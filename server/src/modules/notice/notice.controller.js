import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import * as noticeService from './notice.service.js';

export const getNotices = asyncHandler(async (req, res) => {
    const schoolId = req.schoolId || req.user?.schoolId;
    const result = await noticeService.getNotices(schoolId, req.query, req.user);
    return res.status(200).json(ApiResponse.success(result, 'Notices retrieved successfully'));
});

export const getNoticeById = asyncHandler(async (req, res) => {
    const schoolId = req.schoolId || req.user?.schoolId;
    const notice = await noticeService.getNoticeById(schoolId, req.params.id);
    return res.status(200).json(ApiResponse.success(notice, 'Notice retrieved successfully'));
});

export const createNotice = asyncHandler(async (req, res) => {
    const schoolId = req.schoolId || req.user?.schoolId;
    const authorUserId = req.user?.sub || req.user?._id || req.user?.id;
    const notice = await noticeService.createNotice(schoolId, req.body, authorUserId);
    return res.status(201).json(ApiResponse.success(notice, 'Notice published successfully'));
});

export const updateNotice = asyncHandler(async (req, res) => {
    const schoolId = req.schoolId || req.user?.schoolId;
    const notice = await noticeService.updateNotice(schoolId, req.params.id, req.body);
    return res.status(200).json(ApiResponse.success(notice, 'Notice updated successfully'));
});

export const togglePinNotice = asyncHandler(async (req, res) => {
    const schoolId = req.schoolId || req.user?.schoolId;
    const result = await noticeService.togglePinNotice(schoolId, req.params.id);
    return res.status(200).json(ApiResponse.success(result, 'Notice pin state updated'));
});

export const acknowledgeNotice = asyncHandler(async (req, res) => {
    const schoolId = req.schoolId || req.user?.schoolId;
    const userId = req.user?.sub || req.user?._id || req.user?.id;
    const result = await noticeService.acknowledgeNotice(schoolId, req.params.id, userId);
    return res.status(200).json(ApiResponse.success(result, 'Notice acknowledged'));
});

export const deleteNotice = asyncHandler(async (req, res) => {
    const schoolId = req.schoolId || req.user?.schoolId;
    const result = await noticeService.deleteNotice(schoolId, req.params.id);
    return res.status(200).json(ApiResponse.success(result, 'Notice deleted successfully'));
});
