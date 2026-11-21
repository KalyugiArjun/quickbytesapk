import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';

// @desc    Get all restaurants with filters, search and sorting
// @route   GET /api/restaurants
// @access  Public
export const getAllRestaurants = async (req, res, next) => {
  try {
    const { search, cuisine, isPureVeg, sort, rating } = req.query;
    const query = { isApproved: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisineType: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (cuisine && cuisine !== 'All') {
      query.cuisineType = { $regex: cuisine, $options: 'i' };
    }

    if (isPureVeg === 'true') {
      query.isPureVeg = true;
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    let sortOption = { rating: -1 }; // default: highest rated
    if (sort === 'deliveryTime') {
      sortOption = { deliveryTimeMinutes: 1 };
    } else if (sort === 'deliveryFee') {
      sortOption = { deliveryFee: 1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    }

    const restaurants = await Restaurant.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single restaurant by ID with its menu categories & items
// @route   GET /api/restaurants/:id
// @access  Public
export const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const menuItems = await MenuItem.find({ restaurantId: restaurant._id, isAvailable: true });

    res.status(200).json({
      success: true,
      restaurant,
      menuItems
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current vendor's restaurant
// @route   GET /api/restaurants/vendor/me
// @access  Private (Vendor only)
export const getVendorRestaurant = async (req, res, next) => {
  try {
    let restaurant = await Restaurant.findOne({ ownerId: req.user._id });

    if (!restaurant) {
      // Auto-create if not exists
      restaurant = await Restaurant.create({
        ownerId: req.user._id,
        name: `${req.user.name}'s Kitchen`,
        email: req.user.email
      });
    }

    res.status(200).json({
      success: true,
      restaurant
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update restaurant details
// @route   PUT /api/restaurants/vendor/me
// @access  Private (Vendor only)
export const updateRestaurant = async (req, res, next) => {
  try {
    let restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const allowedUpdates = [
      'name', 'tagline', 'description', 'cuisineType', 'address', 'phone',
      'email', 'bannerImage', 'logo', 'isOpen', 'deliveryFee', 'minOrderValue',
      'deliveryTimeMinutes', 'isPureVeg'
    ];

    allowedUpdates.forEach(key => {
      if (req.body[key] !== undefined) {
        restaurant[key] = req.body[key];
      }
    });

    await restaurant.save();

    res.status(200).json({
      success: true,
      message: 'Restaurant profile updated successfully',
      restaurant
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Get all restaurants (including unapproved)
// @route   GET /api/restaurants/admin/all
// @access  Private (Admin only)
export const getAllRestaurantsAdmin = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find().populate('ownerId', 'name email phone status');
    res.status(200).json({
      success: true,
      count: restaurants.length,
      restaurants
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin: Update restaurant approval & commission
// @route   PUT /api/restaurants/admin/:id/status
// @access  Private (Admin only)
export const updateRestaurantStatusAdmin = async (req, res, next) => {
  try {
    const { isApproved, commissionRate, isOpen } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    if (isApproved !== undefined) restaurant.isApproved = isApproved;
    if (commissionRate !== undefined) restaurant.commissionRate = commissionRate;
    if (isOpen !== undefined) restaurant.isOpen = isOpen;

    await restaurant.save();

    res.status(200).json({
      success: true,
      message: 'Restaurant status updated by admin',
      restaurant
    });
  } catch (err) {
    next(err);
  }
};
