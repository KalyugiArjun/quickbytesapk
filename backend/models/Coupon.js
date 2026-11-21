import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true
    },
    title: {
      type: String,
      default: 'Special QuickBite Discount'
    },
    description: {
      type: String,
      default: 'Get instant savings on delicious meals'
    },
    discountType: {
      type: String,
      enum: ['percentage', 'flat'],
      default: 'percentage'
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required']
    },
    minOrderValue: {
      type: Number,
      default: 199
    },
    maxDiscount: {
      type: Number,
      default: 120
    },
    validUntil: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    },
    usageLimit: {
      type: Number,
      default: 1000
    },
    usedCount: {
      type: Number,
      default: 48
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
