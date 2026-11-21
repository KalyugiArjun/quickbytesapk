import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, Zap, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Discover Nearby Hot Food',
      description: 'Explore the highest-rated authentic Nizami dum biryanis, sourdough pizzerias, and pure veg Gujarati feasts in your neighborhood.',
      icon: MapPin,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80',
      tag: 'LOCAL GOURMET'
    },
    {
      title: 'Affordable, Feast-Worthy Deals',
      description: 'Save big with verified discount coupons (QUICKBITE50, MOJKARO), zero hidden fees, and transparent pricing.',
      icon: DollarSign,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80',
      tag: 'BEST PRICES'
    },
    {
      title: 'Fast & Convenient Ordering',
      description: 'Order in 3 clicks with QuickBite Wallet, UPI, or Cash on Delivery, followed by real-time kitchen status tracking.',
      icon: Zap,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80',
      tag: 'LIGHTNING FAST'
    }
  ];

  const handleFinish = () => {
    localStorage.setItem('quickbite_has_onboarded', 'true');
    navigate('/');
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleFinish();
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#111111',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '30px 20px',
        maxWidth: '540px',
        margin: '0 auto'
      }}
    >
      {/* Top Header with Skip Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF' }}>
          Quick<span style={{ color: '#FF7900' }}>Bite</span>
        </span>
        <button
          onClick={handleFinish}
          style={{
            background: 'none',
            border: 'none',
            color: '#A3A3A3',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Skip Intro
        </button>
      </div>

      {/* Main Slide Card */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '20px 0' }}>
        <div
          style={{
            width: '100%',
            height: '280px',
            borderRadius: '20px',
            overflow: 'hidden',
            border: '1px solid #333333',
            marginBottom: '28px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
            position: 'relative'
          }}
        >
          <img
            src={slide.image}
            alt={slide.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: '#FF7900',
              color: '#FFF',
              fontSize: '11px',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '9999px'
            }}
          >
            {slide.tag}
          </div>
        </div>

        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            backgroundColor: '#1C1C1C',
            border: '1px solid #FF7900',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FF7900',
            marginBottom: '16px'
          }}
        >
          <Icon size={26} />
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 10px 0' }}>
          {slide.title}
        </h2>
        <p style={{ fontSize: '14px', color: '#A3A3A3', lineHeight: 1.6, margin: 0, maxWidth: '400px' }}>
          {slide.description}
        </p>

        {/* Step Indicator Dots */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentSlide(i)}
              style={{
                width: currentSlide === i ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: currentSlide === i ? '#FF7900' : '#333333',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom Action Button */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Button variant="primary" size="lg" fullWidth onClick={handleNext} icon={ArrowRight}>
          {currentSlide === slides.length - 1 ? 'Start Feasting (Khaao Pio Moj Karo)' : 'Next Step'}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingPage;
