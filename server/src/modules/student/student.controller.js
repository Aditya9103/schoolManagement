import * as studentService from './student.service.js';
import ApiResponse from '../../utils/ApiResponse.js';
import ApiError from '../../utils/ApiError.js';
import School from '../school/school.model.js';
import Student from './student.model.js';

const resolveSchoolId = async (req) => {
    if (req.user?.schoolId) return req.user.schoolId;
    if (req.query?.schoolId) return req.query.schoolId;
    if (req.body?.schoolId) return req.body.schoolId;
    if (req.user?.role === 'SUPER_ADMIN') {
        const defaultSchool = await School.findOne({ isActive: true }).select('_id');
        if (defaultSchool) return defaultSchool._id;
    }
    throw ApiError.badRequest('School ID could not be determined');
};

export const getStudents = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const { search, classId, sectionId, status, sort, page, limit } = req.query;
        const result = await studentService.getStudents(schoolId, {
            search,
            classId,
            sectionId,
            status,
            sort,
            page,
            limit,
        });
        return res.status(200).json(ApiResponse.success(result, 'Students retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const getStudentById = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const student = await studentService.getStudentById(schoolId, req.params.id);
        return res.status(200).json(ApiResponse.success(student, 'Student details retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const getStudentProfile = async (req, res, next) => {
    try {
        // For logged in STUDENT role viewing their own profile
        const student = await Student.findOne({ userId: req.user.sub })
            .populate('classId', 'name numericGrade stream')
            .populate({
                path: 'sectionId',
                select: 'name roomNumber classTeacherId',
                populate: {
                    path: 'classTeacherId',
                    select: 'firstName lastName email profilePhotoUrl',
                },
            })
            .populate('schoolId', 'name code logoUrl address contactPhone contactEmail')
            .lean();

        if (!student) throw ApiError.notFound('Student record not found for your account');
        return res.status(200).json(ApiResponse.success(student, 'My profile retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const createStudent = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const student = await studentService.createStudent(schoolId, req.body);
        return res.status(201).json(ApiResponse.created(student, 'Student enrolled successfully'));
    } catch (err) {
        next(err);
    }
};

export const updateStudent = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const updated = await studentService.updateStudent(schoolId, req.params.id, req.body);
        return res.status(200).json(ApiResponse.success(updated, 'Student updated successfully'));
    } catch (err) {
        next(err);
    }
};

export const deleteStudent = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        await studentService.deleteStudent(schoolId, req.params.id);
        return res.status(200).json(ApiResponse.success(null, 'Student deleted successfully'));
    } catch (err) {
        next(err);
    }
};

export const addDocument = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const documents = await studentService.addDocument(schoolId, req.params.id, req.body);
        return res.status(200).json(ApiResponse.success(documents, 'Document added successfully'));
    } catch (err) {
        next(err);
    }
};

export const removeDocument = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const documents = await studentService.removeDocument(schoolId, req.params.id, req.params.docId);
        return res.status(200).json(ApiResponse.success(documents, 'Document removed successfully'));
    } catch (err) {
        next(err);
    }
};
