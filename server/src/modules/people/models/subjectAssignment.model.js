import mongoose from 'mongoose';

const subjectAssignmentSchema = new mongoose.Schema(
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
        subjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
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
        periodsPerWeek: {
            type: Number,
            default: 5,
            min: 1,
            max: 30,
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

subjectAssignmentSchema.index(
    { schoolId: 1, sectionId: 1, subjectId: 1, teacherId: 1, status: 1 },
    { unique: true }
);
subjectAssignmentSchema.index({ schoolId: 1, teacherId: 1, status: 1 });
subjectAssignmentSchema.index({ schoolId: 1, classId: 1, sectionId: 1 });

export default mongoose.model('SubjectAssignment', subjectAssignmentSchema);
