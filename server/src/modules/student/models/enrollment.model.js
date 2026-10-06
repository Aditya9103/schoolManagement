import mongoose from 'mongoose';
import { ENROLLMENT_STATUS } from '../../../config/stateMachines.js';

const enrollmentSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        academicYearId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AcademicYear',
            required: true,
            index: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
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
        rollNumber: {
            type: Number,
            required: true,
        },
        admissionNumber: {
            type: String,
            required: true,
            trim: true,
            uppercase: true,
        },
        enrollmentStatus: {
            type: String,
            enum: Object.values(ENROLLMENT_STATUS),
            default: ENROLLMENT_STATUS.ENROLLED,
            index: true,
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
            default: null,
        },
        remarks: {
            type: String,
            default: null,
            trim: true,
        },
    },
    { timestamps: true }
);

// One student can have only one active enrollment per academic year
enrollmentSchema.index({ schoolId: 1, academicYearId: 1, studentId: 1 }, { unique: true });
// Fast query for class/section rosters
enrollmentSchema.index({ schoolId: 1, academicYearId: 1, sectionId: 1, rollNumber: 1 });
enrollmentSchema.index({ schoolId: 1, studentId: 1, enrollmentStatus: 1 });

export default mongoose.model('Enrollment', enrollmentSchema);
