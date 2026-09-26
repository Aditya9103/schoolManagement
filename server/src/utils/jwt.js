import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import ApiError from './ApiError.js';

/**
 * verifyToken — Synchronously verifies a JWT access or refresh token.
 * @param {string} token
 * @param {'access'|'refresh'} [type='access']
 * @returns {object} Decoded token payload
 */
export const verifyToken = (token, type = 'access') => {
    try {
        const secret = type === 'refresh' ? env.jwt.refreshSecret : env.jwt.accessSecret;
        return jwt.verify(token, secret, {
            issuer: 'sms-api',
            audience: 'sms-client',
        });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw ApiError.unauthorized('Token has expired');
        }
        throw ApiError.unauthorized('Invalid token');
    }
};

/**
 * signToken — Signs a JWT payload.
 * @param {object} payload
 * @param {object} [options={}]
 * @returns {string} Signed JWT
 */
export const signToken = (payload, options = {}) => {
    return jwt.sign(payload, env.jwt.accessSecret, {
        issuer: 'sms-api',
        audience: 'sms-client',
        expiresIn: env.jwt.accessExpires || '15m',
        ...options,
    });
};

export default {
    verifyToken,
    signToken,
};
