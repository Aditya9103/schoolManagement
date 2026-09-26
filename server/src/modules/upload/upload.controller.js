import asyncHandler from '../../utils/asyncHandler.js';
import ApiResponse from '../../utils/ApiResponse.js';
import ApiError from '../../utils/ApiError.js';
import {
    deleteFileFromS3,
    getSignedUploadUrl,
    getSignedDownloadUrl,
} from '../../services/s3.service.js';

/**
 * upload.controller.js — Controller for S3 file uploads and presigned URLs.
 */

/**
 * POST /api/v1/uploads/image
 * Upload a single image file to AWS S3.
 */
export const uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw ApiError.badRequest('No image file provided');
    }

    res.status(201).json(
        new ApiResponse(
            201,
            {
                url: req.file.s3Url || req.file.url,
                key: req.file.key,
                bucket: req.file.bucket,
                size: req.file.size,
                mimetype: req.file.mimetype,
                originalname: req.file.originalname,
            },
            'Image uploaded successfully to AWS S3'
        )
    );
});

/**
 * POST /api/v1/uploads/document
 * Upload a document (PDF, DOCX, CSV) to AWS S3.
 */
export const uploadDocument = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw ApiError.badRequest('No document file provided');
    }

    res.status(201).json(
        new ApiResponse(
            201,
            {
                url: req.file.s3Url || req.file.url,
                key: req.file.key,
                bucket: req.file.bucket,
                size: req.file.size,
                mimetype: req.file.mimetype,
                originalname: req.file.originalname,
            },
            'Document uploaded successfully to AWS S3'
        )
    );
});

/**
 * POST /api/v1/uploads/presigned-url
 * Generate a pre-signed URL for direct S3 upload from the browser.
 */
export const getPresignedUploadUrl = asyncHandler(async (req, res) => {
    const { key, contentType, folder = 'direct' } = req.body;

    if (!contentType) {
        throw ApiError.badRequest('contentType is required');
    }

    const objectKey = key || `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const result = await getSignedUploadUrl(objectKey, contentType);

    res.status(200).json(
        new ApiResponse(200, result, 'Presigned S3 upload URL generated successfully')
    );
});

/**
 * DELETE /api/v1/uploads
 * Delete a file from AWS S3 by key or URL.
 */
export const deleteFile = asyncHandler(async (req, res) => {
    const { key, url } = req.body;
    const target = key || url;

    if (!target) {
        throw ApiError.badRequest('File key or URL is required for deletion');
    }

    await deleteFileFromS3(target);

    res.status(200).json(
        new ApiResponse(200, null, 'File deleted from AWS S3 successfully')
    );
});
