import React from 'react';
import { Plus, Minus, Star, Flame } from 'lucide-react';
import { DietaryBadge } from './Badge';
import { useCart } from '../../context/CartContext';

const FoodCard = ({ item, restaurant }) => {
  const { items, addToCart, updateQuantity } = useCart();
  const cartItem = items.find((i) => i._id === item._id);

  const price = item.price;
  const discountPrice = item.discountPrice;
  const hasDiscount = discountPrice && discountPrice < price;

  return (
    <div
      style={{
        backgroundColor: '#242424',
        border: '1px solid #333333',
        borderRadius: '12px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.25s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#FF7900';
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 121, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#333333';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
      }}
    >
      {/* Top Image Banner */}
      <div style={{ position: 'relative', width: '100%', height: '180px', overflow: 'hidden' }}>
        <img
          src={item.image}
          alt={item.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Dietary veg/non-veg badge */}
        <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
          <DietaryBadge isVeg={item.isVeg} />
        </div>

        {/* Bestseller Badge */}
        {item.isBestseller && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: '#FF7900',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
            }}
          >
            <Flame size={12} /> BESTSELLER
          </div>
        )}

        {/* Preparation time badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            backgroundColor: 'rgba(17, 17, 17, 0.85)',
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '4px',
            backdropFilter: 'blur(4px)'
          }}
        >
          {item.preparationTime || 20} mins
        </div>
      </div>

      {/* Details Section */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 6px 0' }}>
              {item.name}
            </h4>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                color: '#4ADE80',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 700
              }}
            >
              <Star size={11} fill="#4ADE80" /> {item.rating || 4.8}
            </div>
          </div>

          <p
            style={{
              fontSize: '13px',
              color: '#A3A3A3',
              margin: '0 0 14px 0',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {item.description}
          </p>
        </div>

        {/* Price & Add to Cart Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#FF7900' }}>
                ₹{hasDiscount ? discountPrice : price}
              </span>
              {hasDiscount && (
                <span style={{ fontSize: '13px', color: '#737373', textDecoration: 'line-through' }}>
                  ₹{price}
                </span>
              )}
            </div>
          </div>

          {/* Add to cart / Quantity buttons */}
          {cartItem ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#1C1C1C',
                border: '1px solid #FF7900',
                borderRadius: '8px',
                padding: '4px 8px'
              }}
            >
              <button
                onClick={() => updateQuantity(item._id, cartItem.quantity - 1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FF7900',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Minus size={14} />
              </button>
              <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '14px', minWidth: '16px', textAlign: 'center' }}>
                {cartItem.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item._id, cartItem.quantity + 1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FF7900',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(item, restaurant)}
              style={{
                backgroundColor: '#2E2E2E',
                color: '#FF7900',
                border: '1px solid #333333',
                borderRadius: '8px',
                padding: '6px 16px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FF7900';
                e.currentTarget.style.color = '#FFFFFF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#2E2E2E';
                e.currentTarget.style.color = '#FF7900';
              }}
            >
              <Plus size={14} /> ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
