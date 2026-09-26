/**
 * socket.server.js — PrimeSchoolOs Socket.IO server.
 * Multi-tenant real-time events scoped to schoolId.
 */
import { Server } from 'socket.io';
import { verifyToken } from '../utils/jwt.js';
import * as userRepo from '../modules/auth/user.repository.js';
import ROOMS from './rooms.js';
import logger from '../config/logger.js';

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true,
        },
        transports: ['websocket', 'polling'],
    });

    // ── Auth Middleware ─────────────────────────────────────────────────────────
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token || socket.handshake.query?.token;
            if (!token) return next(new Error('AUTH_REQUIRED'));
            const payload = verifyToken(token, 'access');
            const user = await userRepo.findById(payload.sub);
            if (!user || !user.isActive) return next(new Error('USER_INACTIVE'));
            socket.user = user;
            socket.userId = user._id.toString();
            next();
        } catch (err) {
            next(new Error('INVALID_TOKEN'));
        }
    });

    // ── Connection Handler ──────────────────────────────────────────────────────
    io.on('connection', async (socket) => {
        const { user, userId } = socket;
        logger.info(`[Socket] Connected: ${userId} (${user.role})`);

        // Personal room
        socket.join(ROOMS.USER(userId));

        // School-scoped rooms
        if (user.schoolId) {
            const sid = user.schoolId.toString();
            socket.join(ROOMS.SCHOOL(sid));

            if (user.role === 'SCHOOL_ADMIN') socket.join(ROOMS.SCHOOL_ADMIN(sid));
            if (user.role === 'TEACHER') socket.join(ROOMS.TEACHER(sid));
            if (['PARENT', 'STUDENT'].includes(user.role)) socket.join(ROOMS.PARENT(sid));
            if (user.role === 'DRIVER') socket.join(ROOMS.DRIVER(sid));
        }

        // Platform room for Super Admin
        if (user.role === 'SUPER_ADMIN') {
            socket.join(ROOMS.PLATFORM);
        }

        // ── Events ─────────────────────────────────────────────────────────────
        socket.on('mark_read', ({ notificationId }) => {
            logger.debug(`[Socket] mark_read: ${notificationId} by ${userId}`);
        });

        socket.on('driver_location', ({ lat, lng, vehicleId }) => {
            if (user.role !== 'DRIVER' || !vehicleId) return;
            socket.to(ROOMS.BUS(vehicleId)).emit('bus_location_update', { lat, lng, vehicleId, timestamp: Date.now() });
        });

        socket.on('disconnect', () => {
            logger.info(`[Socket] Disconnected: ${userId}`);
        });
    });

    logger.info('[Socket] PrimeSchoolOs Socket.IO server initialized');
    return io;
};

export const getIO = () => {
    if (!io) throw new Error('[Socket] Socket.IO not initialized — call initSocket() first');
    return io;
};

// ── Emit helpers ────────────────────────────────────────────────────────────────
export const emitToUser = (userId, event, data) => getIO().to(ROOMS.USER(userId)).emit(event, data);
export const emitToSchool = (schoolId, event, data) => getIO().to(ROOMS.SCHOOL(schoolId)).emit(event, data);
export const emitToPlatform = (event, data) => getIO().to(ROOMS.PLATFORM).emit(event, data);
export const emitToBus = (vehicleId, event, data) => getIO().to(ROOMS.BUS(vehicleId)).emit(event, data);

export default { initSocket, getIO, emitToUser, emitToSchool, emitToPlatform, emitToBus };
