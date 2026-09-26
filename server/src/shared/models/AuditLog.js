/**
 * AuditLog.js — PrimeSchoolOs Audit Trail Model.
 * Captures who did what, to which resource, from where, and when.
 * Scoped by schoolId (null = platform-level action by Super Admin).
 */
import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
    {
        // Multi-tenant scope (null for Super Admin platform actions)
        schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School', default: null, index: true },

        // Actor
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        role: { type: String, default: null },

        // Action descriptor
        action: { type: String, required: true, trim: true },          // e.g. 'CREATE', 'UPDATE', 'LOGIN'
        resourceType: { type: String, required: true, trim: true },    // e.g. 'SCHOOL', 'STUDENT', 'FEE'
        resourceId: { type: mongoose.Schema.Types.ObjectId, default: null },

        // State diff (optional, for UPDATE actions)
        beforeState: { type: mongoose.Schema.Types.Mixed, default: null },
        afterState: { type: mongoose.Schema.Types.Mixed, default: null },

        // Request metadata
        ipAddress: { type: String, default: null },
        userAgent: { type: String, default: null },
        endpoint: { type: String, default: null },
        method: { type: String, default: null },

        // JWT token ID (for tracing a specific session)
        jti: { type: String, default: null },

        // Outcome
        statusCode: { type: Number, default: null },
        success: { type: Boolean, default: true },
        errorMessage: { type: String, default: null },
    },
    {
        timestamps: true,
        // TTL: auto-delete audit logs older than 2 years (Phase 5+: make configurable)
        // expireAfterSeconds: 63072000
    }
);

auditLogSchema.index({ schoolId: 1, createdAt: -1 });
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, resourceType: 1 });

export default mongoose.model('AuditLog', auditLogSchema);
