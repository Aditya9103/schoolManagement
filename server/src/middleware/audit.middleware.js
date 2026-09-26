/**
 * audit.middleware.js — PrimeSchoolOs Audit Log Middleware.
 * Captures: who did what, to which resource, from where, and when.
 * Scoped by schoolId (null = Super Admin platform actions).
 */

import AuditLog from '../shared/models/AuditLog.js';

/**
 * auditLog — Middleware factory for post-request audit logging.
 *
 * @param {string} action        - Audit action (e.g. 'CREATE', 'UPDATE', 'DELETE')
 * @param {string} resourceType  - Resource being acted on (e.g. 'SCHOOL', 'STUDENT', 'STAFF')
 * @returns {import('express').RequestHandler}
 */
export const auditLog = (action, resourceType) => (req, res, next) => {
    res.on('finish', () => {
        if (res.statusCode >= 400) return;

        _writeAuditLog(req, res, action, resourceType).catch((err) => {
            console.error('[AuditLog] Failed to write audit entry:', err.message);
        });
    });

    return next();
};

const _writeAuditLog = async (req, res, action, resourceType) => {
    const actor = req.user ?? null;
    const schoolId = actor?.schoolId ?? req.schoolId ?? actor?.societyId ?? null;
    const userId = actor?.sub ?? actor?._id ?? null;

    await AuditLog.create({
        schoolId: schoolId ? schoolId.toString() : null,
        userId: userId ? userId.toString() : null,
        role: actor?.role ?? null,
        action,
        resourceType,
        resourceId: req.auditResourceId ?? null,
        beforeState: req.auditBeforeState ?? null,
        afterState: req.auditAfterState ?? null,
        ipAddress: req.ip || req.headers['x-forwarded-for'] || null,
        userAgent: req.headers['user-agent'] || null,
        endpoint: req.originalUrl,
        method: req.method,
        statusCode: res.statusCode,
        jti: actor?.jti ?? null,
    });
};

/**
 * auditLogin — Audit helper for login events.
 */
export const auditLogin = async ({
    userId,
    role,
    schoolId,
    societyId,
    ipAddress,
    userAgent,
    jti,
}) => {
    const targetSchoolId = schoolId || societyId || null;
    await AuditLog.create({
        schoolId: targetSchoolId ? targetSchoolId.toString() : null,
        userId: userId ? userId.toString() : null,
        role: role ?? null,
        action: 'LOGIN',
        resourceType: 'USER',
        resourceId: userId ? userId.toString() : null,
        ipAddress: ipAddress ?? null,
        userAgent: userAgent ?? null,
        jti: jti ?? null,
        statusCode: 200,
        success: true,
    }).catch((err) => {
        console.error('[AuditLog] Failed to write login audit:', err.message);
    });
};

/**
 * auditLogout — Audit helper for logout events.
 */
export const auditLogout = async ({
    userId,
    role,
    schoolId,
    societyId,
    jti,
    ipAddress,
    userAgent,
}) => {
    const targetSchoolId = schoolId || societyId || null;
    await AuditLog.create({
        schoolId: targetSchoolId ? targetSchoolId.toString() : null,
        userId: userId ? userId.toString() : null,
        role: role ?? null,
        action: 'LOGOUT',
        resourceType: 'USER',
        resourceId: userId ? userId.toString() : null,
        jti: jti ?? null,
        ipAddress: ipAddress ?? null,
        userAgent: userAgent ?? null,
        statusCode: 200,
        success: true,
    }).catch((err) => {
        console.error('[AuditLog] Failed to write logout audit:', err.message);
    });
};
