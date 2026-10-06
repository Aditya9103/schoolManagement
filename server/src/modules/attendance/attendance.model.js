import mongoose from 'mongoose';

const attendanceRecordItemSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
        },
        rollNo: {
            type: String,
            default: '',
        },
        studentName: {
            type: String,
            trim: true,
            default: '',
        },
        avatar: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED', 'HALF_DAY'],
            default: 'PRESENT',
        },
        remarks: {
            type: String,
            trim: true,
            default: '',
        },
        checkInTime: {
            type: Date,
            default: null,
        },
    },
    { _id: false }
);

const attendanceSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
            required: true,
            index: true,
        },
        sectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Section',
            required: true,
            index: true,
        },
        date: {
            type: Date,
            required: true,
            index: true,
        },
        dateString: {
            type: String,
            required: true,
            index: true, // "YYYY-MM-DD"
        },
        period: {
            type: String,
            enum: ['FULL_DAY', 'PERIOD_1', 'PERIOD_2', 'PERIOD_3', 'PERIOD_4', 'PERIOD_5', 'PERIOD_6', 'PERIOD_7', 'PERIOD_8'],
            default: 'FULL_DAY',
        },
        records: [attendanceRecordItemSchema],
        statistics: {
            totalStudents: { type: Number, default: 0 },
            presentCount: { type: Number, default: 0 },
            absentCount: { type: Number, default: 0 },
            lateCount: { type: Number, default: 0 },
            excusedCount: { type: Number, default: 0 },
            attendanceRate: { type: Number, default: 0 },
        },
        markedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        academicYear: {
            type: String,
            default: '2026-27',
        },
    },
    { timestamps: true }
);

// Compound unique index for school, class, section, dateString, and period
attendanceSchema.index(
    { schoolId: 1, classId: 1, sectionId: 1, dateString: 1, period: 1 },
    { unique: true }
);
attendanceSchema.index({ schoolId: 1, dateString: 1 });

export default mongoose.model('Attendance', attendanceSchema);
