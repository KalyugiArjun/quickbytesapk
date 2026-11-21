import express from 'express';
import {
  getAllRestaurants,
  getRestaurantById,
  getVendorRestaurant,
  updateRestaurant,
  getAllRestaurantsAdmin,
  updateRestaurantStatusAdmin
} from '../controllers/restaurantController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllRestaurants);
router.get('/vendor/me', protect, authorize('vendor'), getVendorRestaurant);
router.put('/vendor/me', protect, authorize('vendor'), updateRestaurant);
router.get('/admin/all', protect, authorize('admin'), getAllRestaurantsAdmin);
router.put('/admin/:id/status', protect, authorize('admin'), updateRestaurantStatusAdmin);
router.get('/:id', getRestaurantById);

export default router;
