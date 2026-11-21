import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Sparkles } from 'lucide-react';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically transition to home or onboarding after 2.8 seconds
    const timer = setTimeout(() => {
      const hasOnboarded = localStorage.getItem('quickbite_has_onboarded');
      if (hasOnboarded) {
        navigate('/');
      } else {
        navigate('/onboarding');
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      onClick={() => navigate('/')}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#111111',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        cursor: 'pointer'
      }}
    >
      <div
        className="pulse-glow"
        style={{
          width: '90px',
          height: '90px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #FF7900 0%, #FF5A00 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 30px rgba(255, 121, 0, 0.5)',
          marginBottom: '20px'
        }}
      >
        <Flame size={48} color="#FFFFFF" />
      </div>

      <h1
        style={{
          fontSize: '36px',
          fontWeight: 900,
          margin: 0,
          letterSpacing: '-1px',
          color: '#FFFFFF'
        }}
      >
        Quick<span style={{ color: '#FF7900' }}>Bite</span>
      </h1>

      <span
        style={{
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#FF7900',
          marginTop: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <Sparkles size={14} /> Khaao Pio Moj Karo
      </span>

      <span style={{ position: 'absolute', bottom: '30px', fontSize: '11px', color: '#555' }}>
        Tap anywhere to skip • Initializing QuickBite platform...
      </span>
    </div>
  );
};

export default SplashScreen;
