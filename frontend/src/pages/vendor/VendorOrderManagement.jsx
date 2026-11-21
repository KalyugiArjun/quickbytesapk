import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Filter, Eye, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { Skeleton } from '../../components/common/Skeleton';
import { useToast } from '../../context/ToastContext';

const VendorOrderManagement = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/vendor/orders');
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        showToast(`Order status updated to ${newStatus.replace('_', ' ')}`, 'success');
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(res.data.order);
        }
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const statusTabs = [
    { key: 'all', label: 'All Orders' },
    { key: 'placed', label: 'New / Placed' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'preparing', label: 'Preparing' },
    { key: 'out_for_delivery', label: 'Dispatched' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' }
  ];

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'all') return true;
    return o.orderStatus === activeTab;
  });

  return (
    <div style={{ padding: '30px', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0' }}>
          Order Management Pipeline
        </h1>
        <p style={{ color: '#A3A3A3', fontSize: '14px', margin: 0 }}>
          Accept incoming tickets, track cooking stages, and coordinate driver handoff.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          borderBottom: '1px solid #333333',
          paddingBottom: '12px',
          marginBottom: '24px'
        }}
      >
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              background: activeTab === tab.key ? '#FF7900' : '#1C1C1C',
              color: activeTab === tab.key ? '#FFFFFF' : '#A3A3A3',
              border: '1px solid #333333',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="100px" borderRadius="12px" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#A3A3A3', backgroundColor: '#1C1C1C', borderRadius: '12px', border: '1px solid #333333' }}>
          No orders in this category.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              style={{
                backgroundColor: '#1C1C1C',
                border: '1px solid #333333',
                borderRadius: '12px',
                padding: '18px 24px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>
                    #{order.orderNumber}
                  </span>
                  <Badge variant={order.orderStatus}>{order.orderStatus.replace('_', ' ')}</Badge>
                  <span style={{ fontSize: '12px', color: '#737373' }}>
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div style={{ fontSize: '14px', color: '#FFFFFF', fontWeight: 600 }}>
                  {order.items.map((i) => `${i.name} × ${i.quantity}`).join(', ')}
                </div>

                <div style={{ fontSize: '12px', color: '#A3A3A3', marginTop: '4px' }}>
                  Customer: {order.customerId?.name || 'Customer'} • Phone: {order.customerId?.phone || order.deliveryAddress?.phone}
                </div>
              </div>

              {/* Status Selector & Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#FF7900' }}>
                    ₹{order.totalAmount.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '11px', color: '#737373', textTransform: 'uppercase' }}>
                    {order.paymentMethod}
                  </div>
                </div>

                <select
                  value={order.orderStatus}
                  onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                  style={{
                    backgroundColor: '#242424',
                    color: '#FFFFFF',
                    border: '1px solid #FF7900',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="placed">Placed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <Button
                  variant="secondary"
                  size="sm"
                  icon={Eye}
                  onClick={() => setSelectedOrder(order)}
                >
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order Details #${selectedOrder?.orderNumber}`}
      >
        {selectedOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#A3A3A3', fontSize: '13px' }}>Status:</span>
              <Badge variant={selectedOrder.orderStatus}>{selectedOrder.orderStatus.replace('_', ' ')}</Badge>
            </div>

            <div style={{ borderTop: '1px solid #333333', paddingTop: '12px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#FFFFFF' }}>Items Ordered:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span>{item.name} × {item.quantity}</span>
                    <span style={{ color: '#FF7900' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid #333333', paddingTop: '12px' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#FFFFFF' }}>Delivery Details:</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#A3A3A3' }}>
                {selectedOrder.deliveryAddress?.street}, {selectedOrder.deliveryAddress?.city} - {selectedOrder.deliveryAddress?.zipCode}
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#A3A3A3' }}>
                Phone: {selectedOrder.deliveryAddress?.phone}
              </p>
              {selectedOrder.orderNotes && (
                <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#FF7900' }}>
                  Note: "{selectedOrder.orderNotes}"
                </p>
              )}
            </div>

            <div style={{ borderTop: '1px solid #333333', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800 }}>
              <span>Total Value:</span>
              <span style={{ color: '#FF7900' }}>₹{selectedOrder.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default VendorOrderManagement;
