import React, { useState, useEffect } from 'react';
import { Search, Eye } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { Skeleton } from '../../components/common/Skeleton';

const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const query = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
        const res = await api.get(`/orders/admin/all${query}`);
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error('Failed to load admin orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [statusFilter]);

  const filteredOrders = orders.filter((o) =>
    o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.restaurantId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '30px', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0' }}>
          Global Orders Monitor
        </h1>
        <p style={{ color: '#A3A3A3', fontSize: '14px', margin: 0 }}>
          Inspect orders across all partner restaurants, payment states, and delivery milestones.
        </p>
      </div>

      {/* Filter and Search */}
      <div style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by Order #, Customer, or Restaurant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            maxWidth: '380px',
            backgroundColor: '#1C1C1C',
            border: '1px solid #333333',
            borderRadius: '8px',
            padding: '10px 14px',
            color: '#FFFFFF',
            fontSize: '13px',
            outline: 'none'
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            backgroundColor: '#1C1C1C',
            color: '#FFFFFF',
            border: '1px solid #333333',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '13px',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="all">All Statuses</option>
          <option value="placed">Placed</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="out_for_delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="80px" borderRadius="10px" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#A3A3A3', backgroundColor: '#1C1C1C', borderRadius: '12px', border: '1px solid #333333' }}>
          No orders match this filter.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              style={{
                backgroundColor: '#1C1C1C',
                border: '1px solid #333333',
                borderRadius: '10px',
                padding: '16px 20px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '14px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>
                    #{order.orderNumber}
                  </span>
                  <Badge variant={order.orderStatus}>{order.orderStatus.replace('_', ' ')}</Badge>
                  <span style={{ fontSize: '12px', color: '#737373' }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#A3A3A3' }}>
                  Kitchen: <strong style={{ color: '#FFFFFF' }}>{order.restaurantId?.name}</strong> • Customer: {order.customerId?.name}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#FF7900' }}>
                    ₹{order.totalAmount.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '11px', color: '#737373', textTransform: 'uppercase' }}>
                    {order.paymentMethod} • {order.paymentStatus}
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  icon={Eye}
                  onClick={() => setSelectedOrder(order)}
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Global Order #${selectedOrder?.orderNumber}`}
      >
        {selectedOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#A3A3A3' }}>Restaurant:</span>
              <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{selectedOrder.restaurantId?.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#A3A3A3' }}>Customer:</span>
              <span style={{ color: '#FFFFFF' }}>{selectedOrder.customerId?.name} ({selectedOrder.customerId?.phone})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#A3A3A3' }}>Delivery Address:</span>
              <span style={{ color: '#FFFFFF', textAlign: 'right' }}>
                {selectedOrder.deliveryAddress?.street}, {selectedOrder.deliveryAddress?.city}
              </span>
            </div>

            <div style={{ borderTop: '1px solid #333333', paddingTop: '10px' }}>
              <div style={{ fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>Items:</div>
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.name} × {item.quantity}</span>
                  <span style={{ color: '#FF7900' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #333333', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800 }}>
              <span>Total Paid:</span>
              <span style={{ color: '#FF7900' }}>₹{selectedOrder.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrderManagement;
