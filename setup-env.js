#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🔧 Configuração do arquivo .env para Henrique Store Notifications');
console.log('===============================================================\n');

// Função para fazer perguntas
function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

// Função para gerar o conteúdo do .env
function generateEnvContent(config) {
    return `# ========================================
# CONFIGURAÇÕES DO SERVIDOR
# ========================================
NODE_ENV=${config.NODE_ENV}
PORT=${config.PORT}
API_VERSION=${config.API_VERSION}

# ========================================
# CONFIGURAÇÕES DO BANCO DE DADOS
# ========================================
DB_HOST=${config.DB_HOST}
DB_PORT=${config.DB_PORT}
DB_NAME=${config.DB_NAME}
DB_USER=${config.DB_USER}
DB_PASS=${config.DB_PASS}
DB_DIALECT=${config.DB_DIALECT}
DB_POOL_MAX=${config.DB_POOL_MAX}
DB_POOL_MIN=${config.DB_POOL_MIN}
DB_POOL_ACQUIRE=${config.DB_POOL_ACQUIRE}
DB_POOL_IDLE=${config.DB_POOL_IDLE}
DB_LOGGING=${config.DB_LOGGING}

# ========================================
# CONFIGURAÇÕES AWS
# ========================================
AWS_REGION=${config.AWS_REGION}
AWS_ACCESS_KEY_ID=${config.AWS_ACCESS_KEY_ID}
AWS_SECRET_ACCESS_KEY=${config.AWS_SECRET_ACCESS_KEY}

# AWS SES (Email Service)
AWS_SES_FROM_EMAIL=${config.AWS_SES_FROM_EMAIL}
AWS_SES_CONFIGURATION_SET=${config.AWS_SES_CONFIGURATION_SET}

# AWS SNS (SMS Service)
AWS_SNS_TOPIC_ARN=${config.AWS_SNS_TOPIC_ARN}

# ========================================
# CONFIGURAÇÕES DE LOG
# ========================================
LOG_LEVEL=${config.LOG_LEVEL}
LOG_PRETTY_PRINT=${config.LOG_PRETTY_PRINT}

# ========================================
# CONFIGURAÇÕES DE SEGURANÇA
# ========================================
JWT_SECRET=${config.JWT_SECRET}
CORS_ORIGIN=${config.CORS_ORIGIN}
RATE_LIMIT_WINDOW_MS=${config.RATE_LIMIT_WINDOW_MS}
RATE_LIMIT_MAX_REQUESTS=${config.RATE_LIMIT_MAX_REQUESTS}

# ========================================
# CONFIGURAÇÕES DE VALIDAÇÃO
# ========================================
MAX_FILE_SIZE=${config.MAX_FILE_SIZE}
ALLOWED_FILE_TYPES=${config.ALLOWED_FILE_TYPES}

# ========================================
# CONFIGURAÇÕES DE NOTIFICAÇÕES
# ========================================
NOTIFICATION_MAX_RETRIES=${config.NOTIFICATION_MAX_RETRIES}
NOTIFICATION_RETRY_DELAY=${config.NOTIFICATION_RETRY_DELAY}
NOTIFICATION_BATCH_SIZE=${config.NOTIFICATION_BATCH_SIZE}
NOTIFICATION_PRIORITY_DEFAULT=${config.NOTIFICATION_PRIORITY_DEFAULT}

# ========================================
# CONFIGURAÇÕES DE TESTE
# ========================================
TEST_DB_NAME=${config.TEST_DB_NAME}
TEST_DB_HOST=${config.TEST_DB_HOST}
TEST_DB_PORT=${config.TEST_DB_PORT}
TEST_DB_USER=${config.TEST_DB_USER}
TEST_DB_PASS=${config.TEST_DB_PASS}
`;
}

async function main() {
    try {
        const config = {};

        console.log('📋 Configurações do Servidor:');
        config.NODE_ENV = (await question('NODE_ENV (development/production): ')) || 'development';
        config.PORT = (await question('PORT (3003): ')) || '3003';
        config.API_VERSION = (await question('API_VERSION (v1): ')) || 'v1';

        console.log('\n🗄️  Configurações do Banco de Dados:');
        config.DB_HOST = (await question('DB_HOST (localhost): ')) || 'localhost';
        config.DB_PORT = (await question('DB_PORT (5432): ')) || '5432';
        config.DB_NAME = (await question('DB_NAME (henrique_store): ')) || 'henrique_store';
        config.DB_USER = (await question('DB_USER (postgres): ')) || 'postgres';
        config.DB_PASS = (await question('DB_PASS: ')) || 'your_password_here';
        config.DB_DIALECT = (await question('DB_DIALECT (postgres): ')) || 'postgres';
        config.DB_POOL_MAX = (await question('DB_POOL_MAX (10): ')) || '10';
        config.DB_POOL_MIN = (await question('DB_POOL_MIN (0): ')) || '0';
        config.DB_POOL_ACQUIRE = (await question('DB_POOL_ACQUIRE (30000): ')) || '30000';
        config.DB_POOL_IDLE = (await question('DB_POOL_IDLE (10000): ')) || '10000';
        config.DB_LOGGING = (await question('DB_LOGGING (true): ')) || 'true';

        console.log('\n☁️  Configurações AWS:');
        config.AWS_REGION = (await question('AWS_REGION (us-east-1): ')) || 'us-east-1';
        config.AWS_ACCESS_KEY_ID = (await question('AWS_ACCESS_KEY_ID: ')) || 'your_aws_access_key_id';
        config.AWS_SECRET_ACCESS_KEY = (await question('AWS_SECRET_ACCESS_KEY: ')) || 'your_aws_secret_access_key';
        config.AWS_SES_FROM_EMAIL =
            (await question('AWS_SES_FROM_EMAIL (noreply@henrique-store.com): ')) || 'noreply@henrique-store.com';
        config.AWS_SES_CONFIGURATION_SET =
            (await question('AWS_SES_CONFIGURATION_SET (henrique-store-notifications): ')) ||
            'henrique-store-notifications';
        config.AWS_SNS_TOPIC_ARN =
            (await question('AWS_SNS_TOPIC_ARN: ')) ||
            'arn:aws:sns:us-east-1:123456789012:henrique-store-notifications';

        console.log('\n📝 Configurações de Log:');
        config.LOG_LEVEL = (await question('LOG_LEVEL (info): ')) || 'info';
        config.LOG_PRETTY_PRINT = (await question('LOG_PRETTY_PRINT (true): ')) || 'true';

        console.log('\n🔒 Configurações de Segurança:');
        config.JWT_SECRET = (await question('JWT_SECRET: ')) || 'henrique_store_notifications_jwt_secret_2024';
        config.CORS_ORIGIN = (await question('CORS_ORIGIN (http://localhost:3000): ')) || 'http://localhost:3000';
        config.RATE_LIMIT_WINDOW_MS = (await question('RATE_LIMIT_WINDOW_MS (900000): ')) || '900000';
        config.RATE_LIMIT_MAX_REQUESTS = (await question('RATE_LIMIT_MAX_REQUESTS (100): ')) || '100';

        console.log('\n✅ Configurações de Validação:');
        config.MAX_FILE_SIZE = (await question('MAX_FILE_SIZE (5242880): ')) || '5242880';
        config.ALLOWED_FILE_TYPES =
            (await question('ALLOWED_FILE_TYPES (image/jpeg,image/png,image/gif): ')) ||
            'image/jpeg,image/png,image/gif';

        console.log('\n📧 Configurações de Notificações:');
        config.NOTIFICATION_MAX_RETRIES = (await question('NOTIFICATION_MAX_RETRIES (3): ')) || '3';
        config.NOTIFICATION_RETRY_DELAY = (await question('NOTIFICATION_RETRY_DELAY (5000): ')) || '5000';
        config.NOTIFICATION_BATCH_SIZE = (await question('NOTIFICATION_BATCH_SIZE (100): ')) || '100';
        config.NOTIFICATION_PRIORITY_DEFAULT = (await question('NOTIFICATION_PRIORITY_DEFAULT (NORMAL): ')) || 'NORMAL';

        console.log('\n🧪 Configurações de Teste:');
        config.TEST_DB_NAME = (await question('TEST_DB_NAME (henrique_store_test): ')) || 'henrique_store_test';
        config.TEST_DB_HOST = (await question('TEST_DB_HOST (localhost): ')) || 'localhost';
        config.TEST_DB_PORT = (await question('TEST_DB_PORT (5432): ')) || '5432';
        config.TEST_DB_USER = (await question('TEST_DB_USER (postgres): ')) || 'postgres';
        config.TEST_DB_PASS = (await question('TEST_DB_PASS: ')) || 'your_password_here';

        // Gerar o conteúdo do arquivo .env
        const envContent = generateEnvContent(config);

        // Salvar o arquivo .env
        const envPath = path.join(__dirname, '.env');
        fs.writeFileSync(envPath, envContent);

        console.log('\n✅ Arquivo .env criado com sucesso!');
        console.log(`📁 Localização: ${envPath}`);
        console.log('\n⚠️  Lembre-se de:');
        console.log('  1. Substituir "your_password_here" pela senha real do PostgreSQL');
        console.log('  2. Configurar as credenciais AWS reais');
        console.log('  3. Ajustar o JWT_SECRET para um valor seguro');
        console.log('  4. Configurar o domínio correto para CORS_ORIGIN');
    } catch (error) {
        console.error('❌ Erro ao configurar o arquivo .env:', error);
    } finally {
        rl.close();
    }
}

main();
