import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import { sendEmail } from '../utils/emailService.js';
import crypto from 'crypto';

// Helper to send token response
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = user.getSignedJwtToken();

  const userObj = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar,
    addresses: user.addresses,
    walletBalance: user.walletBalance,
    status: user.status
  };

  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: userObj
  });
};

// @desc    Register user (Customer or Vendor)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, restaurantName, cuisineType, street, city, zipCode } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    // Default to 'customer' unless explicit
    const userRole = role === 'vendor' ? 'vendor' : 'customer';

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '+91 98765 43210',
      role: userRole,
      addresses: street ? [{
        label: 'Home',
        street,
        city: city || 'Mumbai',
        zipCode: zipCode || '400001',
        isDefault: true
      }] : []
    });

    // If registering as vendor, automatically initialize a draft restaurant profile
    if (userRole === 'vendor') {
      await Restaurant.create({
        ownerId: user._id,
        name: restaurantName || `${name}'s Kitchen`,
        cuisineType: cuisineType ? (Array.isArray(cuisineType) ? cuisineType : [cuisineType]) : ['Fast Food', 'Beverages'],
        address: {
          street: street || '101 Gourmet Avenue',
          city: city || 'Mumbai',
          state: 'Maharashtra',
          zipCode: zipCode || '400001'
        },
        phone: phone || '+91 98200 11223',
        email: email
      });
    }

    sendTokenResponse(user, 201, res, 'Registration successful! Welcome to QuickBite.');
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password credentials' });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact administrator.' });
    }

    sendTokenResponse(user, 200, res, 'Welcome back to QuickBite!');
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let restaurant = null;

    if (user.role === 'vendor') {
      restaurant = await Restaurant.findOne({ ownerId: user._id });
    }

    res.status(200).json({
      success: true,
      user,
      restaurant
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (phone) fieldsToUpdate.phone = phone;
    if (avatar) fieldsToUpdate.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password does not match' });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password changed successfully!');
  } catch (err) {
    next(err);
  }
};

// @desc    Add address
// @route   POST /api/auth/address
// @access  Private
export const addAddress = async (req, res, next) => {
  try {
    const { label, street, city, state, zipCode, isDefault } = req.body;
    const user = await User.findById(req.user.id);

    if (isDefault) {
      user.addresses.forEach(a => a.isDefault = false);
    }

    user.addresses.push({
      label: label || 'Home',
      street,
      city: city || 'Mumbai',
      state: state || 'Maharashtra',
      zipCode,
      isDefault: isDefault || user.addresses.length === 0
    });

    await user.save();
    res.status(200).json({ success: true, message: 'Address saved successfully', addresses: user.addresses });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete address
// @route   DELETE /api/auth/address/:addressId
// @access  Private
export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.addressId);
    await user.save();
    res.status(200).json({ success: true, message: 'Address removed', addresses: user.addresses });
  } catch (err) {
    next(err);
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No account registered with that email' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    const message = `You requested a password reset for QuickBite.\nPlease visit this link to reset your password:\n\n${resetUrl}\n\nIf you did not make this request, please ignore this email.`;

    await sendEmail({
      to: user.email,
      subject: 'QuickBite Password Reset Request',
      text: message
    });

    res.status(200).json({ success: true, message: 'Password reset link sent to your email.' });
  } catch (err) {
    next(err);
  }
};
