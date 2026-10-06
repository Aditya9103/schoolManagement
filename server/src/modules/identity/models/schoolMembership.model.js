import mongoose from 'mongoose';

const schoolMembershipSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        // Role name can be any system role (e.g. 'TEACHER', 'SCHOOL_ADMIN') OR custom dynamic role (e.g. 'Sports Coach', 'Academic Coordinator')
        role: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        // Reference to custom dynamic role in `Role` collection (if custom or configured)
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role',
            default: null,
            index: true,
        },
        // Canonical archetype category for security fallback
        baseRoleCategory: {
            type: String,
            enum: ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STAFF', 'PARENT', 'STUDENT', 'DRIVER'],
            default: 'STAFF',
            index: true,
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'INVITED', 'SUSPENDED'],
            default: 'ACTIVE',
            index: true,
        },
        permissionsOverride: {
            type: Map,
            of: Object,
            default: {},
        },
        joinedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// A user can have at most one active membership per school
schoolMembershipSchema.index({ userId: 1, schoolId: 1 }, { unique: true });
schoolMembershipSchema.index({ schoolId: 1, role: 1 });

export default mongoose.model('SchoolMembership', schoolMembershipSchema);
