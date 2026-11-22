import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, Bike, Leaf } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/restaurant/${restaurant._id}`)}
      style={{
        backgroundColor: '#1E1E1E',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '22px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, box-shadow 0.2s ease',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 114, 0, 0.4)';
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 114, 0, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
      }}
    >
      {/* Cover Banner */}
      <div style={{ position: 'relative', width: '100%', height: '160px', overflow: 'hidden' }}>
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
            backgroundColor: 'rgba(15, 15, 15, 0.85)',
            backdropFilter: 'blur(8px)',
            color: '#FFFFFF',
            padding: '4px 10px',
            borderRadius: '9999px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '12px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Star size={13} fill="#FF7200" color="#FF7200" /> {restaurant.rating || 4.8}
        </div>

        {/* Pure Veg Pill */}
        {restaurant.isPureVeg && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              backgroundColor: 'rgba(34, 197, 94, 0.9)',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Leaf size={11} /> PURE VEG
          </div>
        )}
      </div>

      {/* Body Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={restaurant.logo}
            alt={restaurant.name}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              objectFit: 'cover',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#FFFFFF',
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {restaurant.name}
            </h3>
            <p
              style={{
                fontSize: '12px',
                color: '#9E9E9E',
                margin: '2px 0 0 0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {restaurant.cuisineType?.join(', ')}
            </p>
          </div>
        </div>

        {/* Distance & Delivery Meta */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#8E8E93',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '10px',
            marginTop: 'auto'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} color="#FF7200" />
            <span>{restaurant.deliveryTimeMinutes || 25} mins</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Bike size={13} color="#FF7200" />
            <span>{restaurant.distanceKm || 2.1} km away</span>
          </div>

          <div style={{ color: '#E0E0E0', fontWeight: 600 }}>
            ₹{restaurant.minOrderValue || 199} min
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
