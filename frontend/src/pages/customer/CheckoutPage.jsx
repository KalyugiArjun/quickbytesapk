import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CreditCard,
  Banknote,
  Wallet,
  QrCode,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import Button from '../../components/common/Button';

const CheckoutPage = () => {
  const { items, restaurant, subtotal, deliveryFee, tax, discount, coupon, total, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Address selection / input
  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];
  const [street, setStreet] = useState(defaultAddress?.street || 'Flat 402, Lotus Residency, Central Avenue, Powai');
  const [city, setCity] = useState(defaultAddress?.city || 'Mumbai');
  const [zipCode, setZipCode] = useState(defaultAddress?.zipCode || '400076');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [orderNotes, setOrderNotes] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('COD'); // COD, CARD, UPI, WALLET
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Your cart is empty</h2>
        <p style={{ color: '#A3A3A3', marginBottom: '20px' }}>Add some delicious items first!</p>
        <Button variant="primary" onClick={() => navigate('/restaurants')}>
          Browse Menu
        </Button>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Please log in to complete your order.', 'warning');
      navigate('/login');
      return;
    }

    if (!street.trim() || !zipCode.trim() || !phone.trim()) {
      showToast('Please fill out complete delivery address & contact.', 'warning');
      return;
    }

    if (paymentMethod === 'WALLET' && (user?.walletBalance || 0) < total) {
      showToast(`Insufficient wallet balance (₹${user?.walletBalance?.toFixed(2) || '0.00'}). Please pick another payment method.`, 'error');
      return;
    }

    setLoading(true);
    try {
      const orderPayload = {
        restaurantId: restaurant._id,
        items: items.map((i) => ({
          menuItemId: i._id,
          name: i.name,
          price: i.discountPrice || i.price,
          quantity: i.quantity,
          image: i.image,
          isVeg: i.isVeg
        })),
        subtotal,
        deliveryFee,
        tax,
        discount,
        totalAmount: total,
        appliedCoupon: coupon ? { code: coupon.code, discount: coupon.discount } : null,
        deliveryAddress: {
          street,
          city,
          state: 'Maharashtra',
          zipCode,
          phone
        },
        paymentMethod,
        orderNotes
      };

      const res = await api.post('/orders', orderPayload);

      if (res.data.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        clearCart();
        showToast('Order confirmed! Khaao Pio Moj Karo!', 'success');
        navigate(`/orders/${res.data.order._id}`);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to place order. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '90vh', padding: '40px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '24px' }}>
          Secure Checkout
        </h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
            alignItems: 'start'
          }}
        >
          {/* Left Form Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Delivery Address Card */}
            <div
              style={{
                backgroundColor: '#1C1C1C',
                border: '1px solid #333333',
                borderRadius: '14px',
                padding: '24px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <MapPin size={20} color="#FF7900" />
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
                  Delivery Address & Contact
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
                    Street Address / Flat / Building
                  </label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#242424',
                      border: '1px solid #333333',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: '#242424',
                        border: '1px solid #333333',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
                      PIN / Zip Code
                    </label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: '#242424',
                        border: '1px solid #333333',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
                    Contact Phone Number for Delivery Driver
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#242424',
                      border: '1px solid #333333',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
                    Special Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ring the doorbell twice, leave at door..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#242424',
                      border: '1px solid #333333',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div
              style={{
                backgroundColor: '#1C1C1C',
                border: '1px solid #333333',
                borderRadius: '14px',
                padding: '24px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                <ShieldCheck size={20} color="#22C55E" />
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
                  Select Payment Option
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                {/* Cash on delivery */}
                <div
                  onClick={() => setPaymentMethod('COD')}
                  style={{
                    backgroundColor: paymentMethod === 'COD' ? 'rgba(255, 121, 0, 0.15)' : '#242424',
                    border: paymentMethod === 'COD' ? '2px solid #FF7900' : '1px solid #333333',
                    borderRadius: '10px',
                    padding: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <Banknote size={20} color={paymentMethod === 'COD' ? '#FF7900' : '#A3A3A3'} />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>Cash on Delivery</span>
                  <span style={{ fontSize: '11px', color: '#A3A3A3' }}>Pay upon receipt</span>
                </div>

                {/* QuickBite Wallet */}
                <div
                  onClick={() => setPaymentMethod('WALLET')}
                  style={{
                    backgroundColor: paymentMethod === 'WALLET' ? 'rgba(255, 121, 0, 0.15)' : '#242424',
                    border: paymentMethod === 'WALLET' ? '2px solid #FF7900' : '1px solid #333333',
                    borderRadius: '10px',
                    padding: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <Wallet size={20} color={paymentMethod === 'WALLET' ? '#FF7900' : '#A3A3A3'} />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>QuickBite Wallet</span>
                  <span style={{ fontSize: '11px', color: '#22C55E', fontWeight: 600 }}>
                    Balance: ₹{user?.walletBalance?.toFixed(2) || '500.00'}
                  </span>
                </div>

                {/* UPI / QR */}
                <div
                  onClick={() => setPaymentMethod('UPI')}
                  style={{
                    backgroundColor: paymentMethod === 'UPI' ? 'rgba(255, 121, 0, 0.15)' : '#242424',
                    border: paymentMethod === 'UPI' ? '2px solid #FF7900' : '1px solid #333333',
                    borderRadius: '10px',
                    padding: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <QrCode size={20} color={paymentMethod === 'UPI' ? '#FF7900' : '#A3A3A3'} />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>UPI / QR</span>
                  <span style={{ fontSize: '11px', color: '#A3A3A3' }}>GPay, PhonePe, Paytm</span>
                </div>

                {/* Card */}
                <div
                  onClick={() => setPaymentMethod('CARD')}
                  style={{
                    backgroundColor: paymentMethod === 'CARD' ? 'rgba(255, 121, 0, 0.15)' : '#242424',
                    border: paymentMethod === 'CARD' ? '2px solid #FF7900' : '1px solid #333333',
                    borderRadius: '10px',
                    padding: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <CreditCard size={20} color={paymentMethod === 'CARD' ? '#FF7900' : '#A3A3A3'} />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>Credit / Debit</span>
                  <span style={{ fontSize: '11px', color: '#A3A3A3' }}>Visa, Mastercard</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Summary Column */}
          <div
            style={{
              backgroundColor: '#1C1C1C',
              border: '1px solid #333333',
              borderRadius: '14px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
              Order Review
            </h3>

            {/* Restaurant header */}
            {restaurant && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #2E2E2E', paddingBottom: '14px' }}>
                <img
                  src={restaurant.logo}
                  alt={restaurant.name}
                  style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{restaurant.name}</div>
                  <div style={{ fontSize: '12px', color: '#FF7900' }}>
                    ~{restaurant.deliveryTimeMinutes || 30} mins delivery
                  </div>
                </div>
              </div>
            )}

            {/* Items summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '220px', overflowY: 'auto' }}>
              {items.map((item) => (
                <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#E5E5E5' }}>
                    {item.name} × <strong style={{ color: '#FF7900' }}>{item.quantity}</strong>
                  </span>
                  <span style={{ color: '#FFFFFF', fontWeight: 600 }}>
                    ₹{((item.discountPrice || item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div
              style={{
                borderTop: '1px solid #2E2E2E',
                paddingTop: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '13px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A3A3A3' }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A3A3A3' }}>
                <span>Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A3A3A3' }}>
                <span>GST Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#22C55E', fontWeight: 600 }}>
                  <span>Coupon Savings ({coupon?.code})</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
              <div
                style={{
                  borderTop: '1px solid #333333',
                  paddingTop: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '18px',
                  fontWeight: 900,
                  color: '#FFFFFF'
                }}
              >
                <span>Total Amount</span>
                <span style={{ color: '#FF7900' }}>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              onClick={handlePlaceOrder}
              icon={CheckCircle2}
            >
              Place Order • ₹{total.toFixed(2)}
            </Button>

            <span style={{ fontSize: '11px', color: '#737373', textAlign: 'center', display: 'block' }}>
              By placing an order, you agree to QuickBite's terms of service and freshness guarantee.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
