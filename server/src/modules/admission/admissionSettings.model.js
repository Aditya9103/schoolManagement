import mongoose from 'mongoose';

const classSeatSchema = new mongoose.Schema(
    {
        className: { type: String, required: true },
        classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', default: null },
        totalSeats: { type: Number, required: true, default: 40 },
        filledSeats: { type: Number, default: 0 },
        applicationFee: { type: Number, default: 500 },
        isOpen: { type: Boolean, default: true },
    },
    { _id: false }
);

const admissionSettingsSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            unique: true,
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
        },
        isAdmissionOpen: {
            type: Boolean,
            default: true,
        },
        startDate: {
            type: Date,
            default: () => new Date('2026-08-01'),
        },
        endDate: {
            type: Date,
            default: () => new Date('2026-11-30'),
        },
        heroTitle: {
            type: String,
            default: 'Every Child Deserves a Brighter Tomorrow',
        },
        heroSubtitle: {
            type: String,
            default: 'Nurturing potential, building character, shaping future leaders.',
        },
        defaultApplicationFee: {
            type: Number,
            default: 500,
        },
        allowedClasses: [classSeatSchema],
        requiredDocuments: {
            type: [String],
            default: [
                'Birth Certificate',
                'Aadhaar Card',
                'Previous Class Marksheet',
                'Transfer Certificate (TC)',
                'Passport Size Photo',
                'Address Proof',
            ],
        },
        instructions: {
            type: String,
            default: 'Please ensure all uploaded documents are legible and in PDF/JPG format under 5MB.',
        },
        contactPhone: { type: String, default: '+91 98765 43210' },
        contactEmail: { type: String, default: 'admissions@greenwood.edu' },
    },
    { timestamps: true }
);

export default mongoose.model('AdmissionSettings', admissionSettingsSchema);
