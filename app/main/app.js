require('./bootstrap')();

const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const cors = require('cors');
const hpp = require('hpp');
const session = require('express-session');
const i18n = require('i18n');
const middle = require('./middleware');
const addRouters = require('./routers');
const logger = require('../utils/logger');

// Middleware de logging personalizado para filtrar kube-probe
const pinoHttp = require('pino-http')({
    logger: logger,
    customLogLevel: function (req, res, err) {
        // Filtrar requisições do kube-probe para evitar logs excessivos
        if (req.headers['user-agent']?.includes('kube-probe')) {
            return 'silent'; // Não loga essas requisições
        }
        return 'info'; // Log normal para outras requisições
    }
});
const csrf = require('csurf');
const csrfProtection = csrf({
    cookie: true,
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'DELETE', 'PATCH'],
    ignorePaths: ['/health', '/v1/health'] // Ignorar endpoints de health check
});

const memoryStore = new session.MemoryStore();

const app = express();

app.use(pinoHttp);

i18n.configure({
    locales: ['en'],
    defaultLocale: 'en',
    directory: __dirname + '/../../locale/error',
    objectNotation: false,
    register: global,
    updateFiles: false,
    syncFiles: false
});

const rawBodySaver = function (req, res, buffer, encoding) {
    if (buffer?.length) {
        req.rawBody = buffer.toString(encoding || 'utf8');
    }
};

app.use(compress());

// CORS configuration for API
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : ['http://localhost:3000', 'http://localhost:3001', 'http://notifications-ms:3003'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 86400 // 24 hours
};
app.use(cors(corsOptions));
app.use(
    bodyParser.json({
        limit: '50mb',
        verify: rawBodySaver
    })
);
app.use(
    bodyParser.urlencoded({
        verify: rawBodySaver,
        limit: '50mb',
        extended: true
    })
);

app.use(
    hpp({
        whitelist: []
    })
);

const routers = {};
routers.v1 = express.Router();

app.set('port', process.env.PORT_SERVER || 3000);
app.use(i18n.init);

app.disable('x-powered-by');

// Security middleware
app.use(helmet.noSniff());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.hidePoweredBy());
app.use(helmet.xssFilter());
app.use(helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' }));

app.use((req, res, next) => {
    // Security headers for API
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-Frame-Options', 'DENY');
    res.set('X-XSS-Protection', '1; mode=block');
    res.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Content Security Policy for API
    const cspPolicy = [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https:",
        "font-src 'self'",
        "connect-src 'self'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'"
    ].join('; ');

    res.set('Content-Security-Policy', cspPolicy);

    return next();
});

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'default-secret-key-change-in-production',
        resave: false,
        saveUninitialized: true,
        store: memoryStore
    })
);

app.use(cookieParser());
app.use(csrfProtection);

app.use('/v1/', routers.v1);
app.use('/', routers.v1);

app.use(middle.throw404);

app.use(middle.logError);
app.use(middle.handleError);
app.use(middle.errorHandler);

addRouters(routers.v1);

module.exports = app;
