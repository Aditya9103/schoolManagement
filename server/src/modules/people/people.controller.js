import * as peopleService from './people.service.js';
import ApiError from '../../utils/ApiError.js';

// ── TEACHERS CONTROLLERS ───────────────────────────────────────────────────

export const getTeachers = async (req, res, next) => {
    try {
        const schoolId = req.user.schoolId || req.user.societyId;
        const result = await peopleService.getTeachers(schoolId, req.query, req.scopeFilter);
        return res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

export const getTeacherById = async (req, res, next) => {
    try {
        const schoolId = req.user.schoolId || req.user.societyId;
        const result = await peopleService.getTeacherById(schoolId, req.params.id);
        return res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

export const createTeacher = async (req, res, next) => {
    try {
        const schoolId = req.user.schoolId || req.user.societyId;
        const result = await peopleService.createTeacher(schoolId, req.body, req.user._id);
        return res.status(201).json({ success: true, message: 'Teacher created successfully', data: result });
    } catch (err) {
        next(err);
    }
};

export const updateTeacher = async (req, res, next) => {
    try {
        const schoolId = req.user.schoolId || req.user.societyId;
        const result = await peopleService.updateTeacher(schoolId, req.params.id, req.body);
        return res.status(200).json({ success: true, message: 'Teacher updated successfully', data: result });
    } catch (err) {
        next(err);
    }
};

export const deleteTeacher = async (req, res, next) => {
    try {
        const schoolId = req.user.schoolId || req.user.societyId;
        const result = await peopleService.deleteTeacher(schoolId, req.params.id);
        return res.status(200).json({ success: true, message: 'Teacher deactivated successfully', data: result });
    } catch (err) {
        next(err);
    }
};

export const assignTeacherClass = async (req, res, next) => {
    try {
        const schoolId = req.user.schoolId || req.user.societyId;
        const result = await peopleService.assignTeacherClass(schoolId, req.params.id, req.body);
        return res.status(200).json({ success: true, message: 'Class assigned successfully', data: result });
    } catch (err) {
        next(err);
    }
};

export const assignTeacherSubject = async (req, res, next) => {
    try {
        const schoolId = req.user.schoolId || req.user.societyId;
        const result = await peopleService.assignTeacherSubject(schoolId, req.params.id, req.body);
        return res.status(200).json({ success: true, message: 'Subject assigned successfully', data: result });
    } catch (err) {
        next(err);
    }
};

export const removeTeacherAssignment = async (req, res, next) => {
    try {
        const schoolId = req.user.schoolId || req.user.societyId;
        const result = await peopleService.removeTeacherAssignment(schoolId, req.params.id, req.params.assignmentId, req.query.type);
        return res.status(200).json({ success: true, message: 'Assignment removed successfully', data: result });
    } catch (err) {
        next(err);
    }
};

// ── STAFF CONTROLLERS ──────────────────────────────────────────────────────

export const getStaffList = async (req, res, next) => {
    try {
        const schoolId = req.user.schoolId || req.user.societyId;
        const result = await peopleService.getStaffList(schoolId, req.query, req.scopeFilter);
        return res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

export const getStaffById = async (req, res, next) => {
    try {
        const schoolId = req.user.schoolId || req.user.societyId;
        const result = await peopleService.getStaffById(schoolId, req.params.id);
        return res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

export const getStaffPayroll = async (req, res, next) => {
    try {
        const schoolId = req.user.schoolId || req.user.societyId;
        const result = await peopleService.getStaffPayroll(schoolId, req.params.id);
        return res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

export const createStaff = async (req, res, next) => {
    try {
        const schoolId = req.user.schoolId || req.user.societyId;
        const result = await peopleService.createStaff(schoolId, req.body, req.user._id);
        return res.status(201).json({ success: true, message: 'Staff member created successfully', data: result });
    } catch (err) {
        next(err);
    }
};

// ── EMPLOYEE ATTENDANCE CONTROLLERS ────────────────────────────────────────

export const getEmployeeAttendance = async (req, res, next) => {
    try {
        const schoolId = req.user.schoolId || req.user.societyId;
        const result = await peopleService.getEmployeeAttendance(schoolId, req.query, req.scopeFilter);
        return res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

export const markEmployeeAttendance = async (req, res, next) => {
    try {
        const schoolId = req.user.schoolId || req.user.societyId;
        const result = await peopleService.markEmployeeAttendance(schoolId, req.body, req.user._id);
        return res.status(200).json({ success: true, message: 'Attendance marked successfully', data: result });
    } catch (err) {
        next(err);
    }
};

// ── PARENTS CONTROLLERS ────────────────────────────────────────────────────

export const getParentsList = async (req, res, next) => {
    try {
        const schoolId = req.user.schoolId || req.user.societyId;
        const result = await peopleService.getParentsList(schoolId, req.query, req.scopeFilter);
        return res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

export const getParentById = async (req, res, next) => {
    try {
        const schoolId = req.user.schoolId || req.user.societyId;
        const result = await peopleService.getParentById(schoolId, req.params.id);
        return res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

export const createParent = async (req, res, next) => {
    try {
        const schoolId = req.user.schoolId || req.user.societyId;
        const result = await peopleService.createParent(schoolId, req.body, req.user._id);
        return res.status(201).json({ success: true, message: 'Parent profile created successfully', data: result });
    } catch (err) {
        next(err);
    }
};

export const getMyChildren = async (req, res, next) => {
    try {
        const schoolId = req.user.schoolId || req.user.societyId;
        const result = await peopleService.getMyChildren(schoolId, req.user);
        return res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};
