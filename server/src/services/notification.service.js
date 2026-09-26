/**
 * notification.service.js — PrimeSchoolOs in-app + push notification service.
 */
import Notification from '../modules/notification/notification.model.js';
import { emitToUser } from '../socket/socket.server.js';
import logger from '../config/logger.js';

/**
 * Create and deliver an in-app notification to one or many recipients.
 * @param {object} opts
 * @param {string|string[]} opts.recipientId - User ID(s)
 * @param {string} opts.title
 * @param {string} opts.message
 * @param {string} opts.type - NotificationType enum
 * @param {string} [opts.schoolId] - School scope (null = platform-level)
 * @param {string} [opts.senderId] - Sender user ID
 * @param {string} [opts.priority] - LOW | NORMAL | HIGH | CRITICAL
 * @param {string} [opts.actionUrl] - Deep link URL
 * @param {object} [opts.actionData] - Extra metadata
 * @param {object} [opts.channels] - Override delivery channels
 */
export const sendNotification = async ({
    recipientId,
    title,
    message,
    type,
    schoolId = null,
    senderId = null,
    priority = 'NORMAL',
    actionUrl = null,
    actionData = null,
    channels = {},
}) => {
    const recipients = Array.isArray(recipientId) ? recipientId : [recipientId];

    const docs = await Promise.all(
        recipients.map((rid) =>
            Notification.create({
                recipientId: rid,
                schoolId,
                senderId,
                title,
                message,
                type,
                priority,
                actionUrl,
                actionData,
                channels: { inApp: true, push: false, email: false, whatsapp: false, ...channels },
            })
        )
    );

    // Emit real-time via Socket.IO
    docs.forEach((doc) => {
        try {
            emitToUser(doc.recipientId.toString(), 'notification', {
                id: doc._id,
                title: doc.title,
                message: doc.message,
                type: doc.type,
                priority: doc.priority,
                actionUrl: doc.actionUrl,
                createdAt: doc.createdAt,
            });
        } catch (err) {
            logger.warn(`[Notification] Socket emit failed for ${doc.recipientId}: ${err.message}`);
        }
    });

    return docs;
};

/**
 * Mark a notification as read.
 */
export const markAsRead = (notificationId, userId) =>
    Notification.findOneAndUpdate(
        { _id: notificationId, recipientId: userId },
        { isRead: true, readAt: new Date() },
        { new: true }
    );

/**
 * Get paginated unread + recent notifications for a user.
 */
export const getUserNotifications = async (userId, { page = 1, limit = 20 } = {}) => {
    const skip = (page - 1) * limit;
    const [items, unreadCount] = await Promise.all([
        Notification.find({ recipientId: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Notification.countDocuments({ recipientId: userId, isRead: false }),
    ]);
    return { items, unreadCount, page, limit };
};
