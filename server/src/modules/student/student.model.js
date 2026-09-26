import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
            index: true,
        },
        admissionNo: {
            type: String,
            required: [true, 'Admission number is required'],
            trim: true,
            uppercase: true,
        }, // e.g. "ADM-2023-0012"
        rollNo: {
            type: Number,
            required: [true, 'Roll number is required'],
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
            required: [true, 'Class is required'],
            index: true,
        },
        sectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Section',
            required: [true, 'Section is required'],
            index: true,
        },
        academicYear: {
            type: String,
            default: '2026-27',
        },
        academicYearId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AcademicYear',
            default: null,
            index: true,
        },
        admissionDate: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'INACTIVE', 'TRANSFERRED', 'GRADUATED'],
            default: 'ACTIVE',
            index: true,
        },

        // Personal Information (matching Mockup Image 2/4 Screen 11)
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
        },
        photoUrl: {
            type: String,
            default: null,
        },
        dateOfBirth: {
            type: Date,
            required: [true, 'Date of birth is required'],
        },
        bloodGroup: {
            type: String,
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', null],
            default: null,
        },
        gender: {
            type: String,
            enum: ['MALE', 'FEMALE', 'OTHER'],
            default: 'MALE',
        },

        // Parent / Guardian Details
        fatherName: { type: String, trim: true, default: '' },
        fatherPhone: { type: String, trim: true, default: '' },
        fatherOccupation: { type: String, trim: true, default: '' },
        motherName: { type: String, trim: true, default: '' },
        motherPhone: { type: String, trim: true, default: '' },
        motherOccupation: { type: String, trim: true, default: '' },
        guardianName: { type: String, trim: true, default: '' },
        guardianPhone: { type: String, trim: true, default: '' },
        address: { type: String, trim: true, default: '' },
        emergencyContact: { type: String, trim: true, default: '' },

        // Transport (for Driver App & Live tracking synergy)
        busRouteNo: { type: String, trim: true, default: '' },
        busStop: { type: String, trim: true, default: '' },

        // AWS S3 Documents
        documents: [
            {
                title: { type: String, required: true },
                url: { type: String, required: true },
                key: { type: String, default: '' },
                type: { type: String, default: 'DOCUMENT' },
                uploadedAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

studentSchema.index({ schoolId: 1, admissionNo: 1 }, { unique: true });
studentSchema.index({ schoolId: 1, classId: 1, sectionId: 1, rollNo: 1 });
studentSchema.index({ schoolId: 1, firstName: 1, lastName: 1 });

export default mongoose.model('Student', studentSchema);
