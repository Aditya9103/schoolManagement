import mongoose from 'mongoose';

const feeCategorySchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Fee category name is required'],
            trim: true,
        },
        code: {
            type: String,
            required: [true, 'Category code is required'],
            uppercase: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
            trim: true,
        },
        isTaxable: {
            type: Boolean,
            default: false,
        },
        taxRate: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

feeCategorySchema.index({ schoolId: 1, code: 1 }, { unique: true });

const FeeCategory = mongoose.models.FeeCategory || mongoose.model('FeeCategory', feeCategorySchema);
export default FeeCategory;
