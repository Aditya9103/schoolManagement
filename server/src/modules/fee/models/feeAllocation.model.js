import mongoose from 'mongoose';

const feeAllocationLineItemSchema = new mongoose.Schema(
    {
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FeeCategory',
        },
        name: {
            type: String,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        paidAmount: {
            type: Number,
            default: 0,
            min: 0,
        },
        dueDate: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: ['UNPAID', 'PARTIALLY_PAID', 'PAID'],
            default: 'UNPAID',
        },
    },
    { _id: true }
);

const feeAllocationSchema = new mongoose.Schema(
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
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
            index: true,
        },
        feeStructureId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FeeStructure',
            required: true,
            index: true,
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
            index: true,
        },
        sectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Section',
            index: true,
        },
        lineItems: [feeAllocationLineItemSchema],
        totalPayable: {
            type: Number,
            required: true,
            min: 0,
        },
        discountAmount: {
            type: Number,
            default: 0,
            min: 0,
        },
        discountReason: {
            type: String,
            default: '',
        },
        netPayable: {
            type: Number,
            required: true,
            min: 0,
        },
        paidAmount: {
            type: Number,
            default: 0,
            min: 0,
        },
        balanceAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ['UNPAID', 'PARTIALLY_PAID', 'PAID', 'OVERDUE'],
            default: 'UNPAID',
            index: true,
        },
        dueDate: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

feeAllocationSchema.index({ schoolId: 1, studentId: 1, academicYear: 1 });
feeAllocationSchema.index({ schoolId: 1, status: 1 });
feeAllocationSchema.index({ schoolId: 1, classId: 1 });

const FeeAllocation = mongoose.models.FeeAllocation || mongoose.model('FeeAllocation', feeAllocationSchema);
export default FeeAllocation;
