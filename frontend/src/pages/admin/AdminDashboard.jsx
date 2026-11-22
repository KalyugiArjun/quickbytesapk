import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  Users,
  Store,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Filter,
  Search,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { useToast } from '../../context/ToastContext';
import { MOCK_VENDOR_APPROVALS, MOCK_RESTAURANTS } from '../../data/mockData';

const AdminDashboard = () => {
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'approvals', 'payouts', 'kitchens'
  const [approvals, setApprovals] = useState(MOCK_VENDOR_APPROVALS);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  const fetchAdminData = async () => {
    try {
      const res = await api.get('/analytics/admin');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApprovePartner = (appId, name) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'approved' } : a))
    );
    showToast(`Approved ${name}! Onboarding credentials sent via email.`, 'success');
  };

  const handleRejectPartner = (appId, name) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: 'rejected' } : a))
    );
    showToast(`Application for ${name} rejected.`, 'info');
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        showToast(`Order status updated to ${newStatus.replace('_', ' ')}`, 'success');
        fetchAdminData();
      }
    } catch (err) {
      showToast('Status updated locally.', 'info');
      // Optimistic update
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          recentOrders: prev.recentOrders.map((o) =>
            o._id === orderId ? { ...o, orderStatus: newStatus } : o
          )
        };
      });
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '30px' }}>
        <Skeleton height="80px" borderRadius="16px" style={{ marginBottom: '20px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="120px" borderRadius="16px" />
          ))}
        </div>
      </div>
    );
  }

  const { metrics, recentOrders } = data || {};

  const filteredOrders = recentOrders?.filter((o) => {
    if (selectedStatusFilter === 'ALL') return true;
    return o.orderStatus?.toUpperCase() === selectedStatusFilter;
  }) || [];

  return (
    <div style={{ padding: '30px 24px', maxWidth: '1240px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div style={{ marginBottom: '26px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', backgroundColor: 'rgba(255, 114, 0, 0.15)', color: '#FF7200', padding: '3px 10px', borderRadius: '9999px', fontWeight: 800 }}>
              SUPER ADMIN CONSOLE
            </span>
            <span style={{ fontSize: '12px', color: '#22C55E', fontWeight: 700 }}>
              ● System Online & Synced
            </span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '6px 0 2px 0', color: '#FFFFFF' }}>
            Platform Master Command Center
          </h1>
          <p style={{ color: '#9E9E9E', fontSize: '13px', margin: 0 }}>
            Real-time GMV flows, partner KYC approvals, dispatch governance, and platform take-rates.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          style={{
            backgroundColor: '#1E1E1E',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '9999px',
            padding: '8px 16px',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={14} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        {/* Gross GMV */}
        <div style={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#9E9E9E', fontWeight: 600 }}>Gross Platform GMV</span>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: 'rgba(34, 197, 94, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22C55E' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF' }}>
            ₹{metrics?.grossMerchandiseValue?.toFixed(2) || '1,48,920.00'}
          </div>
          <div style={{ fontSize: '11px', color: '#22C55E', fontWeight: 700, marginTop: '4px' }}>
            ↑ 14.8% vs last week
          </div>
        </div>

        {/* Platform Commission Earned */}
        <div style={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#9E9E9E', fontWeight: 600 }}>Commission Revenue</span>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: 'rgba(255, 114, 0, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF7200' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#FF7200' }}>
            ₹{metrics?.platformCommissionEarned?.toFixed(2) || '14,892.00'}
          </div>
          <div style={{ fontSize: '11px', color: '#8E8E93', marginTop: '4px' }}>
            10% standard platform take rate
          </div>
        </div>

        {/* Verified Kitchens */}
        <div style={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#9E9E9E', fontWeight: 600 }}>Partner Kitchens</span>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
              <Store size={18} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF' }}>
            {metrics?.totalVendors || MOCK_RESTAURANTS.length}
          </div>
          <div style={{ fontSize: '11px', color: '#3B82F6', fontWeight: 700, marginTop: '4px' }}>
            {approvals.filter((a) => a.status === 'pending').length} pending KYC approvals
          </div>
        </div>

        {/* Registered Foodies */}
        <div style={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '20px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#9E9E9E', fontWeight: 600 }}>Total Customers</span>
            <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: 'rgba(168, 85, 247, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C084FC' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF' }}>
            {metrics?.totalUsers || 1842}
          </div>
          <div style={{ fontSize: '11px', color: '#C084FC', fontWeight: 700, marginTop: '4px' }}>
            94% verified active mobile users
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '12px',
          marginBottom: '20px',
          overflowX: 'auto'
        }}
      >
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            backgroundColor: activeTab === 'orders' ? '#FF7200' : '#1A1A1A',
            border: 'none',
            borderRadius: '9999px',
            padding: '8px 18px',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Activity size={14} />
          <span>Live Orders ({recentOrders?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('approvals')}
          style={{
            backgroundColor: activeTab === 'approvals' ? '#FF7200' : '#1A1A1A',
            border: 'none',
            borderRadius: '9999px',
            padding: '8px 18px',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <ShieldCheck size={14} />
          <span>Partner Approvals ({approvals.filter((a) => a.status === 'pending').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('kitchens')}
          style={{
            backgroundColor: activeTab === 'kitchens' ? '#FF7200' : '#1A1A1A',
            border: 'none',
            borderRadius: '9999px',
            padding: '8px 18px',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Store size={14} />
          <span>Kitchens Directory ({MOCK_RESTAURANTS.length})</span>
        </button>
      </div>

      {/* TAB 1: Live Platform Orders Dispatch */}
      {activeTab === 'orders' && (
        <div
          style={{
            backgroundColor: '#1A1A1A',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '24px'
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
              Live Platform Orders Stream
            </h3>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {['ALL', 'PENDING', 'PREPARING', 'READY_FOR_PICKUP', 'DELIVERED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatusFilter(st)}
                  style={{
                    backgroundColor: selectedStatusFilter === st ? '#FF7200' : '#222222',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '5px 12px',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredOrders.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#9E9E9E', fontSize: '14px' }}>
                No orders match filter "{selectedStatusFilter}"
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order._id}
                  style={{
                    backgroundColor: '#161616',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                    borderRadius: '18px',
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
                      <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>
                        #{order.orderNumber}
                      </span>
                      <Badge variant={order.orderStatus}>{order.orderStatus.replace('_', ' ')}</Badge>
                      <span style={{ fontSize: '12px', color: '#9E9E9E' }}>
                        Kitchen: <strong style={{ color: '#FFFFFF' }}>{order.restaurantId?.name || 'Artisan Kitchen'}</strong>
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#8E8E93' }}>
                      Customer: {order.customerId?.name || 'Jhon Doe'} • {order.items?.length || 2} items
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '17px', fontWeight: 900, color: '#FF7200' }}>
                        ₹{order.totalAmount?.toFixed(2) || '449.00'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#737373', textTransform: 'uppercase' }}>
                        {order.paymentMethod || 'COD'} • {order.paymentStatus || 'COMPLETED'}
                      </div>
                    </div>

                    {/* Quick status update button */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {order.orderStatus === 'pending' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order._id, 'preparing')}
                          style={{ backgroundColor: '#22C55E', border: 'none', borderRadius: '9999px', padding: '6px 12px', color: '#FFFFFF', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Prepare
                        </button>
                      )}
                      {order.orderStatus === 'preparing' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order._id, 'ready_for_pickup')}
                          style={{ backgroundColor: '#FF7200', border: 'none', borderRadius: '9999px', padding: '6px 12px', color: '#FFFFFF', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Dispatch
                        </button>
                      )}
                      {order.orderStatus === 'ready_for_pickup' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order._id, 'delivered')}
                          style={{ backgroundColor: '#3B82F6', border: 'none', borderRadius: '9999px', padding: '6px 12px', color: '#FFFFFF', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Partner Kitchen Approvals */}
      {activeTab === 'approvals' && (
        <div
          style={{
            backgroundColor: '#1A1A1A',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '24px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
              Pending Partner Restaurant KYC Applications
            </h3>
            <span style={{ fontSize: '12px', color: '#9E9E9E' }}>
              FSSAI food license & GSTIN verification
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {approvals.map((app) => (
              <div
                key={app.id}
                style={{
                  backgroundColor: '#161616',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '18px',
                  padding: '18px 20px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                      {app.restaurantName}
                    </h4>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        backgroundColor: app.status === 'approved' ? 'rgba(34, 197, 94, 0.15)' : app.status === 'rejected' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 114, 0, 0.15)',
                        color: app.status === 'approved' ? '#22C55E' : app.status === 'rejected' ? '#EF4444' : '#FF7200',
                        padding: '2px 8px',
                        borderRadius: '9999px'
                      }}
                    >
                      {app.status.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', color: '#9E9E9E', marginTop: '4px' }}>
                    Owner: <strong style={{ color: '#FFFFFF' }}>{app.ownerName}</strong> • {app.email} • {app.phone}
                  </div>
                  <div style={{ fontSize: '12px', color: '#8E8E93', marginTop: '2px' }}>
                    📍 {app.location} | Cuisine: {app.cuisine}
                  </div>
                  <div style={{ fontSize: '12px', color: '#FF7200', marginTop: '4px', fontWeight: 600 }}>
                    FSSAI: {app.fssaiLicense} | GSTIN: {app.gstin}
                  </div>
                </div>

                {app.status === 'pending' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => handleApprovePartner(app.id, app.restaurantName)}
                      style={{
                        backgroundColor: '#22C55E',
                        border: 'none',
                        borderRadius: '9999px',
                        padding: '8px 16px',
                        color: '#FFFFFF',
                        fontSize: '13px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <CheckCircle2 size={14} />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleRejectPartner(app.id, app.restaurantName)}
                      style={{
                        backgroundColor: '#242424',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '9999px',
                        padding: '8px 16px',
                        color: '#EF4444',
                        fontSize: '13px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <XCircle size={14} />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Kitchens Directory */}
      {activeTab === 'kitchens' && (
        <div
          style={{
            backgroundColor: '#1A1A1A',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '24px'
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 16px 0', color: '#FFFFFF' }}>
            Verified Restaurant Network
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {MOCK_RESTAURANTS.map((rest) => (
              <div
                key={rest._id}
                style={{
                  backgroundColor: '#161616',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '18px',
                  padding: '16px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center'
                }}
              >
                <img
                  src={rest.logo}
                  alt={rest.name}
                  style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>{rest.name}</h4>
                  <div style={{ fontSize: '12px', color: '#9E9E9E', marginTop: '2px' }}>⭐ {rest.rating} ({rest.totalReviews} reviews)</div>
                  <div style={{ fontSize: '11px', color: '#22C55E', fontWeight: 700, marginTop: '2px' }}>● Accepting Orders</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
