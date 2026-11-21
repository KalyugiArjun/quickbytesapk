import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Flame,
  Search,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag,
  Check,
  ShieldCheck,
  Zap,
  Award
} from 'lucide-react';
import api from '../../services/api';
import RestaurantCard from '../../components/common/RestaurantCard';
import Button from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { useToast } from '../../context/ToastContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState('');
  const [copiedCoupon, setCopiedCoupon] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [resRest, resCat] = await Promise.all([
          api.get('/restaurants'),
          api.get('/categories')
        ]);
        if (resRest.data.success) setRestaurants(resRest.data.data.slice(0, 6));
        if (resCat.data.success) setCategories(resCat.data.categories);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchVal.trim())}`);
    } else {
      navigate('/restaurants');
    }
  };

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    showToast(`Coupon code ${code} copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '80px 0 100px 0',
          background: 'linear-gradient(180deg, #1C1C1C 0%, #111111 100%)',
          borderBottom: '1px solid #333333',
          overflow: 'hidden'
        }}
      >
        {/* Glow ambient circle */}
        <div
          style={{
            position: 'absolute',
            top: '-150px',
            right: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 121, 0, 0.15) 0%, rgba(0,0,0,0) 70%)',
            pointerEvents: 'none'
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'center'
            }}
          >
            {/* Left Hero Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(255, 121, 0, 0.12)',
                  border: '1px solid #FF7900',
                  color: '#FF7900',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  width: 'fit-content'
                }}
              >
                <Sparkles size={14} />
                <span>KHAAO PIO MOJ KARO</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(32px, 5vw, 52px)',
                  lineHeight: 1.15,
                  fontWeight: 900,
                  margin: 0
                }}
              >
                Craving Hot, Gourmet Food? <br />
                <span className="text-gradient">QuickBite Delivers It Fresh.</span>
              </h1>

              <p style={{ fontSize: '16px', color: '#A3A3A3', maxWidth: '500px', margin: 0, lineHeight: 1.6 }}>
                Order from authentic Nizami biryani handis, woodfired sourdough pizzerias, and pure veg Gujarati feasts. Delivered piping hot to your doorstep.
              </p>

              {/* Quick Search */}
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', maxWidth: '480px', marginTop: '10px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={18} color="#A3A3A3" style={{ position: 'absolute', left: '16px', top: '15px' }} />
                  <input
                    type="text"
                    placeholder="Search dishes or restaurants..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: '#242424',
                      border: '1px solid #333333',
                      borderRadius: '10px',
                      padding: '14px 16px 14px 44px',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                <Button variant="primary" type="submit" size="lg">
                  Find Food
                </Button>
              </form>

              {/* Highlights */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', paddingTop: '10px', fontSize: '13px', color: '#A3A3A3' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={16} color="#FF7900" /> ~25 Min Delivery
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} color="#22C55E" /> 100% Quality Checked
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={16} color="#3B82F6" /> Top Rated Kitchens
                </span>
              </div>
            </div>

            {/* Right Hero Image Collage */}
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '460px',
                  height: '380px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: '1px solid #333333',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
                  alt="Delicious food spread"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Floating promo card */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    right: '20px',
                    backgroundColor: 'rgba(28, 28, 28, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid #333333',
                    borderRadius: '14px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#FF7900', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
                      <Flame size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>Special Welcome Offer</div>
                      <div style={{ fontSize: '11px', color: '#A3A3A3' }}>Use QUICKBITE50 for 50% OFF</div>
                    </div>
                  </div>
                  <button
                    onClick={() => copyCouponCode('QUICKBITE50')}
                    style={{
                      background: '#242424',
                      border: '1px solid #FF7900',
                      color: '#FF7900',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {copiedCoupon === 'QUICKBITE50' ? 'COPIED' : 'COPY'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cuisine Categories */}
      <section style={{ padding: '60px 0', borderBottom: '1px solid #2E2E2E' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
            <div>
              <span style={{ fontSize: '12px', color: '#FF7900', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Taste the Flavours
              </span>
              <h2 style={{ fontSize: '26px', margin: '4px 0 0 0' }}>Explore Popular Cuisines</h2>
            </div>
            <Link
              to="/restaurants"
              style={{
                color: '#FF7900',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              See All <ArrowRight size={15} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '16px'
            }}
          >
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} height="130px" borderRadius="12px" />
              ))
            ) : (
              categories.map((cat) => (
                <div
                  key={cat._id}
                  onClick={() => navigate(`/restaurants?cuisine=${encodeURIComponent(cat.name)}`)}
                  style={{
                    backgroundColor: '#1C1C1C',
                    border: '1px solid #333333',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#FF7900';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 121, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#333333';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FF7900' }}
                  />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>{cat.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
            <div>
              <span style={{ fontSize: '12px', color: '#FF7900', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Handpicked Favorites
              </span>
              <h2 style={{ fontSize: '26px', margin: '4px 0 0 0' }}>Top Rated Restaurants Near You</h2>
            </div>
            <Link
              to="/restaurants"
              style={{
                color: '#FF7900',
                fontSize: '14px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Browse All <ArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <div className="grid-responsive-cards">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} height="300px" borderRadius="14px" />
              ))}
            </div>
          ) : (
            <div className="grid-responsive-cards">
              {restaurants.map((rest) => (
                <RestaurantCard key={rest._id} restaurant={rest} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Active Discount Deals Banner */}
      <section style={{ padding: '30px 0 60px 0' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, #242424 0%, #1C1C1C 100%)',
              border: '1px solid #FF7900',
              borderRadius: '16px',
              padding: '36px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              alignItems: 'center',
              boxShadow: '0 12px 30px rgba(0,0,0,0.5)'
            }}
          >
            <div>
              <span style={{ backgroundColor: 'rgba(255, 121, 0, 0.2)', color: '#FF7900', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                LIMITED TIME OFFERS
              </span>
              <h3 style={{ fontSize: '24px', fontWeight: 800, margin: '10px 0 6px 0', color: '#FFFFFF' }}>
                Grab Big Discounts on Every Feast!
              </h3>
              <p style={{ color: '#A3A3A3', fontSize: '14px', margin: 0 }}>
                Apply verified promo codes at checkout for instant cash savings.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'flex-end' }}>
              <div
                onClick={() => copyCouponCode('QUICKBITE50')}
                style={{
                  backgroundColor: '#111111',
                  border: '1px dashed #FF7900',
                  borderRadius: '10px',
                  padding: '12px 18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Tag size={18} color="#FF7900" />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>QUICKBITE50</div>
                  <div style={{ fontSize: '11px', color: '#22C55E' }}>50% OFF (Up to ₹150)</div>
                </div>
              </div>

              <div
                onClick={() => copyCouponCode('MOJKARO')}
                style={{
                  backgroundColor: '#111111',
                  border: '1px dashed #FF7900',
                  borderRadius: '10px',
                  padding: '12px 18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Tag size={18} color="#FF7900" />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>MOJKARO</div>
                  <div style={{ fontSize: '11px', color: '#22C55E' }}>Flat ₹100 OFF</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
