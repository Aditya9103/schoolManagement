import mongoose from 'mongoose';

const otpStoreSchema = new mongoose.Schema(
    {
        // Primary identifier: email address or normalized phone number
        identifier: {
            type: String,
            required: true,
            trim: true,
        },
        // Backward-compatible email field
        email: {
            type: String,
            trim: true,
            default: null,
        },
        // Phone number for WhatsApp/SMS delivery
        phone: {
            type: String,
            trim: true,
            default: null,
        },
        // Delivery channel used
        channel: {
            type: String,
            enum: ['email', 'whatsapp', 'sms'],
            default: 'email',
        },
        // Bcrypt-hashed OTP
        otpHash: {
            type: String,
            required: true,
        },
        // Purpose
        purpose: {
            type: String,
            enum: ['LOGIN', 'REGISTER', 'FORGOT_PASSWORD', 'CHANGE_EMAIL'],
            required: true,
        },
        // Failed verification attempts
        attempts: {
            type: Number,
            default: 0,
        },
        // Resend counter
        resendCount: {
            type: Number,
            default: 0,
        },
        // Timestamp of last resend
        lastResendAt: {
            type: Date,
            default: null,
        },
        // Expiration timestamp
        expiresAt: {
            type: Date,
            required: true,
        },
        // Whether OTP was already verified/consumed
        isUsed: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Auto-delete expired OTP records from MongoDB
otpStoreSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpStoreSchema.index({ identifier: 1, purpose: 1, isUsed: 1 });
otpStoreSchema.index({ email: 1, purpose: 1 });
otpStoreSchema.index({ phone: 1, purpose: 1 });

export default mongoose.model('OtpStore', otpStoreSchema);
