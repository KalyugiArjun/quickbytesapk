import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Please provide restaurant name'],
      trim: true
    },
    tagline: {
      type: String,
      default: 'Authentic tastes, made fresh with love'
    },
    description: {
      type: String,
      default: 'Serving delicious hot meals, signature beverages, and chef specials.'
    },
    cuisineType: {
      type: [String],
      default: ['North Indian', 'Biryani', 'Fast Food']
    },
    address: {
      street: { type: String, default: '104 Food Street, MG Road' },
      city: { type: String, default: 'Mumbai' },
      state: { type: String, default: 'Maharashtra' },
      zipCode: { type: String, default: '400001' }
    },
    phone: {
      type: String,
      default: '+91 98200 11223'
    },
    email: {
      type: String,
      default: 'orders@quickbiterestaurant.com'
    },
    bannerImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
    },
    logo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80'
    },
    rating: {
      type: Number,
      default: 4.6,
      min: 1,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 128
    },
    isOpen: {
      type: Boolean,
      default: true
    },
    isApproved: {
      type: Boolean,
      default: true
    },
    deliveryFee: {
      type: Number,
      default: 35
    },
    minOrderValue: {
      type: Number,
      default: 149
    },
    deliveryTimeMinutes: {
      type: Number,
      default: 25
    },
    commissionRate: {
      type: Number,
      default: 10 // 10% platform commission
    },
    isPureVeg: {
      type: Boolean,
      default: false
    },
    isFeatured: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;
