import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    phone: {
      type: String,
      default: '+91 98765 43210'
    },
    role: {
      type: String,
      enum: ['customer', 'vendor', 'admin'],
      default: 'customer'
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    },
    addresses: [
      {
        label: { type: String, default: 'Home' }, // Home, Work, Other
        street: { type: String, required: true },
        city: { type: String, required: true, default: 'Mumbai' },
        state: { type: String, default: 'Maharashtra' },
        zipCode: { type: String, required: true, default: '400001' },
        isDefault: { type: Boolean, default: false }
      }
    ],
    walletBalance: {
      type: Number,
      default: 500.00 // Bonus welcome credit for interactive testing
    },
    isVerified: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active'
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'quickbite_super_secret_jwt_key_2026',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

const User = mongoose.model('User', userSchema);
export default User;
