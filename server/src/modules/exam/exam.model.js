import mongoose from 'mongoose';

const subjectExamSchema = new mongoose.Schema(
    {
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
        subjectName: { type: String, required: true },
        subjectCode: { type: String, default: '' },
        maxMarks: { type: Number, default: 100 },
        passingMarks: { type: Number, default: 33 },
        examDate: { type: Date },
        startTime: { type: String, default: '09:00 AM' },
        endTime: { type: String, default: '12:00 PM' },
        roomNo: { type: String, default: '' },
    },
    { _id: true }
);

const classExamSchema = new mongoose.Schema(
    {
        classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
        className: { type: String, required: true },
        sectionName: { type: String, default: 'A' },
        subjects: [subjectExamSchema],
    },
    { _id: true }
);

const examSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        academicYear: {
            type: String,
            default: '2026 - 27',
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['PERIODIC_TEST', 'TERM_EXAM', 'BOARD_PATTERN', 'MOCK_EXAM', 'PRACTICAL'],
            default: 'PERIODIC_TEST',
            index: true,
        },
        term: {
            type: String,
            enum: ['Term 1', 'Term 2', 'Annual'],
            default: 'Term 1',
            index: true,
        },
        classesApplicable: {
            type: String,
            default: '1 - 12',
        },
        classes: [classExamSchema],
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['DRAFT', 'UPCOMING', 'ONGOING', 'COMPLETED', 'RESULTS_PUBLISHED'],
            default: 'UPCOMING',
            index: true,
        },
        gradingScale: {
            type: String,
            enum: ['CBSE_10_POINT', 'PERCENTAGE', 'GPA_4_POINT'],
            default: 'CBSE_10_POINT',
        },
        includeInFinalResult: {
            type: Boolean,
            default: true,
        },
        allowReEvaluation: {
            type: Boolean,
            default: false,
        },
        description: {
            type: String,
            default: '',
        },
        statistics: {
            totalStudents: { type: Number, default: 0 },
            appearedCount: { type: Number, default: 0 },
            passedCount: { type: Number, default: 0 },
            failedCount: { type: Number, default: 0 },
            averagePercentage: { type: Number, default: 0 },
            highestMarks: { type: Number, default: 0 },
            lowestMarks: { type: Number, default: 0 },
            passRate: { type: Number, default: 0 },
            distinctionRate: { type: Number, default: 0 },
            firstDivisionRate: { type: Number, default: 0 },
            secondDivisionRate: { type: Number, default: 0 },
        },
    },
    {
        timestamps: true,
    }
);

examSchema.index({ schoolId: 1, academicYear: 1, status: 1 });
examSchema.index({ schoolId: 1, name: 1 });

const Exam = mongoose.models.Exam || mongoose.model('Exam', examSchema);

export default Exam;
