import React, { useState, useEffect } from 'react';
import { Store, Check, X, Shield, Star, DollarSign } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { useToast } from '../../context/ToastContext';

const AdminRestaurantManagement = () => {
  const { showToast } = useToast();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async () => {
    try {
      const res = await api.get('/restaurants/admin/all');
      if (res.data.success) {
        setRestaurants(res.data.restaurants);
      }
    } catch (err) {
      console.error('Failed to load restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleUpdateStatus = async (restaurantId, updates) => {
    try {
      const res = await api.put(`/restaurants/admin/${restaurantId}/status`, updates);
      if (res.data.success) {
        showToast('Restaurant updated!', 'success');
        fetchRestaurants();
      }
    } catch (err) {
      showToast('Failed to update restaurant', 'error');
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0' }}>
          Restaurant Partner Verification & Commission
        </h1>
        <p style={{ color: '#A3A3A3', fontSize: '14px', margin: 0 }}>
          Review partner applications, configure platform commission cuts, and toggle listing approvals.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height="120px" borderRadius="12px" />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {restaurants.map((rest) => (
            <div
              key={rest._id}
              style={{
                backgroundColor: '#1C1C1C',
                border: '1px solid #333333',
                borderRadius: '14px',
                padding: '20px 24px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img
                  src={rest.logo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=100&q=80'}
                  alt={rest.name}
                  style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                      {rest.name}
                    </h3>
                    <Badge variant={rest.isApproved ? 'success' : 'warning'}>
                      {rest.isApproved ? 'Approved' : 'Pending Approval'}
                    </Badge>
                  </div>
                  <div style={{ fontSize: '13px', color: '#A3A3A3', marginBottom: '4px' }}>
                    Owner: {rest.ownerId?.name || 'Partner'} • {rest.ownerId?.email} • {rest.phone}
                  </div>
                  <div style={{ fontSize: '12px', color: '#737373' }}>
                    {rest.cuisineType?.join(', ')} • Rating: ⭐ {rest.rating || 4.5}
                  </div>
                </div>
              </div>

              {/* Commission & Approval Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <label style={{ fontSize: '12px', color: '#A3A3A3' }}>Commission %:</label>
                  <input
                    type="number"
                    defaultValue={rest.commissionRate || 10}
                    onBlur={(e) => handleUpdateStatus(rest._id, { commissionRate: Number(e.target.value) })}
                    style={{
                      width: '60px',
                      backgroundColor: '#242424',
                      border: '1px solid #333333',
                      borderRadius: '6px',
                      padding: '6px',
                      color: '#FF7900',
                      fontWeight: 700,
                      textAlign: 'center'
                    }}
                  />
                </div>

                <Button
                  variant={rest.isApproved ? 'secondary' : 'success'}
                  size="sm"
                  onClick={() => handleUpdateStatus(rest._id, { isApproved: !rest.isApproved })}
                >
                  {rest.isApproved ? 'Suspend Listing' : 'Approve Partner'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRestaurantManagement;
