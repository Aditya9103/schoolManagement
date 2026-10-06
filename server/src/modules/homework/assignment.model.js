import mongoose from 'mongoose';

const attachmentItemSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        url: { type: String, required: true },
        size: { type: String, default: '1.2 MB' },
        fileType: { type: String, default: 'PDF' },
        key: { type: String, default: '' },
    },
    { _id: false }
);

const assignmentSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: [true, 'Assignment title is required'],
            trim: true,
        },
        subjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
            default: null,
        },
        subjectName: {
            type: String,
            required: true,
            trim: true,
        }, // e.g. "Mathematics", "English", "Science"
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
            required: true,
            index: true,
        },
        className: {
            type: String,
            required: true,
            trim: true,
        }, // e.g. "Class 6"
        sectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Section',
            default: null,
        },
        sectionName: {
            type: String,
            default: 'Section A',
            trim: true,
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        teacherName: {
            type: String,
            default: 'Teacher',
        },
        type: {
            type: String,
            enum: ['HOMEWORK', 'ASSIGNMENT', 'PROJECT', 'PRACTICAL'],
            default: 'HOMEWORK',
        },
        category: {
            type: String,
            default: 'Chapter Exercise',
            trim: true,
        },
        deadline: {
            type: Date,
            required: [true, 'Deadline is required'],
            index: true,
        },
        deadlineFormatted: {
            type: String,
            default: '',
        }, // e.g. "21 Apr 2026 11:59 PM"
        instructions: [
            {
                type: String,
                trim: true,
            },
        ],
        description: {
            type: String,
            default: '',
            trim: true,
        },
        attachments: [attachmentItemSchema],
        maxMarks: {
            type: Number,
            default: 20,
        },
        allowLate: {
            type: Boolean,
            default: true,
        },
        notifyStudents: {
            type: Boolean,
            default: true,
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'UPCOMING', 'PAST', 'COMPLETED', 'GRADED', 'DRAFT'],
            default: 'ACTIVE',
            index: true,
        },
        statistics: {
            totalStudents: { type: Number, default: 32 },
            submittedCount: { type: Number, default: 28 },
            pendingCount: { type: Number, default: 4 },
            lateCount: { type: Number, default: 2 },
            gradedCount: { type: Number, default: 24 },
            submissionRate: { type: Number, default: 87.5 },
            averageScore: { type: Number, default: 17.2 },
        },
    },
    { timestamps: true }
);

assignmentSchema.index({ schoolId: 1, classId: 1, deadline: -1 });
assignmentSchema.index({ schoolId: 1, status: 1 });

export default mongoose.model('Assignment', assignmentSchema);
