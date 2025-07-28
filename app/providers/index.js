// Arquivo de índice para exportar todas as integrações
const AWSNotificationIntegration = require('./aws_notification_integration');

// Exportar integrações individuais
module.exports = {
    AWSNotificationIntegration
};

// Exportar todas as integrações como um objeto
module.exports.integrations = {
    notifications: AWSNotificationIntegration
};

// Função utilitária para criar instâncias de integração
module.exports.createIntegration = (type, service = null) => {
    switch (type) {
        case 'notifications':
            return new AWSNotificationIntegration();
        default:
            throw new Error(`Integration type '${type}' not supported`);
    }
};

// Função para verificar a saúde de todas as integrações
module.exports.checkAllIntegrationsHealth = async () => {
    const healthResults = [];

    try {
        // Verificar integração de notificações AWS
        const notificationIntegration = new AWSNotificationIntegration();
        const notificationHealth = await notificationIntegration.checkHealth();
        healthResults.push({
            service: 'notifications',
            status: notificationHealth.status,
            details: notificationHealth
        });
    } catch (error) {
        healthResults.push({
            service: 'notifications',
            status: 'unhealthy',
            error: error.message
        });
    }

    return healthResults;
};
