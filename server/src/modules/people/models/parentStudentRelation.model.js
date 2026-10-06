import mongoose from 'mongoose';

const parentStudentRelationSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ParentProfile',
            required: true,
            index: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
            index: true,
        },
        relationship: {
            type: String,
            enum: ['FATHER', 'MOTHER', 'STEP_FATHER', 'STEP_MOTHER', 'LEGAL_GUARDIAN', 'GRANDPARENT', 'SIBLING', 'OTHER'],
            default: 'FATHER',
            required: true,
        },
        isPrimaryContact: {
            type: Boolean,
            default: true,
        },
        canPickupStudent: {
            type: Boolean,
            default: true,
        },
        canReceiveNotifications: {
            type: Boolean,
            default: true,
        },
        isEmergencyContact: {
            type: Boolean,
            default: true,
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'INACTIVE'],
            default: 'ACTIVE',
            index: true,
        },
    },
    { timestamps: true }
);

parentStudentRelationSchema.index(
    { schoolId: 1, parentId: 1, studentId: 1 },
    { unique: true }
);
parentStudentRelationSchema.index({ schoolId: 1, studentId: 1 });
parentStudentRelationSchema.index({ schoolId: 1, parentId: 1 });

export default mongoose.model('ParentStudentRelation', parentStudentRelationSchema);
