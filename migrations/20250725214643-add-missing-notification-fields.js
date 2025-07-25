'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Função para verificar se uma coluna existe
        const columnExists = async (tableName, columnName) => {
            try {
                const result = await queryInterface.sequelize.query(
                    `SELECT column_name FROM information_schema.columns WHERE table_name = '${tableName}' AND column_name = '${columnName}'`
                );
                return result[0].length > 0;
            } catch (error) {
                return false;
            }
        };

        // Função para verificar se um índice existe
        const indexExists = async (tableName, indexName) => {
            try {
                const result = await queryInterface.sequelize.query(
                    `SELECT indexname FROM pg_indexes WHERE tablename = '${tableName}' AND indexname = '${indexName}'`
                );
                return result[0].length > 0;
            } catch (error) {
                return false;
            }
        };

        // Adicionar campos apenas se não existirem
        const fieldsToAdd = [
            {
                name: 'cancelled_at',
                definition: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    comment: 'Timestamp when notification was cancelled'
                }
            },
            {
                name: 'user_phone',
                definition: {
                    type: Sequelize.STRING,
                    allowNull: true,
                    comment: 'Phone number for SMS notifications'
                }
            },
            {
                name: 'metadata',
                definition: {
                    type: Sequelize.JSONB,
                    allowNull: true,
                    comment: 'Additional metadata for the notification'
                }
            },
            {
                name: 'priority',
                definition: {
                    type: Sequelize.ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT'),
                    defaultValue: 'NORMAL',
                    allowNull: false,
                    comment: 'Notification priority level'
                }
            },
            {
                name: 'scheduled_at',
                definition: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    comment: 'Scheduled time for notification delivery'
                }
            },
            {
                name: 'delivery_attempts',
                definition: {
                    type: Sequelize.INTEGER,
                    defaultValue: 0,
                    allowNull: false,
                    comment: 'Number of delivery attempts made'
                }
            },
            {
                name: 'last_attempt_at',
                definition: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    comment: 'Timestamp of last delivery attempt'
                }
            },
            {
                name: 'expires_at',
                definition: {
                    type: Sequelize.DATE,
                    allowNull: true,
                    comment: 'Expiration time for the notification'
                }
            }
        ];

        // Adicionar campos
        for (const field of fieldsToAdd) {
            const exists = await columnExists('notifications', field.name);
            if (!exists) {
                await queryInterface.addColumn('notifications', field.name, field.definition);
                console.log(`Added column: ${field.name}`);
            } else {
                console.log(`Column already exists: ${field.name}`);
            }
        }

        // Adicionar índices apenas se não existirem
        const indexesToAdd = [
            'notifications_notification_id',
            'notifications_aws_message_id',
            'notifications_is_active',
            'notifications_priority',
            'notifications_scheduled_at',
            'notifications_expires_at',
            'notifications_user_phone',
            'notifications_cancelled_at'
        ];

        for (const indexName of indexesToAdd) {
            const exists = await indexExists('notifications', indexName);
            if (!exists) {
                const columnName = indexName.replace('notifications_', '');
                await queryInterface.addIndex('notifications', [columnName]);
                console.log(`Added index: ${indexName}`);
            } else {
                console.log(`Index already exists: ${indexName}`);
            }
        }
    },

    async down(queryInterface, Sequelize) {
        // Remover índices
        const indexesToRemove = [
            'notifications_notification_id',
            'notifications_aws_message_id',
            'notifications_is_active',
            'notifications_priority',
            'notifications_scheduled_at',
            'notifications_expires_at',
            'notifications_user_phone',
            'notifications_cancelled_at'
        ];

        for (const indexName of indexesToRemove) {
            try {
                await queryInterface.removeIndex('notifications', indexName);
            } catch (error) {
                console.log(`Index not found: ${indexName}`);
            }
        }

        // Remover colunas
        const columnsToRemove = [
            'cancelled_at',
            'user_phone',
            'metadata',
            'priority',
            'scheduled_at',
            'delivery_attempts',
            'last_attempt_at',
            'expires_at'
        ];

        for (const columnName of columnsToRemove) {
            try {
                await queryInterface.removeColumn('notifications', columnName);
            } catch (error) {
                console.log(`Column not found: ${columnName}`);
            }
        }
    }
};
