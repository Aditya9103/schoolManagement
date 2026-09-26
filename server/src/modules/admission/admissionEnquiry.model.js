import mongoose from 'mongoose';

const admissionEnquirySchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        applicantName: {
            type: String,
            required: [true, 'Applicant name is required'],
            trim: true,
        },
        parentName: {
            type: String,
            required: [true, 'Parent name is required'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
            default: '',
        },
        classInterest: {
            type: String,
            required: true,
            trim: true,
        },
        academicYear: {
            type: String,
            default: '2026-27',
        },
        academicYearId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AcademicYear',
            default: null,
        },
        source: {
            type: String,
            enum: ['Website', 'Walk-in', 'Phone', 'Referral', 'Advertisement', 'Social Media', 'Other'],
            default: 'Walk-in',
        },
        status: {
            type: String,
            enum: ['Open', 'Contacted', 'Follow-up Scheduled', 'Converted', 'Dropped'],
            default: 'Open',
            index: true,
        },
        priority: {
            type: String,
            enum: ['High', 'Medium', 'Low'],
            default: 'Medium',
        },
        nextFollowUpDate: {
            type: Date,
            default: null,
        },
        notes: {
            type: String,
            default: '',
        },
        convertedApplicationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AdmissionApplication',
            default: null,
        },
        assignedStaffName: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

admissionEnquirySchema.index({ schoolId: 1, status: 1 });
admissionEnquirySchema.index({ schoolId: 1, nextFollowUpDate: 1 });

export default mongoose.model('AdmissionEnquiry', admissionEnquirySchema);
