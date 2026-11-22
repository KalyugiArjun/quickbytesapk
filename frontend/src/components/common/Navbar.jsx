import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Flame,
  ShoppingBag,
  Bell,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Utensils,
  ShieldCheck,
  Search,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import Badge from './Badge';

const Navbar = () => {
  const { user, role, logout, demoLogin, isAuthenticated } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications if logged in
  useEffect(() => {
    if (isAuthenticated) {
      api.get('/notifications')
        .then((res) => {
          if (res.data.success) {
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.unreadCount);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isHome = location.pathname === '/';

  return (
    <header
      className={`quickbite-navbar ${isHome ? 'hide-on-mobile-home' : ''}`}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(15, 15, 15, 0.94)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        height: '66px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          width: '100%'
        }}
      >
        {/* Brand Logo & Tagline */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none'
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF7200 0%, #FF5500 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(255, 114, 0, 0.35)'
            }}
          >
            <Flame size={22} color="#FFFFFF" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '20px',
                fontWeight: 900,
                letterSpacing: '-0.4px',
                lineHeight: 1.1,
                color: '#FFFFFF'
              }}
            >
              Quick<span style={{ color: '#FF7200' }}>Bite</span>
            </span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                color: '#FF7200',
                letterSpacing: '0.06em',
                textTransform: 'uppercase'
              }}
            >
              Khaao Pio Moj Karo
            </span>
          </div>
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            flex: 1,
            maxWidth: '420px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Search
            size={17}
            color="#7E7E7E"
            style={{ position: 'absolute', left: '16px', pointerEvents: 'none' }}
          />
          <input
            type="text"
            placeholder="Search foods, pizzas, biryanis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#1E1E1E',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '9999px',
              padding: '9px 16px 9px 44px',
              color: '#FFFFFF',
              fontSize: '13px',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => (e.target.style.borderColor = '#FF7200')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)')}
          />
        </form>

        {/* Navigation & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Explore Link */}
          <Link
            to="/restaurants"
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: location.pathname === '/restaurants' ? '#FF7900' : '#A3A3A3',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = location.pathname === '/restaurants' ? '#FF7900' : '#A3A3A3')
            }
          >
            <Utensils size={16} /> Explore
          </Link>

          {/* Role-Specific Direct Shortcut */}
          {role === 'vendor' && (
            <Link
              to="/vendor/dashboard"
              style={{
                backgroundColor: 'rgba(255, 121, 0, 0.15)',
                color: '#FF7900',
                border: '1px solid #FF7900',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LayoutDashboard size={15} /> Vendor Portal
            </Link>
          )}

          {role === 'admin' && (
            <Link
              to="/admin/dashboard"
              style={{
                backgroundColor: 'rgba(236, 72, 153, 0.15)',
                color: '#F472B6',
                border: '1px solid #EC4899',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ShieldCheck size={15} /> Admin Portal
            </Link>
          )}

          {/* Cart Trigger Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            style={{
              position: 'relative',
              backgroundColor: '#1C1C1C',
              border: '1px solid #333333',
              borderRadius: '10px',
              color: '#FFFFFF',
              padding: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#FF7900';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#333333';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <ShoppingBag size={20} color="#FF7900" />
            {itemCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: '#FF5A00',
                  color: '#FFFFFF',
                  borderRadius: '9999px',
                  width: '20px',
                  height: '20px',
                  fontSize: '11px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
                }}
              >
                {itemCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              style={{
                position: 'relative',
                backgroundColor: '#1C1C1C',
                border: '1px solid #333333',
                borderRadius: '10px',
                color: '#FFFFFF',
                padding: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bell size={20} color="#A3A3A3" />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#FF7900'
                  }}
                />
              )}
            </button>

            {notificationsOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  width: '320px',
                  backgroundColor: '#1C1C1C',
                  border: '1px solid #333333',
                  borderRadius: '12px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.7)',
                  padding: '12px',
                  zIndex: 2000
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', color: '#FFFFFF' }}>Notifications</h4>
                  {unreadCount > 0 && <span style={{ fontSize: '11px', color: '#FF7900' }}>{unreadCount} new</span>}
                </div>
                {notifications.length === 0 ? (
                  <p style={{ fontSize: '13px', color: '#737373', textAlign: 'center', margin: '20px 0' }}>
                    No notifications yet.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '260px', overflowY: 'auto' }}>
                    {notifications.map((n) => (
                      <div
                        key={n._id}
                        style={{
                          backgroundColor: '#242424',
                          padding: '10px',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      >
                        <div style={{ fontWeight: 600, color: '#FFFFFF', marginBottom: '2px' }}>{n.title}</div>
                        <div style={{ color: '#A3A3A3' }}>{n.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile & Demo Switcher Dropdown */}
          <div style={{ position: 'relative' }} ref={profileRef}>
            {isAuthenticated ? (
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{
                  backgroundColor: '#1C1C1C',
                  border: '1px solid #333333',
                  borderRadius: '10px',
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: '#FFFFFF'
                }}
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt="Avatar"
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{user?.name?.split(' ')[0]}</span>
                <Badge variant={role}>{role}</Badge>
                <ChevronDown size={14} color="#A3A3A3" />
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link
                  to="/login"
                  style={{
                    backgroundColor: 'transparent',
                    color: '#FFFFFF',
                    border: '1px solid #333333',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 600
                  }}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  style={{
                    background: 'linear-gradient(135deg, #FF7900 0%, #FF5A00 100%)',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: 600
                  }}
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Profile Dropdown Menu */}
            {profileOpen && isAuthenticated && (
              <div
                style={{
                  position: 'absolute',
                  top: '50px',
                  right: 0,
                  width: '260px',
                  backgroundColor: '#1C1C1C',
                  border: '1px solid #333333',
                  borderRadius: '12px',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.7)',
                  padding: '12px',
                  zIndex: 2000,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                <div style={{ padding: '8px', borderBottom: '1px solid #333333', marginBottom: '6px' }}>
                  <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '14px' }}>{user.name}</div>
                  <div style={{ color: '#A3A3A3', fontSize: '12px' }}>{user.email}</div>
                  <div style={{ marginTop: '6px', fontSize: '12px', color: '#FF7900', fontWeight: 600 }}>
                    Wallet Balance: ₹{user.walletBalance?.toFixed(2) || '0.00'}
                  </div>
                </div>

                {role === 'customer' && (
                  <>
                    <Link
                      to="/orders"
                      onClick={() => setProfileOpen(false)}
                      style={{ padding: '8px', color: '#FFFFFF', fontSize: '13px', borderRadius: '6px' }}
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      style={{ padding: '8px', color: '#FFFFFF', fontSize: '13px', borderRadius: '6px' }}
                    >
                      Account & Addresses
                    </Link>
                  </>
                )}

                {role === 'vendor' && (
                  <>
                    <Link
                      to="/vendor/dashboard"
                      onClick={() => setProfileOpen(false)}
                      style={{ padding: '8px', color: '#FFFFFF', fontSize: '13px', borderRadius: '6px' }}
                    >
                      Vendor Dashboard
                    </Link>
                    <Link
                      to="/vendor/orders"
                      onClick={() => setProfileOpen(false)}
                      style={{ padding: '8px', color: '#FFFFFF', fontSize: '13px', borderRadius: '6px' }}
                    >
                      Manage Orders
                    </Link>
                    <Link
                      to="/vendor/menu"
                      onClick={() => setProfileOpen(false)}
                      style={{ padding: '8px', color: '#FFFFFF', fontSize: '13px', borderRadius: '6px' }}
                    >
                      Manage Menu
                    </Link>
                    <Link
                      to="/vendor/settings"
                      onClick={() => setProfileOpen(false)}
                      style={{ padding: '8px', color: '#FFFFFF', fontSize: '13px', borderRadius: '6px' }}
                    >
                      Restaurant Profile
                    </Link>
                  </>
                )}

                {role === 'admin' && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setProfileOpen(false)}
                      style={{ padding: '8px', color: '#FFFFFF', fontSize: '13px', borderRadius: '6px' }}
                    >
                      Platform Analytics
                    </Link>
                    <Link
                      to="/admin/restaurants"
                      onClick={() => setProfileOpen(false)}
                      style={{ padding: '8px', color: '#FFFFFF', fontSize: '13px', borderRadius: '6px' }}
                    >
                      Restaurants Approval
                    </Link>
                    <Link
                      to="/admin/orders"
                      onClick={() => setProfileOpen(false)}
                      style={{ padding: '8px', color: '#FFFFFF', fontSize: '13px', borderRadius: '6px' }}
                    >
                      Global Orders
                    </Link>
                    <Link
                      to="/admin/coupons"
                      onClick={() => setProfileOpen(false)}
                      style={{ padding: '8px', color: '#FFFFFF', fontSize: '13px', borderRadius: '6px' }}
                    >
                      Coupons & Deals
                    </Link>
                  </>
                )}

                {/* Quick Demo Switcher Section */}
                <div style={{ borderTop: '1px solid #333333', marginTop: '6px', paddingTop: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#A3A3A3', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={12} color="#FF7900" /> QUICK SWITCH DEMO ROLE:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                    <button
                      onClick={() => { demoLogin('customer'); setProfileOpen(false); navigate('/restaurants'); }}
                      style={{ background: '#242424', border: '1px solid #333333', borderRadius: '4px', color: '#C084FC', fontSize: '10px', padding: '4px', cursor: 'pointer' }}
                    >
                      Customer
                    </button>
                    <button
                      onClick={() => { demoLogin('vendor'); setProfileOpen(false); navigate('/vendor/dashboard'); }}
                      style={{ background: '#242424', border: '1px solid #333333', borderRadius: '4px', color: '#FF7900', fontSize: '10px', padding: '4px', cursor: 'pointer' }}
                    >
                      Vendor
                    </button>
                    <button
                      onClick={() => { demoLogin('admin'); setProfileOpen(false); navigate('/admin/dashboard'); }}
                      style={{ background: '#242424', border: '1px solid #333333', borderRadius: '4px', color: '#F472B6', fontSize: '10px', padding: '4px', cursor: 'pointer' }}
                    >
                      Admin
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => { logout(); setProfileOpen(false); }}
                  style={{
                    marginTop: '8px',
                    background: 'transparent',
                    border: 'none',
                    color: '#EF4444',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    padding: '8px'
                  }}
                >
                  <LogOut size={14} /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
