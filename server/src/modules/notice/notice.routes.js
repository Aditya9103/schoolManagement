import { Router } from 'express';
import * as ctrl from './notice.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

// Universal auth guard
router.use(authenticate);

router.get('/', ctrl.getNotices);
router.get('/:id', ctrl.getNoticeById);
router.post('/', ctrl.createNotice);
router.patch('/:id', ctrl.updateNotice);
router.patch('/:id/pin', ctrl.togglePinNotice);
router.post('/:id/acknowledge', ctrl.acknowledgeNotice);
router.delete('/:id', ctrl.deleteNotice);

export default router;
