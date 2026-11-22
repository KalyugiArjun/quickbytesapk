import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, Heart, Bell, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const BottomNav = () => {
  const { itemCount, setIsCartOpen } = useCart();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const isWishlist = location.pathname === '/wishlist';
  const isProfile = location.pathname === '/profile';

  return (
    <div
      className="floating-bottom-dock"
      style={{
        position: 'fixed',
        bottom: '22px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(28, 28, 28, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '9999px',
        padding: '6px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        zIndex: 9000,
        boxShadow: '0 16px 45px rgba(0, 0, 0, 0.85), 0 0 25px rgba(255, 114, 0, 0.12)'
      }}
    >
      {/* 1. Home - Active Circle */}
      <NavLink
        to="/"
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          backgroundColor: isHome ? '#FF7200' : 'transparent',
          backgroundImage: isHome ? 'linear-gradient(135deg, #FF7200 0%, #FF5500 100%)' : 'none',
          color: isHome ? '#FFFFFF' : '#8E8E93',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          boxShadow: isHome ? '0 4px 16px rgba(255, 114, 0, 0.45)' : 'none',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        aria-label="Home"
      >
        <Home size={20} color={isHome ? '#FFFFFF' : '#9E9E9E'} />
      </NavLink>

      {/* 2. Cart / Shopping Bag Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'transparent',
          border: 'none',
          color: '#9E9E9E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          transition: 'color 0.2s ease'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#9E9E9E')}
        aria-label="Shopping Cart"
      >
        <ShoppingBag size={20} />
        {itemCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '2px',
              backgroundColor: '#FF7200',
              color: '#FFFFFF',
              borderRadius: '9999px',
              minWidth: '16px',
              height: '16px',
              fontSize: '10px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.6)'
            }}
          >
            {itemCount}
          </span>
        )}
      </button>

      {/* 3. Wishlist / Heart */}
      <NavLink
        to="/wishlist"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: isWishlist ? '#FF7200' : 'transparent',
          backgroundImage: isWishlist ? 'linear-gradient(135deg, #FF7200 0%, #FF5500 100%)' : 'none',
          color: isWishlist ? '#FFFFFF' : '#9E9E9E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          boxShadow: isWishlist ? '0 4px 16px rgba(255, 114, 0, 0.45)' : 'none',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        aria-label="Wishlist"
      >
        <Heart size={20} />
      </NavLink>

      {/* 4. Notifications / Bell */}
      <button
        onClick={() => {
          if (isAuthenticated) {
            navigate('/orders');
          } else {
            navigate('/login');
          }
        }}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: 'transparent',
          border: 'none',
          color: '#9E9E9E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'color 0.2s ease'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#9E9E9E')}
        aria-label="Orders & Notifications"
      >
        <Bell size={20} />
      </button>

      {/* 5. User / Profile */}
      <NavLink
        to="/profile"
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: isProfile ? '#FF7200' : 'transparent',
          backgroundImage: isProfile ? 'linear-gradient(135deg, #FF7200 0%, #FF5500 100%)' : 'none',
          color: isProfile ? '#FFFFFF' : '#9E9E9E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textDecoration: 'none',
          boxShadow: isProfile ? '0 4px 16px rgba(255, 114, 0, 0.45)' : 'none',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        aria-label="Profile"
      >
        <User size={20} />
      </NavLink>
    </div>
  );
};

export default BottomNav;
