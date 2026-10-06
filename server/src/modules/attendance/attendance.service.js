import Attendance from './attendance.model.js';
import StudentLeave from './leave.model.js';
import Student from '../student/student.model.js';
import ClassModel from '../academic/class.model.js';
import SectionModel from '../academic/section.model.js';
import { eventBus, DOMAIN_EVENTS } from '../../events/eventBus.js';
import ApiError from '../../utils/ApiError.js';

/**
 * Calculate summary statistics from records array
 */
const calculateStats = (records = []) => {
    const totalStudents = records.length;
    let presentCount = 0;
    let absentCount = 0;
    let lateCount = 0;
    let excusedCount = 0;

    for (const r of records) {
        const s = (r.status || 'PRESENT').toUpperCase();
        if (s === 'PRESENT') presentCount++;
        else if (s === 'ABSENT') absentCount++;
        else if (s === 'LATE') lateCount++;
        else if (s === 'EXCUSED' || s === 'HALF_DAY') excusedCount++;
    }

    const attendanceRate = totalStudents > 0
        ? Number((((presentCount + lateCount) / totalStudents) * 100).toFixed(1))
        : 0;

    return {
        totalStudents,
        presentCount,
        absentCount,
        lateCount,
        excusedCount,
        attendanceRate,
    };
};

/**
 * Get or initialize attendance register for a class, section, date, period
 */
export const getAttendanceRegister = async (schoolId, { classId, sectionId, dateString, period = 'FULL_DAY' }) => {
    const targetDateStr = dateString || new Date().toISOString().split('T')[0];
    const targetPeriod = period || 'FULL_DAY';

    let classDoc = null;
    let sectionDoc = null;

    if (classId && classId !== 'all') {
        classDoc = await ClassModel.findOne({ _id: classId, schoolId }).catch(() => null);
    }
    if (sectionId && sectionId !== 'all') {
        sectionDoc = await SectionModel.findOne({ _id: sectionId, schoolId }).catch(() => null);
    }

    // Try finding existing saved attendance
    let query = { schoolId, dateString: targetDateStr, period: targetPeriod };
    if (classId && classId !== 'all') query.classId = classId;
    if (sectionId && sectionId !== 'all') query.sectionId = sectionId;

    let attendanceDoc = await Attendance.findOne(query);

    // Fetch actual registered students for this class & section
    let studentFilter = { schoolId, status: 'ACTIVE' };
    if (classId && classId !== 'all') studentFilter.classId = classId;
    if (sectionId && sectionId !== 'all') studentFilter.sectionId = sectionId;

    const dbStudents = await Student.find(studentFilter).sort({ rollNo: 1 }).limit(100);

    if (attendanceDoc) {
        // Sync or refresh student names/avatars if available
        return attendanceDoc;
    }

    // Generate register records from real DB students if available
    let records = [];
    if (dbStudents && dbStudents.length > 0) {
        records = dbStudents.map((st, idx) => ({
            studentId: st._id,
            rollNo: st.rollNo ? `${st.rollNo}` : `${idx + 1}`,
            studentName: `${st.firstName || ''} ${st.lastName || ''}`.trim() || `Student ${idx + 1}`,
            avatar: st.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${st.firstName || idx}`,
            status: 'PRESENT',
            remarks: '-',
            checkInTime: null,
        }));
    }

    const stats = calculateStats(records);

    return {
        _id: null,
        schoolId,
        classId: classDoc?._id || classId || null,
        className: classDoc?.name || (classId ? 'Class' : 'All Classes'),
        sectionId: sectionDoc?._id || sectionId || null,
        sectionName: sectionDoc?.name || (sectionId ? 'Section' : 'All Sections'),
        dateString: targetDateStr,
        period: targetPeriod,
        records,
        statistics: stats,
        isSaved: false,
    };
};

/**
 * Save or update attendance register
 */
export const saveAttendanceRegister = async (schoolId, userId, payload) => {
    const { classId, sectionId, dateString, period = 'FULL_DAY', records = [] } = payload;

    if (!dateString) {
        throw ApiError.badRequest('dateString is required (YYYY-MM-DD)');
    }

    const stats = calculateStats(records);
    const dateObj = new Date(dateString + 'T00:00:00.000Z');

    // Auto find default class and section if not provided
    let resolvedClassId = classId;
    let resolvedSectionId = sectionId;

    if (!resolvedClassId || resolvedClassId === 'all') {
        const firstClass = await ClassModel.findOne({ schoolId });
        resolvedClassId = firstClass?._id;
    }
    if (!resolvedSectionId || resolvedSectionId === 'all') {
        const firstSec = await SectionModel.findOne({ schoolId });
        resolvedSectionId = firstSec?._id;
    }

    const updatedDoc = await Attendance.findOneAndUpdate(
        {
            schoolId,
            classId: resolvedClassId,
            sectionId: resolvedSectionId,
            dateString,
            period,
        },
        {
            schoolId,
            classId: resolvedClassId,
            sectionId: resolvedSectionId,
            date: dateObj,
            dateString,
            period,
            records,
            statistics: stats,
            markedBy: userId,
            academicYear: '2026-27',
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Emit live domain event for Socket.IO broadcast and RTK Query invalidation
    eventBus.publish(DOMAIN_EVENTS.ATTENDANCE_MARKED, {
        schoolId,
        classId: resolvedClassId,
        sectionId: resolvedSectionId,
        dateString,
        period,
        statistics: stats,
        markedBy: userId,
    });

    return updatedDoc;
};

/**
 * Get high-level overview statistics for attendance dashboard
 */
export const getAttendanceStats = async (schoolId, { dateString } = {}) => {
    const targetDate = dateString || new Date().toISOString().split('T')[0];

    // Find all attendance records for today in this school
    const todayRegisters = await Attendance.find({ schoolId, dateString: targetDate });

    // Count total enrolled students in school
    const totalEnrolled = await Student.countDocuments({ schoolId, status: 'ACTIVE' });

    let presentToday = 0;
    let absentToday = 0;
    let lateToday = 0;
    let excusedToday = 0;

    for (const reg of todayRegisters) {
        presentToday += reg.statistics?.presentCount || 0;
        absentToday += reg.statistics?.absentCount || 0;
        lateToday += reg.statistics?.lateCount || 0;
        excusedToday += reg.statistics?.excusedCount || 0;
    }

    const markedTotal = presentToday + absentToday + lateToday + excusedToday;
    const notMarkedToday = Math.max(0, totalEnrolled - markedTotal);
    const attendanceRate = markedTotal > 0
        ? Number((((presentToday + lateToday) / markedTotal) * 100).toFixed(1))
        : 0;

    // 7-day attendance trend data computed from real Attendance records
    const trendDays = [];
    const targetDateObj = new Date(targetDate + 'T00:00:00.000Z');

    for (let i = 6; i >= 0; i--) {
        const d = new Date(targetDateObj);
        d.setUTCDate(d.getUTCDate() - i);
        const dStr = d.toISOString().split('T')[0];
        const dayLabel = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        trendDays.push({ day: dayLabel, date: dStr, present: 0, absent: 0, late: 0 });
    }

    const past7Registers = await Attendance.find({
        schoolId,
        dateString: { $in: trendDays.map((t) => t.date) },
    });

    for (const reg of past7Registers) {
        const dayItem = trendDays.find((t) => t.date === reg.dateString);
        if (dayItem) {
            dayItem.present += reg.statistics?.presentCount || 0;
            dayItem.absent += reg.statistics?.absentCount || 0;
            dayItem.late += reg.statistics?.lateCount || 0;
        }
    }

    // Donut breakdown
    const totalConsidered = markedTotal + notMarkedToday;
    const pct = (val) => (totalConsidered > 0 ? Number(((val / totalConsidered) * 100).toFixed(1)) : 0);

    const distribution = [
        { name: 'Present', value: presentToday, percentage: pct(presentToday), color: '#10b981' },
        { name: 'Absent', value: absentToday, percentage: pct(absentToday), color: '#ef4444' },
        { name: 'Late', value: lateToday, percentage: pct(lateToday), color: '#f59e0b' },
        { name: 'Excused', value: excusedToday, percentage: pct(excusedToday), color: '#6366f1' },
        { name: 'Not Marked', value: notMarkedToday, percentage: pct(notMarkedToday), color: '#94a3b8' },
    ];

    return {
        summary: {
            totalStudents: totalEnrolled,
            totalStudentsDelta: 'Live',
            presentToday,
            presentTodayRate: `${attendanceRate}%`,
            absentToday,
            absentTodayDelta: 'Live',
            lateToday,
            lateTodayDelta: 'Live',
            attendanceRate,
            attendanceRateDelta: 'Live',
        },
        distribution,
        trendDays,
    };
};

/**
 * Get recent attendance activity feed from real records
 */
export const getRecentActivities = async (schoolId) => {
    const recentRegisters = await Attendance.find({ schoolId })
        .sort({ updatedAt: -1 })
        .limit(10)
        .populate('classId', 'name')
        .populate('sectionId', 'name');

    const activities = [];

    for (const reg of recentRegisters) {
        const className = reg.classId?.name || reg.className || 'Class';
        const sectionName = reg.sectionId?.name || reg.sectionName || 'Section';
        for (const rec of (reg.records || [])) {
            if (rec.status === 'ABSENT' || rec.status === 'LATE') {
                activities.push({
                    id: `act-${rec._id || rec.studentId}-${reg._id}`,
                    type: rec.status,
                    studentName: rec.studentName || 'Student',
                    action: `marked ${rec.status === 'ABSENT' ? 'Absent' : 'Late'}`,
                    details: `${className} - ${sectionName} • ${reg.dateString}`,
                    avatar: rec.avatar || null,
                    badgeColor: rec.status === 'ABSENT'
                        ? 'bg-red-50 text-red-700 border-red-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200',
                });
                if (activities.length >= 10) break;
            }
        }
        if (activities.length >= 10) break;
    }

    const recentLeaves = await StudentLeave.find({ schoolId })
        .sort({ createdAt: -1 })
        .limit(5);

    for (const lv of recentLeaves) {
        activities.push({
            id: `leave-${lv._id}`,
            type: 'LEAVE',
            studentName: lv.studentName || 'Student',
            action: `${lv.leaveType || 'Leave'} (${lv.status})`,
            details: `${lv.className || ''} • ${lv.startDate || ''} to ${lv.endDate || ''}`,
            avatar: null,
            badgeColor: lv.status === 'APPROVED'
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-amber-50 text-amber-700 border-amber-200',
        });
    }

    return activities;
};

/**
 * Student Leaves
 */
export const getLeaveRequests = async (schoolId, filter = {}) => {
    const leaves = await StudentLeave.find({ schoolId }).sort({ createdAt: -1 });
    return leaves || [];
};

export const createLeaveRequest = async (schoolId, userId, data) => {
    const leave = await StudentLeave.create({
        schoolId,
        ...data,
        appliedBy: userId,
    });
    return leave;
};

export const updateLeaveStatus = async (schoolId, leaveId, status, reviewNote, userId) => {
    const leave = await StudentLeave.findOneAndUpdate(
        { _id: leaveId, schoolId },
        { status, reviewNote, reviewedBy: userId },
        { new: true }
    );
    return leave;
};
