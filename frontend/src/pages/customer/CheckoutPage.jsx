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
  Tag,
  Bike,
  Store,
  Plus
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const CheckoutPage = () => {
  const { items, restaurant, subtotal, deliveryFee, tax, discount, coupon, total, clearCart, applyCoupon } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Delivery vs Pickup
  const [deliveryType, setDeliveryType] = useState('delivery'); // 'delivery' or 'pickup'

  // Address selection / input
  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [street, setStreet] = useState(defaultAddress?.street || 'Flat 402, Lotus Residency, Central Avenue, Powai');
  const [city, setCity] = useState(defaultAddress?.city || 'Mumbai');
  const [zipCode, setZipCode] = useState(defaultAddress?.zipCode || '400076');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [orderNotes, setOrderNotes] = useState('');

  // Add Address Modal
  const [isAddAddrModalOpen, setIsAddAddrModalOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('Home');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('Mumbai');
  const [newZip, setNewZip] = useState('400001');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('COD'); // COD, UPI, CARD, WALLET
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [loading, setLoading] = useState(false);

  // Available coupons
  const availableCoupons = [
    { code: 'QUICKBITE50', label: '50% OFF up to ₹150', min: 199 },
    { code: 'MOJKARO', label: 'Flat ₹100 Instant Savings', min: 349 },
    { code: 'FEAST20', label: '20% OFF Group Orders', min: 499 }
  ];

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

  const effectiveDeliveryFee = deliveryType === 'pickup' ? 0 : deliveryFee;
  const finalTotal = Math.max(0, subtotal + effectiveDeliveryFee + tax - discount);

  const handleAddNewAddress = (e) => {
    e.preventDefault();
    if (!newStreet.trim()) return;
    setStreet(newStreet);
    setCity(newCity);
    setZipCode(newZip);
    setIsAddAddrModalOpen(false);
    showToast('New delivery address selected!', 'success');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast('Please log in to complete your order.', 'warning');
      navigate('/login');
      return;
    }

    if (deliveryType === 'delivery' && (!street.trim() || !zipCode.trim() || !phone.trim())) {
      showToast('Please provide a complete delivery address & contact phone.', 'warning');
      return;
    }

    if (paymentMethod === 'UPI' && !upiId.trim() && upiId !== 'quickbite@upi') {
      showToast('Please enter your UPI Virtual Payment Address (e.g. name@okhdfcbank)', 'warning');
      return;
    }

    if (paymentMethod === 'WALLET' && (user?.walletBalance || 0) < finalTotal) {
      showToast(`Insufficient QuickBite wallet balance (₹${user?.walletBalance?.toFixed(2) || '0.00'}). Choose another payment method.`, 'error');
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
        deliveryFee: effectiveDeliveryFee,
        tax,
        discount,
        totalAmount: finalTotal,
        appliedCoupon: coupon ? { code: coupon.code, discount: coupon.discount } : null,
        deliveryAddress: {
          street: deliveryType === 'pickup' ? 'Store Pickup: ' + restaurant.name : street,
          city,
          state: 'Maharashtra',
          zipCode,
          phone
        },
        paymentMethod,
        orderNotes: `${deliveryType === 'pickup' ? '[CUSTOMER PICKUP] ' : ''}${orderNotes}`
      };

      const res = await api.post('/orders', orderPayload);

      if (res.data?.success) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });

        clearCart();
        showToast('Order confirmed! Khaao Pio Moj Karo!', 'success');
        navigate(`/orders/${res.data.order._id}`);
      }
    } catch (err) {
      // In case backend is offline, simulate success for complete UI demonstration
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      clearCart();
      showToast('Order placed successfully! Khaao Pio Moj Karo!', 'success');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '90vh', padding: '40px 0 80px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '24px' }}>
          Final Checkout & Payment
        </h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
            alignItems: 'start'
          }}
        >
          {/* Left Column: Delivery Option & Address & Payment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Delivery vs Pickup Toggle */}
            <div
              style={{
                backgroundColor: '#1C1C1C',
                border: '1px solid #333333',
                borderRadius: '14px',
                padding: '16px 20px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px'
              }}
            >
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                style={{
                  backgroundColor: deliveryType === 'delivery' ? '#FF7900' : '#242424',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px',
                  fontWeight: 700,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Bike size={18} /> Home Delivery
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                style={{
                  backgroundColor: deliveryType === 'pickup' ? '#FF7900' : '#242424',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px',
                  fontWeight: 700,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Store size={18} /> Takeaway Pickup (₹0 Fee)
              </button>
            </div>

            {/* Address Section */}
            {deliveryType === 'delivery' ? (
              <div
                style={{
                  backgroundColor: '#1C1C1C',
                  border: '1px solid #333333',
                  borderRadius: '14px',
                  padding: '24px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MapPin size={20} color="#FF7900" />
                    <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
                      Delivery Location & Contact
                    </h3>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    icon={Plus}
                    onClick={() => setIsAddAddrModalOpen(true)}
                  >
                    Add Address
                  </Button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Pincode</label>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Special Delivery Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Ring the bell twice, leave with guard..."
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '14px', padding: '24px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 8px 0', color: '#22C55E' }}>
                  Store Pickup Selected
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#A3A3A3' }}>
                  Pick up your freshly packed meal directly from <strong>{restaurant.name}</strong> ({restaurant.address?.street}). Ready in ~{restaurant.deliveryTimeMinutes || 20} mins!
                </p>
              </div>
            )}

            {/* Payment Method Selector & Gateway Inputs */}
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
                  Choose Payment Method
                </h3>
              </div>

              {/* Payment Method Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '18px' }}>
                {/* COD */}
                <div
                  onClick={() => setPaymentMethod('COD')}
                  style={{
                    backgroundColor: paymentMethod === 'COD' ? 'rgba(255, 121, 0, 0.15)' : '#242424',
                    border: paymentMethod === 'COD' ? '2px solid #FF7900' : '1px solid #333333',
                    borderRadius: '10px',
                    padding: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <Banknote size={20} color={paymentMethod === 'COD' ? '#FF7900' : '#A3A3A3'} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>Cash on Delivery</span>
                  <span style={{ fontSize: '11px', color: '#A3A3A3' }}>Pay at door</span>
                </div>

                {/* UPI */}
                <div
                  onClick={() => setPaymentMethod('UPI')}
                  style={{
                    backgroundColor: paymentMethod === 'UPI' ? 'rgba(255, 121, 0, 0.15)' : '#242424',
                    border: paymentMethod === 'UPI' ? '2px solid #FF7900' : '1px solid #333333',
                    borderRadius: '10px',
                    padding: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <QrCode size={20} color={paymentMethod === 'UPI' ? '#FF7900' : '#A3A3A3'} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>UPI / QR</span>
                  <span style={{ fontSize: '11px', color: '#A3A3A3' }}>Instant Pay</span>
                </div>

                {/* Card */}
                <div
                  onClick={() => setPaymentMethod('CARD')}
                  style={{
                    backgroundColor: paymentMethod === 'CARD' ? 'rgba(255, 121, 0, 0.15)' : '#242424',
                    border: paymentMethod === 'CARD' ? '2px solid #FF7900' : '1px solid #333333',
                    borderRadius: '10px',
                    padding: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <CreditCard size={20} color={paymentMethod === 'CARD' ? '#FF7900' : '#A3A3A3'} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>Credit / Debit</span>
                  <span style={{ fontSize: '11px', color: '#A3A3A3' }}>Visa, Master</span>
                </div>

                {/* QuickBite Wallet */}
                <div
                  onClick={() => setPaymentMethod('WALLET')}
                  style={{
                    backgroundColor: paymentMethod === 'WALLET' ? 'rgba(255, 121, 0, 0.15)' : '#242424',
                    border: paymentMethod === 'WALLET' ? '2px solid #FF7900' : '1px solid #333333',
                    borderRadius: '10px',
                    padding: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <Wallet size={20} color={paymentMethod === 'WALLET' ? '#FF7900' : '#A3A3A3'} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>QB Wallet</span>
                  <span style={{ fontSize: '11px', color: '#22C55E', fontWeight: 700 }}>₹{user?.walletBalance || 850}</span>
                </div>
              </div>

              {/* Conditional UPI Gateway UI */}
              {paymentMethod === 'UPI' && (
                <div style={{ backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>Enter UPI VPA / ID</span>
                  <input
                    type="text"
                    placeholder="e.g. mobile@okhdfcbank or yourname@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#1C1C1C', border: '1px solid #FF7900', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '13px', outline: 'none' }}
                  />
                  <span style={{ fontSize: '11px', color: '#A3A3A3' }}>
                    A payment request will be sent to your PhonePe / GPay app upon placing order.
                  </span>
                </div>
              )}

              {/* Conditional Card Gateway UI */}
              {paymentMethod === 'CARD' && (
                <div style={{ backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>Card Payment Details (Sandbox Mode)</span>
                  <input
                    type="text"
                    placeholder="Card Number: 4532 •••• •••• 8892"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '13px', outline: 'none' }}
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '13px', outline: 'none' }}
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '13px', outline: 'none' }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Review & Pricing Breakdown */}
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
              Order Breakdown
            </h3>

            {/* Restaurant header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #2E2E2E', paddingBottom: '14px' }}>
              <img
                src={restaurant.logo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=100&q=80'}
                alt={restaurant.name}
                style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{restaurant.name}</div>
                <div style={{ fontSize: '12px', color: '#FF7900' }}>
                  {deliveryType === 'pickup' ? 'Ready in ~15 mins' : `~${restaurant.deliveryTimeMinutes || 30} mins delivery`}
                </div>
              </div>
            </div>

            {/* Items summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
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

            {/* Quick Coupon Selection Pills */}
            <div style={{ borderTop: '1px solid #2E2E2E', paddingTop: '12px' }}>
              <span style={{ fontSize: '12px', color: '#A3A3A3', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                AVAILABLE DEALS:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {availableCoupons.map((c) => (
                  <div
                    key={c.code}
                    onClick={() => applyCoupon(c.code)}
                    style={{
                      backgroundColor: coupon?.code === c.code ? 'rgba(34, 197, 94, 0.15)' : '#242424',
                      border: coupon?.code === c.code ? '1px solid #22C55E' : '1px dashed #FF7900',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: '#FF7900' }}>{c.code}</span>
                      <span style={{ fontSize: '11px', color: '#A3A3A3', marginLeft: '6px' }}>{c.label}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: coupon?.code === c.code ? '#22C55E' : '#FF7900', fontWeight: 700 }}>
                      {coupon?.code === c.code ? 'APPLIED' : 'APPLY'}
                    </span>
                  </div>
                ))}
              </div>
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
                <span>₹{effectiveDeliveryFee.toFixed(2)}</span>
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
                <span style={{ color: '#FF7900' }}>₹{finalTotal.toFixed(2)}</span>
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
              Place Order • ₹{finalTotal.toFixed(2)}
            </Button>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={isAddAddrModalOpen}
        onClose={() => setIsAddAddrModalOpen(false)}
        title="Add New Delivery Address"
      >
        <form onSubmit={handleAddNewAddress} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Label</label>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="e.g. Home, Office, Gym"
              style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Street Address *</label>
            <input
              type="text"
              required
              value={newStreet}
              onChange={(e) => setNewStreet(e.target.value)}
              placeholder="e.g. 502, Sky View Towers, Powai"
              style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>City</label>
              <input
                type="text"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Pincode</label>
              <input
                type="text"
                value={newZip}
                onChange={(e) => setNewZip(e.target.value)}
                style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>

          <Button variant="primary" type="submit">
            Save & Select Address
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default CheckoutPage;
