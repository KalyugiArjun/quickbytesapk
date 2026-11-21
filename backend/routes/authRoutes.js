import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  addAddress,
  deleteAddress,
  forgotPassword
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/address', protect, addAddress);
router.delete('/address/:addressId', protect, deleteAddress);

export default router;
