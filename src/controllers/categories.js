import {
    createCategory,
    getAllCategories,
    getCategoriesByProjectId,
    getCategoryDetails,
    getProjectsByCategoryId,
    updateCategory,
    updateCategoryAssignments
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
];

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res, next) => {
    const categoryId = req.params.id;

    if (!/^\d+$/.test(categoryId)) {
        const err = new Error('Category Not Found');
        err.status = 404;
        return next(err);
    }

    const category = await getCategoryDetails(categoryId);

    if (!category) {
        const err = new Error('Category Not Found');
        err.status = 404;
        return next(err);
    }

    const projects = await getProjectsByCategoryId(categoryId);
    const title = 'Category Details';

    res.render('category', { title, category, projects });
};

const showNewCategoryForm = (req, res) => {
    const title = 'Add New Category';
    res.render('new-category', { title });
};

const processNewCategoryForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-category');
    }

    const categoryId = await createCategory(req.body.name);
    req.flash('success', 'Category added successfully!');
    res.redirect(`/category/${categoryId}`);
};

const showEditCategoryForm = async (req, res, next) => {
    const categoryId = req.params.id;

    if (!/^\d+$/.test(categoryId)) {
        const err = new Error('Category Not Found');
        err.status = 404;
        return next(err);
    }

    const category = await getCategoryDetails(categoryId);

    if (!category) {
        const err = new Error('Category Not Found');
        err.status = 404;
        return next(err);
    }

    const title = 'Edit Category';
    res.render('edit-category', { title, category });
};

const processEditCategoryForm = async (req, res, next) => {
    const categoryId = req.params.id;
    const errors = validationResult(req);

    if (!/^\d+$/.test(categoryId)) {
        const err = new Error('Category Not Found');
        err.status = 404;
        return next(err);
    }

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-category/${categoryId}`);
    }

    const category = await getCategoryDetails(categoryId);

    if (!category) {
        const err = new Error('Category Not Found');
        err.status = 404;
        return next(err);
    }

    await updateCategory(categoryId, req.body.name);
    req.flash('success', 'Category updated successfully!');
    res.redirect(`/category/${categoryId}`);
};

const showAssignCategoriesForm = async (req, res, next) => {
    const projectId = req.params.projectId;

    if (!/^\d+$/.test(projectId)) {
        const err = new Error('Project Not Found');
        err.status = 404;
        return next(err);
    }

    const projectDetails = await getProjectDetails(projectId);

    if (!projectDetails) {
        const err = new Error('Project Not Found');
        err.status = 404;
        return next(err);
    }

    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);
    const title = 'Assign Categories to Project';

    res.render('assign-categories', {
        title,
        projectId,
        projectDetails,
        categories,
        assignedCategories
    });
};

const processAssignCategoriesForm = async (req, res, next) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    const categoryIds = Array.isArray(selectedCategoryIds)
        ? selectedCategoryIds
        : [selectedCategoryIds];

    if (!/^\d+$/.test(projectId) || categoryIds.some((id) => !/^\d+$/.test(id))) {
        const err = new Error('Invalid category assignment');
        err.status = 400;
        return next(err);
    }

    const projectDetails = await getProjectDetails(projectId);

    if (!projectDetails) {
        const err = new Error('Project Not Found');
        err.status = 404;
        return next(err);
    }

    const uniqueCategoryIds = [...new Set(categoryIds)];
    await updateCategoryAssignments(projectId, uniqueCategoryIds);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};
