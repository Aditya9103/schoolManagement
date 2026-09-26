import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Section name is required'],
            trim: true,
            uppercase: true,
        }, // e.g. "A", "B", "C"
        classTeacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        roomNumber: {
            type: String,
            trim: true,
            default: '',
        }, // e.g. "Room 201"
        code: {
            type: String,
            trim: true,
            default: '',
        }, // e.g. "1A"
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active',
        },
        capacity: {
            type: Number,
            default: 30,
            min: 1,
        },
        studentCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

sectionSchema.index({ schoolId: 1, classId: 1, name: 1 }, { unique: true });

export default mongoose.model('Section', sectionSchema);
