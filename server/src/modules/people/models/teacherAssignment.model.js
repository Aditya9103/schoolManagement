import mongoose from 'mongoose';

const teacherAssignmentSchema = new mongoose.Schema(
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
            default: null,
            index: true,
        },
        academicYear: {
            type: String,
            default: '2026-27',
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
        assignmentType: {
            type: String,
            enum: ['CLASS_TEACHER', 'ASSISTANT_CLASS_TEACHER', 'GRADE_COORDINATOR'],
            default: 'CLASS_TEACHER',
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'TRANSFERRED', 'COMPLETED'],
            default: 'ACTIVE',
            index: true,
        },
    },
    { timestamps: true }
);

// A teacher can be assigned to multiple sections, but typically one active CLASS_TEACHER per section
teacherAssignmentSchema.index(
    { schoolId: 1, sectionId: 1, assignmentType: 1, status: 1 },
    { unique: true, partialFilterExpression: { status: 'ACTIVE', assignmentType: 'CLASS_TEACHER' } }
);
teacherAssignmentSchema.index({ schoolId: 1, teacherId: 1, status: 1 });

export default mongoose.model('TeacherAssignment', teacherAssignmentSchema);
