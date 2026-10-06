import mongoose from 'mongoose';

const feeTransactionSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        receiptNumber: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
            index: true,
        },
        allocationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FeeAllocation',
            required: true,
            index: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
            index: true,
        },
        amount: {
            type: Number,
            required: [true, 'Transaction amount is required'],
            min: [1, 'Amount must be at least 1'],
        },
        paymentMethod: {
            type: String,
            enum: ['CASH', 'UPI', 'CARD', 'NET_BANKING', 'CHEQUE', 'ONLINE'],
            default: 'CASH',
        },
        transactionReference: {
            type: String,
            default: '',
            trim: true,
        },
        paymentGatewayDetails: {
            gateway: { type: String, default: 'MANUAL' },
            orderId: { type: String, default: null },
            paymentId: { type: String, default: null },
            signature: { type: String, default: null },
        },
        collectedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        collectedByName: {
            type: String,
            default: 'Fee Cashier',
        },
        remarks: {
            type: String,
            default: '',
        },
        paymentDate: {
            type: Date,
            default: Date.now,
        },
        breakdown: [
            {
                name: { type: String, required: true },
                amountPaid: { type: Number, required: true },
            },
        ],
        receiptPdfUrl: {
            type: String,
            default: null,
        },
        status: {
            type: String,
            enum: ['SUCCESS', 'FAILED', 'PENDING', 'REFUNDED'],
            default: 'SUCCESS',
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

feeTransactionSchema.index({ schoolId: 1, paymentDate: -1 });
feeTransactionSchema.index({ schoolId: 1, studentId: 1 });

const FeeTransaction = mongoose.models.FeeTransaction || mongoose.model('FeeTransaction', feeTransactionSchema);
export default FeeTransaction;
