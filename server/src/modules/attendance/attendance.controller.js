import * as attendanceService from './attendance.service.js';
import ApiResponse from '../../utils/ApiResponse.js';
import ApiError from '../../utils/ApiError.js';
import School from '../school/school.model.js';

const resolveSchoolId = async (req) => {
    if (req.user?.schoolId) return req.user.schoolId;
    if (req.user?.societyId) return req.user.societyId;
    if (req.query?.schoolId) return req.query.schoolId;
    if (req.body?.schoolId) return req.body.schoolId;
    if (req.user?.role === 'SUPER_ADMIN') {
        const defaultSchool = await School.findOne({ isActive: true }).select('_id');
        if (defaultSchool) return defaultSchool._id;
    }
    throw ApiError.badRequest('School ID could not be determined');
};

export const getAttendanceRegister = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const { classId, sectionId, dateString, period } = req.query;
        const result = await attendanceService.getAttendanceRegister(schoolId, {
            classId,
            sectionId,
            dateString,
            period,
        });
        return res.status(200).json(ApiResponse.success(result, 'Attendance register fetched successfully'));
    } catch (err) {
        next(err);
    }
};

export const saveAttendanceRegister = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const userId = req.user?.sub || req.user?._id;
        const result = await attendanceService.saveAttendanceRegister(schoolId, userId, req.body);
        return res.status(200).json(ApiResponse.success(result, 'Attendance saved successfully'));
    } catch (err) {
        next(err);
    }
};

export const getAttendanceStats = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const { dateString } = req.query;
        const stats = await attendanceService.getAttendanceStats(schoolId, { dateString });
        return res.status(200).json(ApiResponse.success(stats, 'Attendance statistics retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const getRecentActivities = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const activities = await attendanceService.getRecentActivities(schoolId);
        return res.status(200).json(ApiResponse.success(activities, 'Recent activities retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const getLeaveRequests = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const leaves = await attendanceService.getLeaveRequests(schoolId, req.query);
        return res.status(200).json(ApiResponse.success(leaves, 'Leave requests retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const createLeaveRequest = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const userId = req.user?.sub || req.user?._id;
        const leave = await attendanceService.createLeaveRequest(schoolId, userId, req.body);
        return res.status(201).json(ApiResponse.created(leave, 'Leave request created successfully'));
    } catch (err) {
        next(err);
    }
};

export const updateLeaveStatus = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const userId = req.user?.sub || req.user?._id;
        const { id } = req.params;
        const { status, reviewNote } = req.body;
        const leave = await attendanceService.updateLeaveStatus(schoolId, id, status, reviewNote, userId);
        return res.status(200).json(ApiResponse.success(leave, 'Leave status updated successfully'));
    } catch (err) {
        next(err);
    }
};
