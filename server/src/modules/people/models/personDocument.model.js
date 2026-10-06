import mongoose from 'mongoose';

const personDocumentSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        ownerType: {
            type: String,
            enum: ['TEACHER', 'STAFF', 'PARENT', 'STUDENT'],
            required: true,
            index: true,
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true,
        },
        documentCategory: {
            type: String,
            enum: ['IDENTITY_PROOF', 'EDUCATION_DEGREE', 'CONTRACT', 'EXPERIENCE_LETTER', 'MEDICAL_CERTIFICATE', 'OTHER'],
            default: 'IDENTITY_PROOF',
        },
        documentName: {
            type: String,
            required: true,
            trim: true,
        },
        fileUrl: {
            type: String,
            required: true,
        },
        fileSize: {
            type: Number,
            default: 0,
        },
        fileFormat: {
            type: String,
            default: 'PDF',
        },
        verificationStatus: {
            type: String,
            enum: ['PENDING', 'VERIFIED', 'REJECTED'],
            default: 'PENDING',
        },
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        verifiedAt: {
            type: Date,
            default: null,
        },
        rejectionReason: {
            type: String,
            default: '',
        },
        expiryDate: {
            type: Date,
            default: null,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

personDocumentSchema.index({ schoolId: 1, ownerType: 1, ownerId: 1 });

export default mongoose.model('PersonDocument', personDocumentSchema);
