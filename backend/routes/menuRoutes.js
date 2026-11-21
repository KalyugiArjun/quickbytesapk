import express from 'express';
import {
  getMenuByRestaurant,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability
} from '../controllers/menuController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/restaurant/:restaurantId', getMenuByRestaurant);
router.post('/', protect, authorize('vendor'), createMenuItem);
router.put('/:id', protect, authorize('vendor'), updateMenuItem);
router.delete('/:id', protect, authorize('vendor'), deleteMenuItem);
router.patch('/:id/toggle-availability', protect, authorize('vendor'), toggleAvailability);

export default router;
