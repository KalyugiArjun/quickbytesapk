import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  Phone,
  MapPin,
  Bike,
  Receipt,
  RotateCcw,
  AlertOctagon,
  Sparkles
} from 'lucide-react';
import api from '../../services/api';
import OrderStatusStepper from '../../components/common/OrderStatusStepper';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { useToast } from '../../context/ToastContext';

const OrderTrackingPage = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (err) {
      console.error('Failed to load order:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Auto refresh status every 8 seconds for live progress
    const interval = setInterval(fetchOrder, 8000);
    return () => clearInterval(interval);
  }, [id]);

  const handleCancelOrder = async () => {
    const confirm = window.confirm('Are you sure you want to cancel this order?');
    if (!confirm) return;

    setCancelling(true);
    try {
      const res = await api.post(`/orders/${id}/cancel`, {
        reason: 'Customer requested cancellation from tracking page'
      });
      if (res.data.success) {
        showToast('Order cancelled.', 'info');
        setOrder(res.data.order);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not cancel order', 'error');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <Skeleton height="80px" borderRadius="12px" style={{ marginBottom: '20px' }} />
        <Skeleton height="240px" borderRadius="12px" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Order not found</h2>
        <Link to="/orders">
          <Button variant="primary">View My Orders</Button>
        </Link>
      </div>
    );
  }

  const canCancel = ['placed', 'confirmed'].includes(order.orderStatus);

  return (
    <div style={{ minHeight: '85vh', padding: '40px 0' }}>
      <div className="container">
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '30px'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0 }}>
                Order #{order.orderNumber}
              </h1>
              <Badge variant={order.orderStatus}>{order.orderStatus.replace('_', ' ')}</Badge>
            </div>
            <p style={{ color: '#A3A3A3', fontSize: '13px', margin: '4px 0 0 0' }}>
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {canCancel && (
              <Button
                variant="danger"
                size="sm"
                onClick={handleCancelOrder}
                loading={cancelling}
                icon={AlertOctagon}
              >
                Cancel Order
              </Button>
            )}
            <Link to="/restaurants">
              <Button variant="outline" size="sm" icon={RotateCcw}>
                Order Again
              </Button>
            </Link>
          </div>
        </div>

        {/* Live Stepper Tracker Card */}
        <div
          style={{
            backgroundColor: '#1C1C1C',
            border: '1px solid #333333',
            borderRadius: '16px',
            padding: '30px 24px',
            marginBottom: '30px'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '12px', color: '#FF7900', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              LIVE ORDER STATUS
            </span>
            <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '6px 0 0 0' }}>
              {order.orderStatus === 'delivered'
                ? 'Your Food Has Arrived! Khaao Pio Moj Karo! 🎉'
                : order.orderStatus === 'out_for_delivery'
                ? 'Driver is en route with your piping hot order 🛵'
                : order.orderStatus === 'preparing'
                ? 'The chef is preparing your meal in the kitchen 👨‍🍳'
                : 'Order received and confirmed by kitchen ✨'}
            </h2>
          </div>

          <OrderStatusStepper currentStatus={order.orderStatus} />
        </div>

        {/* Details Grid: Left Items + Right Delivery info */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}
        >
          {/* Items & Bill */}
          <div
            style={{
              backgroundColor: '#1C1C1C',
              border: '1px solid #333333',
              borderRadius: '14px',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <Receipt size={18} color="#FF7900" />
              <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0 }}>
                Order Summary ({order.items.length} items)
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              {order.items.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80'}
                      alt={item.name}
                      style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, color: '#FFFFFF' }}>{item.name}</div>
                      <div style={{ fontSize: '12px', color: '#A3A3A3' }}>Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <span style={{ fontWeight: 700, color: '#FF7900' }}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div style={{ borderTop: '1px solid #2E2E2E', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A3A3A3' }}>
                <span>Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A3A3A3' }}>
                <span>Delivery Fee</span>
                <span>₹{order.deliveryFee.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#22C55E' }}>
                  <span>Coupon Discount ({order.appliedCoupon?.code})</span>
                  <span>-₹{order.discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ borderTop: '1px solid #333333', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>
                <span>Total Paid</span>
                <span style={{ color: '#FF7900' }}>₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Restaurant & Driver info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Restaurant Card */}
            <div
              style={{
                backgroundColor: '#1C1C1C',
                border: '1px solid #333333',
                borderRadius: '14px',
                padding: '24px'
              }}
            >
              <h4 style={{ fontSize: '15px', color: '#A3A3A3', margin: '0 0 12px 0' }}>RESTAURANT</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={order.restaurantId?.logo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=100&q=80'}
                  alt="Restaurant"
                  style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                    {order.restaurantId?.name || 'QuickBite Partner Kitchen'}
                  </h3>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#A3A3A3' }}>
                    {order.restaurantId?.phone || '+91 98200 11223'}
                  </p>
                </div>
              </div>
            </div>

            {/* Delivery Driver */}
            <div
              style={{
                backgroundColor: '#1C1C1C',
                border: '1px solid #333333',
                borderRadius: '14px',
                padding: '24px'
              }}
            >
              <h4 style={{ fontSize: '15px', color: '#A3A3A3', margin: '0 0 12px 0' }}>DELIVERY PARTNER</h4>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#242424', border: '1px solid #333333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF7900' }}>
                    <Bike size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
                      {order.driverInfo?.name || 'Rahul Sharma'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#A3A3A3' }}>
                      {order.driverInfo?.vehicleNumber || 'MH-02-EX-4492'}
                    </div>
                  </div>
                </div>

                <a
                  href={`tel:${order.driverInfo?.phone || '+919988776655'}`}
                  style={{
                    backgroundColor: '#242424',
                    border: '1px solid #333333',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    color: '#22C55E',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Phone size={14} /> Call
                </a>
              </div>

              {/* Delivery Address */}
              <div style={{ marginTop: '16px', borderTop: '1px solid #2E2E2E', paddingTop: '12px' }}>
                <div style={{ fontSize: '12px', color: '#737373', marginBottom: '4px' }}>DELIVERING TO:</div>
                <div style={{ fontSize: '13px', color: '#FFFFFF' }}>
                  {order.deliveryAddress?.street}, {order.deliveryAddress?.city} - {order.deliveryAddress?.zipCode}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
