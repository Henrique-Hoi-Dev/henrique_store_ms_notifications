const Notifications = require('./notifications_model');
const AWSNotificationIntegration = require('../../Integration/aws_notification_integration');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../../../utils/logger');

class NotificationsService {
    constructor() {
        this.awsIntegration = new AWSNotificationIntegration();
    }

    async list(filters = {}) {
        try {
            const { page = 1, limit = 10, status, type, user_id, category, is_active } = filters;

            const where = {};
            if (status) where.status = status;
            if (type) where.type = type;
            if (user_id) where.user_id = user_id;
            if (category) where.category = category;
            if (is_active !== undefined) where.is_active = is_active;

            const offset = (page - 1) * limit;

            const { count, rows } = await Notifications.findAndCountAll({
                where,
                order: [['created_at', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            return {
                notifications: rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: count,
                    totalPages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            logger.error('Error listing notifications:', error);
            throw new Error('FAILED_TO_LIST_NOTIFICATIONS');
        }
    }

    async getById(id) {
        try {
            return await Notifications.findByPk(id);
        } catch (error) {
            logger.error('Error getting notification by ID:', error);
            throw new Error('FAILED_TO_GET_NOTIFICATION');
        }
    }

    async getByNotificationId(notificationId) {
        try {
            return await Notifications.findOne({
                where: { notification_id: notificationId }
            });
        } catch (error) {
            logger.error('Error getting notification by notification ID:', error);
            throw new Error('FAILED_TO_GET_NOTIFICATION');
        }
    }

    async create(notificationData) {
        try {
            const notification = await Notifications.create({
                ...notificationData,
                notification_id: uuidv4()
            });

            // Enviar notificação imediatamente
            await this.sendNotification(notification);

            return notification;
        } catch (error) {
            logger.error('Error creating notification:', error);
            throw new Error('FAILED_TO_CREATE_NOTIFICATION');
        }
    }

    async update(id, updateData) {
        try {
            const notification = await Notifications.findByPk(id);
            if (!notification) return null;

            await notification.update(updateData);
            return notification;
        } catch (error) {
            logger.error('Error updating notification:', error);
            throw new Error('FAILED_TO_UPDATE_NOTIFICATION');
        }
    }

    async updateStatus(id, status) {
        try {
            const notification = await Notifications.findByPk(id);
            if (!notification) return null;

            const updateData = { status };

            if (status === 'SENT') {
                updateData.sent_at = new Date();
            } else if (status === 'DELIVERED') {
                updateData.delivered_at = new Date();
            }

            await notification.update(updateData);
            return notification;
        } catch (error) {
            logger.error('Error updating notification status:', error);
            throw new Error('FAILED_TO_UPDATE_NOTIFICATION_STATUS');
        }
    }

    async softDelete(id) {
        try {
            const notification = await Notifications.findByPk(id);
            if (!notification) return null;

            await notification.destroy();
            return notification;
        } catch (error) {
            logger.error('Error soft deleting notification:', error);
            throw new Error('FAILED_TO_DELETE_NOTIFICATION');
        }
    }

    async getNotificationsByUser(userId, options = {}) {
        try {
            const { page = 1, limit = 10 } = options;
            const offset = (page - 1) * limit;

            const { count, rows } = await Notifications.findAndCountAll({
                where: { user_id: userId, is_active: true },
                order: [['created_at', 'DESC']],
                limit: parseInt(limit),
                offset: parseInt(offset)
            });

            return {
                notifications: rows,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total: count,
                    totalPages: Math.ceil(count / limit)
                }
            };
        } catch (error) {
            logger.error('Error getting notifications by user:', error);
            throw new Error('FAILED_TO_GET_USER_NOTIFICATIONS');
        }
    }

    async sendNotification(notification) {
        try {
            // Atualizar status para PENDING
            await notification.update({ status: 'PENDING' });

            // Enviar via AWS
            const result = await this.awsIntegration.sendNotification(notification);

            // Atualizar com informações do AWS
            await notification.update({
                status: 'SENT',
                aws_message_id: result.messageId,
                sent_at: new Date()
            });

            return notification;
        } catch (error) {
            logger.error('Error sending notification:', error);

            // Atualizar status para FAILED
            await notification.update({
                status: 'FAILED',
                error_message: error.message,
                retry_count: notification.retry_count + 1
            });

            throw new Error('FAILED_TO_SEND_NOTIFICATION');
        }
    }

    async sendBulkNotifications(notifications) {
        try {
            const results = [];

            for (const notificationData of notifications) {
                try {
                    const notification = await this.create(notificationData);
                    results.push({
                        success: true,
                        notification_id: notification.notification_id,
                        message: 'Notification sent successfully'
                    });
                } catch (error) {
                    results.push({
                        success: false,
                        notification_id: notificationData.notification_id || 'unknown',
                        error: error.message
                    });
                }
            }

            return {
                total: notifications.length,
                successful: results.filter((r) => r.success).length,
                failed: results.filter((r) => !r.success).length,
                results
            };
        } catch (error) {
            logger.error('Error sending bulk notifications:', error);
            throw new Error('FAILED_TO_SEND_BULK_NOTIFICATIONS');
        }
    }

    async retryFailedNotifications() {
        try {
            const failedNotifications = await Notifications.findAll({
                where: {
                    status: 'FAILED',
                    retry_count: { [require('sequelize').Op.lt]: 3 }
                }
            });

            const results = [];

            for (const notification of failedNotifications) {
                try {
                    await this.sendNotification(notification);
                    results.push({
                        notification_id: notification.notification_id,
                        success: true
                    });
                } catch (error) {
                    results.push({
                        notification_id: notification.notification_id,
                        success: false,
                        error: error.message
                    });
                }
            }

            return {
                total: failedNotifications.length,
                successful: results.filter((r) => r.success).length,
                failed: results.filter((r) => !r.success).length,
                results
            };
        } catch (error) {
            logger.error('Error retrying failed notifications:', error);
            throw new Error('FAILED_TO_RETRY_NOTIFICATIONS');
        }
    }

    async getPendingNotifications() {
        try {
            return await Notifications.findAll({
                where: { status: 'PENDING' },
                order: [['created_at', 'ASC']]
            });
        } catch (error) {
            logger.error('Error getting pending notifications:', error);
            throw new Error('FAILED_TO_GET_PENDING_NOTIFICATIONS');
        }
    }

    async getNotificationStats() {
        try {
            const stats = await Notifications.findAll({
                attributes: [
                    'status',
                    'type',
                    'category',
                    [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
                ],
                group: ['status', 'type', 'category'],
                where: {
                    created_at: {
                        [require('sequelize').Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Últimos 30 dias
                    }
                }
            });

            return {
                period: '30_days',
                stats
            };
        } catch (error) {
            logger.error('Error getting notification stats:', error);
            throw new Error('FAILED_TO_GET_NOTIFICATION_STATS');
        }
    }

    async cancelNotification(id) {
        try {
            const notification = await Notifications.findByPk(id);
            if (!notification) return null;

            // Só pode cancelar notificações pendentes
            if (notification.status !== 'PENDING') {
                throw new Error('CANNOT_CANCEL_NON_PENDING_NOTIFICATION');
            }

            await notification.update({
                status: 'CANCELLED',
                cancelled_at: new Date()
            });

            return notification;
        } catch (error) {
            logger.error('Error cancelling notification:', error);
            throw new Error('FAILED_TO_CANCEL_NOTIFICATION');
        }
    }
}

module.exports = NotificationsService;
