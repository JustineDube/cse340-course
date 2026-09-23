import db from './db.js';

const getAllProjects = async () => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.project_date, o.name AS organization_name
        FROM service_project p
        JOIN organization o ON p.organization_id = o.organization_id
        ORDER BY p.project_date ASC;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT project_id, organization_id, title, description, location, project_date
        FROM service_project
        WHERE organization_id = $1
        ORDER BY project_date ASC;
    `;

    const result = await db.query(query, [organizationId]);

    return result.rows;
};

export { getAllProjects, getProjectsByOrganizationId };