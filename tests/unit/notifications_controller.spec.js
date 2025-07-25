const NotificationsController = require('../../app/api/v1/business/notifications/notifications_controller');
const NotificationsService = require('../../app/api/v1/business/notifications/notifications_service');

// Mock do service
jest.mock('../../app/api/v1/business/notifications/notifications_service');

describe('NotificationsController', () => {
    let controller;
    let mockService;

    beforeEach(() => {
        mockService = {
            list: jest.fn(),
            getById: jest.fn(),
            getByNotificationId: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            updateStatus: jest.fn(),
            softDelete: jest.fn(),
            getNotificationsByUser: jest.fn(),
            getNotificationsSummary: jest.fn(),
            sendNotification: jest.fn(),
            sendBulkNotifications: jest.fn(),
            retryFailedNotifications: jest.fn(),
            markAsRead: jest.fn(),
            markAllAsRead: jest.fn(),
            getPendingNotifications: jest.fn(),
            getNotificationStats: jest.fn()
        };

        NotificationsService.mockImplementation(() => mockService);
        controller = new NotificationsController();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('list', () => {
        it('should return notifications list successfully', async () => {
            const mockRequest = {
                query: {
                    page: 1,
                    limit: 20,
                    status: 'SENT',
                    type: 'EMAIL'
                }
            };

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockNext = jest.fn();

            const mockNotifications = {
                data: [
                    {
                        id: '550e8400-e29b-41d4-a716-446655440001',
                        notificationId: 'notif_001',
                        userEmail: 'test@example.com',
                        type: 'EMAIL',
                        status: 'SENT'
                    }
                ],
                meta: {
                    total: 1,
                    page: 1,
                    limit: 20
                }
            };

            mockService.list.mockResolvedValue(mockNotifications);

            await controller.list(mockRequest, mockResponse, mockNext);

            expect(mockService.list).toHaveBeenCalledWith({
                page: 1,
                limit: 20,
                status: 'SENT',
                type: 'EMAIL'
            });
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockNotifications);
        });

        it('should handle errors in list', async () => {
            const mockRequest = {
                query: {}
            };

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockNext = jest.fn();

            const error = new Error('Database error');
            mockService.list.mockRejectedValue(error);

            await controller.list(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalled();
            expect(mockNext.mock.calls[0][0]).toBeDefined();
        });
    });

    describe('getById', () => {
        it('should return notification by id successfully', async () => {
            const mockRequest = {
                params: { id: '550e8400-e29b-41d4-a716-446655440001' }
            };

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockNext = jest.fn();

            const mockNotification = {
                id: '550e8400-e29b-41d4-a716-446655440001',
                notificationId: 'notif_001',
                userEmail: 'test@example.com',
                type: 'EMAIL',
                status: 'SENT'
            };

            mockService.getById.mockResolvedValue(mockNotification);

            await controller.getById(mockRequest, mockResponse, mockNext);

            expect(mockService.getById).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440001');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockNotification);
        });

        it('should return 404 when notification not found', async () => {
            const mockRequest = {
                params: { id: '550e8400-e29b-41d4-a716-446655440001' }
            };

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockNext = jest.fn();

            mockService.getById.mockResolvedValue(null);

            await controller.getById(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalled();
            expect(mockNext.mock.calls[0][0].message).toContain('NOTIFICATION_NOT_FOUND');
        });
    });

    describe('create', () => {
        it('should create notification successfully', async () => {
            const mockRequest = {
                body: {
                    user_id: '550e8400-e29b-41d4-a716-446655440010',
                    user_email: 'test@example.com',
                    user_name: 'Test User',
                    type: 'EMAIL',
                    subject: 'Test Subject',
                    content: 'Test Content'
                }
            };

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockNext = jest.fn();

            const mockNotification = {
                id: '550e8400-e29b-41d4-a716-446655440001',
                notificationId: 'notif_001',
                userEmail: 'test@example.com',
                type: 'EMAIL',
                status: 'PENDING'
            };

            mockService.create.mockResolvedValue(mockNotification);

            await controller.create(mockRequest, mockResponse, mockNext);

            expect(mockService.create).toHaveBeenCalledWith(mockRequest.body);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(mockNotification);
        });
    });

    describe('sendNotification', () => {
        it('should send notification successfully', async () => {
            const mockRequest = {
                body: {
                    user_id: '550e8400-e29b-41d4-a716-446655440010',
                    user_email: 'test@example.com',
                    user_name: 'Test User',
                    type: 'EMAIL',
                    subject: 'Test Subject',
                    content: 'Test Content'
                }
            };

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockNext = jest.fn();

            const mockNotification = {
                id: '550e8400-e29b-41d4-a716-446655440001',
                notificationId: 'notif_001',
                userEmail: 'test@example.com',
                type: 'EMAIL',
                status: 'SENT'
            };

            mockService.sendNotification.mockResolvedValue(mockNotification);

            await controller.sendNotification(mockRequest, mockResponse, mockNext);

            expect(mockService.sendNotification).toHaveBeenCalledWith(mockRequest.body);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(mockNotification);
        });
    });

    describe('markAsRead', () => {
        it('should mark notification as read successfully', async () => {
            const mockRequest = {
                params: { notificationId: 'notif_001' }
            };

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockNext = jest.fn();

            const mockNotification = {
                id: '550e8400-e29b-41d4-a716-446655440001',
                notificationId: 'notif_001',
                status: 'READ'
            };

            mockService.markAsRead.mockResolvedValue(mockNotification);

            await controller.markAsRead(mockRequest, mockResponse, mockNext);

            expect(mockService.markAsRead).toHaveBeenCalledWith('notif_001');
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(mockNotification);
        });

        it('should return 404 when notification not found for mark as read', async () => {
            const mockRequest = {
                params: { notificationId: 'notif_001' }
            };

            const mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            const mockNext = jest.fn();

            mockService.markAsRead.mockResolvedValue(null);

            await controller.markAsRead(mockRequest, mockResponse, mockNext);

            expect(mockNext).toHaveBeenCalled();
            expect(mockNext.mock.calls[0][0].message).toContain('NOTIFICATION_NOT_FOUND');
        });
    });
}); 