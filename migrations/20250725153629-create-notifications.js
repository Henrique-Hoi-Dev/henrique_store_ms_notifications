'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      notification_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false
      },
      user_email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      user_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      type: {
        type: Sequelize.ENUM('EMAIL', 'SMS'),
        allowNull: false
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      template_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      template_data: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: 'Template variables and data'
      },
      status: {
        type: Sequelize.ENUM('PENDING', 'SENT', 'FAILED', 'DELIVERED'),
        defaultValue: 'PENDING'
      },
      aws_message_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      retry_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      max_retries: {
        type: Sequelize.INTEGER,
        defaultValue: 3
      },
      sent_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      delivered_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      error_message: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      category: {
        type: Sequelize.ENUM('ORDER_CONFIRMATION', 'ORDER_SHIPPED', 'ORDER_DELIVERED', 'PASSWORD_RESET', 'ACCOUNT_VERIFICATION', 'PROMOTIONAL', 'SYSTEM'),
        defaultValue: 'SYSTEM'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Criar índices para melhor performance
    await queryInterface.addIndex('notifications', ['user_id']);
    await queryInterface.addIndex('notifications', ['status']);
    await queryInterface.addIndex('notifications', ['type']);
    await queryInterface.addIndex('notifications', ['category']);
    await queryInterface.addIndex('notifications', ['created_at']);
    await queryInterface.addIndex('notifications', ['notification_id']);
    await queryInterface.addIndex('notifications', ['aws_message_id']);
    await queryInterface.addIndex('notifications', ['is_active']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('notifications');
  }
}; 