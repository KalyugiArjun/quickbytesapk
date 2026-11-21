import Coupon from '../models/Coupon.js';

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
// @access  Public
export const validateCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please enter a coupon code' });
    }

    const coupon = await Coupon.findOne({
      code: code.toUpperCase().trim(),
      isActive: true
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive coupon code' });
    }

    if (new Date() > new Date(coupon.validUntil)) {
      return res.status(400).json({ success: false, message: 'This coupon has expired' });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    }

    if (cartTotal && cartTotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon`
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    discount = Math.min(discount, cartTotal || discount);

    res.status(200).json({
      success: true,
      message: `Coupon '${coupon.code}' applied! You save ₹${discount.toFixed(2)}`,
      coupon: {
        code: coupon.code,
        discount: Number(discount.toFixed(2)),
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        description: coupon.description
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all active coupons
// @route   GET /api/coupons
// @access  Public
export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({ isActive: true }).sort({ discountValue: -1 });
    res.status(200).json({
      success: true,
      count: coupons.length,
      coupons
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Create coupon
// @route   POST /api/coupons
// @access  Private (Admin)
export const createCoupon = async (req, res, next) => {
  try {
    const { code, title, description, discountType, discountValue, minOrderValue, maxDiscount, validUntil } = req.body;
    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      title,
      description,
      discountType,
      discountValue,
      minOrderValue: minOrderValue || 0,
      maxDiscount: maxDiscount || 500,
      validUntil: validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      coupon
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Toggle or delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private (Admin)
export const deleteCoupon = async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Coupon deleted' });
  } catch (err) {
    next(err);
  }
};
