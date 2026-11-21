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
  ArrowUpRight
} from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '30px' }}>
        <Skeleton height="80px" borderRadius="12px" style={{ marginBottom: '20px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="120px" borderRadius="12px" />
          ))}
        </div>
      </div>
    );
  }

  const { metrics, recentOrders, platformGrowth } = data || {};

  return (
    <div style={{ padding: '30px', maxWidth: '1200px' }}>
      {/* Title */}
      <div style={{ marginBottom: '26px' }}>
        <span style={{ fontSize: '12px', color: '#F472B6', fontWeight: 700, letterSpacing: '0.06em' }}>
          SUPER ADMIN GOVERNANCE
        </span>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '4px 0 0 0', color: '#FFFFFF' }}>
          Platform Master Overview
        </h1>
        <p style={{ color: '#A3A3A3', fontSize: '14px', margin: '4px 0 0 0' }}>
          Real-time metrics, GMV flow, partner onboarding, and platform-wide commissions.
        </p>
      </div>

      {/* KPI Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
          marginBottom: '30px'
        }}
      >
        {/* GMV */}
        <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#A3A3A3', fontWeight: 600 }}>Gross GMV</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(34, 197, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22C55E' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>
            ₹{metrics?.grossMerchandiseValue?.toFixed(2) || '0.00'}
          </div>
          <span style={{ fontSize: '11px', color: '#22C55E', fontWeight: 600 }}>Total processed volume</span>
        </div>

        {/* Commission */}
        <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#A3A3A3', fontWeight: 600 }}>Commission Revenue</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(255, 121, 0, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF7900' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#FF7900' }}>
            ₹{metrics?.platformCommissionEarned?.toFixed(2) || '0.00'}
          </div>
          <span style={{ fontSize: '11px', color: '#A3A3A3' }}>Avg 10% platform take rate</span>
        </div>

        {/* Restaurants */}
        <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#A3A3A3', fontWeight: 600 }}>Partner Kitchens</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
              <Store size={18} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>
            {metrics?.totalVendors || 0}
          </div>
          <Link to="/admin/restaurants" style={{ fontSize: '11px', color: '#3B82F6', fontWeight: 600 }}>
            Manage Approvals →
          </Link>
        </div>

        {/* Users */}
        <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#A3A3A3', fontWeight: 600 }}>Foodie Customers</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EC4899' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>
            {metrics?.totalUsers || 0}
          </div>
          <Link to="/admin/users" style={{ fontSize: '11px', color: '#EC4899', fontWeight: 600 }}>
            Inspect Directory →
          </Link>
        </div>
      </div>

      {/* Recent Global Orders */}
      <div
        style={{
          backgroundColor: '#1C1C1C',
          border: '1px solid #333333',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '30px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={20} color="#FF7900" />
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
              Live Platform Orders Activity
            </h3>
          </div>
          <Link to="/admin/orders" style={{ fontSize: '13px', color: '#FF7900', fontWeight: 600 }}>
            View All Global Orders →
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recentOrders?.map((order) => (
            <div
              key={order._id}
              style={{
                backgroundColor: '#242424',
                border: '1px solid #333333',
                borderRadius: '10px',
                padding: '14px 20px',
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
                  <span style={{ fontSize: '12px', color: '#A3A3A3' }}>
                    Restaurant: <strong style={{ color: '#FFFFFF' }}>{order.restaurantId?.name}</strong>
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#A3A3A3' }}>
                  Customer: {order.customerId?.name} ({order.customerId?.email})
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#FF7900' }}>
                  ₹{order.totalAmount.toFixed(2)}
                </div>
                <div style={{ fontSize: '11px', color: '#737373', textTransform: 'uppercase' }}>
                  {order.paymentMethod} • {order.paymentStatus}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
