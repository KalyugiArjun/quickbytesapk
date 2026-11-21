import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    categoryName: {
      type: String,
      default: 'Main Course'
    },
    name: {
      type: String,
      required: [true, 'Please enter item name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please enter item description']
    },
    price: {
      type: Number,
      required: [true, 'Please enter item regular price'],
      min: 0
    },
    discountPrice: {
      type: Number,
      default: null
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
    },
    isVeg: {
      type: Boolean,
      default: false
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    preparationTime: {
      type: Number,
      default: 20 // minutes
    },
    spicyLevel: {
      type: String,
      enum: ['mild', 'medium', 'hot', 'extra_hot'],
      default: 'medium'
    },
    rating: {
      type: Number,
      default: 4.8
    },
    totalOrders: {
      type: Number,
      default: 45
    },
    isBestseller: {
      type: Boolean,
      default: false
    },
    addOns: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true, default: 0 },
        required: { type: Boolean, default: false }
      }
    ],
    tags: [String]
  },
  { timestamps: true }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;
