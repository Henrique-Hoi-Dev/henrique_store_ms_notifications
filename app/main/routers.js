const notificationsRouter = require('../api/v1/business/notifications/notifications_router');

const addRouters = (router) => {
    router.route('/health').get((req, res) => {
        res.setHeader('csrf-token', req.csrfToken());
        return res.status(200).send();
    });

    router.use('/notifications', notificationsRouter);

    return router;
};

module.exports = addRouters;
