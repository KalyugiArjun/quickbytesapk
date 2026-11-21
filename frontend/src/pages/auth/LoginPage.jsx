import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Flame, Mail, Lock, Sparkles, User, Store, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const LoginPage = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectPath = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res?.success) {
      if (res.user.role === 'vendor') {
        navigate('/vendor/dashboard');
      } else if (res.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(redirectPath === '/login' ? '/' : redirectPath);
      }
    }
  };

  const handleQuickDemo = async (role) => {
    setLoading(true);
    const res = await demoLogin(role);
    setLoading(false);
    if (res?.success) {
      if (role === 'vendor') navigate('/vendor/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
      else navigate('/restaurants');
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
          maxWidth: '440px',
          backgroundColor: '#1C1C1C',
          border: '1px solid #333333',
          borderRadius: '16px',
          padding: '36px',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF7900 0%, #FF5A00 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              boxShadow: '0 4px 14px rgba(255, 121, 0, 0.4)'
            }}
          >
            <Flame size={28} color="#FFFFFF" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
            Welcome Back to QuickBite
          </h2>
          <span style={{ fontSize: '11px', color: '#FF7900', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', display: 'block', marginTop: '4px' }}>
            Khaao Pio Moj Karo
          </span>
        </div>

        {/* One-Click Role Testing Switcher */}
        <div
          style={{
            backgroundColor: '#242424',
            border: '1px solid #333333',
            borderRadius: '10px',
            padding: '12px',
            marginBottom: '24px'
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#A3A3A3', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={13} color="#FF7900" /> INSTANT 1-CLICK DEMO LOGIN:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              style={{
                backgroundColor: '#1C1C1C',
                border: '1px solid #A855F7',
                borderRadius: '6px',
                padding: '8px 4px',
                color: '#C084FC',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              <User size={14} /> Customer
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('vendor')}
              style={{
                backgroundColor: '#1C1C1C',
                border: '1px solid #FF7900',
                borderRadius: '6px',
                padding: '8px 4px',
                color: '#FF7900',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              <Store size={14} /> Vendor
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              style={{
                backgroundColor: '#1C1C1C',
                border: '1px solid #EC4899',
                borderRadius: '6px',
                padding: '8px 4px',
                color: '#F472B6',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              <Shield size={14} /> Admin
            </button>
          </div>
        </div>

        {/* Regular Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#A3A3A3" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                style={{
                  width: '100%',
                  backgroundColor: '#242424',
                  border: '1px solid #333333',
                  borderRadius: '8px',
                  padding: '10px 14px 10px 38px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#A3A3A3" style={{ position: 'absolute', left: '12px', top: '12px' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  backgroundColor: '#242424',
                  border: '1px solid #333333',
                  borderRadius: '8px',
                  padding: '10px 14px 10px 38px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <Button variant="primary" type="submit" fullWidth loading={loading} size="lg" style={{ marginTop: '8px' }}>
            Sign In
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#A3A3A3' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: '#FF7900', fontWeight: 700 }}>
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
