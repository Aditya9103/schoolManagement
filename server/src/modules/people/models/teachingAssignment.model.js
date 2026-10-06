import mongoose from 'mongoose';
import { TEACHING_ASSIGNMENT_TYPE } from '../../../config/stateMachines.js';

const teachingAssignmentSchema = new mongoose.Schema(
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
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
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
        subjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
            default: null,
            index: true,
        },
        assignmentType: {
            type: String,
            enum: Object.values(TEACHING_ASSIGNMENT_TYPE),
            required: true,
            default: TEACHING_ASSIGNMENT_TYPE.SUBJECT_TEACHER,
            index: true,
        },
        periodsPerWeek: {
            type: Number,
            default: 0,
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

// Prevent duplicate assignment of identical teacher + section + subject in same academic year
teachingAssignmentSchema.index(
    { schoolId: 1, academicYearId: 1, teacherId: 1, sectionId: 1, subjectId: 1 },
    { unique: true }
);

// Fast queries
teachingAssignmentSchema.index({ schoolId: 1, academicYearId: 1, teacherId: 1, status: 1 });
teachingAssignmentSchema.index({ schoolId: 1, academicYearId: 1, sectionId: 1, status: 1 });

export default mongoose.model('TeachingAssignment', teachingAssignmentSchema);
