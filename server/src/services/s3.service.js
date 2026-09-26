import {
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import s3Client from '../config/s3.js';
import env from '../config/env.js';
import logger from '../utils/logger.js';
import ApiError from '../utils/ApiError.js';

/**
 * s3.service.js — Complete AWS S3 storage service.
 * Handles uploading files, streaming buffers, pre-signed URLs, and deletion.
 */

const getBucket = () => {
    const bucket = env.aws.bucket;
    if (!bucket) {
        throw ApiError.internal('AWS_S3_BUCKET is not configured');
    }
    return bucket;
};

/**
 * Upload a raw buffer directly to S3.
 *
 * @param {Buffer} buffer
 * @param {Object} options
 * @param {string} options.key - Desired S3 key / object path
 * @param {string} options.contentType - MIME type
 * @param {Object} [options.metadata={}] - Optional metadata key-values
 * @returns {Promise<{ url: string, key: string, bucket: string, size: number, mimetype: string }>}
 */
export const uploadBufferToS3 = async (buffer, { key, contentType, metadata = {} }) => {
    if (!s3Client) {
        throw ApiError.internal('AWS S3 Client is not initialized');
    }

    const bucket = getBucket();

    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        Metadata: metadata,
    });

    await s3Client.send(command);

    const region = env.aws.region;
    const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    logger.info(`✅ Uploaded object to S3: ${key} (${buffer.length} bytes)`);

    return {
        url,
        key,
        bucket,
        size: buffer.length,
        mimetype: contentType,
    };
};

/**
 * Upload a file object (from Multer memory storage).
 * Automatically generates a collision-free UUID key preserving file extension.
 *
 * @param {Express.Multer.File} file - Multer file with .buffer, .originalname, .mimetype
 * @param {Object} [options={}]
 * @param {string} [options.folder='uploads'] - Subfolder prefix (e.g. 'avatars', 'schools/logos')
 * @returns {Promise<{ url: string, key: string, bucket: string, size: number, mimetype: string, originalname: string }>}
 */
export const uploadFileToS3 = async (file, options = {}) => {
    if (!file || !file.buffer) {
        throw ApiError.badRequest('No file buffer provided for upload');
    }

    const folder = (options.folder || 'uploads').replace(/^\/+|\/+$/g, '');
    const ext = path.extname(file.originalname || '').toLowerCase();
    const uniqueName = `${uuidv4()}${ext}`;
    const key = `${folder}/${uniqueName}`;

    const result = await uploadBufferToS3(file.buffer, {
        key,
        contentType: file.mimetype || 'application/octet-stream',
        metadata: {
            originalname: encodeURIComponent(file.originalname || 'unknown'),
        },
    });

    return {
        ...result,
        originalname: file.originalname,
    };
};

/**
 * Generate a pre-signed URL for downloading a private object.
 *
 * @param {string} key - S3 object key
 * @param {number} [expiresInSeconds=3600] - Expiry in seconds (default: 1 hour)
 * @returns {Promise<string>} Signed URL
 */
export const getSignedDownloadUrl = async (key, expiresInSeconds = 3600) => {
    if (!s3Client) throw ApiError.internal('AWS S3 Client is not initialized');

    const bucket = getBucket();
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
};

/**
 * Generate a pre-signed URL for client-side direct upload.
 *
 * @param {string} key - S3 key to write
 * @param {string} contentType - Expected MIME type
 * @param {number} [expiresInSeconds=900] - Expiry in seconds (default: 15 mins)
 * @returns {Promise<{ uploadUrl: string, key: string, fileUrl: string }>}
 */
export const getSignedUploadUrl = async (key, contentType, expiresInSeconds = 900) => {
    if (!s3Client) throw ApiError.internal('AWS S3 Client is not initialized');

    const bucket = getBucket();
    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
    const fileUrl = `https://${bucket}.s3.${env.aws.region}.amazonaws.com/${key}`;

    return { uploadUrl, key, fileUrl };
};

/**
 * Delete an object from S3.
 * Accepts either the S3 key or full S3 URL.
 *
 * @param {string} keyOrUrl
 * @returns {Promise<boolean>}
 */
export const deleteFileFromS3 = async (keyOrUrl) => {
    if (!keyOrUrl) return false;
    if (!s3Client) throw ApiError.internal('AWS S3 Client is not initialized');

    const key = extractKeyFromUrl(keyOrUrl);
    const bucket = getBucket();

    try {
        const command = new DeleteObjectCommand({
            Bucket: bucket,
            Key: key,
        });

        await s3Client.send(command);
        logger.info(`🗑️ Deleted S3 object: ${key}`);
        return true;
    } catch (error) {
        logger.error(`❌ Failed to delete S3 object ${key}: ${error.message}`);
        throw error;
    }
};

/**
 * Extract S3 key from a full S3 URL or return the key if already relative.
 *
 * @param {string} urlOrKey
 * @returns {string}
 */
export const extractKeyFromUrl = (urlOrKey) => {
    if (!urlOrKey) return '';
    try {
        if (!urlOrKey.startsWith('http')) {
            return urlOrKey;
        }
        const parsed = new URL(urlOrKey);
        return decodeURIComponent(parsed.pathname.replace(/^\/+/, ''));
    } catch {
        return urlOrKey;
    }
};
