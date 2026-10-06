import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { authenticateUser, createUser, getAllUsers } from '../models/users.js';
import { getProjectsByVolunteer } from '../models/projects.js';

const userRegistrationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .bail()
        .isLength({ max: 100 })
        .withMessage('Name cannot exceed 100 characters'),
    body('email')
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage('Email is required')
        .bail()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .bail()
        .isLength({ max: 100 })
        .withMessage('Email cannot exceed 100 characters'),
    body('password')
        .isString()
        .withMessage('Password is required')
        .bail()
        .isLength({ min: 7 })
        .withMessage('Password must be at least 7 characters long')
        .bail()
        .custom((password) => Buffer.byteLength(password, 'utf8') <= 72)
        .withMessage('Password cannot exceed 72 bytes')
];

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(({ msg }) => req.flash('error', msg));
        return res.redirect('/register');
    }

    const { name, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    try {
        await createUser(name, email, passwordHash);
    } catch (error) {
        if (error.code === '23505' && error.constraint === 'users_email_key') {
            req.flash('error', 'An account with that email address already exists.');
            return res.redirect('/register');
        }

        return next(error);
    }

    req.flash('success', 'Registration successful! Please log in.');
    return res.redirect('/');
};

const loginValidation = [
    body('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .isString()
        .withMessage('Email or password is incorrect')
        .bail()
        .notEmpty()
        .withMessage('Email or password is incorrect')
        .bail()
        .custom((password) => Buffer.byteLength(password, 'utf8') <= 72)
        .withMessage('Email or password is incorrect')
];

const regenerateSession = (req) => new Promise((resolve, reject) => {
    req.session.regenerate((error) => {
        if (error) {
            reject(error);
            return;
        }
        resolve();
    });
});

const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }

    return next();
};

const requireRole = (role, unauthorizedRedirect = '/') => (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access this page.');
        return res.redirect('/login');
    }

    if (req.session.user.role_name !== role) {
        req.flash('error', 'You do not have permission to access this page.');
        return res.redirect(unauthorizedRedirect);
    }

    return next();
};

const showDashboard = async (req, res) => {
    const { name, email } = req.session.user;
    const volunteerProjects = await getProjectsByVolunteer(req.session.user.user_id);
    res.render('dashboard', { title: 'Dashboard', name, email, volunteerProjects });
};

const showUsersPage = async (req, res) => {
    const users = await getAllUsers();
    res.render('users', { title: 'Registered Users', users });
};

const processLoginForm = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
    }

    const { email, password } = req.body;
    const user = await authenticateUser(email, password);

    if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
    }

    try {
        await regenerateSession(req);
    } catch (error) {
        return next(error);
    }

    req.session.user = user;
    req.flash('success', 'Login successful!');

    if (res.locals.NODE_ENV === 'development') {
        console.log('User logged in:', { userId: user.user_id });
    }

    return res.redirect('/dashboard');
};

const processLogout = async (req, res, next) => {
    try {
        await regenerateSession(req);
    } catch (error) {
        return next(error);
    }

    req.flash('success', 'Logout successful!');
    return res.redirect('/login');
};

export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    userRegistrationValidation,
    showLoginForm,
    processLoginForm,
    processLogout,
    loginValidation,
    requireLogin,
    requireRole,
    showDashboard,
    showUsersPage
};
