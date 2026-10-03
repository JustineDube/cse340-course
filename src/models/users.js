import bcrypt from 'bcrypt';
import db from './db.js';

const createUser = async (name, email, passwordHash) => {
    const query = `
        INSERT INTO users (name, email, password_hash, role_id)
        SELECT $1, $2, $3, role_id
        FROM roles
        WHERE role_name = $4
        RETURNING user_id;
    `;

    const result = await db.query(query, [name, email, passwordHash, 'user']);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user: the default user role is missing');
    }

    return result.rows[0].user_id;
};

const findUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1;
    `;

    const result = await db.query(query, [email]);
    return result.rows[0] || null;
};

const getAllUsers = async () => {
    const query = `
        SELECT u.name, u.email, r.role_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.role_id
        ORDER BY u.name ASC, u.email ASC;
    `;

    const result = await db.query(query);
    return result.rows;
};

const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user || !(await verifyPassword(password, user.password_hash))) {
        return null;
    }

    const { password_hash, ...authenticatedUser } = user;
    return authenticatedUser;
};

export { createUser, authenticateUser, getAllUsers };
