import Review from '../models/Review.js';
import Restaurant from '../models/Restaurant.js';

// @desc    Add review for restaurant
// @route   POST /api/reviews
// @access  Private (Customer)
export const createReview = async (req, res, next) => {
  try {
    const { restaurantId, orderId, rating, comment } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const review = await Review.create({
      customerId: req.user.id,
      customerName: req.user.name,
      customerAvatar: req.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      restaurantId,
      orderId,
      rating: Number(rating),
      comment
    });

    // Recalculate restaurant average rating
    const reviews = await Review.find({ restaurantId });
    const totalReviews = reviews.length;
    const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews;

    restaurant.rating = Number(avgRating.toFixed(1));
    restaurant.totalReviews = totalReviews;
    await restaurant.save();

    res.status(201).json({
      success: true,
      message: 'Review posted successfully! Thank you for your feedback.',
      review
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get reviews for a restaurant
// @route   GET /api/reviews/restaurant/:restaurantId
// @access  Public
export const getRestaurantReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ restaurantId: req.params.restaurantId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Vendor reply to a review
// @route   POST /api/reviews/:id/reply
// @access  Private (Vendor)
export const replyToReview = async (req, res, next) => {
  try {
    const { comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.vendorReply = {
      comment,
      repliedAt: new Date()
    };

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Reply added successfully',
      review
    });
  } catch (err) {
    next(err);
  }
};
