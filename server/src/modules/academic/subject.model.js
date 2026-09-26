import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        // Single class reference (for class-specific subjects)
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
            default: null,
            index: true,
        },
        sectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Section',
            default: null,
        },
        // Multi-class assignment (e.g. English assigned to 10 classes)
        classesAssigned: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Class',
            },
        ],
        name: {
            type: String,
            required: [true, 'Subject name is required'],
            trim: true,
        }, // e.g. "English", "Mathematics", "Science"
        code: {
            type: String,
            required: [true, 'Subject code is required'],
            trim: true,
            uppercase: true,
        }, // e.g. "ENG", "MATH", "SCI"
        category: {
            type: String,
            enum: ['Languages', 'Mathematics', 'Science', 'Humanities', 'Technology', 'Arts', 'Sports', 'Other'],
            default: 'Languages',
        },
        type: {
            type: String,
            enum: ['Core', 'Elective'],
            default: 'Core',
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        // Primary teacher reference
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        // Multiple teachers assigned (any teacher can have multiple subjects)
        teachersAssigned: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        periodsPerWeek: {
            type: Number,
            default: 5,
            min: 1,
            max: 30,
        },
        color: {
            type: String,
            default: '#3B82F6', // hex color for cards & timetable blocks
        },
        icon: {
            type: String,
            default: 'BookOpen',
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active',
        },
    },
    { timestamps: true }
);

subjectSchema.index({ schoolId: 1, code: 1 });
subjectSchema.index({ schoolId: 1, classId: 1 });

export default mongoose.model('Subject', subjectSchema);
