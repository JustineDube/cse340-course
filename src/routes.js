import express from 'express';

import { showHomePage } from './controllers/index.js';
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation,
    showEditOrganizationForm,
    processEditOrganizationForm
} from './controllers/organizations.js';
import {
    showProjectsPage,
    showProjectDetailsPage,
    addVolunteerToProject,
    removeVolunteerFromProject,
    removeVolunteerFromDashboard,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
} from './controllers/projects.js';
import {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation,
    showAssignCategoriesForm,
    processAssignCategoriesForm
} from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';
import {
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
} from './controllers/users.js';

const router = express.Router();
const requireAdmin = requireRole('admin');
const requireAdminUsersPage = requireRole('admin', '/dashboard');

router.get('/', showHomePage);
router.get('/register', showUserRegistrationForm);
router.post('/register', userRegistrationValidation, processUserRegistrationForm);
router.get('/login', showLoginForm);
router.post('/login', loginValidation, processLoginForm);
router.get('/logout', processLogout);
router.get('/dashboard', requireLogin, showDashboard);
router.get('/users', requireAdminUsersPage, showUsersPage);
router.post('/dashboard/projects/:projectId/remove-volunteer', requireLogin, removeVolunteerFromDashboard);
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/edit-organization/:id', requireAdmin, showEditOrganizationForm);
router.post(
    '/edit-organization/:id',
    requireAdmin,
    organizationValidation,
    processEditOrganizationForm
);
router.get('/new-organization', requireAdmin, showNewOrganizationForm);
router.post('/new-organization', requireAdmin, organizationValidation, processNewOrganizationForm);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.post('/project/:id/volunteer', requireLogin, addVolunteerToProject);
router.post('/project/:id/remove-volunteer', requireLogin, removeVolunteerFromProject);
router.get('/new-project', requireAdmin, showNewProjectForm);
router.post('/new-project', requireAdmin, projectValidation, processNewProjectForm);
router.get('/edit-project/:id', requireAdmin, showEditProjectForm);
router.post('/edit-project/:id', requireAdmin, projectValidation, processEditProjectForm);
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/new-category', requireAdmin, showNewCategoryForm);
router.post('/new-category', requireAdmin, categoryValidation, processNewCategoryForm);
router.get('/edit-category/:id', requireAdmin, showEditCategoryForm);
router.post('/edit-category/:id', requireAdmin, categoryValidation, processEditCategoryForm);
router.get('/project/:projectId/assign-categories', requireAdmin, showAssignCategoriesForm);
router.post('/project/:projectId/assign-categories', requireAdmin, processAssignCategoriesForm);
router.get('/assign-categories/:projectId', requireAdmin, showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireAdmin, processAssignCategoriesForm);
router.get('/test-error', testErrorPage);

export default router;
