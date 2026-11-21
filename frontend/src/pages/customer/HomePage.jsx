import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Flame,
  Search,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Clock,
  Star,
  Zap,
  ShieldCheck,
  Award,
  Heart
} from 'lucide-react';
import api from '../../services/api';
import { MOCK_CATEGORIES, MOCK_DISHES, MOCK_RESTAURANTS, MOCK_PROMO_BANNERS } from '../../data/mockData';
import RestaurantCard from '../../components/common/RestaurantCard';
import FoodCard from '../../components/common/FoodCard';
import FoodDetailModal from '../../components/common/FoodDetailModal';
import LocationModal from '../../components/common/LocationModal';
import Button from '../../components/common/Button';
import { useLocationContext } from '../../context/LocationContext';
import { useToast } from '../../context/ToastContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { currentLocation, setIsLocationModalOpen } = useLocationContext();

  const [restaurants, setRestaurants] = useState(MOCK_RESTAURANTS);
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [dishes, setDishes] = useState(MOCK_DISHES);
  const [searchVal, setSearchVal] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedCoupon, setCopiedCoupon] = useState(null);

  // Selected dish for popup details
  const [detailDish, setDetailDish] = useState(null);

  // Auto carousel slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % MOCK_PROMO_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real data if backend is reachable, fallback gracefully
  useEffect(() => {
    Promise.all([
      api.get('/restaurants'),
      api.get('/categories')
    ])
      .then(([resRest, resCat]) => {
        if (resRest.data?.success && resRest.data.data.length > 0) {
          setRestaurants(resRest.data.data);
        }
        if (resCat.data?.success && resCat.data.categories.length > 0) {
          // Merge with 10 categories
          setCategories(MOCK_CATEGORIES);
        }
      })
      .catch(() => {
        // Keeps mock data seamlessly
      });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    showToast(`Coupon ${code} copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  const popularDishes = dishes.filter((d) => d.isPopular || d.isBestseller);
  const recommendedDishes = dishes.filter((d) => d.isRecommended);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Location Bar & Quick Announcement */}
      <div
        style={{
          backgroundColor: '#161616',
          borderBottom: '1px solid #292929',
          padding: '8px 0'
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
          <div
            onClick={() => setIsLocationModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#A3A3A3', cursor: 'pointer' }}
          >
            <MapPin size={14} color="#FF7900" />
            <span>Delivering to: <strong style={{ color: '#FFFFFF' }}>{currentLocation}</strong></span>
            <span style={{ color: '#FF7900', fontWeight: 700, marginLeft: '4px' }}>Change</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22C55E', fontWeight: 600 }}>
            <Sparkles size={13} />
            <span>Use code <strong>QUICKBITE50</strong> for 50% discount</span>
          </div>
        </div>
      </div>

      {/* Hero Banner Carousel */}
      <section style={{ padding: '24px 0 32px 0' }}>
        <div className="container">
          <div
            style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid #333333',
              boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
              minHeight: '260px',
              background: MOCK_PROMO_BANNERS[currentSlide].bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '40px 48px',
              transition: 'background 0.5s ease'
            }}
          >
            {/* Slide Text Content */}
            <div style={{ maxWidth: '480px', zIndex: 2 }}>
              <span style={{ backgroundColor: 'rgba(255, 121, 0, 0.2)', color: '#FF7900', border: '1px solid #FF7900', padding: '4px 12px', borderRadius: '9999px', fontSize: '11px', fontWeight: 800 }}>
                {MOCK_PROMO_BANNERS[currentSlide].badge}
              </span>
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 900, color: '#FFFFFF', margin: '12px 0 6px 0', lineHeight: 1.15 }}>
                {MOCK_PROMO_BANNERS[currentSlide].title}
              </h2>
              <p style={{ color: '#E5E5E5', fontSize: '14px', margin: '0 0 18px 0' }}>
                {MOCK_PROMO_BANNERS[currentSlide].subtitle}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/search')}
                >
                  Order Feast Now
                </Button>
                <button
                  onClick={() => copyCouponCode(MOCK_PROMO_BANNERS[currentSlide].code)}
                  style={{
                    backgroundColor: 'rgba(17,17,17,0.7)',
                    border: '1px dashed #FF7900',
                    color: '#FF7900',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {copiedCoupon === MOCK_PROMO_BANNERS[currentSlide].code ? 'COPIED!' : `CODE: ${MOCK_PROMO_BANNERS[currentSlide].code}`}
                </button>
              </div>
            </div>

            {/* Slide Image */}
            <div
              style={{
                width: '260px',
                height: '190px',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '2px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                display: 'none', // Shown on desktop
                position: 'relative'
              }}
              className="carousel-desktop-img"
            >
              <img
                src={MOCK_PROMO_BANNERS[currentSlide].image}
                alt="Promo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Carousel navigation arrows */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + MOCK_PROMO_BANNERS.length) % MOCK_PROMO_BANNERS.length)}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', color: '#FFF', padding: '6px', cursor: 'pointer' }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % MOCK_PROMO_BANNERS.length)}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', color: '#FFF', padding: '6px', cursor: 'pointer' }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* 10 Food Categories Grid */}
      <section style={{ padding: '24px 0 36px 0', borderBottom: '1px solid #242424' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>
                What are you craving today?
              </h2>
              <span style={{ fontSize: '13px', color: '#A3A3A3' }}>
                Explore 10 curated local culinary categories
              </span>
            </div>
            <Link to="/search" style={{ color: '#FF7900', fontSize: '13px', fontWeight: 700 }}>
              View All →
            </Link>
          </div>

          {/* 10 Categories horizontal scroll / grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))',
              gap: '12px'
            }}
          >
            {categories.map((cat) => (
              <div
                key={cat.id || cat._id}
                onClick={() => navigate(`/search?q=${encodeURIComponent(cat.name)}`)}
                style={{
                  backgroundColor: '#1C1C1C',
                  border: '1px solid #333333',
                  borderRadius: '14px',
                  padding: '14px 10px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FF7900';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(255, 121, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#333333';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid #FF7900',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#242424'
                  }}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}>{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Food Section */}
      <section style={{ padding: '40px 0 20px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={22} color="#FF7900" />
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
                  Most Popular Dishes in Mumbai
                </h3>
                <span style={{ fontSize: '12px', color: '#A3A3A3' }}>Ordered 500+ times this week</span>
              </div>
            </div>
            <Link to="/search" style={{ color: '#FF7900', fontSize: '13px', fontWeight: 600 }}>
              See All →
            </Link>
          </div>

          <div className="grid-responsive-cards">
            {popularDishes.slice(0, 4).map((dish) => (
              <div key={dish._id} onClick={() => setDetailDish(dish)} style={{ cursor: 'pointer' }}>
                <FoodCard
                  item={dish}
                  restaurant={{ _id: dish.restaurantId, name: dish.restaurantName }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Restaurants Section */}
      <section style={{ padding: '36px 0 20px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={22} color="#22C55E" />
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
                  Nearby Gourmet Kitchens
                </h3>
                <span style={{ fontSize: '12px', color: '#A3A3A3' }}>Piping hot delivery under 30 mins</span>
              </div>
            </div>
            <Link to="/restaurants" style={{ color: '#FF7900', fontSize: '13px', fontWeight: 600 }}>
              Explore All Kitchens →
            </Link>
          </div>

          <div className="grid-responsive-cards">
            {restaurants.slice(0, 3).map((rest) => (
              <RestaurantCard key={rest._id} restaurant={rest} />
            ))}
          </div>
        </div>
      </section>

      {/* Chef Recommended Food Section */}
      <section style={{ padding: '36px 0 20px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={22} color="#FF7900" />
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0 }}>
                  Chef Recommended Specials
                </h3>
                <span style={{ fontSize: '12px', color: '#A3A3A3' }}>Curated flavors handpicked for foodies</span>
              </div>
            </div>
            <Link to="/search" style={{ color: '#FF7900', fontSize: '13px', fontWeight: 600 }}>
              See All →
            </Link>
          </div>

          <div className="grid-responsive-cards">
            {recommendedDishes.slice(0, 4).map((dish) => (
              <div key={dish._id} onClick={() => setDetailDish(dish)} style={{ cursor: 'pointer' }}>
                <FoodCard
                  item={dish}
                  restaurant={{ _id: dish.restaurantId, name: dish.restaurantName }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Food Detail Modal Trigger */}
      <FoodDetailModal
        isOpen={!!detailDish}
        onClose={() => setDetailDish(null)}
        dish={detailDish}
        restaurant={{ _id: detailDish?.restaurantId, name: detailDish?.restaurantName }}
      />

      {/* Location Modal */}
      <LocationModal />
    </div>
  );
};

export default HomePage;
