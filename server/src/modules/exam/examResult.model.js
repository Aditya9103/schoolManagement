import mongoose from 'mongoose';

const subjectScoreSchema = new mongoose.Schema(
    {
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
        subjectName: { type: String, required: true },
        subjectCode: { type: String, default: '' },
        maxMarks: { type: Number, default: 100 },
        marksObtained: { type: Number, default: 0 },
        isAbsent: { type: Boolean, default: false },
        grade: { type: String, default: 'A' },
        gradePoint: { type: Number, default: 8.0 },
        remarks: { type: String, default: '' },
    },
    { _id: true }
);

const examResultSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        examId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exam',
            required: true,
            index: true,
        },
        examName: {
            type: String,
            required: true,
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
            index: true,
        },
        rollNo: {
            type: String,
            required: true,
            index: true,
        },
        avatar: {
            type: String,
            default: '',
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
            required: true,
        },
        className: {
            type: String,
            required: true,
            index: true,
        },
        sectionName: {
            type: String,
            default: 'A',
        },
        subjectMarks: [subjectScoreSchema],
        totalMaxMarks: {
            type: Number,
            default: 500,
        },
        totalMarksObtained: {
            type: Number,
            default: 0,
        },
        percentage: {
            type: Number,
            default: 0,
        },
        overallGrade: {
            type: String,
            default: 'A',
        },
        gpa: {
            type: Number,
            default: 8.5,
        },
        rank: {
            type: Number,
            default: 1,
        },
        resultStatus: {
            type: String,
            enum: ['PASS', 'FAIL', 'WITHHELD', 'COMPARTMENT'],
            default: 'PASS',
        },
        attendancePercentage: {
            type: Number,
            default: 95.0,
        },
        status: {
            type: String,
            enum: ['DRAFT', 'PROCESSED', 'PUBLISHED'],
            default: 'PUBLISHED',
        },
        remarks: {
            type: String,
            default: 'Excellent performance, keep it up!',
        },
        reportCardGeneratedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

examResultSchema.index({ schoolId: 1, examId: 1, classId: 1 });
examResultSchema.index({ schoolId: 1, examId: 1, studentId: 1 }, { unique: true });

const ExamResult = mongoose.models.ExamResult || mongoose.model('ExamResult', examResultSchema);

export default ExamResult;
