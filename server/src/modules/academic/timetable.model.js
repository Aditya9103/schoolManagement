import mongoose from 'mongoose';

const periodDefinitionSchema = new mongoose.Schema(
    {
        periodNumber: {
            type: Number,
            required: true,
        },
        name: {
            type: String,
            default: '',
        },
        startTime: {
            type: String,
            required: true, // e.g. "08:00 AM"
        },
        endTime: {
            type: String,
            required: true, // e.g. "08:45 AM"
        },
        isBreak: {
            type: Boolean,
            default: false,
        },
        breakTitle: {
            type: String,
            default: 'Recess',
        },
    },
    { _id: true }
);

const timetableSlotSchema = new mongoose.Schema(
    {
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            required: true,
        },
        periodNumber: {
            type: Number,
            required: true,
        },
        startTime: {
            type: String,
            default: '',
        },
        endTime: {
            type: String,
            default: '',
        },
        isBreak: {
            type: Boolean,
            default: false,
        },
        breakTitle: {
            type: String,
            default: 'Recess',
        },
        subjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
            default: null,
        },
        subjectName: {
            type: String,
            default: '',
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        teacherName: {
            type: String,
            default: '',
        },
        roomNumber: {
            type: String,
            default: '',
        },
        color: {
            type: String,
            default: '#3B82F6',
        },
        note: {
            type: String,
            default: '',
        },
    },
    { _id: true }
);

const timetableSchema = new mongoose.Schema(
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
        academicYearId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AcademicYear',
            default: null,
        },
        periodsConfig: [periodDefinitionSchema],
        slots: [timetableSlotSchema],
    },
    { timestamps: true }
);

timetableSchema.index({ schoolId: 1, classId: 1, sectionId: 1 }, { unique: true });

export default mongoose.model('Timetable', timetableSchema);
