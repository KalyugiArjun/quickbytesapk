import React, { useState } from 'react';
import { User, MapPin, Plus, Trash2, Shield, Wallet } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import api from '../../services/api';

const CustomerProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [updating, setUpdating] = useState(false);

  // Address modal
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('Mumbai');
  const [addrZip, setAddrZip] = useState('400001');

  // Top up wallet demo
  const [walletAdding, setWalletAdding] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    await updateProfile({ name, phone });
    setUpdating(false);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!addrStreet.trim() || !addrZip.trim()) {
      showToast('Please provide full address details.', 'warning');
      return;
    }
    try {
      const res = await api.post('/auth/address', {
        label: addrLabel,
        street: addrStreet,
        city: addrCity,
        zipCode: addrZip
      });
      if (res.data.success) {
        showToast('Address added!', 'success');
        setIsAddressModalOpen(false);
        setAddrStreet('');
        window.location.reload();
      }
    } catch (err) {
      showToast('Failed to add address', 'error');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await api.delete(`/auth/address/${addressId}`);
      showToast('Address removed', 'info');
      window.location.reload();
    } catch (err) {
      showToast('Failed to delete address', 'error');
    }
  };

  return (
    <div style={{ minHeight: '80vh', padding: '40px 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '24px' }}>
          My Account
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {/* Profile Details Card */}
          <div
            style={{
              backgroundColor: '#1C1C1C',
              border: '1px solid #333333',
              borderRadius: '14px',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt="Avatar"
                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FF7900' }}
              />
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{user?.name}</h3>
                <span style={{ fontSize: '13px', color: '#A3A3A3' }}>{user?.email}</span>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  Phone Number
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

              <Button variant="primary" type="submit" loading={updating} style={{ marginTop: '8px' }}>
                Save Changes
              </Button>
            </form>
          </div>

          {/* Wallet Balance Card */}
          <div
            style={{
              backgroundColor: '#1C1C1C',
              border: '1px solid #333333',
              borderRadius: '14px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Wallet size={20} color="#FF7900" />
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>
                  QuickBite Wallet
                </h3>
              </div>

              <p style={{ fontSize: '13px', color: '#A3A3A3', margin: '0 0 16px 0' }}>
                Use your wallet for 1-click seamless checkouts and instant order refunds.
              </p>

              <div
                style={{
                  backgroundColor: '#242424',
                  border: '1px solid #333333',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ fontSize: '13px', color: '#A3A3A3' }}>Current Balance</span>
                <span style={{ fontSize: '26px', fontWeight: 900, color: '#22C55E' }}>
                  ₹{user?.walletBalance?.toFixed(2) || '850.00'}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <span style={{ fontSize: '11px', color: '#737373', display: 'block', textAlign: 'center' }}>
                QuickBite Wallet Balance is credited automatically on welcome & refunds.
              </span>
            </div>
          </div>
        </div>

        {/* Saved Addresses Section */}
        <div
          style={{
            marginTop: '30px',
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
                Saved Addresses
              </h3>
            </div>
            <Button variant="outline" size="sm" icon={Plus} onClick={() => setIsAddressModalOpen(true)}>
              Add New Address
            </Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            {user?.addresses && user.addresses.length > 0 ? (
              user.addresses.map((addr) => (
                <div
                  key={addr._id}
                  style={{
                    backgroundColor: '#242424',
                    border: '1px solid #333333',
                    borderRadius: '10px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#FF7900' }}>
                        {addr.label || 'Home'}
                      </span>
                      {addr.isDefault && (
                        <span style={{ fontSize: '10px', backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#4ADE80', padding: '2px 6px', borderRadius: '4px' }}>
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#FFFFFF', lineHeight: 1.4 }}>
                      {addr.street}, {addr.city} - {addr.zipCode}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteAddress(addr._id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#EF4444',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: 0
                    }}
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              ))
            ) : (
              <p style={{ color: '#A3A3A3', fontSize: '13px' }}>
                No saved addresses yet. Click "Add New Address" above.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title="Add New Delivery Address"
      >
        <form onSubmit={handleAddAddress} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
              Address Label (Home, Office, Other)
            </label>
            <input
              type="text"
              value={addrLabel}
              onChange={(e) => setAddrLabel(e.target.value)}
              placeholder="e.g. Home, Work"
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
              Street Address / Flat / Building
            </label>
            <input
              type="text"
              value={addrStreet}
              onChange={(e) => setAddrStreet(e.target.value)}
              placeholder="e.g. 501, Green Heights, Powai"
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
                value={addrCity}
                onChange={(e) => setAddrCity(e.target.value)}
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
                Zip / PIN Code
              </label>
              <input
                type="text"
                value={addrZip}
                onChange={(e) => setAddrZip(e.target.value)}
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

          <Button variant="primary" type="submit">
            Save Address
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default CustomerProfilePage;
