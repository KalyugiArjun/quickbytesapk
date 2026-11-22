import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  MapPin,
  Plus,
  Trash2,
  Shield,
  Wallet,
  ShoppingBag,
  Heart,
  CreditCard,
  Headphones,
  Tag,
  Settings,
  LogOut,
  ChevronRight,
  Edit2,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import BottomNav from '../../components/common/BottomNav';
import api from '../../services/api';

const CustomerProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Profile Edit State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [name, setName] = useState(user?.name || 'Jhon Doe');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [updating, setUpdating] = useState(false);

  // Wallet Modal State
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(user?.walletBalance || 850);
  const [topupAmount, setTopupAmount] = useState('200');

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState(
    user?.addresses?.length
      ? user.addresses
      : [
          { _id: 'addr-1', label: 'Home', street: 'Flat 402, Lotus Residency, California, USA', city: 'California', zipCode: '90210', isDefault: true },
          { _id: 'addr-2', label: 'Work', street: 'Suite 18, Sunset Boulevard, California, USA', city: 'California', zipCode: '90028', isDefault: false }
        ]
  );
  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('California');
  const [addrZip, setAddrZip] = useState('90210');

  // Help Modal State
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await updateProfile({ name, phone });
      showToast('Profile updated successfully!', 'success');
      setIsEditProfileOpen(false);
    } catch (err) {
      showToast('Failed to update profile', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleTopupWallet = (amt) => {
    const added = parseFloat(amt);
    if (isNaN(added) || added <= 0) return;
    const newBal = walletBalance + added;
    setWalletBalance(newBal);
    showToast(`Added ₹${added} to QuickBite Wallet! New balance: ₹${newBal.toFixed(2)}`, 'success');
    setIsWalletModalOpen(false);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!addrStreet.trim() || !addrZip.trim()) {
      showToast('Please provide street address and postal code.', 'warning');
      return;
    }
    const newAddr = {
      _id: `addr-${Date.now()}`,
      label: addrLabel,
      street: addrStreet,
      city: addrCity,
      zipCode: addrZip,
      isDefault: savedAddresses.length === 0
    };
    setSavedAddresses([...savedAddresses, newAddr]);
    showToast('New address saved successfully!', 'success');
    setIsAddressModalOpen(false);
    setAddrStreet('');
  };

  const handleDeleteAddress = (id) => {
    setSavedAddresses(savedAddresses.filter((a) => a._id !== id));
    showToast('Address removed', 'info');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F0F0F', paddingBottom: '100px' }}>
      <div className="container" style={{ maxWidth: '640px', paddingTop: '20px' }}>
        
        {/* Swiggy Style Profile Header Card */}
        <div
          style={{
            backgroundColor: '#1A1A1A',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '24px',
            marginBottom: '18px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid #FF7200',
                  padding: '2px',
                  backgroundColor: '#1E1E1E'
                }}
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                  alt="Profile"
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
                  }}
                />
              </div>

              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  {user?.name || name}
                </h2>
                <div style={{ fontSize: '13px', color: '#9E9E9E', marginTop: '2px' }}>
                  {user?.phone || phone}
                </div>
                <div style={{ fontSize: '12px', color: '#6E6E6E' }}>
                  {user?.email || 'customer@quickbite.com'}
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditProfileOpen(true)}
              style={{
                backgroundColor: 'rgba(255, 114, 0, 0.12)',
                border: '1px solid rgba(255, 114, 0, 0.4)',
                borderRadius: '9999px',
                padding: '6px 14px',
                color: '#FF7200',
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer'
              }}
            >
              <Edit2 size={13} />
              <span>EDIT</span>
            </button>
          </div>

          {/* QuickBite ONE Gold Membership Banner (Swiggy One Style) */}
          <div
            style={{
              marginTop: '20px',
              backgroundColor: '#222222',
              backgroundImage: 'linear-gradient(135deg, rgba(255, 114, 0, 0.15) 0%, rgba(255, 85, 0, 0.05) 100%)',
              border: '1px solid rgba(255, 114, 0, 0.3)',
              borderRadius: '16px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#FF7200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
              >
                <Sparkles size={16} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                  QuickBite ONE Member
                </div>
                <div style={{ fontSize: '11px', color: '#9E9E9E' }}>
                  Unlimited FREE Delivery on orders above ₹149 & extra 10% OFF
                </div>
              </div>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#22C55E' }}>ACTIVE</span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            marginBottom: '18px'
          }}
        >
          {/* Wallet Balance */}
          <div
            onClick={() => setIsWalletModalOpen(true)}
            style={{
              backgroundColor: '#1A1A1A',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '12px 8px',
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: 900, color: '#22C55E' }}>
              ₹{walletBalance.toFixed(0)}
            </div>
            <div style={{ fontSize: '11px', color: '#9E9E9E', marginTop: '2px', fontWeight: 600 }}>Wallet</div>
          </div>

          {/* Past Orders */}
          <div
            onClick={() => navigate('/orders')}
            style={{
              backgroundColor: '#1A1A1A',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '12px 8px',
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: 900, color: '#FFFFFF' }}>
              12
            </div>
            <div style={{ fontSize: '11px', color: '#9E9E9E', marginTop: '2px', fontWeight: 600 }}>Orders</div>
          </div>

          {/* Favorites */}
          <div
            onClick={() => navigate('/wishlist')}
            style={{
              backgroundColor: '#1A1A1A',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '12px 8px',
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: 900, color: '#FF7200' }}>
              6
            </div>
            <div style={{ fontSize: '11px', color: '#9E9E9E', marginTop: '2px', fontWeight: 600 }}>Favorites</div>
          </div>

          {/* Coupons */}
          <div
            onClick={() => navigate('/checkout')}
            style={{
              backgroundColor: '#1A1A1A',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '12px 8px',
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: 900, color: '#3B82F6' }}>
              3
            </div>
            <div style={{ fontSize: '11px', color: '#9E9E9E', marginTop: '2px', fontWeight: 600 }}>Coupons</div>
          </div>
        </div>

        {/* Swiggy Style Menu Options List */}
        <div
          style={{
            backgroundColor: '#1A1A1A',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            overflow: 'hidden',
            marginBottom: '18px'
          }}
        >
          {/* Row 1: My Orders */}
          <div
            onClick={() => navigate('/orders')}
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 114, 0, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FF7200'
                }}
              >
                <ShoppingBag size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>My Orders</div>
                <div style={{ fontSize: '12px', color: '#8E8E93' }}>Active orders, past receipts & reorder</div>
              </div>
            </div>
            <ChevronRight size={18} color="#6E6E6E" />
          </div>

          {/* Row 2: QuickBite Wallet */}
          <div
            onClick={() => setIsWalletModalOpen(true)}
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(34, 197, 94, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#22C55E'
                }}
              >
                <Wallet size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>QuickBite Money</div>
                <div style={{ fontSize: '12px', color: '#8E8E93' }}>Current balance: ₹{walletBalance.toFixed(2)} • Add funds</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#22C55E' }}>+ ADD</span>
              <ChevronRight size={18} color="#6E6E6E" />
            </div>
          </div>

          {/* Row 3: Saved Addresses */}
          <div
            onClick={() => setIsAddressModalOpen(true)}
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(59, 130, 246, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#3B82F6'
                }}
              >
                <MapPin size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>Saved Addresses</div>
                <div style={{ fontSize: '12px', color: '#8E8E93' }}>{savedAddresses.length} addresses saved</div>
              </div>
            </div>
            <ChevronRight size={18} color="#6E6E6E" />
          </div>

          {/* Row 4: Wishlist */}
          <div
            onClick={() => navigate('/wishlist')}
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#EF4444'
                }}
              >
                <Heart size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>Favourites & Wishlist</div>
                <div style={{ fontSize: '12px', color: '#8E8E93' }}>Dishes and restaurants you love</div>
              </div>
            </div>
            <ChevronRight size={18} color="#6E6E6E" />
          </div>

          {/* Row 5: Help & Support */}
          <div
            onClick={() => setIsHelpModalOpen(true)}
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(168, 85, 247, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C084FC'
                }}
              >
                <Headphones size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>Help & Support</div>
                <div style={{ fontSize: '12px', color: '#8E8E93' }}>24x7 Customer support & BiteBot AI</div>
              </div>
            </div>
            <ChevronRight size={18} color="#6E6E6E" />
          </div>

          {/* Row 6: Log Out */}
          <div
            onClick={() => {
              logout();
              showToast('Logged out safely.', 'info');
              navigate('/login');
            }}
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#EF4444'
                }}
              >
                <LogOut size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#EF4444' }}>Log Out</div>
                <div style={{ fontSize: '12px', color: '#8E8E93' }}>Sign out from this device</div>
              </div>
            </div>
            <ChevronRight size={18} color="#6E6E6E" />
          </div>
        </div>

      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        title="Edit Profile Details"
      >
        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#9E9E9E', display: 'block', marginBottom: '6px' }}>Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#1E1E1E',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '10px 14px',
                color: '#FFFFFF',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#9E9E9E', display: 'block', marginBottom: '6px' }}>Phone Number</label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#1E1E1E',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '10px 14px',
                color: '#FFFFFF',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            style={{
              backgroundColor: '#FF7200',
              backgroundImage: 'linear-gradient(135deg, #FF7200 0%, #FF5500 100%)',
              border: 'none',
              borderRadius: '9999px',
              padding: '12px',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer',
              marginTop: '6px'
            }}
          >
            {updating ? 'Saving Changes...' : 'Save Profile'}
          </button>
        </form>
      </Modal>

      {/* Wallet Top-Up Modal */}
      <Modal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        title="QuickBite Money Wallet"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              backgroundColor: '#161616',
              borderRadius: '16px',
              padding: '16px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div style={{ fontSize: '12px', color: '#9E9E9E' }}>Available Wallet Balance</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#22C55E', margin: '4px 0' }}>
              ₹{walletBalance.toFixed(2)}
            </div>
            <div style={{ fontSize: '11px', color: '#6E6E6E' }}>
              Used instantly for 1-click checkout with 0 gateway failures
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#9E9E9E', display: 'block', marginBottom: '8px' }}>
              Select Top-up Amount
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {['100', '200', '500'].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTopupAmount(amt)}
                  style={{
                    backgroundColor: topupAmount === amt ? '#FF7200' : '#1E1E1E',
                    border: topupAmount === amt ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '10px',
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  +₹{amt}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleTopupWallet(topupAmount)}
            style={{
              backgroundColor: '#22C55E',
              border: 'none',
              borderRadius: '9999px',
              padding: '12px',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Add ₹{topupAmount} Now
          </button>
        </div>
      </Modal>

      {/* Saved Addresses Modal */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title="Saved Addresses"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {savedAddresses.map((addr) => (
            <div
              key={addr._id}
              style={{
                backgroundColor: '#1E1E1E',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '14px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '10px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>{addr.label}</span>
                  {addr.isDefault && (
                    <span style={{ fontSize: '10px', backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#22C55E', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      DEFAULT
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: '#9E9E9E', marginTop: '4px' }}>
                  {addr.street}, {addr.city} - {addr.zipCode}
                </div>
              </div>

              <button
                onClick={() => handleDeleteAddress(addr._id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#737373',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#EF4444')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#737373')}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {/* Add Address Form */}
          <form onSubmit={handleAddAddress} style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>Add New Address</span>

            <div style={{ display: 'flex', gap: '8px' }}>
              {['Home', 'Work', 'Other'].map((lbl) => (
                <button
                  key={lbl}
                  type="button"
                  onClick={() => setAddrLabel(lbl)}
                  style={{
                    flex: 1,
                    backgroundColor: addrLabel === lbl ? '#FF7200' : '#1E1E1E',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {lbl}
                </button>
              ))}
            </div>

            <input
              type="text"
              required
              placeholder="Street / Flat / Landmark"
              value={addrStreet}
              onChange={(e) => setAddrStreet(e.target.value)}
              style={{
                backgroundColor: '#1E1E1E',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '9px 12px',
                color: '#FFFFFF',
                fontSize: '13px',
                outline: 'none'
              }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input
                type="text"
                placeholder="City"
                value={addrCity}
                onChange={(e) => setAddrCity(e.target.value)}
                style={{
                  backgroundColor: '#1E1E1E',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <input
                type="text"
                placeholder="Zipcode / Pincode"
                value={addrZip}
                onChange={(e) => setAddrZip(e.target.value)}
                style={{
                  backgroundColor: '#1E1E1E',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: '#FF7200',
                border: 'none',
                borderRadius: '9999px',
                padding: '10px',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Save Address
            </button>
          </form>
        </div>
      </Modal>

      {/* Help Modal */}
      <Modal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        title="24x7 QuickBite Support"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(255, 114, 0, 0.15)', color: '#FF7200', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
            <Headphones size={28} />
          </div>
          <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>How can we help you?</h4>
          <p style={{ fontSize: '13px', color: '#9E9E9E', margin: 0 }}>
            Have a question about your order, food delivery, or refund? Our automated AI assistant BiteBot is live!
          </p>
          <button
            onClick={() => {
              setIsHelpModalOpen(false);
              showToast('Opening BiteBot AI Assistant...', 'info');
              const chatBtn = document.getElementById('quickbite-chatbot-btn');
              if (chatBtn) chatBtn.click();
            }}
            style={{
              backgroundColor: '#FF7200',
              border: 'none',
              borderRadius: '9999px',
              padding: '12px',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Chat with BiteBot
          </button>
        </div>
      </Modal>

      {/* Floating Bottom Nav */}
      <BottomNav />
    </div>
  );
};

export default CustomerProfilePage;
