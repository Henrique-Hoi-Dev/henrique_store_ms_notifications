const BaseIntegration = require('../api/v1/base/base_integration');
const logger = require('../utils/logger');

class AWSNotificationIntegration extends BaseIntegration {
    constructor() {
        super('aws-notifications', 'aws');
        this.ses = null;
        this.sns = null;
        this.initializeAWSServices();
    }

    initializeAWSServices() {
        try {
            // AWS SDK v3
            const { SESClient, SendEmailCommand, SendTemplatedEmailCommand } = require('@aws-sdk/client-ses');
            const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

            const config = {
                region: process.env.AWS_REGION || 'us-east-1',
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
                }
            };

            this.ses = new SESClient(config);
            this.sns = new SNSClient(config);

            logger.info('AWS services initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize AWS services:', error);
            throw new Error('AWS_SERVICES_INITIALIZATION_FAILED');
        }
    }

    async sendNotification(notification) {
        try {
            switch (notification.type) {
                case 'EMAIL':
                    return await this.sendEmail(notification);
                case 'SMS':
                    return await this.sendSMS(notification);
                default:
                    throw new Error(`Unsupported notification type: ${notification.type}`);
            }
        } catch (error) {
            logger.error(`Failed to send ${notification.type} notification:`, error);
            throw new Error(`NOTIFICATION_SEND_FAILED: ${error.message}`);
        }
    }

    async sendEmail(notification) {
        try {
            const { SESClient, SendEmailCommand, SendTemplatedEmailCommand } = require('@aws-sdk/client-ses');

            let command;

            if (notification.template_id) {
                // Enviar email usando template
                command = new SendTemplatedEmailCommand({
                    Source: process.env.AWS_SES_FROM_EMAIL,
                    Destination: {
                        ToAddresses: [notification.user_email]
                    },
                    Template: notification.template_id,
                    TemplateData: JSON.stringify(notification.template_data || {}),
                    ConfigurationSetName: process.env.AWS_SES_CONFIGURATION_SET
                });
            } else {
                // Enviar email direto
                command = new SendEmailCommand({
                    Source: process.env.AWS_SES_FROM_EMAIL,
                    Destination: {
                        ToAddresses: [notification.user_email]
                    },
                    Message: {
                        Subject: {
                            Data: notification.subject,
                            Charset: 'UTF-8'
                        },
                        Body: {
                            Html: {
                                Data: notification.content,
                                Charset: 'UTF-8'
                            },
                            Text: {
                                Data: this.stripHtml(notification.content),
                                Charset: 'UTF-8'
                            }
                        }
                    },
                    ConfigurationSetName: process.env.AWS_SES_CONFIGURATION_SET
                });
            }

            const result = await this.ses.send(command);

            return {
                success: true,
                messageId: result.MessageId,
                requestId: result.$metadata.requestId
            };
        } catch (error) {
            logger.error('Failed to send email:', error);
            throw new Error(`EMAIL_SEND_FAILED: ${error.message}`);
        }
    }

    async sendSMS(notification) {
        try {
            const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

            // Para SMS, precisamos do número de telefone
            const phoneNumber = notification.user_phone || notification.metadata?.phone_number;

            if (!phoneNumber) {
                throw new Error('Phone number is required for SMS notifications');
            }

            const command = new PublishCommand({
                Message: notification.content,
                PhoneNumber: phoneNumber,
                MessageAttributes: {
                    'AWS.SNS.SMS.SMSType': {
                        DataType: 'String',
                        StringValue: 'Transactional'
                    }
                }
            });

            const result = await this.sns.send(command);

            return {
                success: true,
                messageId: result.MessageId,
                requestId: result.$metadata.requestId
            };
        } catch (error) {
            logger.error('Failed to send SMS:', error);
            throw new Error(`SMS_SEND_FAILED: ${error.message}`);
        }
    }

    async getDeliveryStatus(messageId) {
        try {
            // Para AWS SES, podemos verificar o status através do SNS ou logs
            // Esta é uma implementação simplificada
            return {
                messageId,
                status: 'DELIVERED', // Assumindo que foi entregue
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            logger.error('Failed to get delivery status:', error);
            throw new Error(`DELIVERY_STATUS_CHECK_FAILED: ${error.message}`);
        }
    }

    async checkHealth() {
        try {
            const health = {
                ses: false,
                sns: false,
                timestamp: new Date().toISOString()
            };

            // Verificar SES
            try {
                const { SESClient, GetSendQuotaCommand } = require('@aws-sdk/client-ses');
                const sesClient = new SESClient({
                    region: process.env.AWS_REGION || 'us-east-1',
                    credentials: {
                        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
                    }
                });

                const quotaCommand = new GetSendQuotaCommand({});
                await sesClient.send(quotaCommand);
                health.ses = true;
            } catch (error) {
                logger.error('SES health check failed:', error);
            }

            // Verificar SNS
            try {
                const { SNSClient, ListTopicsCommand } = require('@aws-sdk/client-sns');
                const snsClient = new SNSClient({
                    region: process.env.AWS_REGION || 'us-east-1',
                    credentials: {
                        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
                    }
                });

                const topicsCommand = new ListTopicsCommand({});
                await snsClient.send(topicsCommand);
                health.sns = true;
            } catch (error) {
                logger.error('SNS health check failed:', error);
            }

            return health;
        } catch (error) {
            logger.error('Health check failed:', error);
            throw new Error('HEALTH_CHECK_FAILED');
        }
    }

    stripHtml(html) {
        return html.replace(/<[^>]*>/g, '');
    }
}

module.exports = AWSNotificationIntegration;
