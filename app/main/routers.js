const notificationsRouter = require('../api/v1/business/notifications/notifications_router');

const addRouters = (router) => {
    // Health check endpoint - sem CSRF para permitir healthchecks do Kubernetes
    router.route('/health').get((req, res) => {
        // Retorna status 200 com informações básicas de saúde
        return res.status(200).json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            service: 'notifications-ms',
            version: process.env.npm_package_version || '1.0.0'
        });
    });

    router.use('/notifications', notificationsRouter);

    return router;
};

module.exports = addRouters;
