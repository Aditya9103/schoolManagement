import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

// ── Schema: validate & coerce all required environment variables ──────────────
const envSchema = Joi.object({
    // Server
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    PORT: Joi.number().port().default(3000),

    // Database
    MONGO_URI: Joi.string().required().description('MongoDB connection URI'),

    // JWT secrets — required in all environments
    JWT_ACCESS_SECRET: Joi.string().min(32).required().description('Secret for signing access tokens'),
    JWT_REFRESH_SECRET: Joi.string().min(32).required().description('Secret for signing refresh tokens'),

    // JWT expiry overrides (optional — defaults set in constants.js)
    JWT_ACCESS_EXPIRES: Joi.string().default('15m'),
    JWT_REFRESH_EXPIRES: Joi.string().default('7d'),

    // ID Card Secret
    ID_CARD_SECRET: Joi.string().required().description('Secret for signing ID card QR codes'),

    // AWS S3 (file uploads)
    AWS_ACCESS_KEY_ID: Joi.string().optional().allow(''),
    AWS_SECRET_ACCESS_KEY: Joi.string().optional().allow(''),
    AWS_S3_BUCKET: Joi.string().optional().allow(''),
    AWS_REGION: Joi.string().optional().default('us-east-1'),

    // WhatsApp Meta Cloud API
    WHATSAPP_PHONE_NUMBER_ID: Joi.string().optional().allow(''),
    WHATSAPP_WABA_ID: Joi.string().optional().allow(''),
    WHATSAPP_ACCESS_TOKEN: Joi.string().optional().allow(''),
    WHATSAPP_TEMPLATE_NAME: Joi.string().optional().default('tcm_website_auth'),
    WHATSAPP_TEMPLATE_LANG: Joi.string().optional().default('en_US'),

    // Razorpay (payments)
    RAZORPAY_KEY_ID: Joi.string().optional().allow(''),
    RAZORPAY_KEY_SECRET: Joi.string().optional().allow(''),

    // Firebase (push notifications)
    FIREBASE_PROJECT_ID: Joi.string().optional().allow(''),
    FIREBASE_CLIENT_EMAIL: Joi.string().optional().allow(''),
    FIREBASE_PRIVATE_KEY: Joi.string().optional().allow(''),
    FIREBASE_API_KEY: Joi.string().optional().allow(''),
    FIREBASE_AUTH_DOMAIN: Joi.string().optional().allow(''),
    FIREBASE_STORAGE_BUCKET: Joi.string().optional().allow(''),
    FIREBASE_MESSAGING_SENDER_ID: Joi.string().optional().allow(''),
    FIREBASE_APP_ID: Joi.string().optional().allow(''),
    FIREBASE_MEASUREMENT_ID: Joi.string().optional().allow(''),

    // Nodemailer (Brevo email)
    SMTP_HOST: Joi.string().optional().allow(''),
    SMTP_PORT: Joi.number().optional().default(587),
    SMTP_USER: Joi.string().optional().allow(''),
    SMTP_PASS: Joi.string().optional().allow(''),
    SMTP_FROM: Joi.string().optional().allow('').default('noreply@sms.app'),

    // Client origins for CORS
    CLIENT_ORIGINS: Joi.string().optional().allow(''),

}).unknown(); // allow any other env vars (e.g. from CI/CD)

const { error, value } = envSchema.validate(process.env);

if (error) {
    throw new Error(`❌ Environment validation error: ${error.message}`);
}

// ── Export a frozen, typed config object ─────────────────────────────────────
const env = Object.freeze({
    nodeEnv: value.NODE_ENV,
    isProduction: value.NODE_ENV === 'production',
    isDevelopment: value.NODE_ENV === 'development',
    isTest: value.NODE_ENV === 'test',
    port: value.PORT,

    // Database
    db: {
        mongoUri: value.MONGO_URI,
    },

    // JWT
    jwt: {
        accessSecret: value.JWT_ACCESS_SECRET,
        refreshSecret: value.JWT_REFRESH_SECRET,
        accessExpires: value.JWT_ACCESS_EXPIRES,
        refreshExpires: value.JWT_REFRESH_EXPIRES,
    },

    // ID Card
    idCardSecret: value.ID_CARD_SECRET,

    // AWS S3
    aws: {
        accessKeyId: value.AWS_ACCESS_KEY_ID,
        secretAccessKey: value.AWS_SECRET_ACCESS_KEY,
        bucket: value.AWS_S3_BUCKET,
        region: value.AWS_REGION || 'us-east-1',
    },

    // WhatsApp Meta Cloud API
    whatsapp: {
        phoneNumberId: value.WHATSAPP_PHONE_NUMBER_ID,
        wabaId: value.WHATSAPP_WABA_ID,
        accessToken: value.WHATSAPP_ACCESS_TOKEN,
        templateName: value.WHATSAPP_TEMPLATE_NAME || 'tcm_website_auth',
        templateLang: value.WHATSAPP_TEMPLATE_LANG || 'en_US',
    },

    // Razorpay
    razorpay: {
        keyId: value.RAZORPAY_KEY_ID,
        keySecret: value.RAZORPAY_KEY_SECRET,
    },

    // Firebase FCM
    firebase: {
        projectId: value.FIREBASE_PROJECT_ID,
        clientEmail: value.FIREBASE_CLIENT_EMAIL,
        // Newline escapes in env vars need to be restored
        privateKey: value.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        apiKey: value.FIREBASE_API_KEY,
        authDomain: value.FIREBASE_AUTH_DOMAIN,
        storageBucket: value.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: value.FIREBASE_MESSAGING_SENDER_ID,
        appId: value.FIREBASE_APP_ID,
        measurementId: value.FIREBASE_MEASUREMENT_ID,
    },

    // Email (Brevo SMTP)
    smtp: {
        host: value.SMTP_HOST,
        port: value.SMTP_PORT,
        user: value.SMTP_USER,
        pass: value.SMTP_PASS,
        from: value.SMTP_FROM,
    },

    // CORS
    clientOrigins: value.CLIENT_ORIGINS?.split(',').map((o) => o.trim()) ?? ['*'],
});

export default env;
