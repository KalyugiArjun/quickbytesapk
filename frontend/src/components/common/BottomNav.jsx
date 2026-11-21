import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, ShoppingBag, Heart, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const BottomNav = () => {
  const { itemCount, setIsCartOpen } = useCart();

  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: '#1C1C1C',
        borderTop: '1px solid #333333',
        zIndex: 5000,
        display: 'none', // Shown on small devices via CSS query
        justifyContent: 'space-around',
        alignItems: 'center',
        boxShadow: '0 -4px 15px rgba(0, 0, 0, 0.6)'
      }}
    >
      <NavLink
        to="/"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isActive ? '#FF7900' : '#A3A3A3',
          fontSize: '11px',
          fontWeight: 600,
          textDecoration: 'none'
        })}
      >
        <Home size={20} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/search"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isActive ? '#FF7900' : '#A3A3A3',
          fontSize: '11px',
          fontWeight: 600,
          textDecoration: 'none'
        })}
      >
        <Compass size={20} />
        <span>Explore</span>
      </NavLink>

      {/* Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: '#A3A3A3',
          fontSize: '11px',
          fontWeight: 600,
          cursor: 'pointer',
          position: 'relative'
        }}
      >
        <div style={{ position: 'relative' }}>
          <ShoppingBag size={20} color="#FF7900" />
          {itemCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-6px',
                right: '-8px',
                backgroundColor: '#FF5A00',
                color: '#FFF',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '10px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {itemCount}
            </span>
          )}
        </div>
        <span>Cart</span>
      </button>

      <NavLink
        to="/wishlist"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isActive ? '#FF7900' : '#A3A3A3',
          fontSize: '11px',
          fontWeight: 600,
          textDecoration: 'none'
        })}
      >
        <Heart size={20} />
        <span>Wishlist</span>
      </NavLink>

      <NavLink
        to="/profile"
        style={({ isActive }) => ({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: isActive ? '#FF7900' : '#A3A3A3',
          fontSize: '11px',
          fontWeight: 600,
          textDecoration: 'none'
        })}
      >
        <User size={20} />
        <span>Account</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
