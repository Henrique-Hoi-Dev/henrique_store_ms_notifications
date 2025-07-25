const express = require('express');
const NotificationsController = require('./notifications_controller');
const validation = require('./notifications_validation');
const validator = require('../../../../utils/validator');

const router = express.Router();
const notificationsController = new NotificationsController();

// Rotas principais
router.get('/', validator(validation.listNotifications), notificationsController.list.bind(notificationsController));
router.post(
    '/',
    validator(validation.createNotification),
    notificationsController.create.bind(notificationsController)
);

// Rotas por ID
router.get(
    '/:id',
    validator(validation.getNotification),
    notificationsController.getById.bind(notificationsController)
);
router.put(
    '/:id',
    validator(validation.updateNotification),
    notificationsController.update.bind(notificationsController)
);
router.delete(
    '/:id',
    validator(validation.deleteNotification),
    notificationsController.softDelete.bind(notificationsController)
);

// Rotas de envio
router.post(
    '/send/:id',
    validator(validation.sendNotification),
    notificationsController.sendNotification.bind(notificationsController)
);
router.post(
    '/send/bulk',
    validator(validation.sendBulkNotification),
    notificationsController.sendBulkNotifications.bind(notificationsController)
);

// Rotas de retry e status
router.post(
    '/retry/:id',
    validator(validation.retryFailedNotification),
    notificationsController.retryFailedNotifications.bind(notificationsController)
);
router.post(
    '/cancel/:id',
    validator(validation.cancelNotification),
    notificationsController.cancelNotification.bind(notificationsController)
);
router.get('/pending', notificationsController.getPendingNotifications.bind(notificationsController));
router.get(
    '/stats',
    validator(validation.getNotificationStats),
    notificationsController.getNotificationStats.bind(notificationsController)
);

// Rotas de integração
router.get('/health/integrations', notificationsController.getIntegrationsHealth.bind(notificationsController));

module.exports = router;
