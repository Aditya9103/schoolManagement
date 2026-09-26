import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Class name is required'],
            trim: true,
        }, // e.g. "Class 6"
        numericGrade: {
            type: Number,
            required: true,
        }, // 1 through 12, or 0 for pre-primary
        gradeLevel: {
            type: String,
            enum: ['PRE_PRIMARY', 'PRIMARY', 'MIDDLE', 'SECONDARY', 'SENIOR_SECONDARY'],
            default: 'PRIMARY',
        },
        classCode: {
            type: String,
            trim: true,
            uppercase: true,
            default: '',
        },
        classTeacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        tagline: {
            type: String,
            trim: true,
            default: 'Building strong foundations for a brighter future',
        },
        coverImageUrl: {
            type: String,
            default: '',
        },
        bannerUrl: {
            type: String,
            default: '',
        },
        iconUrl: {
            type: String,
            default: '',
        },
        defaultCapacity: {
            type: Number,
            default: 30,
        },
        stream: {
            type: String,
            enum: ['GENERAL', 'SCIENCE', 'COMMERCE', 'ARTS'],
            default: 'GENERAL',
        },
        orderIndex: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

classSchema.index({ schoolId: 1, name: 1 }, { unique: true });
classSchema.index({ schoolId: 1, numericGrade: 1 });

classSchema.pre('validate', function () {
    if (this.gradeLevel !== undefined && this.gradeLevel !== null) {
        const raw = String(this.gradeLevel).trim();
        const asNum = Number(raw);
        if (!isNaN(asNum)) {
            if (asNum === 0) this.gradeLevel = 'PRE_PRIMARY';
            else if (asNum <= 5) this.gradeLevel = 'PRIMARY';
            else if (asNum <= 8) this.gradeLevel = 'MIDDLE';
            else if (asNum <= 10) this.gradeLevel = 'SECONDARY';
            else this.gradeLevel = 'SENIOR_SECONDARY';

            if (this.numericGrade === undefined || this.numericGrade === null) {
                this.numericGrade = asNum;
            }
        }
    }
    if (this.numericGrade === undefined || this.numericGrade === null) {
        const parsed = parseInt(String(this.name).replace(/\D/g, ''), 10);
        this.numericGrade = !isNaN(parsed) ? parsed : 1;
    }
});

export default mongoose.model('Class', classSchema);
