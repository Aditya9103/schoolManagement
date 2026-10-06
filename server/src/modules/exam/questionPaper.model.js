import mongoose from 'mongoose';

const questionPaperSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        examId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exam',
        },
        examName: {
            type: String,
            default: 'Unit Test 1',
        },
        className: {
            type: String,
            required: true,
        },
        subjectName: {
            type: String,
            required: true,
        },
        subjectCode: {
            type: String,
            default: '',
        },
        totalMarks: {
            type: Number,
            default: 100,
        },
        durationMinutes: {
            type: Number,
            default: 180,
        },
        status: {
            type: String,
            enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
            default: 'PUBLISHED',
            index: true,
        },
        fileUrl: {
            type: String,
            default: '',
        },
        fileSize: {
            type: String,
            default: '1.8 MB',
        },
        author: {
            type: String,
            default: 'Academic Department',
        },
    },
    {
        timestamps: true,
    }
);

questionPaperSchema.index({ schoolId: 1, status: 1 });

const QuestionPaper = mongoose.models.QuestionPaper || mongoose.model('QuestionPaper', questionPaperSchema);

export default QuestionPaper;
