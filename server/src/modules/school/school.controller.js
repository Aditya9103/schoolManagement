/**
 * school.controller.js — HTTP handlers for School management.
 */
import * as schoolService from './school.service.js';
import ApiResponse from '../../utils/ApiResponse.js';
import asyncHandler from '../../utils/asyncHandler.js';

export const createSchool = asyncHandler(async (req, res) => {
    const school = await schoolService.createSchool(req.body);
    res.status(201).json(ApiResponse.success(school, 'School created successfully', 201));
});

export const getAllSchools = asyncHandler(async (req, res) => {
    const { page, limit, search, plan, status, isActive, board } = req.query;
    const result = await schoolService.getAllSchools({ page, limit, search, plan, status, isActive, board });
    res.json(ApiResponse.success(result, 'Schools retrieved'));
});

export const getSchoolById = asyncHandler(async (req, res) => {
    const school = await schoolService.getSchoolById(req.params.id);
    res.json(ApiResponse.success(school, 'School retrieved'));
});

export const updateSchool = asyncHandler(async (req, res) => {
    const school = await schoolService.updateSchool(req.params.id, req.body);
    res.json(ApiResponse.success(school, 'School updated'));
});

export const toggleSchoolStatus = asyncHandler(async (req, res) => {
    const school = await schoolService.toggleSchoolStatus(req.params.id);
    res.json(ApiResponse.success(school, `School ${school.isActive ? 'activated' : 'deactivated'}`));
});

export const updateSubscription = asyncHandler(async (req, res) => {
    const school = await schoolService.updateSubscription(req.params.id, req.body);
    res.json(ApiResponse.success(school, 'Subscription updated'));
});

export const getPlatformStats = asyncHandler(async (req, res) => {
    const stats = await schoolService.getPlatformStats();
    res.json(ApiResponse.success(stats, 'Platform stats retrieved'));
});

export const getSchoolsGrowth = asyncHandler(async (req, res) => {
    const { months } = req.query;
    const data = await schoolService.getSchoolsGrowth(Number(months) || 12);
    res.json(ApiResponse.success(data, 'Growth data retrieved'));
});

export const getRevenueOverview = asyncHandler(async (req, res) => {
    const { months } = req.query;
    const data = await schoolService.getRevenueOverview(Number(months) || 6);
    res.json(ApiResponse.success(data, 'Revenue data retrieved'));
});

export const inviteSchoolAdmin = asyncHandler(async (req, res) => {
    const result = await schoolService.inviteSchoolAdmin(req.params.id, req.body);
    res.json(ApiResponse.success(result, 'Admin invited successfully'));
});

export const getOnboardingPipeline = asyncHandler(async (req, res) => {
    const pipeline = await schoolService.getOnboardingPipeline();
    res.json(ApiResponse.success(pipeline, 'Onboarding pipeline retrieved'));
});

export const getMySchool = asyncHandler(async (req, res) => {
    const schoolId = req.query.schoolId || req.user?.schoolId;
    const school = await schoolService.getMySchool(schoolId);
    res.json(ApiResponse.success(school, 'School profile retrieved'));
});

export const getSchoolDashboardStats = asyncHandler(async (req, res) => {
    const schoolId = req.query.schoolId || req.user?.schoolId;
    const dashboardData = await schoolService.getSchoolDashboardStats(schoolId);
    res.json(ApiResponse.success(dashboardData, 'School dashboard stats retrieved'));
});
