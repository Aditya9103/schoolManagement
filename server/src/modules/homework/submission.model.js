import mongoose from 'mongoose';

const submissionFileSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        url: { type: String, required: true },
        size: { type: String, default: '1.8 MB' },
        fileType: { type: String, default: 'PDF' },
        key: { type: String, default: '' },
    },
    { _id: false }
);

const submissionSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        assignmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Assignment',
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
            required: true,
            trim: true,
        },
        rollNo: {
            type: String,
            required: true,
            trim: true,
        },
        avatar: {
            type: String,
            default: '',
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['SUBMITTED', 'PENDING', 'LATE', 'GRADED', 'RESUBMISSION_REQUESTED'],
            default: 'SUBMITTED',
            index: true,
        },
        files: [submissionFileSchema],
        comments: {
            type: String,
            default: '',
            trim: true,
        },
        marksObtained: {
            type: Number,
            default: null,
        },
        grade: {
            type: String,
            default: null, // e.g. "A", "A+", "B", "C"
        },
        feedback: {
            type: String,
            default: '',
            trim: true,
        },
        gradedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        gradedAt: {
            type: Date,
            default: null,
        },
        isLate: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

submissionSchema.index({ schoolId: 1, assignmentId: 1, studentId: 1 }, { unique: true });
submissionSchema.index({ schoolId: 1, status: 1 });

export default mongoose.model('Submission', submissionSchema);
