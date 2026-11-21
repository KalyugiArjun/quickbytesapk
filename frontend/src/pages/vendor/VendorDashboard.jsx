import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Star,
  UtensilsCrossed,
  ArrowUpRight,
  TrendingUp,
  Power
} from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { useToast } from '../../context/ToastContext';

const VendorDashboard = () => {
  const { showToast } = useToast();
  const [analytics, setAnalytics] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingStatus, setTogglingStatus] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [resAnalytics, resRest, resOrders] = await Promise.all([
        api.get('/analytics/vendor'),
        api.get('/restaurants/vendor/me'),
        api.get('/orders/vendor/orders')
      ]);

      if (resAnalytics.data.success) setAnalytics(resAnalytics.data);
      if (resRest.data.success) setRestaurant(resRest.data.restaurant);
      if (resOrders.data.success) setOrders(resOrders.data.orders);
    } catch (err) {
      console.error('Failed to load vendor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleToggleKitchenStatus = async () => {
    if (!restaurant) return;
    setTogglingStatus(true);
    try {
      const newStatus = !restaurant.isOpen;
      const res = await api.put('/restaurants/vendor/me', { isOpen: newStatus });
      if (res.data.success) {
        setRestaurant(res.data.restaurant);
        showToast(
          `Kitchen is now ${newStatus ? 'OPEN and accepting orders!' : 'CLOSED for today.'}`,
          newStatus ? 'success' : 'info'
        );
      }
    } catch (err) {
      showToast('Failed to update kitchen status', 'error');
    } finally {
      setTogglingStatus(false);
    }
  };

  const handleQuickStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        showToast(`Order updated to ${newStatus.replace('_', ' ')}`, 'success');
        fetchDashboardData();
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '30px' }}>
        <Skeleton height="100px" borderRadius="12px" style={{ marginBottom: '20px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="120px" borderRadius="12px" />
          ))}
        </div>
      </div>
    );
  }

  const activeOrders = orders.filter((o) => !['delivered', 'cancelled'].includes(o.orderStatus));

  return (
    <div style={{ padding: '30px', maxWidth: '1200px' }}>
      {/* Top Welcome & Kitchen Status Toggle Banner */}
      <div
        style={{
          backgroundColor: '#1C1C1C',
          border: '1px solid #333333',
          borderRadius: '16px',
          padding: '24px 30px',
          marginBottom: '30px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}
      >
        <div>
          <span style={{ fontSize: '12px', color: '#FF7900', fontWeight: 700, letterSpacing: '0.06em' }}>
            VENDOR CONTROL PANEL
          </span>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '4px 0 0 0', color: '#FFFFFF' }}>
            {restaurant?.name || 'My Kitchen'}
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#A3A3A3' }}>
            Live performance, incoming food tickets, and customer reviews.
          </p>
        </div>

        {/* Toggle Kitchen Open / Closed */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: restaurant?.isOpen ? '#22C55E' : '#EF4444' }}>
              {restaurant?.isOpen ? '● Kitchen Online' : '○ Kitchen Closed'}
            </div>
            <div style={{ fontSize: '11px', color: '#737373' }}>
              {restaurant?.isOpen ? 'Receiving customer orders' : 'Not taking orders'}
            </div>
          </div>
          <Button
            variant={restaurant?.isOpen ? 'danger' : 'success'}
            size="sm"
            onClick={handleToggleKitchenStatus}
            loading={togglingStatus}
            icon={Power}
          >
            {restaurant?.isOpen ? 'Close Kitchen' : 'Open Kitchen'}
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
          marginBottom: '30px'
        }}
      >
        {/* Revenue */}
        <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: '#A3A3A3', fontWeight: 600 }}>Total Revenue</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(34, 197, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22C55E' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>
            ₹{analytics?.stats?.totalRevenue?.toFixed(2) || '0.00'}
          </div>
          <span style={{ fontSize: '11px', color: '#22C55E', fontWeight: 600 }}>100% Verified Settled</span>
        </div>

        {/* Total Orders */}
        <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: '#A3A3A3', fontWeight: 600 }}>Total Orders</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255, 121, 0, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF7900' }}>
              <ShoppingBag size={18} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>
            {analytics?.stats?.totalOrders || 0}
          </div>
          <span style={{ fontSize: '11px', color: '#FF7900', fontWeight: 600 }}>
            {analytics?.stats?.activeOrdersCount || 0} live active
          </span>
        </div>

        {/* Menu Items */}
        <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: '#A3A3A3', fontWeight: 600 }}>Menu Items</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
              <UtensilsCrossed size={18} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>
            {analytics?.stats?.totalMenuItems || 0}
          </div>
          <Link to="/vendor/menu" style={{ fontSize: '11px', color: '#3B82F6', fontWeight: 600 }}>
            Manage Catalog →
          </Link>
        </div>

        {/* Rating */}
        <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: '#A3A3A3', fontWeight: 600 }}>Kitchen Rating</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(234, 179, 8, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EAB308' }}>
              <Star size={18} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>
            {restaurant?.rating || 4.8} / 5.0
          </div>
          <Link to="/vendor/reviews" style={{ fontSize: '11px', color: '#EAB308', fontWeight: 600 }}>
            {restaurant?.totalReviews || 0} reviews →
          </Link>
        </div>
      </div>

      {/* Active Orders Pipeline */}
      <div
        style={{
          backgroundColor: '#1C1C1C',
          border: '1px solid #333333',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '30px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={20} color="#FF7900" />
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
              Live Kitchen Tickets ({activeOrders.length})
            </h3>
          </div>
          <Link to="/vendor/orders" style={{ fontSize: '13px', color: '#FF7900', fontWeight: 600 }}>
            View Full Pipeline →
          </Link>
        </div>

        {activeOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#A3A3A3' }}>
            No active orders waiting in kitchen right now. Ready for new customers!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeOrders.slice(0, 5).map((order) => (
              <div
                key={order._id}
                style={{
                  backgroundColor: '#242424',
                  border: '1px solid #333333',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
                      #{order.orderNumber}
                    </span>
                    <Badge variant={order.orderStatus}>{order.orderStatus.replace('_', ' ')}</Badge>
                    <span style={{ fontSize: '12px', color: '#A3A3A3' }}>
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#E5E5E5' }}>
                    {order.items.map((i) => `${i.name} (×${i.quantity})`).join(', ')}
                  </div>
                  <div style={{ fontSize: '12px', color: '#A3A3A3', marginTop: '4px' }}>
                    Customer: {order.customerId?.name || 'Customer'} • {order.customerId?.phone}
                  </div>
                </div>

                {/* Status action buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {order.orderStatus === 'placed' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleQuickStatusUpdate(order._id, 'confirmed')}
                    >
                      Accept Order
                    </Button>
                  )}
                  {order.orderStatus === 'confirmed' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleQuickStatusUpdate(order._id, 'preparing')}
                    >
                      Start Cooking
                    </Button>
                  )}
                  {order.orderStatus === 'preparing' && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleQuickStatusUpdate(order._id, 'out_for_delivery')}
                    >
                      Dispatch with Driver
                    </Button>
                  )}
                  {order.orderStatus === 'out_for_delivery' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleQuickStatusUpdate(order._id, 'delivered')}
                    >
                      Mark Delivered
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popular Dishes / Daily Sales Breakdown */}
      {analytics?.popularDishes && analytics.popularDishes.length > 0 && (
        <div
          style={{
            backgroundColor: '#1C1C1C',
            border: '1px solid #333333',
            borderRadius: '16px',
            padding: '24px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <TrendingUp size={20} color="#FF7900" />
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
              Top Selling Dishes
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {analytics.popularDishes.map((dish, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#242424',
                  border: '1px solid #333333',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>{dish.name}</div>
                  <div style={{ fontSize: '11px', color: '#A3A3A3' }}>{dish.count} orders fulfilled</div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#22C55E' }}>
                  ₹{dish.revenue.toFixed(0)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
