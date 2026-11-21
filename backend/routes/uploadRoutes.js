import express from 'express';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload an image file' });
  }

  // Construct relative URL
  const fileUrl = `/uploads/${req.file.filename}`;

  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    url: fileUrl
  });
});

export default router;
