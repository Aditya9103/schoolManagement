/**
 * notification.model.js — PrimeSchoolOs In-App Notification Model.
 */
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        // Multi-tenant: which school this notification belongs to (null = platform-level)
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            default: null,
            index: true,
        },
        // Recipient
        recipientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        // Sender (null = system)
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        title: { type: String, required: true, trim: true, maxlength: 200 },
        message: { type: String, required: true, trim: true, maxlength: 2000 },
        type: {
            type: String,
            enum: [
                'ANNOUNCEMENT', 'FEE_REMINDER', 'ATTENDANCE_ALERT', 'HOMEWORK', 'EXAM',
                'TRANSPORT', 'LEAVE', 'NOTICE', 'CHAT_MESSAGE', 'SYSTEM', 'SUBSCRIPTION',
            ],
            required: true,
            index: true,
        },
        priority: {
            type: String,
            enum: ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'],
            default: 'NORMAL',
        },
        isRead: { type: Boolean, default: false, index: true },
        readAt: { type: Date, default: null },
        // Deep link: which page/resource this notification links to
        actionUrl: { type: String, default: null },
        actionData: { type: mongoose.Schema.Types.Mixed, default: null },
        // Delivery tracking
        channels: {
            inApp: { type: Boolean, default: true },
            push: { type: Boolean, default: false },
            email: { type: Boolean, default: false },
            whatsapp: { type: Boolean, default: false },
        },
        // Expiry for ephemeral notifications
        expiresAt: { type: Date, default: null },
    },
    { timestamps: true }
);

notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ schoolId: 1, type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, sparse: true });

export default mongoose.model('Notification', notificationSchema);
