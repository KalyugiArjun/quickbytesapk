import React, { useState } from 'react';
import { Star, Clock, Plus, Minus, Heart, X, Check } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import { DietaryBadge } from './Badge';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const FoodDetailModal = ({ isOpen, onClose, dish, restaurant }) => {
  if (!isOpen || !dish) return null;

  const { addToCart } = useCart();
  const { isDishInWishlist, toggleWishlistDish } = useWishlist();

  const [selectedVariant, setSelectedVariant] = useState(dish.variants?.[0] || null);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const isFavorited = isDishInWishlist(dish._id);

  // Price Calculation
  const basePrice = dish.discountPrice || dish.price;
  const variantDelta = selectedVariant?.priceDelta || 0;
  const addOnsTotal = selectedAddOns.reduce((acc, curr) => acc + curr.price, 0);
  const singleUnitPrice = basePrice + variantDelta + addOnsTotal;
  const totalPrice = singleUnitPrice * quantity;

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
    addToCart(customizedDish, restaurant || { _id: dish.restaurantId, name: dish.restaurantName || 'QuickBite Partner' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={dish.name} maxWidth="600px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Large Food Photography Cover */}
        <div style={{ position: 'relative', width: '100%', height: '260px', borderRadius: '12px', overflow: 'hidden' }}>
          <img
            src={dish.image}
            alt={dish.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
            <DietaryBadge isVeg={dish.isVeg} />
          </div>

          <button
            onClick={() => toggleWishlistDish(dish)}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: 'rgba(28, 28, 28, 0.85)',
              border: '1px solid #333333',
              borderRadius: '50%',
              padding: '8px',
              color: isFavorited ? '#EF4444' : '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              backdropFilter: 'blur(4px)'
            }}
          >
            <Heart size={18} fill={isFavorited ? '#EF4444' : 'none'} />
          </button>

          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              backgroundColor: 'rgba(17, 17, 17, 0.85)',
              color: '#FFFFFF',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Clock size={13} color="#FF7900" /> {dish.preparationTime || 20} mins
          </div>
        </div>

        {/* Basic Details */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
              {dish.name}
            </h3>
            <span style={{ fontSize: '22px', fontWeight: 900, color: '#FF7900' }}>
              ₹{totalPrice.toFixed(0)}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#4ADE80', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>
              <Star size={12} fill="#4ADE80" /> {dish.rating || 4.8}
            </div>
            <span style={{ color: '#737373', fontSize: '12px' }}>
              From {restaurant?.name || dish.restaurantName || 'Verified Gourmet Kitchen'}
            </span>
          </div>

          <p style={{ fontSize: '14px', color: '#A3A3A3', lineHeight: 1.5, margin: 0 }}>
            {dish.description}
          </p>
        </div>

        {/* Variant Selection if available */}
        {dish.variants && dish.variants.length > 0 && (
          <div style={{ borderTop: '1px solid #333333', paddingTop: '14px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', display: 'block', marginBottom: '8px' }}>
              Select Portion / Size:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {dish.variants.map((variant, idx) => (
                <label
                  key={idx}
                  onClick={() => setSelectedVariant(variant)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: selectedVariant?.name === variant.name ? 'rgba(255, 121, 0, 0.12)' : '#242424',
                    border: selectedVariant?.name === variant.name ? '1px solid #FF7900' : '1px solid #333333',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                    {variant.name}
                  </span>
                  <span style={{ fontSize: '13px', color: '#FF7900', fontWeight: 700 }}>
                    {variant.priceDelta > 0 ? `+₹${variant.priceDelta}` : 'Included'}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Add-ons Checkboxes if available */}
        {dish.addOns && dish.addOns.length > 0 && (
          <div style={{ borderTop: '1px solid #333333', paddingTop: '14px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', display: 'block', marginBottom: '8px' }}>
              Customize with Add-ons:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {dish.addOns.map((addon, idx) => {
                const isSelected = selectedAddOns.some((a) => a.name === addon.name);
                return (
                  <label
                    key={idx}
                    onClick={() => toggleAddOn(addon)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: isSelected ? 'rgba(34, 197, 94, 0.12)' : '#242424',
                      border: isSelected ? '1px solid #22C55E' : '1px solid #333333',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '13px', color: '#FFFFFF' }}>{addon.name}</span>
                    <span style={{ fontSize: '13px', color: '#22C55E', fontWeight: 700 }}>+₹{addon.price}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Actions: Quantity Modifiers & Add to Cart */}
        <div
          style={{
            borderTop: '1px solid #333333',
            paddingTop: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          {/* Quantity selector */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#242424',
              border: '1px solid #333333',
              borderRadius: '8px',
              padding: '6px 12px'
            }}
          >
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              style={{ background: 'none', border: 'none', color: '#A3A3A3', cursor: 'pointer', display: 'flex' }}
            >
              <Minus size={16} />
            </button>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', minWidth: '18px', textAlign: 'center' }}>
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              style={{ background: 'none', border: 'none', color: '#FF7900', cursor: 'pointer', display: 'flex' }}
            >
              <Plus size={16} />
            </button>
          </div>

          <Button variant="primary" size="lg" fullWidth onClick={handleAddToCart}>
            Add {quantity} to Cart • ₹{totalPrice.toFixed(0)}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FoodDetailModal;
