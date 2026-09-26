import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import * as roleService from './role.service.js';

export const getModuleDefinitions = asyncHandler(async (req, res) => {
    const modules = roleService.getModuleDefinitions();
    return res.status(200).json(ApiResponse.success(modules, 'Module definitions retrieved successfully'));
});

export const getRoles = asyncHandler(async (req, res) => {
    const schoolId = req.user.schoolId || req.user.societyId;
    const roles = await roleService.getRoles(schoolId);
    return res.status(200).json(ApiResponse.success(roles, 'Roles retrieved successfully'));
});

export const getRoleById = asyncHandler(async (req, res) => {
    const schoolId = req.user.schoolId || req.user.societyId;
    const role = await roleService.getRoleById(req.params.id, schoolId);
    return res.status(200).json(ApiResponse.success(role, 'Role retrieved successfully'));
});

export const createRole = asyncHandler(async (req, res) => {
    const schoolId = req.user.schoolId || req.user.societyId;
    const role = await roleService.createRole(schoolId, req.body);
    return res.status(201).json(ApiResponse.success(role, 'Custom role created successfully'));
});

export const updateRole = asyncHandler(async (req, res) => {
    const schoolId = req.user.schoolId || req.user.societyId;
    const role = await roleService.updateRole(req.params.id, schoolId, req.body);
    return res.status(200).json(ApiResponse.success(role, 'Role updated successfully'));
});

export const deleteRole = asyncHandler(async (req, res) => {
    const schoolId = req.user.schoolId || req.user.societyId;
    const result = await roleService.deleteRole(req.params.id, schoolId);
    return res.status(200).json(ApiResponse.success(result, 'Role deleted successfully'));
});

export const copyRole = asyncHandler(async (req, res) => {
    const schoolId = req.user.schoolId || req.user.societyId;
    const role = await roleService.copyRole(req.params.id, schoolId, req.body.name);
    return res.status(201).json(ApiResponse.success(role, 'Role cloned successfully'));
});

export const resetToDefault = asyncHandler(async (req, res) => {
    const schoolId = req.user.schoolId || req.user.societyId;
    const role = await roleService.resetToDefault(req.params.id, schoolId);
    return res.status(200).json(ApiResponse.success(role, 'Role permissions reset to default'));
});

export const getMyPermissions = asyncHandler(async (req, res) => {
    const result = await roleService.getMyPermissions(req.user);
    return res.status(200).json(ApiResponse.success(result, 'Current permissions retrieved successfully'));
});
