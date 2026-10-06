import * as homeworkService from './homework.service.js';
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

export const listAssignments = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const result = await homeworkService.listAssignments(schoolId, req.query);
        return res.status(200).json(ApiResponse.success(result, 'Assignments retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const createAssignment = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const userId = req.user?.sub || req.user?._id;
        const result = await homeworkService.createAssignment(schoolId, userId, req.body);
        return res.status(201).json(ApiResponse.created(result, 'Assignment created successfully'));
    } catch (err) {
        next(err);
    }
};

export const getAssignmentById = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const result = await homeworkService.getAssignmentById(schoolId, req.params.id);
        return res.status(200).json(ApiResponse.success(result, 'Assignment details retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const updateAssignment = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const result = await homeworkService.updateAssignment(schoolId, req.params.id, req.body);
        return res.status(200).json(ApiResponse.success(result, 'Assignment updated successfully'));
    } catch (err) {
        next(err);
    }
};

export const deleteAssignment = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const result = await homeworkService.deleteAssignment(schoolId, req.params.id);
        return res.status(200).json(ApiResponse.success(result, 'Assignment deleted successfully'));
    } catch (err) {
        next(err);
    }
};

export const getOverviewStats = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const result = await homeworkService.getOverviewStats(schoolId);
        return res.status(200).json(ApiResponse.success(result, 'Overview statistics retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const listSubmissions = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const result = await homeworkService.listSubmissions(schoolId, req.params.id, req.query);
        return res.status(200).json(ApiResponse.success(result, 'Submissions retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const gradeSubmission = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const teacherId = req.user?.sub || req.user?._id;
        const result = await homeworkService.gradeSubmission(schoolId, req.params.submissionId, req.body, teacherId);
        return res.status(200).json(ApiResponse.success(result, 'Submission evaluated successfully'));
    } catch (err) {
        next(err);
    }
};

export const submitHomework = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const studentId = req.user?.sub || req.user?._id;
        const studentName = req.user?.name || req.body.studentName || 'Student';
        const rollNo = req.body.rollNo || '6A001';
        const result = await homeworkService.submitStudentHomework(schoolId, req.params.id, studentId, studentName, rollNo, req.body);
        return res.status(201).json(ApiResponse.created(result, 'Homework submitted successfully'));
    } catch (err) {
        next(err);
    }
};

export const getAnalytics = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const result = await homeworkService.getAnalytics(schoolId, req.query);
        return res.status(200).json(ApiResponse.success(result, 'Assignment analytics retrieved successfully'));
    } catch (err) {
        next(err);
    }
};
