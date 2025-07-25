const { sequelize } = require('../config/database');
const Notifications = require('../app/api/v1/business/notifications/notifications_model');

// Sync models with database
const syncModels = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Models synchronized with database');
    } catch (error) {
        console.error('Error syncing models:', error);
    }
};

module.exports = {
    sequelize,
    Notifications,
    syncModels
};
