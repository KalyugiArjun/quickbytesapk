import MenuItem from '../models/MenuItem.js';
import Restaurant from '../models/Restaurant.js';

// @desc    Get menu items for a restaurant
// @route   GET /api/menu/restaurant/:restaurantId
// @access  Public
export const getMenuByRestaurant = async (req, res, next) => {
  try {
    const { isVeg, search, category } = req.query;
    const filter = { restaurantId: req.params.restaurantId };

    if (isVeg === 'true') {
      filter.isVeg = true;
    }

    if (category && category !== 'All') {
      filter.categoryName = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await MenuItem.find(filter).sort({ categoryName: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create menu item (Vendor)
// @route   POST /api/menu
// @access  Private (Vendor only)
export const createMenuItem = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant) {
      return res.status(403).json({ success: false, message: 'Vendor restaurant profile not found' });
    }

    const { name, description, price, discountPrice, image, isVeg, categoryName, spicyLevel, preparationTime, addOns, isBestseller } = req.body;

    const item = await MenuItem.create({
      restaurantId: restaurant._id,
      name,
      description,
      price,
      discountPrice: discountPrice || null,
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      isVeg: Boolean(isVeg),
      categoryName: categoryName || 'Chef Special',
      spicyLevel: spicyLevel || 'medium',
      preparationTime: preparationTime || 20,
      addOns: addOns || [],
      isBestseller: Boolean(isBestseller)
    });

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      item
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private (Vendor only)
export const updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant || item.restaurantId.toString() !== restaurant._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this item' });
    }

    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      item: updated
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private (Vendor only)
export const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant || item.restaurantId.toString() !== restaurant._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this item' });
    }

    await MenuItem.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Menu item deleted'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle item availability (in stock / out of stock)
// @route   PATCH /api/menu/:id/toggle-availability
// @access  Private (Vendor only)
export const toggleAvailability = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    item.isAvailable = !item.isAvailable;
    await item.save();

    res.status(200).json({
      success: true,
      message: `Item marked as ${item.isAvailable ? 'Available' : 'Out of Stock'}`,
      item
    });
  } catch (err) {
    next(err);
  }
};
