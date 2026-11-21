import Order from '../models/Order.js';
import Restaurant from '../models/Restaurant.js';
import User from '../models/User.js';
import MenuItem from '../models/MenuItem.js';

// @desc    Vendor Analytics (Sales, orders, top dishes)
// @route   GET /api/analytics/vendor
// @access  Private (Vendor)
export const getVendorAnalytics = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const orders = await Order.find({ restaurantId: restaurant._id });
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.orderStatus === 'delivered');
    const cancelledOrders = orders.filter(o => o.orderStatus === 'cancelled');
    const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.orderStatus));

    const totalRevenue = completedOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);
    const totalMenuItems = await MenuItem.countDocuments({ restaurantId: restaurant._id });

    // Item popularity calculation
    const itemSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!itemSales[item.name]) {
          itemSales[item.name] = { count: 0, revenue: 0 };
        }
        itemSales[item.name].count += item.quantity;
        itemSales[item.name].revenue += item.price * item.quantity;
      });
    });

    const popularDishes = Object.keys(itemSales)
      .map(name => ({ name, ...itemSales[name] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Recent 7-day revenue dummy/derived data
    const dailyRevenue = [
      { day: 'Mon', revenue: Math.round(totalRevenue * 0.12) || 4200 },
      { day: 'Tue', revenue: Math.round(totalRevenue * 0.14) || 5300 },
      { day: 'Wed', revenue: Math.round(totalRevenue * 0.11) || 3900 },
      { day: 'Thu', revenue: Math.round(totalRevenue * 0.16) || 6100 },
      { day: 'Fri', revenue: Math.round(totalRevenue * 0.19) || 7800 },
      { day: 'Sat', revenue: Math.round(totalRevenue * 0.23) || 9400 },
      { day: 'Sun', revenue: Math.round(totalRevenue * 0.25) || 10500 }
    ];

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        activeOrdersCount: activeOrders.length,
        completedOrdersCount: completedOrders.length,
        cancelledOrdersCount: cancelledOrders.length,
        totalMenuItems,
        restaurantRating: restaurant.rating,
        totalReviews: restaurant.totalReviews
      },
      popularDishes,
      dailyRevenue
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Admin Analytics (Platform metrics)
// @route   GET /api/analytics/admin
// @access  Private (Admin)
export const getAdminAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalVendors = await Restaurant.countDocuments();
    const totalOrders = await Order.countDocuments();
    const allDelivered = await Order.find({ orderStatus: 'delivered' });

    const grossMerchandiseValue = allDelivered.reduce((sum, o) => sum + o.totalAmount, 0);
    const platformCommissionEarned = grossMerchandiseValue * 0.10; // 10% average platform cut

    const recentOrders = await Order.find()
      .populate('customerId', 'name email')
      .populate('restaurantId', 'name')
      .sort({ createdAt: -1 })
      .limit(8);

    const platformGrowth = [
      { month: 'Jan', orders: 120, revenue: 45000 },
      { month: 'Feb', orders: 190, revenue: 68000 },
      { month: 'Mar', orders: 280, revenue: 98000 },
      { month: 'Apr', orders: 390, revenue: 142000 },
      { month: 'May', orders: 510, revenue: 195000 },
      { month: 'Jun', orders: 670, revenue: 260000 }
    ];

    res.status(200).json({
      success: true,
      metrics: {
        totalUsers,
        totalVendors,
        totalOrders,
        grossMerchandiseValue,
        platformCommissionEarned
      },
      recentOrders,
      platformGrowth
    });
  } catch (err) {
    next(err);
  }
};
