import mongoose from 'mongoose';

const parentProfileSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
            index: true,
        },
        parentId: {
            type: String,
            required: [true, 'Parent ID is required'],
            trim: true,
            uppercase: true,
        }, // e.g. "PAR001"
        title: {
            type: String,
            enum: ['Mr.', 'Mrs.', 'Ms.', 'Dr.'],
            default: 'Mr.',
        },
        fullName: {
            type: String,
            required: [true, 'Parent full name is required'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
            index: true,
        },
        alternatePhone: {
            type: String,
            trim: true,
            default: '',
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            default: '',
        },
        occupation: {
            type: String,
            trim: true,
            default: '',
        },
        employer: {
            type: String,
            trim: true,
            default: '',
        },
        annualIncome: {
            type: String,
            trim: true,
            default: '',
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'INACTIVE'],
            default: 'ACTIVE',
            index: true,
        },
        address: {
            street: { type: String, trim: true, default: '' },
            city: { type: String, trim: true, default: '' },
            state: { type: String, trim: true, default: '' },
            pincode: { type: String, trim: true, default: '' },
        },
        emergencyContact: {
            name: { type: String, trim: true, default: '' },
            relation: { type: String, trim: true, default: '' },
            phone: { type: String, trim: true, default: '' },
        },
        notes: [
            {
                content: { type: String, required: true },
                authorName: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

parentProfileSchema.index({ schoolId: 1, parentId: 1 }, { unique: true });
parentProfileSchema.index({ schoolId: 1, phone: 1 });
parentProfileSchema.index({ schoolId: 1, fullName: 1 });

export default mongoose.model('ParentProfile', parentProfileSchema);
