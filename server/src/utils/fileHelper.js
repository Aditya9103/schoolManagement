/**
 * fileHelper.js — Helpers for file naming, sizing, and MIME detection.
 */
import path from 'path';

/**
 * Format bytes into human-readable string (e.g. 1.25 MB).
 *
 * @param {number} bytes
 * @param {number} [decimals=2]
 * @returns {string}
 */
export const formatBytes = (bytes, decimals = 2) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Sanitizes a filename to remove special characters and spaces.
 *
 * @param {string} originalName
 * @returns {string} Sanitized filename
 */
export const sanitizeFileName = (originalName) => {
    if (!originalName) return 'file';
    const ext = path.extname(originalName);
    const base = path.basename(originalName, ext);
    const sanitizedBase = base
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .replace(/_+/g, '_')
        .toLowerCase();
    return `${sanitizedBase}${ext.toLowerCase()}`;
};

/**
 * Checks if a MIME type corresponds to an image.
 *
 * @param {string} mimetype
 * @returns {boolean}
 */
export const isImageMime = (mimetype) => {
    return /^image\/(jpeg|png|webp|gif|svg\+xml)$/i.test(mimetype);
};

/**
 * Checks if a MIME type corresponds to a PDF document.
 *
 * @param {string} mimetype
 * @returns {boolean}
 */
export const isPdfMime = (mimetype) => {
    return mimetype === 'application/pdf';
};
