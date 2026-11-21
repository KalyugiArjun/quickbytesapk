import express from 'express';
import {
  validateCoupon,
  getCoupons,
  createCoupon,
  deleteCoupon
} from '../controllers/couponController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCoupons);
router.post('/validate', validateCoupon);
router.post('/', protect, authorize('admin'), createCoupon);
router.delete('/:id', protect, authorize('admin'), deleteCoupon);

export default router;
