import * as academicService from './academic.service.js';
import ApiResponse from '../../utils/ApiResponse.js';
import ApiError from '../../utils/ApiError.js';
import School from '../school/school.model.js';

// Helper to resolve schoolId from user context or superadmin param
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

// ── Screen 1: Classes Overview & Basic CRUD ───────────────────────────────────

export const getOverviewStats = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const stats = await academicService.getOverviewStats(schoolId);
        return res.status(200).json(ApiResponse.success(stats, 'Overview stats retrieved'));
    } catch (err) {
        next(err);
    }
};

export const getTeacherDashboard = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const teacherId = req.user._id;
        const data = await academicService.getTeacherDashboardData(schoolId, teacherId);
        return res.status(200).json(ApiResponse.success(data, 'Teacher dashboard retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const getClasses = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const classes = await academicService.getClassesWithSections(schoolId, req.query);
        return res.status(200).json(ApiResponse.success(classes, 'Classes retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const createClass = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const newClass = await academicService.createClass(schoolId, req.body);
        return res.status(201).json(ApiResponse.created(newClass, 'Class created successfully'));
    } catch (err) {
        next(err);
    }
};

export const updateClass = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const updated = await academicService.updateClass(schoolId, req.params.id, req.body);
        return res.status(200).json(ApiResponse.success(updated, 'Class updated successfully'));
    } catch (err) {
        next(err);
    }
};

export const deleteClass = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const cascade = req.query.cascade === 'true';
        await academicService.deleteClass(schoolId, req.params.id, { cascade });
        return res.status(200).json(ApiResponse.success(null, 'Class deleted successfully'));
    } catch (err) {
        next(err);
    }
};

// ── Screen 2: Class Details ───────────────────────────────────────────────────

export const getClassDetails = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const details = await academicService.getClassDetails(schoolId, req.params.id);
        return res.status(200).json(ApiResponse.success(details, 'Class details retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

// ── Screen 3: Sections CRUD ───────────────────────────────────────────────────

export const createSection = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const section = await academicService.createSection(schoolId, req.params.classId, req.body);
        return res.status(201).json(ApiResponse.created(section, 'Section created successfully'));
    } catch (err) {
        next(err);
    }
};

export const updateSection = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const updated = await academicService.updateSection(schoolId, req.params.sectionId, req.body);
        return res.status(200).json(ApiResponse.success(updated, 'Section updated successfully'));
    } catch (err) {
        next(err);
    }
};

export const deleteSection = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        await academicService.deleteSection(schoolId, req.params.sectionId);
        return res.status(200).json(ApiResponse.success(null, 'Section deleted successfully'));
    } catch (err) {
        next(err);
    }
};

// ── Screen 4: Students by Class ───────────────────────────────────────────────

export const getClassStudents = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const students = await academicService.getClassStudents(schoolId, req.params.id, req.query);
        return res.status(200).json(ApiResponse.success(students, 'Class students retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

// ── Screen 5: Class & Section Teachers ────────────────────────────────────────

export const getClassTeachers = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const teachers = await academicService.getClassTeachers(schoolId);
        return res.status(200).json(ApiResponse.success(teachers, 'Class teachers retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const assignTeacher = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const result = await academicService.assignTeacher(schoolId, req.body);
        return res.status(200).json(ApiResponse.success(result, 'Teacher assigned successfully'));
    } catch (err) {
        next(err);
    }
};

export const getStaffTeachers = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const teachers = await academicService.getStaffTeachers(schoolId);
        return res.status(200).json(ApiResponse.success(teachers, 'Staff teachers retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

// ── Screen 6: Subjects Directory & Assignment ──────────────────────────────────

export const getSubjects = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const subjectsData = await academicService.getSubjects(schoolId, req.query);
        return res.status(200).json(ApiResponse.success(subjectsData, 'Subjects retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const assignSubjectTeachers = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const result = await academicService.assignSubjectTeachers(schoolId, req.body);
        return res.status(200).json(ApiResponse.success(result, 'Teachers assigned to subject successfully'));
    } catch (err) {
        next(err);
    }
};

export const createSubject = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const newSubject = await academicService.createSubject(schoolId, req.body);
        return res.status(201).json(ApiResponse.created(newSubject, 'Subject created successfully'));
    } catch (err) {
        next(err);
    }
};

export const updateSubject = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const updated = await academicService.updateSubject(schoolId, req.params.id, req.body);
        return res.status(200).json(ApiResponse.success(updated, 'Subject updated successfully'));
    } catch (err) {
        next(err);
    }
};

export const deleteSubject = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        await academicService.deleteSubject(schoolId, req.params.id);
        return res.status(200).json(ApiResponse.success(null, 'Subject deleted successfully'));
    } catch (err) {
        next(err);
    }
};

// ── Screen 7: Timetable Schedule Matrix ───────────────────────────────────────

export const getTimetable = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const { classId, sectionId } = req.query;
        const timetable = await academicService.getTimetable(schoolId, classId, sectionId);
        return res.status(200).json(ApiResponse.success(timetable, 'Timetable retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const saveTimetable = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const saved = await academicService.saveTimetable(schoolId, req.body);
        return res.status(200).json(ApiResponse.success(saved, 'Timetable saved successfully'));
    } catch (err) {
        next(err);
    }
};

// ── Screen 8: Class Reports & Analytics ───────────────────────────────────────

export const getClassReports = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const reports = await academicService.getClassReports(schoolId, req.query.classId);
        return res.status(200).json(ApiResponse.success(reports, 'Class reports retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

// ── Screen 9: Class Settings ──────────────────────────────────────────────────

export const getClassSettings = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const settings = await academicService.getClassSettings(schoolId);
        return res.status(200).json(ApiResponse.success(settings, 'Settings retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const updateClassSettings = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const updated = await academicService.updateClassSettings(schoolId, req.body);
        return res.status(200).json(ApiResponse.success(updated, 'Settings updated successfully'));
    } catch (err) {
        next(err);
    }
};

// ── Academic Year Controllers ─────────────────────────────────────────────────

export const getAcademicYears = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const result = await academicService.getAcademicYears(schoolId);
        return res.status(200).json(ApiResponse.success(result, 'Academic years retrieved successfully'));
    } catch (err) {
        next(err);
    }
};

export const createAcademicYear = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const newYear = await academicService.createAcademicYear(schoolId, req.body);
        return res.status(201).json(ApiResponse.created(newYear, 'Academic year created successfully'));
    } catch (err) {
        next(err);
    }
};

export const setCurrentAcademicYear = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const updated = await academicService.setCurrentAcademicYear(schoolId, req.params.id);
        return res.status(200).json(ApiResponse.success(updated, 'Current academic year updated successfully'));
    } catch (err) {
        next(err);
    }
};

export const updateAcademicYear = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        const updated = await academicService.updateAcademicYear(schoolId, req.params.id, req.body);
        return res.status(200).json(ApiResponse.success(updated, 'Academic year updated successfully'));
    } catch (err) {
        next(err);
    }
};

export const deleteAcademicYear = async (req, res, next) => {
    try {
        const schoolId = await resolveSchoolId(req);
        await academicService.deleteAcademicYear(schoolId, req.params.id);
        return res.status(200).json(ApiResponse.success(null, 'Academic year deleted successfully'));
    } catch (err) {
        next(err);
    }
};
