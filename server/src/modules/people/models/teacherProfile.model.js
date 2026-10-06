import mongoose from 'mongoose';

const teacherProfileSchema = new mongoose.Schema(
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
            required: true,
            unique: true,
            index: true,
        },
        employeeId: {
            type: String,
            required: [true, 'Teacher Employee ID is required'],
            trim: true,
            uppercase: true,
        }, // e.g. "TCH001"
        department: {
            type: String,
            required: [true, 'Department is required'],
            trim: true,
            default: 'General',
        }, // e.g. "Mathematics", "Science", "English"
        designation: {
            type: String,
            trim: true,
            default: 'Teacher',
        }, // e.g. "Senior Faculty", "Head of Department"
        qualification: {
            type: String,
            trim: true,
            default: '',
        }, // e.g. "M.Sc. Mathematics, B.Ed."
        experienceYears: {
            type: Number,
            default: 0,
            min: 0,
        },
        specialization: [
            {
                type: String,
                trim: true,
            },
        ],
        joiningDate: {
            type: Date,
            default: Date.now,
        },
        employmentType: {
            type: String,
            enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT'],
            default: 'FULL_TIME',
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'ON_LEAVE', 'RESIGNED', 'SUSPENDED'],
            default: 'ACTIVE',
            index: true,
        },
        workSchedule: {
            workingHours: { type: String, default: '8:00 AM - 3:30 PM' },
            workingDays: {
                type: [String],
                default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            },
        },
        metrics: {
            feedbackRating: { type: Number, default: 4.8 },
            reviewCount: { type: Number, default: 0 },
            studentPassRate: { type: Number, default: 92.0 },
            attendanceRate: { type: Number, default: 96.0 },
        },
        emergencyContact: {
            name: { type: String, trim: true, default: '' },
            relation: { type: String, trim: true, default: '' },
            phone: { type: String, trim: true, default: '' },
        },
        address: {
            street: { type: String, trim: true, default: '' },
            city: { type: String, trim: true, default: '' },
            state: { type: String, trim: true, default: '' },
            pincode: { type: String, trim: true, default: '' },
        },
    },
    { timestamps: true }
);

teacherProfileSchema.index({ schoolId: 1, employeeId: 1 }, { unique: true });
teacherProfileSchema.index({ schoolId: 1, department: 1 });
teacherProfileSchema.index({ schoolId: 1, status: 1 });

export default mongoose.model('TeacherProfile', teacherProfileSchema);
