import React, { useState } from 'react';
import { Star, Clock, Flame, ChevronLeft, ChevronRight, Heart, Plus, Minus, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const FoodDetailModal = ({ isOpen, onClose, dish, restaurant }) => {
  if (!isOpen || !dish) return null;

  const { addToCart } = useCart();
  const { isDishInWishlist, toggleWishlistDish } = useWishlist();

  const [selectedVariant, setSelectedVariant] = useState(dish.variants?.[0] || { name: 'Small', priceDelta: 0 });
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const isFavorited = isDishInWishlist(dish._id);

  // Price Calculation
  const basePrice = dish.discountPrice || dish.price || 20;
  const variantDelta = selectedVariant?.priceDelta || 0;
  const addOnsTotal = selectedAddOns.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const singleUnitPrice = basePrice + variantDelta + addOnsTotal;
  const totalPrice = singleUnitPrice * quantity;

  const isDollar = basePrice < 100;
  const formatCur = (val) => isDollar ? `$${val.toFixed(2)}` : `₹${val.toFixed(0)}`;

  const toggleAddOn = (addon) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((a) => a.name === addon.name);
      if (exists) return prev.filter((a) => a.name !== addon.name);
      return [...prev, addon];
    });
  };

  const handleAddToCart = () => {
    const customizedDish = {
      ...dish,
      name: selectedVariant ? `${dish.name} (${selectedVariant.name})` : dish.name,
      price: singleUnitPrice,
      discountPrice: null,
      selectedAddOns,
      quantity
    };
    addToCart(customizedDish, restaurant || { _id: dish.restaurantId, name: dish.restaurantName || 'QuickBite Kitchen' });
    onClose();
  };

  // Variants fallback if not present on mock
  const availableVariants = dish.variants?.length ? dish.variants : [
    { name: 'Small', priceDelta: 0 },
    { name: 'Medium', priceDelta: isDollar ? 4 : 80 },
    { name: 'Large', priceDelta: isDollar ? 8 : 160 }
  ];

  // Addons fallback
  const availableAddOns = dish.addOns?.length ? dish.addOns : [
    { name: 'Extra Cheese', price: isDollar ? 2.00 : 40, image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=200&q=80' }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="animate-modal"
        style={{
          width: '100%',
          maxWidth: '430px',
          maxHeight: '92vh',
          backgroundColor: '#121212',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '32px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar with Circular Controls */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            right: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10
          }}
        >
          {/* Back Circular Button */}
          <button
            onClick={onClose}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(30, 30, 30, 0.75)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.15s ease'
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Heart Circular Button */}
          <button
            onClick={() => toggleWishlistDish(dish)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(30, 30, 30, 0.75)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: isFavorited ? '#EF4444' : '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.15s ease'
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            aria-label="Favorite"
          >
            <Heart size={18} fill={isFavorited ? '#EF4444' : 'none'} color={isFavorited ? '#EF4444' : '#FFFFFF'} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 20px 100px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          {/* Big Circular Dish Hero Presentation */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '28px',
              position: 'relative'
            }}
          >
            <div
              style={{
                width: '210px',
                height: '210px',
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.8), 0 0 45px rgba(255, 114, 0, 0.15)',
                border: '4px solid #1E1E1E',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#181818'
              }}
            >
              <img
                src={dish.image}
                alt={dish.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Carousel Pagination Dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
              <ChevronLeft size={14} color="#666" style={{ cursor: 'pointer' }} />
              <div style={{ width: '16px', height: '6px', borderRadius: '9999px', backgroundColor: '#FF7200' }} />
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3E3E3E' }} />
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3E3E3E' }} />
              <ChevronRight size={14} color="#666" style={{ cursor: 'pointer' }} />
            </div>
          </div>

          {/* Dish Title & Price */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '4px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              {dish.name}
            </h2>
            <div style={{ fontSize: '22px', fontWeight: 900, color: '#FF7200' }}>
              {formatCur(basePrice + variantDelta)}
            </div>
          </div>

          {/* Description */}
          <p style={{ fontSize: '13px', color: '#9E9E9E', lineHeight: 1.55, margin: 0 }}>
            {showFullDesc ? dish.description : `${dish.description.slice(0, 90)}... `}
            <span
              onClick={() => setShowFullDesc(!showFullDesc)}
              style={{ color: '#FF7200', fontWeight: 600, cursor: 'pointer' }}
            >
              {showFullDesc ? ' Show Less' : ' Read More'}
            </span>
          </p>

          {/* Badges Pill Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Rating */}
            <div
              style={{
                backgroundColor: '#1E1E1E',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '9999px',
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#FFFFFF'
              }}
            >
              <Star size={13} fill="#FF7200" color="#FF7200" />
              <span>{dish.rating || 4.9} ({dish.reviewsCount || '2.3k'})</span>
            </div>

            {/* Preparation Time */}
            <div
              style={{
                backgroundColor: '#1E1E1E',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '9999px',
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#FFFFFF'
              }}
            >
              <Clock size={13} color="#FF7200" />
              <span>{dish.preparationTime || '25-30 Min'}</span>
            </div>

            {/* Calories */}
            <div
              style={{
                backgroundColor: '#1E1E1E',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '9999px',
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#FFFFFF'
              }}
            >
              <Flame size={13} color="#FF7200" />
              <span>{dish.calories || '100 Kcal'}</span>
            </div>
          </div>

          {/* Size Options */}
          <div style={{ marginTop: '8px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
              Size Options
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {availableVariants.map((variant, idx) => {
                const isSelected = selectedVariant?.name === variant.name;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedVariant(variant)}
                    style={{
                      flex: 1,
                      height: '42px',
                      borderRadius: '9999px',
                      backgroundColor: isSelected ? '#FF7200' : '#1E1E1E',
                      backgroundImage: isSelected ? 'linear-gradient(135deg, #FF7200 0%, #FF5500 100%)' : 'none',
                      border: isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: isSelected ? '#FFFFFF' : '#9E9E9E',
                      fontSize: '13px',
                      fontWeight: isSelected ? 800 : 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 4px 15px rgba(255, 114, 0, 0.4)' : 'none'
                    }}
                  >
                    {variant.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add-Ons Section */}
          <div style={{ marginTop: '8px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '10px' }}>
              Add-Ons
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {availableAddOns.map((addon, idx) => {
                const isSelected = selectedAddOns.some((a) => a.name === addon.name);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleAddOn(addon)}
                    style={{
                      backgroundColor: '#1E1E1E',
                      border: isSelected ? '1px solid #FF7200' : '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '16px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          backgroundColor: '#141414'
                        }}
                      >
                        <img
                          src={addon.image || 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=200&q=80'}
                          alt={addon.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>{addon.name}</div>
                        <div style={{ fontSize: '11px', color: '#FF7200', fontWeight: 600 }}>+{formatCur(addon.price)}</div>
                      </div>
                    </div>

                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? '#FF7200' : '#2A2A2A',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Plus size={14} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Floating Action Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(24, 24, 24, 0.95)',
            backdropFilter: 'blur(16px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 20
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: '#9E9E9E', fontWeight: 500 }}>Total Amount</div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF' }}>
              {formatCur(totalPrice)}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            style={{
              backgroundColor: '#FF7200',
              backgroundImage: 'linear-gradient(135deg, #FF7200 0%, #FF5500 100%)',
              border: 'none',
              borderRadius: '9999px',
              padding: '12px 24px',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(255, 114, 0, 0.4)',
              transition: 'transform 0.15s ease'
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <ShoppingBag size={17} color="#FFFFFF" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailModal;
