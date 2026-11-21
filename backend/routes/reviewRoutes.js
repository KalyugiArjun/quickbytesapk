import express from 'express';
import {
  createReview,
  getRestaurantReviews,
  replyToReview
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/restaurant/:restaurantId', getRestaurantReviews);
router.post('/', protect, createReview);
router.post('/:id/reply', protect, authorize('vendor'), replyToReview);

export default router;
