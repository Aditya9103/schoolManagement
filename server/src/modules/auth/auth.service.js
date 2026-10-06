/**
 * auth.service.js — Business logic for authentication.
 *
 * All auth workflows live here:
 *   - OTP send/verify
 *   - Login (OTP-based and password-based)
 *   - Token refresh (with rotation)
 *   - Logout (single device & all devices)
 *   - Password change
 *
 * Services call repositories for DB access and strategies for token operations.
 * Controllers call services and never touch models directly.
 */

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import OtpStore from './otpStore.model.js';
import TokenBlacklist from './tokenBlacklist.model.js';
import * as userRepo from './user.repository.js';
import { generateAccessToken, generateRefreshToken, revokeRefreshToken, revokeAllRefreshTokens } from './strategies/refresh.strategy.js';
import { verifyRefreshToken } from './strategies/jwt.strategy.js';
import ApiError from '../../utils/ApiError.js';
import { OTP_CONFIG, ACCOUNT_SECURITY, ROLES } from '../../config/constants.js';
import { sendEmail, sendOtpEmail } from '../../services/email.service.js';
import { sendWhatsAppOtp } from '../../services/whatsapp.service.js';
import { generateOtp } from '../../services/otp.service.js';
import { uploadFile } from '../../services/storage.service.js';
import { normalizePhone, isValidPhone } from '../../utils/phoneHelper.js';
import env from '../../config/env.js';
import logger from '../../utils/logger.js';

// ── OTP Helpers ───────────────────────────────────────────────────────────────

/**
 * Send an OTP to the given email or WhatsApp mobile number.
 *
 * Flow:
 *  1. Format identifier and detect channel (email vs whatsapp)
 *  2. Invalidate any existing unused OTP for this identifier+purpose
 *  3. Generate a 6-digit cryptographic OTP
 *  4. Hash it with bcrypt and persist to OtpStore
 *  5. Dispatch via Brevo Email or Meta WhatsApp Cloud API
 *
 * @param {string} identifier - Email or phone number
 * @param {string} purpose - Purpose of OTP (LOGIN, REGISTER, etc.)
 * @param {string} [channel='email'] - Delivery channel ('email' | 'whatsapp')
 * @returns {Promise<void>}
 */
export const sendOtp = async (identifier, purpose, channel = 'email') => {
    if (!identifier) {
        throw ApiError.badRequest('Email or phone number is required to send OTP');
    }

    const trimmed = String(identifier).trim();
    const isEmail = trimmed.includes('@');
    const effectiveChannel = channel === 'whatsapp' || (!isEmail && isValidPhone(trimmed)) ? 'whatsapp' : 'email';

    let target = trimmed;
    let email = null;
    let phone = null;

    if (effectiveChannel === 'whatsapp') {
        target = normalizePhone(trimmed);
        phone = target;
        if (!isValidPhone(target)) {
            throw ApiError.badRequest('Please enter a valid phone number for WhatsApp verification');
        }
    } else {
        target = trimmed.toLowerCase();
        email = target;
    }

    // For forgot password, check if account exists first
    if (purpose === OTP_CONFIG.PURPOSES.FORGOT_PASSWORD) {
        const user = isEmail ? await userRepo.findByEmail(target) : await userRepo.findByPhone(target);
        if (!user) {
            throw ApiError.notFound('No registered account was found with this email or mobile number.');
        }
    }

    // Invalidate any existing active OTP for this identifier+purpose
    await OtpStore.updateMany(
        {
            $or: [{ identifier: target }, { email: target }, { phone: target }],
            purpose,
            isUsed: false,
        },
        { isUsed: true }
    );

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + OTP_CONFIG.EXPIRES_IN_MINUTES * 60 * 1000);

    await OtpStore.create({
        identifier: target,
        email,
        phone,
        channel: effectiveChannel,
        otpHash,
        purpose,
        expiresAt,
    });

    // ── Dispatch via configured service ─────────────────────────────────────
    if (effectiveChannel === 'whatsapp') {
        await sendWhatsAppOtp({ phone: target, otp });
        logger.info(`📱 WhatsApp OTP dispatched to +${target} (${purpose})`);
    } else {
        try {
            await sendOtpEmail({
                to: target,
                otp,
                purpose,
                expiryMinutes: OTP_CONFIG.EXPIRES_IN_MINUTES,
            });
            logger.info(`📧 Brevo Email OTP dispatched to ${target} (${purpose})`);
        } catch (emailErr) {
            logger.error(`❌ Failed to dispatch email OTP to ${target}: ${emailErr.message}`);
            if (env.nodeEnv !== 'production') {
                logger.warn(`⚠️ [DEV-FALLBACK] Email delivery failed, but OTP is generated in DB/logs: ${otp}`);
            } else {
                throw ApiError.internal('Unable to send verification email. Please check your email configuration.');
            }
        }
    }

    logger.info(`🔑 [DEV-DIAGNOSTIC] OTP for ${target} [${effectiveChannel.toUpperCase()}]: ${otp}`);
};

/**
 * Verify an OTP submitted by the user.
 *
 * Checks:
 *  - OTP record exists and is not used/expired
 *  - Bcrypt comparison matches
 *  - Max attempts not exceeded
 *
 * @param {string} identifier - Email or Phone
 * @param {string} otp - 6-digit code
 * @param {string} purpose
 * @returns {Promise<OtpStoreDocument>} The verified OTP document
 * @throws {ApiError} 400 on invalid/expired/max-attempts
 */
export const verifyOtp = async (identifier, otp, purpose) => {
    if (!identifier) {
        throw ApiError.badRequest('Identifier is required to verify OTP');
    }

    const trimmed = String(identifier).trim();
    const isEmail = trimmed.includes('@');
    const target = isEmail ? trimmed.toLowerCase() : normalizePhone(trimmed);

    const record = await OtpStore.findOne({
        $or: [{ identifier: target }, { email: target }, { phone: target }],
        purpose,
        isUsed: false,
        expiresAt: { $gt: new Date() },
    });

    if (!record) {
        throw ApiError.badRequest('OTP is invalid or has expired. Please request a new one.');
    }

    if (record.attempts >= OTP_CONFIG.MAX_ATTEMPTS) {
        await OtpStore.findByIdAndUpdate(record._id, { isUsed: true });
        throw ApiError.badRequest('Too many incorrect attempts. Please request a new OTP.');
    }

    const isMatch = await bcrypt.compare(String(otp).trim(), record.otpHash);

    if (!isMatch) {
        await OtpStore.findByIdAndUpdate(record._id, { $inc: { attempts: 1 } });
        const remaining = OTP_CONFIG.MAX_ATTEMPTS - record.attempts - 1;
        throw ApiError.badRequest(`Incorrect OTP. ${remaining} attempt(s) remaining.`);
    }

    // Mark OTP as used
    await OtpStore.findByIdAndUpdate(record._id, { isUsed: true });

    return record;
};

// ── Login ─────────────────────────────────────────────────────────────────────

/**
 * Login using OTP — verifies OTP then issues token pair.
 *
 * @param {string} identifier - Email or Phone number
 * @param {string} otp - 6-digit OTP code
 * @param {object} deviceInfo - { ipAddress, userAgent, deviceFingerprint }
 * @returns {Promise<{ accessToken, refreshToken, user }>}
 */
export const loginWithOtp = async (identifier, otp, deviceInfo = {}) => {
    // Verify OTP (throws on failure)
    await verifyOtp(identifier, otp, OTP_CONFIG.PURPOSES.LOGIN);

    // Find the user by phone or email
    const user = await userRepo.findByPhoneOrEmail(identifier);
    if (!user) {
        throw ApiError.notFound('User account associated with this email/phone not found');
    }

    return _issueTokens(user, deviceInfo);
};

/**
 * Login using password credentials.
 *
 * Security checks:
 *  1. User must exist
 *  2. Account must be active
 *  3. Account must not be locked
 *  4. Password must match
 *  5. Failed login counter is managed
 *
 * @param {string} identifier  - Phone number or email
 * @param {string} password    - Plain text password
 * @param {object} deviceInfo
 * @returns {Promise<{ accessToken, refreshToken, user }>}
 */
export const loginWithPassword = async (identifier, password, deviceInfo = {}) => {
    // Fetch user with passwordHash (excluded by default via select:false)
    const user = await userRepo.findByPhoneOrEmail(identifier, true);

    if (!user) {
        throw ApiError.unauthorized('Invalid credentials');
    }

    if (!user.isActive) {
        throw ApiError.forbidden('Your account has been deactivated. Contact support.');
    }

    // Check account lock
    if (user.lockedUntil && user.lockedUntil > new Date()) {
        const minutesLeft = Math.ceil((user.lockedUntil - Date.now()) / 60000);
        throw ApiError.forbidden(
            `Account is locked due to too many failed attempts. Try again in ${minutesLeft} minute(s).`,
        );
    }

    // Validate password
    if (!user.passwordHash) {
        throw ApiError.badRequest('This account does not have a password set. Use OTP login.');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
        await userRepo.incrementFailedLogin(user._id.toString());
        throw ApiError.unauthorized('Invalid credentials');
    }

    // Reset failed login counter on success (fire and forget to prevent blocking login)
    userRepo.resetFailedLogin(user._id.toString()).catch((err) => {
        console.error(`[AuthService] Failed to reset login attempts for user ${user._id}:`, err);
    });

    return _issueTokens(user, deviceInfo);
};

// ── Token Refresh ─────────────────────────────────────────────────────────────

/**
 * Rotate tokens: validate refresh token → revoke it → issue a new pair.
 *
 * Refresh token rotation means each refresh token can only be used once.
 * This provides detection of token theft (double-use = revoke all).
 *
 * @param {string} rawRefreshToken
 * @param {object} deviceInfo
 * @returns {Promise<{ accessToken, refreshToken }>}
 */
export const refreshTokens = async (rawRefreshToken, deviceInfo = {}) => {
    // Throws if invalid/revoked/expired
    const storedToken = await verifyRefreshToken(rawRefreshToken);

    // Fetch current user
    const user = await userRepo.findById(storedToken.userId.toString());
    if (!user || !user.isActive) {
        throw ApiError.unauthorized('User account not found or deactivated');
    }

    // Revoke the used refresh token (rotation)
    await revokeRefreshToken(rawRefreshToken);

    // Issue fresh pair
    const accessToken = generateAccessToken(user);
    const { rawToken: refreshToken } = await generateRefreshToken(user._id.toString(), deviceInfo);

    return { accessToken, refreshToken };
};

// ── Logout ────────────────────────────────────────────────────────────────────

/**
 * Logout from the current device only.
 *
 * Blacklists the current access token (by its jti) and revokes the refresh token.
 *
 * @param {string} userId
 * @param {string} jti           - JWT ID from the access token payload
 * @param {Date}   tokenExpiresAt - When the access token expires (for TTL)
 * @param {string} rawRefreshToken - The raw refresh token to revoke
 * @returns {Promise<void>}
 */
export const logout = async (userId, jti, tokenExpiresAt, rawRefreshToken) => {
    // Blacklist the access token so it cannot be re-used before it expires
    await TokenBlacklist.create({
        jti,
        userId,
        expiresAt: tokenExpiresAt,
    });

    // Revoke the refresh token if provided
    if (rawRefreshToken) {
        await revokeRefreshToken(rawRefreshToken);
    }
};

/**
 * Logout from ALL devices.
 * Revokes every refresh token and blacklists the current access token.
 *
 * @param {string} userId
 * @param {string} jti
 * @param {Date}   tokenExpiresAt
 * @returns {Promise<void>}
 */
export const logoutAll = async (userId, jti, tokenExpiresAt) => {
    await Promise.all([
        // Blacklist current access token
        TokenBlacklist.create({ jti, userId, expiresAt: tokenExpiresAt }),
        // Revoke ALL refresh tokens for this user
        revokeAllRefreshTokens(userId),
    ]);
};

// ── Password Management ───────────────────────────────────────────────────────

/**
 * Change a user's password.
 *
 * Checks:
 *  - Old password must be correct
 *  - New password must not match any of the last N passwords
 *
 * @param {string} userId
 * @param {string} oldPassword
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const changePassword = async (userId, oldPassword, newPassword) => {
    const user = await userRepo.findById(userId, true); // include passwordHash

    if (!user || !user.passwordHash) {
        throw ApiError.badRequest('Password change is not available for this account.');
    }

    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) {
        throw ApiError.badRequest('Current password is incorrect.');
    }

    // Check against password history
    const history = await userRepo.getPasswordHistory(userId);
    for (const oldHash of history) {
        const isReused = await bcrypt.compare(newPassword, oldHash);
        if (isReused) {
            throw ApiError.badRequest(
                `You cannot reuse any of your last ${ACCOUNT_SECURITY.PASSWORD_HISTORY_COUNT} passwords.`,
            );
        }
    }

    const newHash = await bcrypt.hash(newPassword, ACCOUNT_SECURITY.BCRYPT_SALT_ROUNDS);

    // Store current hash in history before overwriting
    await userRepo.addToPasswordHistory(userId, user.passwordHash);

    // Update the password
    await userRepo.updateUser(userId, { passwordHash: newHash });
};

// ── Private Helpers ───────────────────────────────────────────────────────────

/**
 * Issue an access + refresh token pair after successful authentication.
 * Also updates lastLoginAt on the user record.
 *
 * @param {object} user       - User document (lean)
 * @param {object} deviceInfo
 * @returns {Promise<{ accessToken, refreshToken, user }>}
 */
const _issueTokens = async (user, deviceInfo) => {
    // Fire and forget last login update to speed up response
    userRepo.updateLastLogin(user._id.toString()).catch((err) => {
        console.error(`[AuthService] Failed to update last login for user ${user._id}:`, err);
    });

    const accessToken = generateAccessToken(user);
    const { rawToken: refreshToken } = await generateRefreshToken(
        user._id.toString(),
        deviceInfo,
    );

    // Strip sensitive fields from the user response
    const { passwordHash, passwordHistory, ...safeUser } = user;

    return { accessToken, refreshToken, user: safeUser };
};


/**
 * Get the currently authenticated user's profile (fresh from DB).
 *
 * @param {string} userId
 * @returns {Promise<UserDocument>}
 */
export const getAuthenticatedUser = async (userId) => {
    const user = await userRepo.findById(userId);
    if (!user) {
        throw ApiError.notFound('User');
    }
    const { passwordHash, passwordHistory, ...safeUser } = user;
    return safeUser;
};

/**
 * Register an FCM push notification token for a user (device registration).
 *
 * @param {string} userId
 * @param {string} fcmToken
 * @returns {Promise<void>}
 */
export const registerFcmToken = async (userId, fcmToken) => {
    await userRepo.addFcmToken(userId, fcmToken);
};

/**
 * Update a user's avatar.
 * Uploads to cloudinary and saves the secure URL to the User record.
 * 
 * @param {string} userId 
 * @param {Buffer} imageBuffer 
 * @returns {Promise<UserDocument>}
 */
export const updateMyAvatar = async (userId, imageBuffer) => {
    const uploadResult = await uploadFile(imageBuffer, { folder: 'user_avatars' });
    const updatedUser = await userRepo.updateUser(userId, { profilePhotoUrl: uploadResult.secure_url });
    
    // Strip sensitive fields
    const { passwordHash, passwordHistory, ...safeUser } = updatedUser;
    return safeUser;
};

// ── Resident Registration ─────────────────────────────────────────────────────

/**
 * Step 1: Initiate Resident Registration
 * Creates an UNVERIFIED user and sends an OTP.
 */
export const initiateResidentRegistration = async (firstName, lastName, email, password) => {
    const passwordHash = await bcrypt.hash(password, 10);
    const existing = await userRepo.findByEmail(email);

    if (existing) {
        if (existing.registrationStatus === 'UNVERIFIED' || existing.registrationStatus === 'INCOMPLETE_PROFILE') {
            await userRepo.updateUser(existing._id, {
                firstName,
                lastName,
                passwordHash,
            });
            await sendOtp(email, OTP_CONFIG.PURPOSES.REGISTER);
            return;
        }
        throw ApiError.badRequest('Email is already registered. Please login instead.');
    }

    await userRepo.createUser({
        firstName,
        lastName,
        email,
        passwordHash,
        role: ROLES.RESIDENT,
        registrationStatus: 'UNVERIFIED',
    });

    await sendOtp(email, OTP_CONFIG.PURPOSES.REGISTER);
};

/**
 * Step 2: Verify Resident Registration OTP
 * Updates status to INCOMPLETE_PROFILE and issues login tokens.
 */
export const verifyResidentRegistration = async (email, otp, deviceInfo = {}) => {
    await verifyOtp(email, otp, OTP_CONFIG.PURPOSES.REGISTER);

    const user = await userRepo.findByEmail(email);
    if (!user) throw ApiError.notFound('User not found.');

    await userRepo.updateUser(user._id, {
        registrationStatus: 'INCOMPLETE_PROFILE',
        isEmailVerified: true
    });

    // Fetch updated user to issue tokens with correct status
    const updatedUser = await userRepo.findById(user._id);
    return _issueTokens(updatedUser, deviceInfo);
};

// ── Forgot Password ─────────────────────────────────────────────────────────────

/**
 * Reset password via OTP.
 * Verifies OTP, checks password history, updates password, and adds to history.
 *
 * @param {string} email
 * @param {string} otp
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const resetPassword = async (email, otp, newPassword) => {
    await verifyOtp(email, otp, OTP_CONFIG.PURPOSES.FORGOT_PASSWORD);

    const isEmail = String(email).includes('@');
    const user = isEmail
        ? await userRepo.findByEmail(email, true)
        : await userRepo.findByPhone(normalizePhone(email), true);
    if (!user) {
        throw ApiError.notFound('No account found for this user.');
    }

    // Check against password history
    const history = await userRepo.getPasswordHistory(user._id.toString());
    for (const oldHash of history) {
        const isReused = await bcrypt.compare(newPassword, oldHash);
        if (isReused) {
            throw ApiError.badRequest(
                `You cannot reuse any of your last ${ACCOUNT_SECURITY.PASSWORD_HISTORY_COUNT} passwords.`,
            );
        }
    }

    const newHash = await bcrypt.hash(newPassword, ACCOUNT_SECURITY.BCRYPT_SALT_ROUNDS);

    // Store current hash in history before overwriting (if it exists)
    if (user.passwordHash) {
        await userRepo.addToPasswordHistory(user._id.toString(), user.passwordHash);
    }

    // Update the password
    await userRepo.updateUser(user._id.toString(), { passwordHash: newHash });
};
