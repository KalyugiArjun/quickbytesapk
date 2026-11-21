import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Settings,
  Star,
  Users,
  Store,
  Tag,
  FolderTree,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Badge from './Badge';

const Sidebar = () => {
  const { role, user, restaurant } = useAuth();

  const vendorLinks = [
    { to: '/vendor/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/vendor/orders', label: 'Order Pipeline', icon: ShoppingBag },
    { to: '/vendor/menu', label: 'Menu Catalog', icon: UtensilsCrossed },
    { to: '/vendor/reviews', label: 'Customer Reviews', icon: Star },
    { to: '/vendor/settings', label: 'Kitchen Profile', icon: Settings }
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Platform Metrics', icon: LayoutDashboard },
    { to: '/admin/restaurants', label: 'Restaurants Directory', icon: Store },
    { to: '/admin/orders', label: 'Global Orders', icon: Activity },
    { to: '/admin/users', label: 'Registered Users', icon: Users },
    { to: '/admin/coupons', label: 'Coupons & Deals', icon: Tag },
    { to: '/admin/categories', label: 'Cuisine Categories', icon: FolderTree }
  ];

  const links = role === 'admin' ? adminLinks : vendorLinks;

  return (
    <aside
      style={{
        width: '260px',
        minHeight: 'calc(100vh - 72px)',
        backgroundColor: '#1C1C1C',
        borderRight: '1px solid #333333',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0
      }}
    >
      <div>
        {/* Role Context Header */}
        <div
          style={{
            padding: '12px',
            backgroundColor: '#242424',
            border: '1px solid #333333',
            borderRadius: '10px',
            marginBottom: '24px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: '#A3A3A3', textTransform: 'uppercase', fontWeight: 700 }}>
              Control Center
            </span>
            <Badge variant={role}>{role}</Badge>
          </div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {role === 'vendor' ? (restaurant?.name || 'My Kitchen') : 'Super Admin Workspace'}
          </div>
          <div style={{ fontSize: '12px', color: '#FF7900', marginTop: '2px' }}>
            {role === 'vendor' ? (restaurant?.isOpen ? '🟢 Kitchen Active' : '🔴 Closed') : '🛡️ Full Governance'}
          </div>
        </div>

        {/* Navigation items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  backgroundColor: isActive ? 'rgba(255, 121, 0, 0.15)' : 'transparent',
                  color: isActive ? '#FF7900' : '#A3A3A3',
                  borderLeft: isActive ? '3px solid #FF7900' : '3px solid transparent'
                })}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Quick Brand Footer within sidebar */}
      <div
        style={{
          padding: '12px',
          borderTop: '1px solid #2E2E2E',
          textAlign: 'center'
        }}
      >
        <span style={{ fontSize: '11px', color: '#737373', display: 'block' }}>
          QuickBite Partner Ecosystem
        </span>
        <span style={{ fontSize: '10px', color: '#FF7900', fontWeight: 700 }}>
          Khaao Pio Moj Karo
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;
