import { Router } from 'express';
import { uploadSingle } from '../../middleware/upload.middleware.js';
import * as uploadController from './upload.controller.js';

const router = Router();

// Upload image (avatars, school logos, banners)
router.post('/image', uploadSingle('file', 'images', 'image'), uploadController.uploadImage);

// Upload document (PDFs, assignments, syllabus)
router.post('/document', uploadSingle('file', 'documents', 'document'), uploadController.uploadDocument);

// Get presigned upload URL for direct browser uploads
router.post('/presigned-url', uploadController.getPresignedUploadUrl);

// Delete file
router.delete('/', uploadController.deleteFile);

export default router;
