import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        // Multi-tenant: which school this user belongs to (null for SUPER_ADMIN)
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            default: null,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
            default: null,
        },
        passwordHash: {
            type: String,
            default: null,
            select: false,
        },
        firstName: { type: String, required: true, trim: true, maxlength: 50 },
        lastName: { type: String, required: true, trim: true, maxlength: 50 },
        displayName: { type: String, trim: true, default: null },
        profilePhotoUrl: { type: String, default: null },
        dateOfBirth: { type: Date, default: null },
        gender: {
            type: String,
            enum: ['MALE', 'FEMALE', 'OTHER', null],
            default: null,
        },
        // PrimeSchoolOs Roles: System roles (TEACHER, SCHOOL_ADMIN, etc.) OR custom dynamic roles created in Roles & Permissions
        role: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role',
            default: null,
            index: true,
        },
        // Staff fields
        employeeId: { type: String, trim: true, default: null },
        department: { type: String, trim: true, default: null },
        designation: { type: String, trim: true, default: null },
        joiningDate: { type: Date, default: null },
        // Student/Parent fields
        admissionNo: { type: String, trim: true, default: null },
        // Driver fields
        licenseNo: { type: String, trim: true, default: null },
        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
            default: null,
        },
        // Account status
        isEmailVerified: { type: Boolean, default: false },
        isPhoneVerified: { type: Boolean, default: false },
        registrationStatus: {
            type: String,
            enum: ['UNVERIFIED', 'INCOMPLETE_PROFILE', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED'],
            default: 'UNVERIFIED',
        },
        isActive: { type: Boolean, default: true },
        lastLoginAt: { type: Date, default: null },
        failedLoginCount: { type: Number, default: 0 },
        lockedUntil: { type: Date, default: null },
        passwordHistory: { type: [String], select: false, default: [] },
        fcmTokens: { type: [String], default: [] },
        metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    { timestamps: true }
);

userSchema.index({ schoolId: 1, role: 1 });
userSchema.index({ role: 1 });

userSchema.methods.comparePassword = async function (plainPassword) {
    return bcrypt.compare(plainPassword, this.passwordHash);
};

userSchema.methods.isAccountLocked = function () {
    return this.lockedUntil && this.lockedUntil > new Date();
};

export default mongoose.model('User', userSchema);
