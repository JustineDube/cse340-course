import db from './db.js'; // Replaced require() with import

async function getAllProjects() {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.project_date, o.name AS organization_name
        FROM service_project p
        JOIN organization o ON p.organization_id = o.organization_id
        ORDER BY p.project_date ASC;
    `;

    // Using db.query instead of pool.query to match your db.js setup
    const result = await db.query(query);
    return result.rows;
}

export { getAllProjects }; // Replaced module.exports with export