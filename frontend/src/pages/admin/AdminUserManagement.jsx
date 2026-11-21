import React, { useState, useEffect } from 'react';
import { Users, Shield, UserX, UserCheck } from 'lucide-react';
import api from '../../services/api';
import Badge from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { useToast } from '../../context/ToastContext';

const AdminUserManagement = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([
    {
      _id: '1',
      name: 'Aarav Sharma',
      email: 'customer@quickbite.com',
      role: 'customer',
      status: 'active',
      phone: '+91 98765 43210',
      walletBalance: 850
    },
    {
      _id: '2',
      name: 'Chef Vikram Malhotra',
      email: 'vendor1@quickbite.com',
      role: 'vendor',
      status: 'active',
      phone: '+91 98200 44556',
      walletBalance: 0
    },
    {
      _id: '3',
      name: 'Chef Maria D\'Souza',
      email: 'vendor2@quickbite.com',
      role: 'vendor',
      status: 'active',
      phone: '+91 98200 77889',
      walletBalance: 0
    },
    {
      _id: '4',
      name: 'Chef Ramesh Patel',
      email: 'vendor3@quickbite.com',
      role: 'vendor',
      status: 'active',
      phone: '+91 98200 99001',
      walletBalance: 0
    },
    {
      _id: '5',
      name: 'Super Admin QuickBite',
      email: 'admin@quickbite.com',
      role: 'admin',
      status: 'active',
      phone: '+91 99000 11223',
      walletBalance: 1500
    }
  ]);
  const [loading, setLoading] = useState(false);

  const toggleUserStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u._id === userId) {
          const newStatus = u.status === 'active' ? 'blocked' : 'active';
          showToast(`User status changed to ${newStatus}`, newStatus === 'active' ? 'success' : 'warning');
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1100px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0' }}>
          Registered Platform Accounts
        </h1>
        <p style={{ color: '#A3A3A3', fontSize: '14px', margin: 0 }}>
          Manage user permissions, review customer roles, and suspend malicious accounts.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {users.map((u) => (
          <div
            key={u._id}
            style={{
              backgroundColor: '#1C1C1C',
              border: '1px solid #333333',
              borderRadius: '12px',
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
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>{u.name}</span>
                <Badge variant={u.role}>{u.role}</Badge>
                <Badge variant={u.status === 'active' ? 'success' : 'danger'}>{u.status}</Badge>
              </div>
              <div style={{ fontSize: '13px', color: '#A3A3A3' }}>
                {u.email} • {u.phone} • Wallet: ₹{u.walletBalance.toFixed(2)}
              </div>
            </div>

            {u.role !== 'admin' && (
              <button
                onClick={() => toggleUserStatus(u._id)}
                style={{
                  backgroundColor: u.status === 'active' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                  color: u.status === 'active' ? '#EF4444' : '#22C55E',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {u.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUserManagement;
