'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const notifications = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        notification_id: 'notif_20250725153629_001',
        user_id: '550e8400-e29b-41d4-a716-446655440010',
        user_email: 'joao.silva@example.com',
        user_name: 'João Silva',
        type: 'EMAIL',
        subject: 'Bem-vindo à Henrique Store!',
        content: '<h1>Olá João!</h1><p>Bem-vindo à Henrique Store. Sua conta foi criada com sucesso.</p>',
        template_id: 'welcome_email',
        template_data: { user_name: 'João Silva' },
        status: 'SENT',
        delivery_status: 'DELIVERED',
        aws_message_id: 'aws_msg_001',
        aws_request_id: 'aws_req_001',
        retry_count: 0,
        max_retries: 3,
        sent_at: new Date('2025-07-25T15:36:29.000Z'),
        delivered_at: new Date('2025-07-25T15:36:30.000Z'),
        priority: 'NORMAL',
        category: 'welcome',
        source: 'SYSTEM',
        is_active: true,
        created_at: new Date('2025-07-25T15:36:29.000Z'),
        updated_at: new Date('2025-07-25T15:36:30.000Z')
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        notification_id: 'notif_20250725153629_002',
        user_id: '550e8400-e29b-41d4-a716-446655440011',
        user_email: 'maria.santos@example.com',
        user_name: 'Maria Santos',
        type: 'SMS',
        subject: 'Pedido Confirmado',
        content: 'Seu pedido #12345 foi confirmado e está sendo processado.',
        status: 'SENT',
        delivery_status: 'DELIVERED',
        aws_message_id: 'aws_msg_002',
        aws_request_id: 'aws_req_002',
        retry_count: 0,
        max_retries: 3,
        sent_at: new Date('2025-07-25T15:36:29.000Z'),
        delivered_at: new Date('2025-07-25T15:36:31.000Z'),
        priority: 'HIGH',
        category: 'order_confirmation',
        source: 'SYSTEM',
        metadata: { phone_number: '+5511999999999' },
        is_active: true,
        created_at: new Date('2025-07-25T15:36:29.000Z'),
        updated_at: new Date('2025-07-25T15:36:31.000Z')
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        notification_id: 'notif_20250725153629_003',
        user_id: '550e8400-e29b-41d4-a716-446655440012',
        user_email: 'pedro.oliveira@example.com',
        user_name: 'Pedro Oliveira',
        type: 'PUSH',
        subject: 'Oferta Especial',
        content: 'Aproveite nossa oferta especial de 20% de desconto em todos os produtos!',
        status: 'SENT',
        delivery_status: 'DELIVERED',
        aws_message_id: 'aws_msg_003',
        aws_request_id: 'aws_req_003',
        retry_count: 0,
        max_retries: 3,
        sent_at: new Date('2025-07-25T15:36:29.000Z'),
        delivered_at: new Date('2025-07-25T15:36:32.000Z'),
        priority: 'NORMAL',
        category: 'promotion',
        source: 'SYSTEM',
        metadata: { endpoint_arn: 'arn:aws:sns:us-east-1:123456789012:endpoint/GCM/MyApp/1234567890' },
        is_active: true,
        created_at: new Date('2025-07-25T15:36:29.000Z'),
        updated_at: new Date('2025-07-25T15:36:32.000Z')
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440004',
        notification_id: 'notif_20250725153629_004',
        user_id: '550e8400-e29b-41d4-a716-446655440013',
        user_email: 'ana.costa@example.com',
        user_name: 'Ana Costa',
        type: 'WHATSAPP',
        subject: 'Entrega Confirmada',
        content: 'Seu pedido foi entregue com sucesso! Obrigado por escolher a Henrique Store.',
        status: 'PENDING',
        delivery_status: 'PENDING',
        retry_count: 0,
        max_retries: 3,
        priority: 'NORMAL',
        category: 'delivery_confirmation',
        source: 'SYSTEM',
        metadata: { phone_number: '+5511888888888' },
        is_active: true,
        created_at: new Date('2025-07-25T15:36:29.000Z'),
        updated_at: new Date('2025-07-25T15:36:29.000Z')
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440005',
        notification_id: 'notif_20250725153629_005',
        user_id: '550e8400-e29b-41d4-a716-446655440014',
        user_email: 'carlos.ferreira@example.com',
        user_name: 'Carlos Ferreira',
        type: 'EMAIL',
        subject: 'Promoção de Aniversário',
        content: '<h1>Feliz Aniversário, Carlos!</h1><p>Como presente especial, você tem 30% de desconto em sua próxima compra.</p>',
        template_id: 'birthday_promotion',
        template_data: { user_name: 'Carlos Ferreira', discount: '30%' },
        status: 'SENT',
        delivery_status: 'DELIVERED',
        aws_message_id: 'aws_msg_005',
        aws_request_id: 'aws_req_005',
        retry_count: 0,
        max_retries: 3,
        sent_at: new Date('2025-07-25T15:36:29.000Z'),
        delivered_at: new Date('2025-07-25T15:36:33.000Z'),
        priority: 'HIGH',
        category: 'birthday_promotion',
        source: 'SCHEDULED',
        is_active: true,
        created_at: new Date('2025-07-25T15:36:29.000Z'),
        updated_at: new Date('2025-07-25T15:36:33.000Z')
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440006',
        notification_id: 'notif_20250725153629_006',
        user_id: '550e8400-e29b-41d4-a716-446655440015',
        user_email: 'lucia.martins@example.com',
        user_name: 'Lúcia Martins',
        type: 'SMS',
        subject: 'Lembrete de Pagamento',
        content: 'Lembrete: seu pagamento vence em 3 dias. Acesse sua conta para evitar juros.',
        status: 'FAILED',
        delivery_status: 'FAILED',
        retry_count: 2,
        max_retries: 3,
        error_message: 'Invalid phone number format',
        priority: 'URGENT',
        category: 'payment_reminder',
        source: 'SYSTEM',
        metadata: { phone_number: 'invalid_number' },
        is_active: true,
        created_at: new Date('2025-07-25T15:36:29.000Z'),
        updated_at: new Date('2025-07-25T15:36:29.000Z')
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440007',
        notification_id: 'notif_20250725153629_007',
        user_id: '550e8400-e29b-41d4-a716-446655440016',
        user_email: 'roberto.lima@example.com',
        user_name: 'Roberto Lima',
        type: 'EMAIL',
        subject: 'Novos Produtos Disponíveis',
        content: '<h1>Confira nossos novos produtos!</h1><p>Temos novidades incríveis esperando por você.</p>',
        status: 'PENDING',
        delivery_status: 'PENDING',
        retry_count: 0,
        max_retries: 3,
        priority: 'NORMAL',
        category: 'new_products',
        source: 'API',
        is_active: true,
        created_at: new Date('2025-07-25T15:36:29.000Z'),
        updated_at: new Date('2025-07-25T15:36:29.000Z')
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440008',
        notification_id: 'notif_20250725153629_008',
        user_id: '550e8400-e29b-41d4-a716-446655440017',
        user_email: 'fernanda.souza@example.com',
        user_name: 'Fernanda Souza',
        type: 'PUSH',
        subject: 'Carrinho Abandonado',
        content: 'Você deixou produtos no carrinho. Complete sua compra e aproveite nossos descontos!',
        status: 'SENT',
        delivery_status: 'DELIVERED',
        aws_message_id: 'aws_msg_008',
        aws_request_id: 'aws_req_008',
        retry_count: 0,
        max_retries: 3,
        sent_at: new Date('2025-07-25T15:36:29.000Z'),
        delivered_at: new Date('2025-07-25T15:36:34.000Z'),
        priority: 'HIGH',
        category: 'abandoned_cart',
        source: 'SYSTEM',
        metadata: { endpoint_arn: 'arn:aws:sns:us-east-1:123456789012:endpoint/GCM/MyApp/0987654321' },
        is_active: true,
        created_at: new Date('2025-07-25T15:36:29.000Z'),
        updated_at: new Date('2025-07-25T15:36:34.000Z')
      }
    ];

    await queryInterface.bulkInsert('notifications', notifications, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('notifications', null, {});
  }
}; 