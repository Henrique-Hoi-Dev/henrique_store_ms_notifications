const { DataTypes } = require('sequelize');
const { sequelize } = require('../../../../../config/database');

const Notifications = sequelize.define(
    'Notifications',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        notification_id: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        user_email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        type: {
            type: DataTypes.ENUM('EMAIL', 'SMS'),
            allowNull: false
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        template_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        template_data: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Template variables and data'
        },
        status: {
            type: DataTypes.ENUM('PENDING', 'SENT', 'FAILED', 'DELIVERED'),
            defaultValue: 'PENDING'
        },
        aws_message_id: {
            type: DataTypes.STRING,
            allowNull: true
        },
        retry_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        max_retries: {
            type: DataTypes.INTEGER,
            defaultValue: 3
        },
        sent_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        delivered_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        error_message: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        category: {
            type: DataTypes.ENUM(
                'ORDER_CONFIRMATION',
                'ORDER_SHIPPED',
                'ORDER_DELIVERED',
                'PASSWORD_RESET',
                'ACCOUNT_VERIFICATION',
                'PROMOTIONAL',
                'SYSTEM'
            ),
            defaultValue: 'SYSTEM'
        },
        user_phone: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: 'Phone number for SMS notifications'
        },
        metadata: {
            type: DataTypes.JSONB,
            allowNull: true,
            comment: 'Additional metadata for the notification'
        },
        priority: {
            type: DataTypes.ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT'),
            defaultValue: 'NORMAL',
            allowNull: false,
            comment: 'Notification priority level'
        },
        scheduled_at: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Scheduled time for notification delivery'
        },
        delivery_attempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            comment: 'Number of delivery attempts made'
        },
        last_attempt_at: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Timestamp of last delivery attempt'
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Expiration time for the notification'
        },
        cancelled_at: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Timestamp when notification was cancelled'
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: 'notifications',
        timestamps: true,
        paranoid: true,
        indexes: [
            {
                fields: ['user_id']
            },
            {
                fields: ['status']
            },
            {
                fields: ['type']
            },
            {
                fields: ['category']
            },
            {
                fields: ['created_at']
            },
            {
                fields: ['notification_id']
            },
            {
                fields: ['aws_message_id']
            },
            {
                fields: ['is_active']
            },
            {
                fields: ['priority']
            },
            {
                fields: ['scheduled_at']
            },
            {
                fields: ['expires_at']
            },
            {
                fields: ['user_phone']
            },
            {
                fields: ['cancelled_at']
            }
        ]
    }
);

module.exports = Notifications;
