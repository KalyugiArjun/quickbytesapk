import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Smartphone, Heart, Shield, Award, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#111111',
        borderTop: '1px solid #333333',
        padding: '60px 0 30px 0',
        marginTop: '60px'
      }}
    >
      <div className="container">
        {/* Top Value Badges */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            paddingBottom: '40px',
            borderBottom: '1px solid #2E2E2E',
            marginBottom: '40px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#1C1C1C', border: '1px solid #333333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF7900' }}>
              <Clock size={22} />
            </div>
            <div>
              <h5 style={{ margin: 0, fontSize: '14px', color: '#FFFFFF' }}>Superfast Delivery</h5>
              <p style={{ margin: 0, fontSize: '12px', color: '#A3A3A3' }}>Piping hot food within 30 mins</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#1C1C1C', border: '1px solid #333333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22C55E' }}>
              <Award size={22} />
            </div>
            <div>
              <h5 style={{ margin: 0, fontSize: '14px', color: '#FFFFFF' }}>Hygiene Guaranteed</h5>
              <p style={{ margin: 0, fontSize: '12px', color: '#A3A3A3' }}>Top rated partner kitchens</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#1C1C1C', border: '1px solid #333333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
              <Shield size={22} />
            </div>
            <div>
              <h5 style={{ margin: 0, fontSize: '14px', color: '#FFFFFF' }}>100% Safe Payments</h5>
              <p style={{ margin: 0, fontSize: '12px', color: '#A3A3A3' }}>UPI, Wallet, Cards & COD</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '10px', backgroundColor: '#1C1C1C', border: '1px solid #333333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EC4899' }}>
              <Smartphone size={22} />
            </div>
            <div>
              <h5 style={{ margin: 0, fontSize: '14px', color: '#FFFFFF' }}>Capacitor APK Ready</h5>
              <p style={{ margin: 0, fontSize: '12px', color: '#A3A3A3' }}>Cross-platform mobile ready</p>
            </div>
          </div>
        </div>

        {/* Links Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px',
            marginBottom: '40px'
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Flame size={24} color="#FF7900" />
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>
                Quick<span style={{ color: '#FF7900' }}>Bite</span>
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#A3A3A3', lineHeight: 1.6, marginBottom: '16px' }}>
              QuickBite connects food lovers to the best hand-crafted gourmet kitchens, local biryani masters, and woodfired artisans.
            </p>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#FF7900' }}>
              Khaao Pio Moj Karo
            </span>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '15px', color: '#FFFFFF', marginBottom: '16px', fontWeight: 700 }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#A3A3A3' }}>
              <li><Link to="/restaurants" style={{ color: 'inherit' }}>Browse Restaurants</Link></li>
              <li><Link to="/restaurants?cuisine=Biryani" style={{ color: 'inherit' }}>Biryani Specials</Link></li>
              <li><Link to="/restaurants?cuisine=Pizza" style={{ color: 'inherit' }}>Artisan Pizzas</Link></li>
              <li><Link to="/restaurants?isPureVeg=true" style={{ color: 'inherit' }}>100% Pure Veg</Link></li>
            </ul>
          </div>

          {/* For Partners & Admins */}
          <div>
            <h4 style={{ fontSize: '15px', color: '#FFFFFF', marginBottom: '16px', fontWeight: 700 }}>For Business</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#A3A3A3' }}>
              <li><Link to="/register" style={{ color: 'inherit' }}>Partner with QuickBite (Vendor)</Link></li>
              <li><Link to="/vendor/dashboard" style={{ color: 'inherit' }}>Restaurant Dashboard</Link></li>
              <li><Link to="/admin/dashboard" style={{ color: 'inherit' }}>Admin Portal</Link></li>
              <li><Link to="/login" style={{ color: 'inherit' }}>Staff Sign In</Link></li>
            </ul>
          </div>

          {/* Mobile Download Badge */}
          <div>
            <h4 style={{ fontSize: '15px', color: '#FFFFFF', marginBottom: '16px', fontWeight: 700 }}>Get the Mobile App</h4>
            <p style={{ fontSize: '12px', color: '#A3A3A3', marginBottom: '12px' }}>
              Exported as native Android APK via Capacitor for instantaneous delivery tracking on phone.
            </p>
            <div
              style={{
                backgroundColor: '#1C1C1C',
                border: '1px solid #333333',
                borderRadius: '8px',
                padding: '10px 14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 600
              }}
            >
              <Smartphone size={20} color="#FF7900" />
              <div>
                <div style={{ fontSize: '10px', color: '#A3A3A3' }}>CAPACITOR READY</div>
                <div>QuickBite Android App</div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            borderTop: '1px solid #2E2E2E',
            paddingTop: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: '#737373'
          }}
        >
          <div>
            © {new Date().getFullYear()} QuickBite Technologies Inc. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Crafted with <Heart size={14} color="#EF4444" fill="#EF4444" /> for food enthusiasts.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
