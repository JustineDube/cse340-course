import { getProjectDetails, getUpcomingProjects } from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res, next) => {
    const projectId = req.params.id;

    if (!/^\d+$/.test(projectId)) {
        const err = new Error('Project Not Found');
        err.status = 404;
        return next(err);
    }

    const project = await getProjectDetails(projectId);

    if (!project) {
        const err = new Error('Project Not Found');
        err.status = 404;
        return next(err);
    }

    const title = 'Project Details';
    res.render('project', { title, project });
};

export { showProjectsPage, showProjectDetailsPage };
