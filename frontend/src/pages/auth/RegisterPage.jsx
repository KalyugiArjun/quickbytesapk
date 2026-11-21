import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, User, Store, Mail, Lock, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('customer'); // 'customer' or 'vendor'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Vendor specific fields
  const [restaurantName, setRestaurantName] = useState('');
  const [cuisineType, setCuisineType] = useState('Fast Food, Biryani');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [zipCode, setZipCode] = useState('400001');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name,
      email,
      password,
      phone,
      role,
      restaurantName,
      cuisineType,
      street,
      city,
      zipCode
    };

    const res = await register(payload);
    setLoading(false);

    if (res?.success) {
      if (role === 'vendor') {
        navigate('/vendor/dashboard');
      } else {
        navigate('/restaurants');
      }
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 160px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#1C1C1C',
          border: '1px solid #333333',
          borderRadius: '16px',
          padding: '36px',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF7900 0%, #FF5A00 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '10px'
            }}
          >
            <Flame size={26} color="#FFFFFF" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
            Create Your QuickBite Account
          </h2>
          <span style={{ fontSize: '11px', color: '#FF7900', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginTop: '4px' }}>
            Khaao Pio Moj Karo
          </span>
        </div>

        {/* Tab Selector: Customer vs Vendor */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            backgroundColor: '#242424',
            padding: '4px',
            borderRadius: '10px',
            marginBottom: '24px'
          }}
        >
          <button
            type="button"
            onClick={() => setRole('customer')}
            style={{
              backgroundColor: role === 'customer' ? '#FF7900' : 'transparent',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '10px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <User size={15} /> Customer
          </button>

          <button
            type="button"
            onClick={() => setRole('vendor')}
            style={{
              backgroundColor: role === 'vendor' ? '#FF7900' : 'transparent',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '10px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Store size={15} /> Restaurant Partner
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Aarav Sharma"
              style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aarav@domain.com"
              style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
                Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>

          {/* Additional fields if role === 'vendor' */}
          {role === 'vendor' && (
            <div style={{ borderTop: '1px solid #333333', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: '#FF7900', fontWeight: 700 }}>
                Restaurant & Kitchen Info
              </span>

              <div>
                <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
                  Restaurant Name *
                </label>
                <input
                  type="text"
                  required
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="e.g. Spice Route Biryani & Kebabs"
                  style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
                  Cuisines Offered
                </label>
                <input
                  type="text"
                  value={cuisineType}
                  onChange={(e) => setCuisineType(e.target.value)}
                  placeholder="Biryani, Mughlai, Fast Food"
                  style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
                />
              </div>
            </div>
          )}

          <Button variant="primary" type="submit" fullWidth loading={loading} size="lg" style={{ marginTop: '8px' }}>
            {role === 'vendor' ? 'Register Restaurant & Start Selling' : 'Create Customer Account'}
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#A3A3A3' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#FF7900', fontWeight: 700 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
