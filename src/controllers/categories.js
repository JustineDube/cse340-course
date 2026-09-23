import {
    getAllCategories,
    getCategoryDetails,
    getProjectsByCategoryId
} from '../models/categories.js';

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

export { showCategoriesPage, showCategoryDetailsPage };
