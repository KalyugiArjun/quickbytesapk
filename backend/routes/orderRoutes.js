import express from 'express';
import {
  createOrder,
  getCustomerOrders,
  getOrderById,
  updateOrderStatus,
  getVendorOrders,
  getAllOrdersAdmin,
  cancelOrder
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getCustomerOrders);
router.get('/vendor/orders', protect, authorize('vendor'), getVendorOrders);
router.get('/admin/all', protect, authorize('admin'), getAllOrdersAdmin);
router.get('/:id', protect, getOrderById);
router.patch('/:id/status', protect, authorize('vendor', 'admin'), updateOrderStatus);
router.post('/:id/cancel', protect, cancelOrder);

export default router;
