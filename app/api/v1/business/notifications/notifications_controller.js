const NotificationsService = require('./notifications_service');
const BaseController = require('../../base/base_controller');
const HttpStatus = require('http-status');

class NotificationsController extends BaseController {
    constructor() {
        super();
        this._notificationsService = new NotificationsService();
    }

    async list(req, res, next) {
        try {
            const data = await this._notificationsService.list(req.query);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getById(req, res, next) {
        try {
            const data = await this._notificationsService.getById(req.params.id);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getByNotificationId(req, res, next) {
        try {
            const data = await this._notificationsService.getByNotificationId(req.params.notificationId);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async create(req, res, next) {
        try {
            const data = await this._notificationsService.create(req.body);
            res.status(HttpStatus.status.CREATED).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async update(req, res, next) {
        try {
            const data = await this._notificationsService.update(req.params.id, req.body);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async updateStatus(req, res, next) {
        try {
            const data = await this._notificationsService.updateStatus(req.params.id, req.body);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async softDelete(req, res, next) {
        try {
            const data = await this._notificationsService.softDelete(req.params.id);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getNotificationsByUser(req, res, next) {
        try {
            const data = await this._notificationsService.getNotificationsByUser(req.params.userId, req.query);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async sendNotification(req, res, next) {
        try {
            const data = await this._notificationsService.sendNotification(req.params.id);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async sendBulkNotifications(req, res, next) {
        try {
            const data = await this._notificationsService.sendBulkNotifications(req.body);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async retryFailedNotifications(req, res, next) {
        try {
            const data = await this._notificationsService.retryFailedNotifications();
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getPendingNotifications(req, res, next) {
        try {
            const data = await this._notificationsService.getPendingNotifications();
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getNotificationStats(req, res, next) {
        try {
            const data = await this._notificationsService.getNotificationStats();
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getIntegrationsHealth(req, res, next) {
        try {
            const data = await this._notificationsService.getIntegrationsHealth();
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async getDeliveryStatus(req, res, next) {
        try {
            const data = await this._notificationsService.getDeliveryStatus(req.params);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }

    async cancelNotification(req, res, next) {
        try {
            const data = await this._notificationsService.cancelNotification(req.params.id);
            res.status(HttpStatus.status.OK).json(this.parseKeysToCamelcase({ data }));
        } catch (err) {
            next(this.handleError(err));
        }
    }
}

module.exports = NotificationsController;
