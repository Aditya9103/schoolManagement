import mongoose from 'mongoose';

const academicYearSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        }, // e.g. "2025-26"
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        isCurrent: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

academicYearSchema.index({ schoolId: 1, name: 1 }, { unique: true });

export default mongoose.model('AcademicYear', academicYearSchema);
