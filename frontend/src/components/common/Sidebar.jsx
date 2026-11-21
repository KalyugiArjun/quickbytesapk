import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Store,
  CheckSquare,
  UtensilsCrossed,
  FolderTree,
  Activity,
  CreditCard,
  DollarSign,
  Tag,
  Percent,
  Star,
  AlertCircle,
  Bell,
  FileText,
  BarChart3,
  Shield,
  Key,
  Settings,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Badge from './Badge';

const Sidebar = () => {
  const { role, user, restaurant, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // 22 Specified Admin Sidebar items
  const adminLinks = [
    { to: '/admin/dashboard', label: '1. Overview', icon: LayoutDashboard },
    { to: '/admin/users', label: '2. Customers', icon: Users },
    { to: '/admin/restaurants', label: '3. Vendors', icon: Store },
    { to: '/admin/vendor-approvals', label: '4. Vendor Approvals', icon: CheckSquare },
    { to: '/admin/restaurants', label: '5. Restaurants', icon: Store },
    { to: '/admin/food-management', label: '6. Food Management', icon: UtensilsCrossed },
    { to: '/admin/categories', label: '7. Food Categories', icon: FolderTree },
    { to: '/admin/orders', label: '8. All Orders', icon: Activity },
    { to: '/admin/payments', label: '9. Payments', icon: CreditCard },
    { to: '/admin/payments', label: '10. Transactions', icon: DollarSign },
    { to: '/admin/coupons', label: '11. Coupons', icon: Tag },
    { to: '/admin/coupons', label: '12. Offers', icon: Percent },
    { to: '/admin/reviews-complaints', label: '13. Reviews', icon: Star },
    { to: '/admin/reviews-complaints', label: '14. Complaints', icon: AlertCircle },
    { to: '/admin/dashboard', label: '15. Notifications', icon: Bell },
    { to: '/admin/reports', label: '16. Reports', icon: FileText },
    { to: '/admin/reports', label: '17. Analytics', icon: BarChart3 },
    { to: '/admin/permissions', label: '18. Admin Management', icon: Shield },
    { to: '/admin/permissions', label: '19. Roles & Permissions', icon: Key },
    { to: '/admin/settings', label: '20. Settings', icon: Settings },
    { to: '/profile', label: '21. Profile', icon: User }
  ];

  // Vendor Portal Links
  const vendorLinks = [
    { to: '/vendor/dashboard', label: 'Kitchen Overview', icon: LayoutDashboard },
    { to: '/vendor/orders', label: 'Order Pipeline', icon: Activity },
    { to: '/vendor/menu', label: 'Menu Catalog', icon: UtensilsCrossed },
    { to: '/vendor/earnings', label: 'Earnings & Payouts', icon: DollarSign },
    { to: '/vendor/reviews', label: 'Customer Reviews', icon: Star },
    { to: '/vendor/settings', label: 'Kitchen Profile', icon: Settings }
  ];

  const links = role === 'admin' ? adminLinks : vendorLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Drawer Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="sidebar-mobile-toggle"
        style={{
          position: 'fixed',
          top: '80px',
          left: '12px',
          zIndex: 9999,
          backgroundColor: '#FF7900',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '8px',
          padding: '8px',
          cursor: 'pointer',
          display: 'none', // Controlled by media query
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Container */}
      <aside
        className={`dashboard-sidebar ${mobileOpen ? 'open' : ''}`}
        style={{
          width: '260px',
          height: 'calc(100vh - 72px)',
          backgroundColor: '#1C1C1C',
          borderRight: '1px solid #333333',
          padding: '20px 14px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0,
          overflowY: 'auto'
        }}
      >
        <div>
          {/* Header pill */}
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#242424',
              border: '1px solid #333333',
              borderRadius: '10px',
              marginBottom: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', color: '#A3A3A3', fontWeight: 700, textTransform: 'uppercase' }}>
                CONSOLE
              </span>
              <Badge variant={role}>{role}</Badge>
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {role === 'vendor' ? (restaurant?.name || 'My Kitchen') : 'QuickBite Super Admin'}
            </div>
          </div>

          {/* Links list */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {links.map((link, idx) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={idx}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    backgroundColor: isActive ? 'rgba(255, 121, 0, 0.15)' : 'transparent',
                    color: isActive ? '#FF7900' : '#A3A3A3',
                    borderLeft: isActive ? '3px solid #FF7900' : '3px solid transparent'
                  })}
                >
                  <Icon size={16} />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Logout item */}
        <div style={{ borderTop: '1px solid #2E2E2E', paddingTop: '12px', marginTop: '16px' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#EF4444',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <LogOut size={16} />
            <span>22. Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
