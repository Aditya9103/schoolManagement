import mongoose from 'mongoose';

const { Schema } = mongoose;

const noticeAttachmentSchema = new Schema(
    {
        fileName: { type: String, required: true },
        fileUrl: { type: String, required: true },
        fileType: { type: String, default: 'application/pdf' },
        fileSize: { type: String, default: '1.2 MB' },
    },
    { _id: false }
);

const acknowledgmentSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        acknowledgedAt: { type: Date, default: Date.now },
    },
    { _id: false }
);

const noticeSchema = new Schema(
    {
        schoolId: {
            type: Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            enum: ['ACADEMIC', 'EVENT', 'HOLIDAY', 'EXAMINATION', 'ADMINISTRATIVE', 'EMERGENCY'],
            default: 'ACADEMIC',
            index: true,
        },
        priority: {
            type: String,
            enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'],
            default: 'NORMAL',
            index: true,
        },
        targetAudience: {
            type: String,
            enum: ['ALL', 'STUDENTS', 'TEACHERS', 'STAFF', 'PARENTS', 'SPECIFIC_CLASSES'],
            default: 'ALL',
            index: true,
        },
        targetClassIds: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Class',
            },
        ],
        attachments: [noticeAttachmentSchema],
        publishedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        publishedAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
        expiresAt: {
            type: Date,
            default: null,
        },
        isPinned: {
            type: Boolean,
            default: false,
            index: true,
        },
        acknowledgmentRequired: {
            type: Boolean,
            default: false,
        },
        acknowledgedBy: [acknowledgmentSchema],
        status: {
            type: String,
            enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
            default: 'PUBLISHED',
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

noticeSchema.index({ schoolId: 1, status: 1, isPinned: -1, publishedAt: -1 });

const Notice = mongoose.models.Notice || mongoose.model('Notice', noticeSchema);

export default Notice;
