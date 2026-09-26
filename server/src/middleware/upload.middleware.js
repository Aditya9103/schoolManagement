/**
 * upload.middleware.js — File upload middleware using Multer + AWS S3.
 *
 * Files are buffered in memory by Multer, then streamed to AWS S3.
 * No temporary files touch the server disk.
 *
 * Exported factories:
 *   uploadSingle(fieldName, folder, allowType)      — Upload a single file to S3
 *   uploadMultiple(fieldName, max, folder, allowType) — Upload up to `max` files to S3
 *   uploadFields(fields, folder)                    — Upload multiple named fields to S3
 *
 * After middleware runs:
 *   req.file  — { url, key, bucket, size, mimetype, s3Url, fileUrl, storageKey, ... }
 *   req.files — Array or map of uploaded file objects with S3 URLs
 */

import multer from 'multer';
import { uploadFileToS3, deleteFileFromS3 } from '../services/s3.service.js';
import ApiError from '../utils/ApiError.js';

// ── Allowed MIME types ────────────────────────────────────────────────────────
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
const ALLOWED_DOC_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
];
const ALL_ALLOWED = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES];

/** Max file size: 25 MB */
const MAX_FILE_SIZE = 25 * 1024 * 1024;

// ── Multer: memory storage (no disk writes) ───────────────────────────────────
const storage = multer.memoryStorage();

/**
 * File filter factory — validates MIME type before accepting the file.
 *
 * @param {'image'|'document'|'any'} allowType
 * @returns {multer.Options['fileFilter']}
 */
const fileFilter = (allowType = 'any') => (req, file, cb) => {
    const allowedTypes =
        allowType === 'image'
            ? ALLOWED_IMAGE_TYPES
            : allowType === 'document'
            ? ALLOWED_DOC_TYPES
            : ALL_ALLOWED;

    if (!allowedTypes.includes(file.mimetype)) {
        return cb(
            ApiError.badRequest(
                `Invalid file type: ${file.mimetype}. Allowed: ${allowedTypes.join(', ')}`,
            ),
            false,
        );
    }
    return cb(null, true);
};

/**
 * Express middleware that streams req.file / req.files to AWS S3 after Multer processes it.
 * Attaches S3 upload details to req.file / req.files.
 *
 * @param {string} folder - Target S3 folder/prefix
 */
const s3UploadMiddleware = (folder) => async (req, res, next) => {
    try {
        // uploadSingle case
        if (req.file) {
            const result = await uploadFileToS3(req.file, { folder });
            req.file.s3Result = result;
            req.file.s3Url = result.url;
            req.file.url = result.url;
            req.file.fileUrl = result.url;
            req.file.key = result.key;
            req.file.storageKey = result.key;
            req.file.bucket = result.bucket;
            // Backward-compatibility alias
            req.file.cloudinaryUrl = result.url;
            req.file.cloudinaryPublicId = result.key;
        }

        // uploadMultiple case
        if (req.files && Array.isArray(req.files)) {
            await Promise.all(
                req.files.map(async (file) => {
                    const result = await uploadFileToS3(file, { folder });
                    file.s3Result = result;
                    file.s3Url = result.url;
                    file.url = result.url;
                    file.fileUrl = result.url;
                    file.key = result.key;
                    file.storageKey = result.key;
                    file.bucket = result.bucket;
                    // Backward-compatibility alias
                    file.cloudinaryUrl = result.url;
                    file.cloudinaryPublicId = result.key;
                }),
            );
        }

        // uploadFields case
        if (req.files && !Array.isArray(req.files)) {
            const fieldKeys = Object.keys(req.files);
            await Promise.all(
                fieldKeys.map(async (fKey) => {
                    const fileList = req.files[fKey];
                    if (Array.isArray(fileList)) {
                        await Promise.all(
                            fileList.map(async (file) => {
                                const result = await uploadFileToS3(file, { folder: `${folder}/${fKey}` });
                                file.s3Result = result;
                                file.s3Url = result.url;
                                file.url = result.url;
                                file.fileUrl = result.url;
                                file.key = result.key;
                                file.storageKey = result.key;
                                file.bucket = result.bucket;
                                file.cloudinaryUrl = result.url;
                                file.cloudinaryPublicId = result.key;
                            }),
                        );
                    }
                }),
            );
        }

        return next();
    } catch (err) {
        return next(err);
    }
};

// ── Exported Factories ────────────────────────────────────────────────────────

/**
 * uploadSingle — Upload a single file from one form field to AWS S3.
 *
 * @param {string} fieldName  - HTML form field name (e.g. 'file', 'photo')
 * @param {string} [folder]   - S3 folder prefix (e.g. 'avatars', 'schools/logos')
 * @param {'image'|'document'|'any'} [allowType] - Restrict file types
 * @returns {import('express').RequestHandler[]} Middleware chain
 */
export const uploadSingle = (fieldName, folder = 'general', allowType = 'any') => [
    multer({
        storage,
        limits: { fileSize: MAX_FILE_SIZE },
        fileFilter: fileFilter(allowType),
    }).single(fieldName),
    s3UploadMiddleware(folder),
];

/**
 * uploadMultiple — Upload multiple files from the same form field to AWS S3.
 *
 * @param {string} fieldName  - HTML form field name (e.g. 'images')
 * @param {number} [max=5]    - Maximum number of files
 * @param {string} [folder]
 * @param {'image'|'document'|'any'} [allowType]
 * @returns {import('express').RequestHandler[]}
 */
export const uploadMultiple = (fieldName, max = 5, folder = 'general', allowType = 'any') => [
    multer({
        storage,
        limits: { fileSize: MAX_FILE_SIZE, files: max },
        fileFilter: fileFilter(allowType),
    }).array(fieldName, max),
    s3UploadMiddleware(folder),
];

/**
 * uploadFields — Upload files from multiple named form fields to AWS S3.
 *
 * @param {Array<{ name: string, maxCount: number }>} fields
 * @param {string} [folder]
 * @returns {import('express').RequestHandler[]}
 */
export const uploadFields = (fields, folder = 'general') => [
    multer({
        storage,
        limits: { fileSize: MAX_FILE_SIZE },
        fileFilter: fileFilter('any'),
    }).fields(fields),
    s3UploadMiddleware(folder),
];

/**
 * Delete a file from AWS S3 (alias for deleteFileFromS3).
 *
 * @param {string} keyOrUrl - S3 key or full S3 URL
 * @returns {Promise<boolean>}
 */
export const deleteFromCloudinary = (keyOrUrl) => {
    return deleteFileFromS3(keyOrUrl);
};

export const deleteFromS3 = (keyOrUrl) => {
    return deleteFileFromS3(keyOrUrl);
};
