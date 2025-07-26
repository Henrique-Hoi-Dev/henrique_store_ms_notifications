const NotificationsService = require('./notifications_service');
const BaseController = require('../../base/base_controller');
const AWSNotificationIntegration = require('../../../../Integration/aws_notification_integration');
const HttpStatus = require('http-status');

class NotificationsController extends BaseController {
    constructor() {
        super();
        this._notificationsService = new NotificationsService();
    }

    async list(req, res, next) {
        try {
            const { page, limit, status, type, user_id, category, is_active } = req.query;

            const result = await this._notificationsService.list({
                page,
                limit,
                status,
                type,
                user_id,
                category,
                is_active
            });

            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(result));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getById(req, res, next) {
        try {
            const notification = await this._notificationsService.getById(req.params.id);
            if (!notification) return next(this.notFound('NOTIFICATION_NOT_FOUND'));
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(notification));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getByNotificationId(req, res, next) {
        try {
            const notification = await this._notificationsService.getByNotificationId(req.params.notificationId);
            if (!notification) return next(this.notFound('NOTIFICATION_NOT_FOUND'));
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(notification));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async create(req, res, next) {
        try {
            const notification = await this._notificationsService.create(req.body);
            res.status(HttpStatus.CREATED).json(this.parseKeysToCamelcase(notification));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async update(req, res, next) {
        try {
            const notification = await this._notificationsService.update(req.params.id, req.body);
            if (!notification) return next(this.notFound('NOTIFICATION_NOT_FOUND'));
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(notification));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async updateStatus(req, res, next) {
        try {
            const { status } = req.body;
            const notification = await this._notificationsService.updateStatus(req.params.id, status);
            if (!notification) return next(this.notFound('NOTIFICATION_NOT_FOUND'));
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(notification));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async softDelete(req, res, next) {
        try {
            const notification = await this._notificationsService.softDelete(req.params.id);
            if (!notification) return next(this.notFound('NOTIFICATION_NOT_FOUND'));
            res.status(HttpStatus.OK).json({ message: 'Notification deleted successfully' });
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getNotificationsByUser(req, res, next) {
        try {
            const { page, limit } = req.query;
            const result = await this._notificationsService.getNotificationsByUser(req.params.userId, {
                page,
                limit
            });
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(result));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async sendNotification(req, res, next) {
        try {
            const notification = await this._notificationsService.getById(req.params.id);
            if (!notification) return next(this.notFound('NOTIFICATION_NOT_FOUND'));

            const result = await this._notificationsService.sendNotification(notification);
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(result));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async sendBulkNotifications(req, res, next) {
        try {
            const { user_ids, user_emails, type, subject, content, template_id, template_data, category } = req.body;

            // Criar notificações para cada user_id
            const notifications = user_ids.map((user_id) => ({
                user_id,
                user_email: user_emails ? user_emails.find((email) => email) : null,
                type,
                subject,
                content,
                template_id,
                template_data,
                category
            }));

            const result = await this._notificationsService.sendBulkNotifications(notifications);
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(result));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async retryFailedNotifications(req, res, next) {
        try {
            const notification = await this._notificationsService.getById(req.params.id);
            if (!notification) return next(this.notFound('NOTIFICATION_NOT_FOUND'));

            const result = await this._notificationsService.sendNotification(notification);
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(result));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getPendingNotifications(req, res, next) {
        try {
            const result = await this._notificationsService.getPendingNotifications();
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(result));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getNotificationStats(req, res, next) {
        try {
            const result = await this._notificationsService.getNotificationStats();
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(result));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getIntegrationsHealth(req, res, next) {
        try {
            const awsIntegration = new AWSNotificationIntegration();
            const health = await awsIntegration.checkHealth();
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(health));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getDeliveryStatus(req, res, next) {
        try {
            const { messageId } = req.params;
            const awsIntegration = new AWSNotificationIntegration();
            const status = await awsIntegration.getDeliveryStatus(messageId);
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(status));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async cancelNotification(req, res, next) {
        try {
            const notification = await this._notificationsService.cancelNotification(req.params.id);
            if (!notification) return next(this.notFound('NOTIFICATION_NOT_FOUND'));
            res.status(HttpStatus.OK).json(this.parseKeysToCamelcase(notification));
        } catch (err) {
            next(this.handleError(err));
        }
    }
}

module.exports = NotificationsController;
