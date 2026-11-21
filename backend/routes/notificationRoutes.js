import express from 'express';
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsRead
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getUserNotifications);
router.patch('/:id/read', protect, markNotificationAsRead);
router.patch('/read-all', protect, markAllNotificationsRead);

export default router;
