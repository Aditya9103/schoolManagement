import mongoose from 'mongoose';

const feeComponentSchema = new mongoose.Schema(
    {
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FeeCategory',
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
            min: [0, 'Amount cannot be negative'],
        },
        dueDate: {
            type: Date,
            default: null,
        },
        frequency: {
            type: String,
            enum: ['ONE_TIME', 'MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'ANNUAL'],
            default: 'QUARTERLY',
        },
    },
    { _id: true }
);

const feeStructureSchema = new mongoose.Schema(
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
        name: {
            type: String,
            required: [true, 'Fee structure title is required'],
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        classIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Class',
                required: true,
            },
        ],
        components: [feeComponentSchema],
        totalAmount: {
            type: Number,
            default: 0,
            min: 0,
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'INACTIVE', 'DRAFT'],
            default: 'ACTIVE',
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

feeStructureSchema.index({ schoolId: 1, name: 1 });

const FeeStructure = mongoose.models.FeeStructure || mongoose.model('FeeStructure', feeStructureSchema);
export default FeeStructure;
