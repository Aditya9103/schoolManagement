import mongoose from 'mongoose';

const staffPayrollSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        staffId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        bankDetails: {
            accountHolderName: { type: String, trim: true, default: '' },
            bankName: { type: String, trim: true, default: '' },
            accountNumber: { type: String, trim: true, default: '' },
            ifscCode: { type: String, trim: true, default: '' },
            panNumber: { type: String, trim: true, default: '' },
        },
        salaryStructure: {
            basicSalary: { type: Number, required: true, default: 0 },
            hra: { type: Number, default: 0 },
            specialAllowance: { type: Number, default: 0 },
            conveyance: { type: Number, default: 0 },
            pfDeduction: { type: Number, default: 0 },
            taxDeduction: { type: Number, default: 0 },
            netMonthlySalary: { type: Number, required: true, default: 0 },
        },
        paymentMode: {
            type: String,
            enum: ['BANK_TRANSFER', 'CHEQUE', 'CASH'],
            default: 'BANK_TRANSFER',
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
    },
    { timestamps: true }
);

staffPayrollSchema.index({ schoolId: 1, staffId: 1 }, { unique: true });

export default mongoose.model('StaffPayroll', staffPayrollSchema);
