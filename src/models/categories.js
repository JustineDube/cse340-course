// src/models/categories.js
import db from './db.js';

export async function getAllCategories() {
    const query = `
        SELECT category_id, name
        FROM category
        ORDER BY name ASC;
    `;
    const result = await db.query(query);
    return result.rows;
}