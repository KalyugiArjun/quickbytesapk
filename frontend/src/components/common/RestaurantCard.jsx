import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, Bike, Leaf } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/restaurant/${restaurant._id}`)}
      style={{
        backgroundColor: '#242424',
        border: '1px solid #333333',
        borderRadius: '14px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#FF7900';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 10px 28px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 121, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#333333';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
      }}
    >
      {/* Banner */}
      <div style={{ position: 'relative', width: '100%', height: '170px' }}>
        <img
          src={restaurant.bannerImage}
          alt={restaurant.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Rating Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            backgroundColor: 'rgba(17, 17, 17, 0.85)',
            backdropFilter: 'blur(4px)',
            color: '#4ADE80',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Star size={14} fill="#4ADE80" /> {restaurant.rating || 4.5}
        </div>

        {/* Pure Veg Pill */}
        {restaurant.isPureVeg && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              backgroundColor: '#22C55E',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Leaf size={12} /> PURE VEG
          </div>
        )}
      </div>

      {/* Body Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img
            src={restaurant.logo}
            alt={restaurant.name}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              objectFit: 'cover',
              border: '1px solid #333333'
            }}
          />
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              {restaurant.name}
            </h3>
            <p style={{ fontSize: '12px', color: '#FF7900', margin: '2px 0 0 0', fontWeight: 500 }}>
              {restaurant.cuisineType ? restaurant.cuisineType.join(' • ') : 'Multi-Cuisine'}
            </p>
          </div>
        </div>

        <p
          style={{
            fontSize: '13px',
            color: '#A3A3A3',
            margin: '4px 0',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {restaurant.tagline || restaurant.description}
        </p>

        {/* Delivery Info Footer */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '10px',
            borderTop: '1px solid #2E2E2E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#A3A3A3'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} color="#FF7900" />
            <span>{restaurant.deliveryTimeMinutes || 30} mins</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Bike size={13} color="#22C55E" />
            <span>{restaurant.deliveryFee === 0 ? 'FREE Delivery' : `₹${restaurant.deliveryFee} Delivery`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
