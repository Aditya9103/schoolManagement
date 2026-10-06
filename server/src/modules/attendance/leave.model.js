import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
            index: true,
        },
        studentName: {
            type: String,
            trim: true,
            required: true,
        },
        rollNo: {
            type: String,
            default: '',
        },
        className: {
            type: String,
            default: '',
        },
        sectionName: {
            type: String,
            default: '',
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        leaveType: {
            type: String,
            enum: ['SICK', 'CASUAL', 'FAMILY_EVENT', 'MEDICAL', 'OTHER'],
            default: 'SICK',
        },
        reason: {
            type: String,
            required: [true, 'Leave reason is required'],
            trim: true,
        },
        status: {
            type: String,
            enum: ['PENDING', 'APPROVED', 'REJECTED'],
            default: 'PENDING',
            index: true,
        },
        appliedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        reviewNote: {
            type: String,
            default: '',
        },
    },
    { timestamps: true }
);

leaveSchema.index({ schoolId: 1, createdAt: -1 });

export default mongoose.model('StudentLeave', leaveSchema);
