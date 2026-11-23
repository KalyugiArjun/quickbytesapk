import React from 'react';
import { Star, Heart, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const FoodCard = ({ item, restaurant, onSelectDish }) => {
  const { items, addToCart, updateQuantity } = useCart();
  const { isDishInWishlist, toggleWishlistDish } = useWishlist();

  if (!item) return null;

  const cartItem = items.find((i) => i._id === item._id);
  const isFavorited = isDishInWishlist(item._id);

  const price = item.discountPrice || item.price;
  const formattedPrice = `₹${typeof price === 'number' ? price.toFixed(0) : price}`;

  const handleCardClick = (e) => {
    // If clicked on wishlist or cart buttons, do not open detail modal
    if (e.target.closest('button')) return;
    if (onSelectDish) {
      onSelectDish(item, restaurant);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(item, restaurant || { _id: item.restaurantId, name: item.restaurantName || 'QuickBite Kitchen' });
  };

  const handleUpdateQty = (e, delta) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem._id, cartItem.quantity + delta);
    }
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlistDish(item);
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        backgroundColor: '#1E1E1E',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        borderRadius: '22px',
        padding: '12px 12px 16px 12px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, box-shadow 0.2s ease',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.35)',
        position: 'relative',
        userSelect: 'none'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 114, 0, 0.4)';
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 114, 0, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.35)';
      }}
    >
      {/* Top Image Container with Dish Presentation */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '148px',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#161616',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '12px'
        }}
      >
        <img
          src={item.image}
          alt={item.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'transform 0.4s ease'
          }}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80';
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Circular Wishlist Button */}
        <button
          onClick={handleWishlist}
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: 'rgba(15, 15, 15, 0.7)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isFavorited ? '#EF4444' : '#FFFFFF',
            cursor: 'pointer',
            transition: 'transform 0.15s ease'
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.9)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          aria-label="Wishlist"
        >
          <Heart size={16} fill={isFavorited ? '#EF4444' : 'none'} color={isFavorited ? '#EF4444' : '#FFFFFF'} />
        </button>
      </div>

      {/* Content Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, justifyContent: 'space-between' }}>
        <div>
          {/* Dish Name */}
          <h4
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: '#FFFFFF',
              margin: '0 0 6px 0',
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {item.name}
          </h4>

          {/* Rating and Price Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#9E9E9E' }}>
              <Star size={13} fill="#FF7200" color="#FF7200" />
              <span style={{ fontWeight: 600, color: '#E0E0E0' }}>{item.rating || 4.9}</span>
              <span style={{ fontSize: '11px', color: '#737373' }}>Ratings</span>
            </div>

            <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>
              {formattedPrice}
            </div>
          </div>
        </div>

        {/* Add to Cart CTA / Quantity Pill */}
        <div style={{ marginTop: '8px' }}>
          {cartItem ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#262626',
                border: '1px solid #FF7200',
                borderRadius: '9999px',
                padding: '4px 8px',
                height: '38px'
              }}
            >
              <button
                onClick={(e) => handleUpdateQty(e, -1)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#1E1E1E',
                  border: 'none',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Minus size={14} />
              </button>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                {cartItem.quantity < 10 ? `0${cartItem.quantity}` : cartItem.quantity}
              </span>
              <button
                onClick={(e) => handleUpdateQty(e, 1)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#FF7200',
                  border: 'none',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              style={{
                width: '100%',
                height: '38px',
                backgroundColor: '#FF7200',
                backgroundImage: 'linear-gradient(135deg, #FF7200 0%, #FF5500 100%)',
                border: 'none',
                borderRadius: '9999px',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                boxShadow: '0 4px 14px rgba(255, 114, 0, 0.35)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(255, 114, 0, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(255, 114, 0, 0.35)';
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            >
              <ShoppingBag size={15} color="#FFFFFF" />
              <span>Add To Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
