import mongoose from 'mongoose';

const employeeAttendanceSchema = new mongoose.Schema(
    {
        schoolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required: true,
            index: true,
        },
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        employeeType: {
            type: String,
            enum: ['TEACHER', 'STAFF'],
            required: true,
            index: true,
        },
        date: {
            type: Date,
            required: true,
            index: true,
        }, // Normalized to UTC midnight
        status: {
            type: String,
            enum: ['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE'],
            default: 'PRESENT',
            index: true,
        },
        checkInTime: {
            type: String,
            default: null,
        }, // e.g. "08:30 AM"
        checkOutTime: {
            type: String,
            default: null,
        }, // e.g. "04:30 PM"
        workDurationMinutes: {
            type: Number,
            default: 0,
        },
        remarks: {
            type: String,
            trim: true,
            default: '',
        },
        markedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

employeeAttendanceSchema.index({ schoolId: 1, employeeId: 1, date: 1 }, { unique: true });
employeeAttendanceSchema.index({ schoolId: 1, date: 1, status: 1 });
employeeAttendanceSchema.index({ schoolId: 1, employeeType: 1, date: 1 });

export default mongoose.model('EmployeeAttendance', employeeAttendanceSchema);
