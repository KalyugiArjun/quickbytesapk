import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  ChevronRight,
  Flame,
  Star,
  Clock,
  Sparkles,
  Tag,
  ShoppingBag,
  Bell,
  Menu
} from 'lucide-react';
import api from '../../services/api';
import { MOCK_CATEGORIES, MOCK_DISHES, MOCK_RESTAURANTS, MOCK_PROMO_BANNERS } from '../../data/mockData';
import FoodCard from '../../components/common/FoodCard';
import FoodDetailModal from '../../components/common/FoodDetailModal';
import LocationModal from '../../components/common/LocationModal';
import RestaurantCard from '../../components/common/RestaurantCard';
import BottomNav from '../../components/common/BottomNav';
import { useLocationContext } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { currentLocation, setIsLocationModalOpen } = useLocationContext();

  const [restaurants, setRestaurants] = useState(MOCK_RESTAURANTS);
  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [dishes, setDishes] = useState(MOCK_DISHES);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchVal, setSearchVal] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Selected dish for popup details (Screen 1)
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

  const handleCategoryClick = (cat) => {
    if (selectedCategory === cat.name) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(cat.name);
    }
  };

  const filteredDishes = selectedCategory
    ? dishes.filter(
        (d) =>
          d.category?.toLowerCase() === selectedCategory.toLowerCase() ||
          d.categoryName?.toLowerCase() === selectedCategory.toLowerCase()
      )
    : dishes;

  // Featured foods (top 4 or 6)
  const featuredFoods = filteredDishes.slice(0, 6);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '90px', backgroundColor: '#0F0F0F' }}>
      <div className="container" style={{ paddingTop: '16px' }}>
        
        {/* Top App Bar matching Screen 2 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}
        >
          {/* User Info / Greeting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #FF7200',
                padding: '1px',
                backgroundColor: '#1E1E1E'
              }}
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                alt="User"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>

            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2 }}>
                Hello, {user?.name ? user.name.split(' ')[0] : 'Jhon'}
              </div>
              <div
                onClick={() => setIsLocationModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  color: '#9E9E9E',
                  cursor: 'pointer',
                  marginTop: '2px'
                }}
              >
                <MapPin size={12} color="#FF7200" />
                <span>{currentLocation || 'California, USA'}</span>
              </div>
            </div>
          </div>

          {/* Right Action Button (Dark Circular Pill) */}
          <button
            onClick={() => navigate('/search')}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#1E1E1E',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            aria-label="Filter foods"
          >
            <SlidersHorizontal size={18} color="#FFFFFF" />
          </button>
        </div>

        {/* Search Bar with Orange Filter Icon matching Screen 2 */}
        <form
          onSubmit={handleSearch}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '24px'
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '16px',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              color: '#737373'
            }}
          >
            <Search size={18} />
          </div>

          <input
            type="text"
            placeholder="Search foods..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            style={{
              width: '100%',
              height: '50px',
              backgroundColor: '#1E1E1E',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '9999px',
              padding: '0 54px 0 46px',
              color: '#FFFFFF',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#FF7200';
              e.target.style.boxShadow = '0 0 16px rgba(255, 114, 0, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.target.style.boxShadow = 'none';
            }}
          />

          {/* Orange Circular Filter Button on Right */}
          <button
            type="submit"
            style={{
              position: 'absolute',
              right: '6px',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#FF7200',
              backgroundImage: 'linear-gradient(135deg, #FF7200 0%, #FF5500 100%)',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(255, 114, 0, 0.4)'
            }}
            aria-label="Filter Search"
          >
            <SlidersHorizontal size={16} />
          </button>
        </form>

        {/* Circular Categories Carousel matching Screen 2 */}
        <div style={{ marginBottom: '28px' }}>
          <div className="category-scroll-container">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <div
                  key={cat.id || cat.name}
                  onClick={() => handleCategoryClick(cat)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  {/* Circular Button Container */}
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: isActive ? 'rgba(255, 114, 0, 0.15)' : '#1E1E1E',
                      border: isActive ? '2px solid #FF7200' : '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      padding: '4px',
                      boxShadow: isActive ? '0 4px 16px rgba(255, 114, 0, 0.3)' : '0 4px 10px rgba(0,0,0,0.3)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  </div>

                  {/* Category Name */}
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#FF7200' : '#A3A3A3',
                      transition: 'color 0.2s ease'
                    }}
                  >
                    {cat.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Featured Food Section Header matching Screen 2 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}
        >
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
            Featured Food
          </h3>

          <Link
            to="/search"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#FF7200',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            <span>See All</span>
            <ChevronRight size={15} />
          </Link>
        </div>

        {/* 2-Column Food Grid matching Screen 2 */}
        <div className="featured-food-grid" style={{ marginBottom: '32px' }}>
          {featuredFoods.map((dish) => (
            <FoodCard
              key={dish._id}
              item={dish}
              restaurant={restaurants.find((r) => r._id === dish.restaurantId)}
              onSelectDish={(item, rest) => setDetailDish(item)}
            />
          ))}
        </div>

        {/* Unslopped Deal Banner Carousel */}
        <div style={{ marginBottom: '36px' }}>
          <div
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backgroundColor: '#1A1A1A',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5)'
            }}
          >
            <div style={{ maxWidth: '340px' }}>
              <span
                style={{
                  backgroundColor: 'rgba(255, 114, 0, 0.15)',
                  color: '#FF7200',
                  border: '1px solid rgba(255, 114, 0, 0.4)',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 800
                }}
              >
                {MOCK_PROMO_BANNERS[currentSlide].badge}
              </span>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: '10px 0 6px 0' }}>
                {MOCK_PROMO_BANNERS[currentSlide].title}
              </h3>
              <p style={{ color: '#9E9E9E', fontSize: '13px', margin: '0 0 14px 0' }}>
                {MOCK_PROMO_BANNERS[currentSlide].subtitle}
              </p>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(MOCK_PROMO_BANNERS[currentSlide].code);
                  showToast(`Coupon ${MOCK_PROMO_BANNERS[currentSlide].code} copied!`, 'success');
                }}
                style={{
                  backgroundColor: '#FF7200',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '8px 18px',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Tag size={13} />
                <span>Apply {MOCK_PROMO_BANNERS[currentSlide].code}</span>
              </button>
            </div>

            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
                border: '3px solid #282828',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
              }}
            >
              <img
                src={MOCK_PROMO_BANNERS[currentSlide].image}
                alt="Promo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>

        {/* Nearby Gourmet Kitchens */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              Top Kitchens Near You
            </h3>
            <Link
              to="/restaurants"
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#FF7200',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '2px'
              }}
            >
              <span>Explore All</span>
              <ChevronRight size={15} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '18px'
            }}
          >
            {restaurants.slice(0, 3).map((rest) => (
              <RestaurantCard key={rest._id} restaurant={rest} />
            ))}
          </div>
        </div>

      </div>

      {/* Food Detail Modal (Screen 1 in image) */}
      <FoodDetailModal
        isOpen={!!detailDish}
        onClose={() => setDetailDish(null)}
        dish={detailDish}
        restaurant={restaurants.find((r) => r._id === detailDish?.restaurantId)}
      />

      {/* Location Modal */}
      <LocationModal />

      {/* Floating Pill Bottom Navigation Dock */}
      <BottomNav />
    </div>
  );
};

export default HomePage;
