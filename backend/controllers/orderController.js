import Order from '../models/Order.js';
import Restaurant from '../models/Restaurant.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Coupon from '../models/Coupon.js';
import { sendEmail } from '../utils/emailService.js';

// Generate unique order number (e.g., QB-49281)
const generateOrderNumber = () => {
  return `QB-${Math.floor(10000 + Math.random() * 90000)}`;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Customer)
export const createOrder = async (req, res, next) => {
  try {
    const {
      restaurantId,
      items,
      subtotal,
      deliveryFee,
      tax,
      discount,
      totalAmount,
      appliedCoupon,
      deliveryAddress,
      paymentMethod,
      orderNotes
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    // Check wallet balance if paymentMethod is WALLET
    if (paymentMethod === 'WALLET') {
      const customer = await User.findById(req.user.id);
      if (customer.walletBalance < totalAmount) {
        return res.status(400).json({
          success: false,
          message: `Insufficient QuickBite wallet balance (₹${customer.walletBalance.toFixed(2)}). Please choose another payment method or top up.`
        });
      }
      customer.walletBalance -= totalAmount;
      await customer.save();
    }

    // Increment coupon usedCount if applied
    if (appliedCoupon && appliedCoupon.code) {
      await Coupon.findOneAndUpdate(
        { code: appliedCoupon.code.toUpperCase() },
        { $inc: { usedCount: 1 } }
      );
    }

    const orderNumber = generateOrderNumber();
    const estDelivery = new Date(Date.now() + (restaurant.deliveryTimeMinutes || 30) * 60 * 1000);

    const order = await Order.create({
      orderNumber,
      customerId: req.user.id,
      restaurantId,
      items,
      subtotal,
      deliveryFee: deliveryFee || 0,
      tax: tax || 0,
      discount: discount || 0,
      totalAmount,
      appliedCoupon,
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'pending' : 'paid',
      orderStatus: 'placed',
      orderNotes: orderNotes || '',
      estimatedDeliveryTime: estDelivery,
      statusHistory: [
        {
          status: 'placed',
          timestamp: new Date(),
          comment: 'Order received by QuickBite platform'
        }
      ]
    });

    // Notify customer
    await Notification.create({
      userId: req.user.id,
      title: 'Order Confirmed! 🍕',
      message: `Your order #${orderNumber} from ${restaurant.name} has been placed successfully.`,
      type: 'order',
      link: `/orders/${order._id}`
    });

    // Notify restaurant owner
    await Notification.create({
      userId: restaurant.ownerId,
      title: 'New Order Received! 🔔',
      message: `New Order #${orderNumber} for ₹${totalAmount.toFixed(2)} is waiting for confirmation.`,
      type: 'order',
      link: `/vendor/orders`
    });

    // Send confirmation email
    sendEmail({
      to: req.user.email,
      subject: `Order Confirmed: ${orderNumber} - Khaao Pio Moj Karo!`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #111; color: #fff; padding: 20px; border-radius: 8px;">
          <h2 style="color: #FF7900;">QuickBite - Order Confirmed!</h2>
          <p>Hi ${req.user.name},</p>
          <p>Thank you for ordering with <strong>QuickBite</strong>! Your delicious meal from <strong>${restaurant.name}</strong> is being processed.</p>
          <hr style="border-color: #333;" />
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Total Amount:</strong> ₹${totalAmount.toFixed(2)}</p>
          <p><strong>Delivery Address:</strong> ${deliveryAddress.street}, ${deliveryAddress.city}</p>
          <p><strong>Estimated Delivery:</strong> ~${restaurant.deliveryTimeMinutes || 30} mins</p>
          <br />
          <p style="color: #FF7900; font-weight: bold;">Khaao Pio Moj Karo!</p>
        </div>
      `
    }).catch(console.error);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Khaao Pio Moj Karo!',
      order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get customer order history
// @route   GET /api/orders/my-orders
// @access  Private (Customer)
export const getCustomerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customerId: req.user.id })
      .populate('restaurantId', 'name logo bannerImage phone address')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurantId', 'name logo bannerImage phone address rating')
      .populate('customerId', 'name email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Role security check: Customer can only view their own order, Vendor can view order for their restaurant, Admin can view all
    if (
      req.user.role === 'customer' &&
      order.customerId._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update order status (Vendor or Admin)
// @route   PATCH /api/orders/:id/status
// @access  Private (Vendor, Admin)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, comment, driverInfo } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const validStatuses = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status transition' });
    }

    order.orderStatus = status;
    if (status === 'delivered') {
      order.paymentStatus = 'paid';
    }
    if (driverInfo) {
      order.driverInfo = driverInfo;
    }

    order.statusHistory.push({
      status,
      timestamp: new Date(),
      comment: comment || `Status updated to ${status.replace('_', ' ')}`
    });

    await order.save();

    // Create customer notification
    const readableStatus = status.replace(/_/g, ' ').toUpperCase();
    await Notification.create({
      userId: order.customerId,
      title: `Order Update: #${order.orderNumber} is ${readableStatus}`,
      message: comment || `Your order status changed to ${readableStatus}.`,
      type: 'order',
      link: `/orders/${order._id}`
    });

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get vendor's incoming and past orders
// @route   GET /api/orders/vendor/orders
// @access  Private (Vendor)
export const getVendorOrders = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant profile not found' });
    }

    const { status } = req.query;
    const filter = { restaurantId: restaurant._id };
    if (status && status !== 'all') {
      filter.orderStatus = status;
    }

    const orders = await Order.find(filter)
      .populate('customerId', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all orders across platform (Admin)
// @route   GET /api/orders/admin/all
// @access  Private (Admin)
export const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status && status !== 'all') {
      filter.orderStatus = status;
    }
    if (search) {
      filter.orderNumber = { $regex: search, $options: 'i' };
    }

    const orders = await Order.find(filter)
      .populate('customerId', 'name email phone')
      .populate('restaurantId', 'name phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Customer cancel order (if still in placed/confirmed stage)
// @route   POST /api/orders/:id/cancel
// @access  Private (Customer)
export const cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.customerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
    }

    if (['preparing', 'out_for_delivery', 'delivered'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order because kitchen is already preparing or it is out for delivery.'
      });
    }

    order.orderStatus = 'cancelled';
    order.cancellationReason = reason || 'Cancelled by customer';
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      comment: reason || 'Cancelled by customer'
    });

    // Refund wallet if paid by wallet
    if (order.paymentMethod === 'WALLET') {
      await User.findByIdAndUpdate(order.customerId, {
        $inc: { walletBalance: order.totalAmount }
      });
      order.paymentStatus = 'refunded';
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (err) {
    next(err);
  }
};
