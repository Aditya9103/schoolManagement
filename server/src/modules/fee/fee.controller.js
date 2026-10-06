import * as feeService from './fee.service.js';
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

export const getFeeOverview = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const overview = await feeService.getFeeOverview(schoolId);
        return res.status(200).json(ApiResponse.success(overview, 'Fee overview fetched successfully'));
    } catch (err) {
        next(err);
    }
};

export const getFeeCategories = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const categories = await feeService.getFeeCategories(schoolId);
        return res.status(200).json(ApiResponse.success(categories, 'Fee categories fetched successfully'));
    } catch (err) {
        next(err);
    }
};

export const createFeeCategory = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const category = await feeService.createFeeCategory(schoolId, req.body);
        return res.status(201).json(ApiResponse.success(category, 'Fee category created successfully'));
    } catch (err) {
        next(err);
    }
};

export const getFeeStructures = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const structures = await feeService.getFeeStructures(schoolId);
        return res.status(200).json(ApiResponse.success(structures, 'Fee structures fetched successfully'));
    } catch (err) {
        next(err);
    }
};

export const createFeeStructure = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const structure = await feeService.createFeeStructure(schoolId, req.body);
        return res.status(201).json(ApiResponse.success(structure, 'Fee structure created successfully'));
    } catch (err) {
        next(err);
    }
};

export const getFeeAllocations = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const result = await feeService.getFeeAllocations(schoolId, req.query);
        return res.status(200).json(ApiResponse.success(result, 'Fee allocations fetched successfully'));
    } catch (err) {
        next(err);
    }
};

export const getStudentFeeAccount = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const { studentId } = req.params;
        const result = await feeService.getStudentFeeAccount(schoolId, studentId);
        return res.status(200).json(ApiResponse.success(result, 'Student fee account retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const collectFeePayment = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const result = await feeService.collectFeePayment(schoolId, req.body, req.user);
        return res.status(200).json(ApiResponse.success(result, 'Fee payment recorded and receipt generated'));
    } catch (err) {
        next(err);
    }
};

export const getFeeTransactions = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const result = await feeService.getFeeTransactions(schoolId, req.query);
        return res.status(200).json(ApiResponse.success(result, 'Fee transactions retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const getFeeDefaulters = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const defaulters = await feeService.getFeeDefaulters(schoolId, req.query);
        return res.status(200).json(ApiResponse.success(defaulters, 'Fee defaulters retrieved successfully'));
    } catch (err) {
        next(err);
    }
};
