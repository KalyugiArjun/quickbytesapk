import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreVertical, Trash2, Plus, Minus, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartDrawer = () => {
  const {
    items,
    restaurant,
    itemCount,
    subtotal,
    deliveryFee,
    tax,
    discount,
    coupon,
    total,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [selectAll, setSelectAll] = useState(true);
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const formatCur = (val) => `₹${Math.round(val || 0)}`;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(8px)',
        zIndex: 11000,
        display: 'flex',
        justifyContent: 'flex-end'
      }}
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="animate-slide-up"
        style={{
          width: '100%',
          maxWidth: '430px',
          height: '100%',
          backgroundColor: '#121212',
          borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.9)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar matching Screen 3 */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#161616'
          }}
        >
          {/* Back Circular Button */}
          <button
            onClick={() => setIsCartOpen(false)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#222222',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Heading with Item Count */}
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
          </h3>

          {/* Select All and 3 Dots Options */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              onClick={() => setSelectAll(!selectAll)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 600,
                color: selectAll ? '#FF7200' : '#8E8E93'
              }}
            >
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: selectAll ? '5px solid #FF7200' : '2px solid #555555',
                  backgroundColor: '#1E1E1E'
                }}
              />
              <span>Select All</span>
            </div>

            <button
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#9E9E9E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-label="Options"
            >
              <MoreVertical size={18} />
            </button>
          </div>
        </div>

        {/* Cart Items List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 20px',
                textAlign: 'center',
                gap: '14px'
              }}
            >
              <div
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  backgroundColor: '#1E1E1E',
                  border: '1px solid #2A2A2A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FF7200'
                }}
              >
                <ShoppingBag size={34} />
              </div>
              <h4 style={{ margin: 0, fontSize: '17px', color: '#FFFFFF' }}>Your cart is empty</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#8E8E93', maxWidth: '240px' }}>
                Add gourmet pizzas, burgers, desserts or drinks to get started.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item._id}
                style={{
                  backgroundColor: '#1B1B1B',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderRadius: '18px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  position: 'relative'
                }}
              >
                {/* Food Thumbnail - Full crisp view */}
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    backgroundColor: '#161616',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h5
                      style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        paddingRight: '18px'
                      }}
                    >
                      {item.name}
                    </h5>

                    {/* Trash Delete Icon */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#737373',
                        cursor: 'pointer',
                        padding: '2px',
                        display: 'flex'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#737373')}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div style={{ fontSize: '11px', color: '#8E8E93', marginTop: '2px' }}>
                    {item.variants?.[0]?.name || '12 Inch'}
                  </div>

                  {/* Price and Quantity Pill */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>
                      {formatCur(item.price)}
                    </div>

                    {/* Quantity Pill matching Screen 3 */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: '#252525',
                        borderRadius: '9999px',
                        padding: '3px 8px'
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#A3A3A3',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '2px'
                        }}
                      >
                        <Minus size={13} />
                      </button>

                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF', minWidth: '16px', textAlign: 'center' }}>
                        {item.quantity < 10 ? `0${item.quantity}` : item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: '#FF7200',
                          border: 'none',
                          color: '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Selection Circle indicator */}
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: selectAll ? '5px solid #FF7200' : '2px solid #555555',
                    backgroundColor: '#1E1E1E',
                    flexShrink: 0
                  }}
                />
              </div>
            ))
          )}
        </div>

        {/* Bottom Checkout Sheet matching Screen 3 */}
        {items.length > 0 && (
          <div
            style={{
              backgroundColor: '#181818',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {/* Calculation rows */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#A3A3A3' }}>
              <span>Subtotal:</span>
              <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{formatCur(subtotal)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#A3A3A3' }}>
              <span>Delivery:</span>
              <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{formatCur(deliveryFee)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#FF7200' }}>
              <span>Discount:</span>
              <span style={{ color: '#FF7200', fontWeight: 800 }}>-{formatCur(discount > 0 ? discount : 0)}</span>
            </div>

            <div style={{ height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.08)', margin: '4px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>
              <span>Total:</span>
              <span style={{ color: '#FF7200', fontSize: '18px' }}>{formatCur(total)}</span>
            </div>

            {/* Checkout Big CTA Button */}
            <button
              onClick={handleProceedToCheckout}
              style={{
                width: '100%',
                height: '48px',
                backgroundColor: '#FF7200',
                backgroundImage: 'linear-gradient(135deg, #FF7200 0%, #FF5500 100%)',
                border: 'none',
                borderRadius: '9999px',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(255, 114, 0, 0.45)',
                transition: 'transform 0.15s ease'
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
