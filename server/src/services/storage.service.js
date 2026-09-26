/**
 * storage.service.js — Primary storage service facade.
 * Backed by AWS S3 (replaces Cloudinary).
 */
import {
    uploadFileToS3,
    uploadBufferToS3,
    deleteFileFromS3,
    getSignedDownloadUrl,
    getSignedUploadUrl,
    extractKeyFromUrl,
} from './s3.service.js';
import logger from '../utils/logger.js';

/**
 * Uploads a file (Multer object or buffer) to AWS S3.
 *
 * @param {Express.Multer.File|Buffer} file - Multer file or Buffer
 * @param {Object} [options={}] - Options (e.g. folder, key)
 * @returns {Promise<{ url: string, key: string, bucket: string, size: number, secure_url: string }>}
 */
export const uploadFile = async (file, options = {}) => {
    try {
        let result;
        if (file && file.buffer) {
            result = await uploadFileToS3(file, options);
        } else if (Buffer.isBuffer(file)) {
            const key = options.key || `uploads/${Date.now()}`;
            result = await uploadBufferToS3(file, {
                key,
                contentType: options.contentType || 'application/octet-stream',
            });
        } else {
            throw new Error('Unsupported file format for upload');
        }

        return {
            ...result,
            secure_url: result.url,
            public_id: result.key,
        };
    } catch (error) {
        logger.error(`Storage upload error: ${error.message}`);
        throw error;
    }
};

/**
 * Deletes a file from AWS S3.
 *
 * @param {string} keyOrUrl - S3 key or URL
 * @returns {Promise<boolean>}
 */
export const deleteFile = async (keyOrUrl) => {
    return await deleteFileFromS3(keyOrUrl);
};

/**
 * Extracts key from URL.
 *
 * @param {string} url - URL or key
 * @returns {string} Key
 */
export const extractPublicId = (url) => {
    return extractKeyFromUrl(url);
};

export {
    uploadFileToS3,
    uploadBufferToS3,
    deleteFileFromS3,
    getSignedDownloadUrl,
    getSignedUploadUrl,
};
