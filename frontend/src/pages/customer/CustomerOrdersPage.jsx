import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, RotateCcw, Clock } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { Skeleton } from '../../components/common/Skeleton';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

const CustomerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error('Failed to load customer orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  const handleReorder = (order) => {
    if (order.items && order.items.length > 0 && order.restaurantId) {
      order.items.forEach((item) => {
        addToCart(item, order.restaurantId);
      });
      showToast('Items added to cart!', 'success');
      navigate('/checkout');
    }
  };

  return (
    <div style={{ minHeight: '80vh', padding: '40px 0' }}>
      <div className="container">
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 6px 0' }}>
            My Orders
          </h1>
          <p style={{ color: '#A3A3A3', fontSize: '14px', margin: 0 }}>
            Track active deliveries and review your previous feasts.
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height="120px" borderRadius="12px" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No orders yet"
            message="Looks like you haven't indulged yet. Explore top restaurants and start ordering!"
            actionText="Explore Restaurants"
            onAction={() => navigate('/restaurants')}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((order) => (
              <div
                key={order._id}
                style={{
                  backgroundColor: '#1C1C1C',
                  border: '1px solid #333333',
                  borderRadius: '14px',
                  padding: '20px 24px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px',
                  transition: 'border-color 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#FF7900')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#333333')}
              >
                {/* Left: Restaurant & Item overview */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src={order.restaurantId?.logo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=100&q=80'}
                    alt="Logo"
                    style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                        {order.restaurantId?.name || 'QuickBite Kitchen'}
                      </h3>
                      <Badge variant={order.orderStatus}>{order.orderStatus.replace('_', ' ')}</Badge>
                    </div>

                    <div style={{ fontSize: '13px', color: '#A3A3A3', marginBottom: '4px' }}>
                      Order #{order.orderNumber} • {new Date(order.createdAt).toLocaleDateString()}
                    </div>

                    <div style={{ fontSize: '13px', color: '#E5E5E5' }}>
                      {order.items.map((i) => `${i.name} (×${i.quantity})`).join(', ')}
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#FF7900' }}>
                      ₹{order.totalAmount.toFixed(2)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#737373', textTransform: 'uppercase' }}>
                      {order.paymentMethod} • {order.paymentStatus}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleReorder(order)}
                      icon={RotateCcw}
                    >
                      Reorder
                    </Button>
                    <Link to={`/orders/${order._id}`}>
                      <Button variant="primary" size="sm" icon={ArrowRight}>
                        Track
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerOrdersPage;
