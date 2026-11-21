import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    customerName: {
      type: String,
      required: true
    },
    customerAvatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: [true, 'Please write your review feedback']
    },
    vendorReply: {
      comment: String,
      repliedAt: Date
    }
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;
