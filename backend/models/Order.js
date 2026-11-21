import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem'
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: String,
  isVeg: Boolean,
  selectedAddOns: [
    {
      name: String,
      price: Number
    }
  ],
  specialInstructions: String
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true
    },
    deliveryFee: {
      type: Number,
      default: 35
    },
    tax: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    appliedCoupon: {
      code: String,
      discount: Number
    },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: 'Maharashtra' },
      zipCode: { type: String, required: true },
      phone: { type: String, required: true }
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'CARD', 'UPI', 'WALLET'],
      default: 'COD'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'placed'
    },
    statusHistory: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        comment: String
      }
    ],
    orderNotes: {
      type: String,
      default: ''
    },
    cancellationReason: {
      type: String,
      default: ''
    },
    driverInfo: {
      name: { type: String, default: 'Rahul Sharma' },
      phone: { type: String, default: '+91 99887 76655' },
      vehicleNumber: { type: String, default: 'MH-02-EX-4492' }
    },
    estimatedDeliveryTime: {
      type: Date
    }
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
