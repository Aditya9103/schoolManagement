import mongoose from 'mongoose';

const communicationLogSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        senderRole: {
            type: String,
            required: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
            index: true,
        },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ParentProfile',
            default: null,
            index: true,
        },
        channel: {
            type: String,
            enum: ['WHATSAPP', 'SMS', 'CALL', 'PORTAL_MESSAGE', 'EMAIL'],
            required: true,
            index: true,
        },
        purpose: {
            type: String,
            enum: ['ACADEMIC', 'ATTENDANCE', 'BEHAVIOR', 'HOMEWORK', 'GENERAL', 'EMERGENCY', 'FEES'],
            default: 'GENERAL',
        },
        messageContent: {
            type: String,
            default: '',
            trim: true,
        },
        deliveryStatus: {
            type: String,
            enum: ['INITIATED', 'SENT', 'DELIVERED', 'FAILED'],
            default: 'INITIATED',
            index: true,
        },
        metadata: {
            type: Map,
            of: String,
            default: {},
        },
    },
    { timestamps: true }
);

communicationLogSchema.index({ schoolId: 1, studentId: 1, createdAt: -1 });
communicationLogSchema.index({ schoolId: 1, senderId: 1, createdAt: -1 });

export default mongoose.model('CommunicationLog', communicationLogSchema);
