import Category from '../models/Category.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new category (Admin)
// @route   POST /api/categories
// @access  Private (Admin only)
export const createCategory = async (req, res, next) => {
  try {
    const { name, image, description, displayOrder } = req.body;
    const category = await Category.create({
      name,
      image,
      description,
      displayOrder: displayOrder || 0
    });

    res.status(201).json({
      success: true,
      message: 'Category created',
      category
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin only)
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated',
      category
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin only)
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Category removed'
    });
  } catch (err) {
    next(err);
  }
};
