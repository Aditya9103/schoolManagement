import * as examService from './exam.service.js';
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

export const getOverviewStats = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const result = await examService.getOverviewStats(schoolId);
        return res.status(200).json(ApiResponse.success(result, 'Exam statistics retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const listExams = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const result = await examService.listExams(schoolId, req.query);
        return res.status(200).json(ApiResponse.success(result, 'Exams retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const getExamById = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const result = await examService.getExamById(schoolId, req.params.id);
        if (!result) throw ApiError.notFound('Exam not found');
        return res.status(200).json(ApiResponse.success(result, 'Exam retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const createExam = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const result = await examService.createExam(schoolId, req.body);
        return res.status(201).json(ApiResponse.created(result, 'Exam created successfully'));
    } catch (err) {
        next(err);
    }
};

export const updateExam = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const result = await examService.updateExam(schoolId, req.params.id, req.body);
        if (!result) throw ApiError.notFound('Exam not found');
        return res.status(200).json(ApiResponse.success(result, 'Exam updated successfully'));
    } catch (err) {
        next(err);
    }
};

export const deleteExam = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        await examService.deleteExam(schoolId, req.params.id);
        return res.status(200).json(ApiResponse.success(null, 'Exam deleted successfully'));
    } catch (err) {
        next(err);
    }
};

export const getRecentResults = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const result = await examService.getRecentResults(schoolId, req.query);
        return res.status(200).json(ApiResponse.success(result, 'Recent results retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const getClassResults = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const result = await examService.getClassResults(schoolId, req.query);
        return res.status(200).json(ApiResponse.success(result, 'Class results retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const getStudentResult = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const result = await examService.getStudentResult(schoolId, req.params.studentId, req.query.examId);
        return res.status(200).json(ApiResponse.success(result, 'Student result retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const saveMarks = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const result = await examService.saveMarks(schoolId, req.body);
        return res.status(200).json(ApiResponse.success(result, 'Marks saved successfully'));
    } catch (err) {
        next(err);
    }
};

export const listQuestionPapers = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const result = await examService.listQuestionPapers(schoolId, req.query);
        return res.status(200).json(ApiResponse.success(result, 'Question papers retrieved successfully'));
    } catch (err) {
        next(err);
    }
};
