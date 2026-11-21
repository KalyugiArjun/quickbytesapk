import express from 'express';
import { getVendorAnalytics, getAdminAnalytics } from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/vendor', protect, authorize('vendor'), getVendorAnalytics);
router.get('/admin', protect, authorize('admin'), getAdminAnalytics);

export default router;
