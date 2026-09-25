const flashMiddleware = (req, res, next) => {
    req.flash = (type, message) => {
        if (!req.session.flash) {
            req.session.flash = {
                success: [],
                error: [],
                warning: [],
                info: []
            };
        }

        if (type && message) {
            if (!req.session.flash[type]) {
                req.session.flash[type] = [];
            }
            req.session.flash[type].push(message);
            return;
        }

        if (type) {
            const messages = req.session.flash[type] || [];
            req.session.flash[type] = [];
            return messages;
        }

        const messages = req.session.flash;
        req.session.flash = {
            success: [],
            error: [],
            warning: [],
            info: []
        };
        return messages;
    };

    res.locals.flash = req.flash;
    next();
};

export default flashMiddleware;
