import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ArrowRight, Tag, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Button from './Button';

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

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    await applyCoupon(couponInput.trim());
    setCouponLoading(false);
    setCouponInput('');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(5px)',
        zIndex: 11000,
        display: 'flex',
        justifyContent: 'flex-end'
      }}
      onClick={() => setIsCartOpen(false)}
    >
      <div
        className="animate-modal"
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          backgroundColor: '#1C1C1C',
          borderLeft: '1px solid #333333',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 30px rgba(0, 0, 0, 0.8)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #333333',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="#FF7900" />
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              Your Feast ({itemCount})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{
              background: '#242424',
              border: '1px solid #333333',
              borderRadius: '8px',
              color: '#A3A3A3',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Content */}
        {items.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 20px',
              textAlign: 'center',
              gap: '16px'
            }}
          >
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                backgroundColor: '#242424',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FF7900'
              }}
            >
              <ShoppingBag size={34} />
            </div>
            <h4 style={{ margin: 0, fontSize: '18px', color: '#FFFFFF' }}>Your cart is empty</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#A3A3A3', maxWidth: '280px' }}>
              Explore dishes from top restaurants and treat yourself to something delicious.
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setIsCartOpen(false);
                navigate('/restaurants');
              }}
            >
              Browse Restaurants
            </Button>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
            {/* Restaurant header */}
            {restaurant && (
              <div
                style={{
                  backgroundColor: '#242424',
                  border: '1px solid #333333',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <img
                  src={restaurant.logo}
                  alt={restaurant.name}
                  style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                    {restaurant.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#FF7900' }}>
                    {restaurant.deliveryTimeMinutes || 30} mins delivery
                  </div>
                </div>
              </div>
            )}

            {/* Item list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {items.map((item) => {
                const itemPrice = item.discountPrice || item.price;
                return (
                  <div
                    key={item._id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#242424',
                      border: '1px solid #333333',
                      borderRadius: '10px',
                      padding: '12px',
                      gap: '12px'
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF', marginBottom: '2px' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '13px', color: '#FF7900', fontWeight: 700 }}>
                        ₹{itemPrice} × {item.quantity} = ₹{itemPrice * item.quantity}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: '#1C1C1C',
                        border: '1px solid #333333',
                        borderRadius: '6px',
                        padding: '3px 6px'
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        style={{ background: 'none', border: 'none', color: '#A3A3A3', cursor: 'pointer', display: 'flex' }}
                      >
                        {item.quantity === 1 ? <Trash2 size={13} color="#EF4444" /> : <Minus size={13} />}
                      </button>
                      <span style={{ fontSize: '12px', fontWeight: 700, minWidth: '16px', textAlign: 'center', color: '#FFFFFF' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        style={{ background: 'none', border: 'none', color: '#FF7900', cursor: 'pointer', display: 'flex' }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coupon form */}
            <div style={{ marginBottom: '20px' }}>
              {coupon ? (
                <div
                  style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    border: '1px dashed #22C55E',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tag size={16} color="#22C55E" />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#4ADE80' }}>
                        {coupon.code} applied!
                      </div>
                      <div style={{ fontSize: '11px', color: '#A3A3A3' }}>
                        You saved ₹{coupon.discount}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Enter coupon (e.g. QUICKBITE50)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    style={{
                      flex: 1,
                      backgroundColor: '#242424',
                      border: '1px solid #333333',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                  <Button variant="outline" size="sm" type="submit" loading={couponLoading}>
                    Apply
                  </Button>
                </form>
              )}
            </div>

            {/* Bill summary */}
            <div
              style={{
                backgroundColor: '#242424',
                border: '1px solid #333333',
                borderRadius: '10px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '13px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A3A3A3' }}>
                <span>Subtotal</span>
                <span style={{ color: '#FFFFFF' }}>₹{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A3A3A3' }}>
                <span>Delivery Fee</span>
                <span style={{ color: '#FFFFFF' }}>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A3A3A3' }}>
                <span>Taxes & GST (5%)</span>
                <span style={{ color: '#FFFFFF' }}>₹{tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#22C55E' }}>
                  <span>Coupon Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div
                style={{
                  borderTop: '1px solid #333333',
                  paddingTop: '8px',
                  marginTop: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#FFFFFF'
                }}
              >
                <span>To Pay</span>
                <span style={{ color: '#FF7900' }}>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Drawer Footer Checkout Button */}
        {items.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              borderTop: '1px solid #333333',
              backgroundColor: '#1C1C1C'
            }}
          >
            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={handleProceedToCheckout}
              icon={ArrowRight}
            >
              Checkout • ₹{total.toFixed(2)}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
