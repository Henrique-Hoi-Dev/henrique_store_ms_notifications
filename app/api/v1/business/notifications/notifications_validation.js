const { Joi } = require('express-validation');

module.exports = {
    createNotification: {
        body: Joi.object({
            user_id: Joi.string().uuid().required(),
            user_email: Joi.string().email().required(),
            user_name: Joi.string().min(1).max(100).optional(),
            user_phone: Joi.string()
                .pattern(/^\+?[1-9]\d{1,14}$/)
                .optional(),
            type: Joi.string().valid('EMAIL', 'SMS').required(),
            subject: Joi.string().min(1).max(200).required(),
            content: Joi.string().min(1).max(5000).required(),
            template_id: Joi.string().min(1).max(100).optional(),
            template_data: Joi.object().optional(),
            category: Joi.string()
                .valid(
                    'ORDER_CONFIRMATION',
                    'ORDER_SHIPPED',
                    'ORDER_DELIVERED',
                    'PASSWORD_RESET',
                    'ACCOUNT_VERIFICATION',
                    'PROMOTIONAL',
                    'SYSTEM'
                )
                .optional(),
            priority: Joi.string().valid('LOW', 'NORMAL', 'HIGH', 'URGENT').optional(),
            scheduled_at: Joi.date().min('now').optional(),
            expires_at: Joi.date().min('now').optional(),
            metadata: Joi.object().optional()
        })
    },

    updateNotification: {
        params: Joi.object({
            id: Joi.string().uuid().required()
        }),
        body: Joi.object({
            user_email: Joi.string().email().optional(),
            user_name: Joi.string().min(1).max(100).optional(),
            user_phone: Joi.string()
                .pattern(/^\+?[1-9]\d{1,14}$/)
                .optional(),
            type: Joi.string().valid('EMAIL', 'SMS').optional(),
            subject: Joi.string().min(1).max(200).optional(),
            content: Joi.string().min(1).max(5000).optional(),
            template_id: Joi.string().min(1).max(100).optional(),
            template_data: Joi.object().optional(),
            category: Joi.string()
                .valid(
                    'ORDER_CONFIRMATION',
                    'ORDER_SHIPPED',
                    'ORDER_DELIVERED',
                    'PASSWORD_RESET',
                    'ACCOUNT_VERIFICATION',
                    'PROMOTIONAL',
                    'SYSTEM'
                )
                .optional(),
            priority: Joi.string().valid('LOW', 'NORMAL', 'HIGH', 'URGENT').optional(),
            scheduled_at: Joi.date().min('now').optional(),
            expires_at: Joi.date().min('now').optional(),
            metadata: Joi.object().optional()
        })
    },

    getNotification: {
        params: Joi.object({
            id: Joi.string().uuid().required()
        })
    },

    deleteNotification: {
        params: Joi.object({
            id: Joi.string().uuid().required()
        })
    },

    listNotifications: {
        query: Joi.object({
            page: Joi.number().integer().min(1).optional(),
            limit: Joi.number().integer().min(1).max(100).optional(),
            user_id: Joi.string().uuid().optional(),
            user_email: Joi.string().email().optional(),
            user_phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
            type: Joi.string().valid('EMAIL', 'SMS').optional(),
            category: Joi.string()
                .valid(
                    'ORDER_CONFIRMATION',
                    'ORDER_SHIPPED',
                    'ORDER_DELIVERED',
                    'PASSWORD_RESET',
                    'ACCOUNT_VERIFICATION',
                    'PROMOTIONAL',
                    'SYSTEM'
                )
                .optional(),
            priority: Joi.string().valid('LOW', 'NORMAL', 'HIGH', 'URGENT').optional(),
            status: Joi.string().valid('PENDING', 'SENT', 'FAILED', 'CANCELLED').optional(),
            created_at_start: Joi.date().optional(),
            created_at_end: Joi.date().optional(),
            sent_at_start: Joi.date().optional(),
            sent_at_end: Joi.date().optional(),
            scheduled_at_start: Joi.date().optional(),
            scheduled_at_end: Joi.date().optional(),
            expires_at_start: Joi.date().optional(),
            expires_at_end: Joi.date().optional()
        })
    },

    sendNotification: {
        params: Joi.object({
            id: Joi.string().uuid().required()
        })
    },

    sendBulkNotification: {
        body: Joi.object({
            user_ids: Joi.array().items(Joi.string().uuid()).min(1).required(),
            user_emails: Joi.array().items(Joi.string().email()).min(1).optional(),
            user_phones: Joi.array().items(Joi.string().pattern(/^\+?[1-9]\d{1,14}$/)).min(1).optional(),
            type: Joi.string().valid('EMAIL', 'SMS').required(),
            subject: Joi.string().min(1).max(200).required(),
            content: Joi.string().min(1).max(5000).required(),
            template_id: Joi.string().min(1).max(100).optional(),
            template_data: Joi.object().optional(),
            category: Joi.string()
                .valid(
                    'ORDER_CONFIRMATION',
                    'ORDER_SHIPPED',
                    'ORDER_DELIVERED',
                    'PASSWORD_RESET',
                    'ACCOUNT_VERIFICATION',
                    'PROMOTIONAL',
                    'SYSTEM'
                )
                .optional(),
            priority: Joi.string().valid('LOW', 'NORMAL', 'HIGH', 'URGENT').optional(),
            scheduled_at: Joi.date().min('now').optional(),
            expires_at: Joi.date().min('now').optional(),
            metadata: Joi.object().optional()
        })
    },

    getNotificationStats: {
        query: Joi.object({
            start_date: Joi.date().optional(),
            end_date: Joi.date().optional(),
            type: Joi.string().valid('EMAIL', 'SMS').optional(),
            category: Joi.string()
                .valid(
                    'ORDER_CONFIRMATION',
                    'ORDER_SHIPPED',
                    'ORDER_DELIVERED',
                    'PASSWORD_RESET',
                    'ACCOUNT_VERIFICATION',
                    'PROMOTIONAL',
                    'SYSTEM'
                )
                .optional(),
            priority: Joi.string().valid('LOW', 'NORMAL', 'HIGH', 'URGENT').optional(),
            status: Joi.string().valid('PENDING', 'SENT', 'FAILED', 'CANCELLED').optional()
        })
    },

    retryFailedNotification: {
        params: Joi.object({
            id: Joi.string().uuid().required()
        })
    },

    cancelNotification: {
        params: Joi.object({
            id: Joi.string().uuid().required()
        })
    }
};
