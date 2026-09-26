import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: [
                'BIRTH_CERTIFICATE',
                'AADHAAR_CARD',
                'AADHAAR',
                'PREVIOUS_TC',
                'TRANSFER_CERTIFICATE',
                'PREVIOUS_MARKSHEET',
                'MARKSHEET',
                'STUDENT_PHOTO',
                'PHOTO',
                'ADDRESS_PROOF',
                'CASTE_CERTIFICATE',
                'OTHER',
            ],
        },
        title: { type: String, required: true },
        fileUrl: { type: String, required: true },
        fileSize: { type: String, default: null },
        status: {
            type: String,
            enum: ['PENDING', 'VERIFIED', 'REJECTED'],
            default: 'PENDING',
        },
        verifiedAt: { type: Date, default: null },
        verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        verifiedByName: { type: String, default: null },
        remarks: { type: String, default: null },
    },
    { _id: true }
);

const entranceTestSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ['WRITTEN', 'INTERVIEW', 'BOTH', 'NONE'],
            default: 'WRITTEN',
        },
        scheduledDate: { type: Date, default: null },
        scheduledTime: { type: String, default: null },
        venue: { type: String, default: null },
        examinerName: { type: String, default: null },
        maxMarks: { type: Number, default: 100 },
        marksObtained: { type: Number, default: null },
        status: {
            type: String,
            enum: ['SCHEDULED', 'ATTENDED', 'COMPLETED', 'PASSED', 'FAILED', 'WAIVED'],
            default: 'SCHEDULED',
        },
        instructions: { type: String, default: null },
        remarks: { type: String, default: null },
        admitCardUrl: { type: String, default: null },
    },
    { _id: false }
);

const timelineSchema = new mongoose.Schema(
    {
        stage: { type: String, required: true },
        message: { type: String, required: true },
        updatedBy: { type: String, default: 'System' },
        timestamp: { type: Date, default: Date.now },
    },
    { _id: false }
);

const admissionApplicationSchema = new mongoose.Schema(
    {
        applicationNo: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
        },
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        academicYear: {
            type: String,
            required: true,
            default: '2026-27',
        },
        academicYearId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AcademicYear',
            default: null,
            index: true,
        },
        targetClassId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
            default: null,
        },
        targetClassName: {
            type: String,
            required: true,
            trim: true,
        },
        // Student Personal Details
        student: {
            firstName: { type: String, required: true, trim: true },
            lastName: { type: String, required: true, trim: true },
            gender: {
                type: String,
                enum: ['Male', 'Female', 'Other'],
                required: true,
                default: 'Male',
            },
            dateOfBirth: { type: Date, required: true },
            bloodGroup: { type: String, default: 'O+' },
            category: {
                type: String,
                enum: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Other'],
                default: 'General',
            },
            religion: { type: String, default: 'Hindu' },
            nationality: { type: String, default: 'Indian' },
            aadhaarNo: { type: String, trim: true, default: null },
            photoUrl: { type: String, default: null },
        },
        // Parent / Guardian Details
        parent: {
            fatherName: { type: String, required: true, trim: true },
            fatherPhone: { type: String, required: true, trim: true },
            fatherEmail: { type: String, lowercase: true, trim: true },
            fatherOccupation: { type: String, trim: true, default: '' },
            fatherAnnualIncome: { type: String, trim: true, default: '' },
            motherName: { type: String, trim: true, default: '' },
            motherPhone: { type: String, trim: true, default: '' },
            motherEmail: { type: String, lowercase: true, trim: true, default: '' },
            motherOccupation: { type: String, trim: true, default: '' },
            primaryContact: {
                type: String,
                enum: ['FATHER', 'MOTHER', 'GUARDIAN'],
                default: 'FATHER',
            },
            address: {
                street: { type: String, default: '' },
                city: { type: String, default: '' },
                state: { type: String, default: '' },
                pincode: { type: String, default: '' },
            },
        },
        // Previous Schooling History
        previousSchool: {
            schoolName: { type: String, default: '' },
            lastClassAttended: { type: String, default: '' },
            percentageOrGrade: { type: String, default: '' },
            tcNumber: { type: String, default: '' },
            reasonForLeaving: { type: String, default: '' },
        },
        // Uploaded Documents
        documents: [documentSchema],
        // Lead Source
        source: {
            type: String,
            enum: ['Website', 'Walk-in', 'Referral', 'Advertisement', 'Social Media', 'Other'],
            default: 'Website',
        },
        // Status in Pipeline
        status: {
            type: String,
            enum: [
                'New Application',
                'SUBMITTED',
                'Under Review',
                'UNDER_REVIEW',
                'Document Pending',
                'DOCS_PENDING',
                'Entrance Test',
                'TEST_SCHEDULED',
                'TEST_COMPLETED',
                'INTERVIEW_SCHEDULED',
                'Selected',
                'SELECTED',
                'Approved',
                'APPROVED',
                'Fee Pending',
                'FEE_PENDING',
                'Admitted',
                'ADMITTED',
                'Enrolled',
                'ENROLLED',
                'Waitlisted',
                'WAITLISTED',
                'Rejected',
                'REJECTED',
                'Withdrawn',
                'WITHDRAWN',
            ],
            default: 'New Application',
            index: true,
        },
        // Entrance Test & Interview Details
        entranceTest: {
            type: entranceTestSchema,
            default: () => ({}),
        },
        // Application Processing Fee
        applicationFee: {
            amount: { type: Number, default: 500 },
            status: {
                type: String,
                enum: ['PAID', 'PENDING', 'WAIVED'],
                default: 'PENDING',
            },
            paymentMethod: { type: String, default: 'Online' },
            transactionRef: { type: String, default: null },
            paidAt: { type: Date, default: null },
        },
        // Enrollment Details when Admitted
        enrollmentDetails: {
            studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', default: null },
            admissionNo: { type: String, default: null },
            classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', default: null },
            className: { type: String, default: null },
            sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', default: null },
            sectionName: { type: String, default: null },
            rollNo: { type: Number, default: null },
            enrolledAt: { type: Date, default: null },
            enrolledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        },
        // Review Notes by Staff / Admin
        reviewNotes: [
            {
                authorName: String,
                authorRole: String,
                note: String,
                createdAt: { type: Date, default: Date.now },
            },
        ],
        // Status Audit Timeline
        timeline: [timelineSchema],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

admissionApplicationSchema.index({ schoolId: 1, applicationNo: 1 }, { unique: true });
admissionApplicationSchema.index({ schoolId: 1, status: 1 });
admissionApplicationSchema.index({ schoolId: 1, academicYear: 1 });
admissionApplicationSchema.index({ 'parent.fatherPhone': 1 });

export default mongoose.model('AdmissionApplication', admissionApplicationSchema);
