import mongoose from 'mongoose';

const staffProfileSchema = new mongoose.Schema(
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
            required: [true, 'Staff Employee ID is required'],
            trim: true,
            uppercase: true,
        }, // e.g. "STF001"
        department: {
            type: String,
            required: [true, 'Department is required'],
            trim: true,
        }, // "Administration", "Finance", "Library", "Security", "Medical", "Transport", "Maintenance"
        designation: {
            type: String,
            required: [true, 'Designation is required'],
            trim: true,
        }, // "Accountant", "Librarian", "Receptionist", "Nurse", "Security Guard", "Lab Assistant"
        reportingManagerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        qualification: {
            type: String,
            trim: true,
            default: '',
        },
        experienceYears: {
            type: Number,
            default: 0,
            min: 0,
        },
        employmentType: {
            type: String,
            enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'SHIFT'],
            default: 'FULL_TIME',
        },
        shiftTiming: {
            type: String,
            default: '9:00 AM - 5:00 PM',
        },
        joiningDate: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'ON_LEAVE', 'RESIGNED', 'SUSPENDED'],
            default: 'ACTIVE',
            index: true,
        },
        assignedTasks: [
            {
                taskTitle: { type: String, required: true, trim: true },
                description: { type: String, default: '' },
                frequency: {
                    type: String,
                    enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'AS_NEEDED'],
                    default: 'DAILY',
                },
                isCompleted: { type: Boolean, default: false },
            },
        ],
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

staffProfileSchema.index({ schoolId: 1, employeeId: 1 }, { unique: true });
staffProfileSchema.index({ schoolId: 1, department: 1 });
staffProfileSchema.index({ schoolId: 1, designation: 1 });
staffProfileSchema.index({ schoolId: 1, status: 1 });

export default mongoose.model('StaffProfile', staffProfileSchema);
