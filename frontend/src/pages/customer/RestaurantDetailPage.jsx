import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Clock,
  Bike,
  Leaf,
  MapPin,
  Phone,
  Search,
  MessageSquarePlus,
  Send
} from 'lucide-react';
import api from '../../services/api';
import FoodCard from '../../components/common/FoodCard';
import { FoodCardSkeleton, Skeleton } from '../../components/common/Skeleton';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const { showToast } = useToast();

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters within menu
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' or 'reviews'
  const [menuSearch, setMenuSearch] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const [resRest, resRev] = await Promise.all([
          api.get(`/restaurants/${id}`),
          api.get(`/reviews/restaurant/${id}`)
        ]);

        if (resRest.data.success) {
          setRestaurant(resRest.data.restaurant);
          setMenuItems(resRest.data.menuItems);
        }
        if (resRev.data.success) {
          setReviews(resRev.data.reviews);
        }
      } catch (err) {
        console.error('Failed to load restaurant details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  const handlePostReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please log in to share your review.', 'warning');
      return;
    }
    if (!reviewComment.trim()) {
      showToast('Please provide your review feedback.', 'warning');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.post('/reviews', {
        restaurantId: id,
        rating: reviewRating,
        comment: reviewComment.trim()
      });

      if (res.data.success) {
        showToast('Review posted successfully! Thank you.', 'success');
        setReviews([res.data.review, ...reviews]);
        setIsReviewModalOpen(false);
        setReviewComment('');
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <Skeleton height="260px" borderRadius="16px" style={{ marginBottom: '24px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <FoodCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>Restaurant not found</h2>
        <Link to="/restaurants">
          <Button variant="primary">Return to Restaurants</Button>
        </Link>
      </div>
    );
  }

  // Derive unique categories present in menu
  const menuCategories = ['All', ...new Set(menuItems.map((item) => item.categoryName || 'Chef Specials'))];

  // Filtered menu
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
                          item.description.toLowerCase().includes(menuSearch.toLowerCase());
    const matchesVeg = vegOnly ? item.isVeg === true : true;
    const matchesCat = selectedCategory === 'All' ? true : item.categoryName === selectedCategory;
    return matchesSearch && matchesVeg && matchesCat;
  });

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      {/* Hero Cover Banner */}
      <div style={{ position: 'relative', width: '100%', height: '300px', overflow: 'hidden' }}>
        <img
          src={restaurant.bannerImage}
          alt={restaurant.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(17,17,17,0.4) 0%, rgba(17,17,17,0.95) 100%)'
          }}
        />

        {/* Content over banner */}
        <div
          className="container"
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '20px',
            width: '100%'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img
              src={restaurant.logo}
              alt={restaurant.name}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '16px',
                border: '3px solid #FF7900',
                objectFit: 'cover',
                boxShadow: '0 8px 20px rgba(0,0,0,0.6)'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', margin: 0, color: '#FFFFFF' }}>
                  {restaurant.name}
                </h1>
                {restaurant.isPureVeg && (
                  <span style={{ backgroundColor: '#22C55E', color: '#FFF', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
                    PURE VEG
                  </span>
                )}
              </div>
              <p style={{ color: '#FF7900', fontSize: '14px', margin: '4px 0 0 0', fontWeight: 600 }}>
                {restaurant.cuisineType ? restaurant.cuisineType.join(' • ') : 'Multi-Cuisine'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px', fontSize: '13px', color: '#A3A3A3' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} color="#FF7900" /> {restaurant.address?.street}, {restaurant.address?.city}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={14} color="#FF7900" /> {restaurant.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', gap: '14px' }}>
            <div
              style={{
                backgroundColor: 'rgba(28, 28, 28, 0.9)',
                border: '1px solid #333333',
                borderRadius: '10px',
                padding: '10px 16px',
                textAlign: 'center'
              }}
            >
              <div style={{ color: '#4ADE80', fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Star size={16} fill="#4ADE80" /> {restaurant.rating || 4.5}
              </div>
              <span style={{ fontSize: '11px', color: '#A3A3A3' }}>{reviews.length} reviews</span>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(28, 28, 28, 0.9)',
                border: '1px solid #333333',
                borderRadius: '10px',
                padding: '10px 16px',
                textAlign: 'center'
              }}
            >
              <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Clock size={16} color="#FF7900" /> {restaurant.deliveryTimeMinutes || 30} mins
              </div>
              <span style={{ fontSize: '11px', color: '#A3A3A3' }}>₹{restaurant.deliveryFee} delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="container" style={{ marginTop: '24px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #333333',
            paddingBottom: '16px',
            marginBottom: '24px'
          }}
        >
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={() => setActiveTab('menu')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '16px',
                fontWeight: 700,
                color: activeTab === 'menu' ? '#FF7900' : '#A3A3A3',
                borderBottom: activeTab === 'menu' ? '2px solid #FF7900' : '2px solid transparent',
                paddingBottom: '8px',
                cursor: 'pointer'
              }}
            >
              Menu Catalog ({menuItems.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '16px',
                fontWeight: 700,
                color: activeTab === 'reviews' ? '#FF7900' : '#A3A3A3',
                borderBottom: activeTab === 'reviews' ? '2px solid #FF7900' : '2px solid transparent',
                paddingBottom: '8px',
                cursor: 'pointer'
              }}
            >
              Customer Reviews ({reviews.length})
            </button>
          </div>

          {activeTab === 'reviews' && (
            <Button
              variant="outline"
              size="sm"
              icon={MessageSquarePlus}
              onClick={() => setIsReviewModalOpen(true)}
            >
              Write a Review
            </Button>
          )}
        </div>

        {/* Tab 1: Menu Items */}
        {activeTab === 'menu' && (
          <div>
            {/* Search and Category Filters */}
            <div
              style={{
                backgroundColor: '#1C1C1C',
                border: '1px solid #333333',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px'
              }}
            >
              {/* Category Pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {menuCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      backgroundColor: selectedCategory === cat ? '#FF7900' : '#242424',
                      color: selectedCategory === cat ? '#FFFFFF' : '#A3A3A3',
                      border: '1px solid #333333',
                      borderRadius: '8px',
                      padding: '6px 14px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search & Veg toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => setVegOnly(!vegOnly)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: vegOnly ? 'rgba(34, 197, 94, 0.2)' : '#242424',
                    color: vegOnly ? '#4ADE80' : '#A3A3A3',
                    border: vegOnly ? '1px solid #22C55E' : '1px solid #333333',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Leaf size={14} color={vegOnly ? '#4ADE80' : '#A3A3A3'} /> Veg Only
                </button>

                <div style={{ position: 'relative' }}>
                  <Search size={15} color="#A3A3A3" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                  <input
                    type="text"
                    placeholder="Search menu..."
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    style={{
                      backgroundColor: '#242424',
                      border: '1px solid #333333',
                      borderRadius: '8px',
                      padding: '6px 12px 6px 32px',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      outline: 'none',
                      width: '180px'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Dishes Grid */}
            {filteredItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#A3A3A3' }}>
                No dishes found matching your current filter.
              </div>
            ) : (
              <div className="grid-responsive-cards">
                {filteredItems.map((dish) => (
                  <FoodCard key={dish._id} item={dish} restaurant={restaurant} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Reviews */}
        {activeTab === 'reviews' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reviews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#A3A3A3' }}>
                No reviews yet. Be the first to share your experience!
              </div>
            ) : (
              reviews.map((rev) => (
                <div
                  key={rev._id}
                  style={{
                    backgroundColor: '#1C1C1C',
                    border: '1px solid #333333',
                    borderRadius: '12px',
                    padding: '18px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={rev.customerAvatar}
                        alt={rev.customerName}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '14px' }}>
                          {rev.customerName}
                        </div>
                        <div style={{ fontSize: '12px', color: '#737373' }}>
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: 'rgba(34, 197, 94, 0.15)',
                        color: '#4ADE80',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 700
                      }}
                    >
                      <Star size={14} fill="#4ADE80" /> {rev.rating} / 5
                    </div>
                  </div>

                  <p style={{ color: '#E5E5E5', fontSize: '14px', margin: 0, lineHeight: 1.5 }}>
                    "{rev.comment}"
                  </p>

                  {/* Vendor Reply if exists */}
                  {rev.vendorReply && rev.vendorReply.comment && (
                    <div
                      style={{
                        backgroundColor: '#242424',
                        borderLeft: '3px solid #FF7900',
                        borderRadius: '6px',
                        padding: '10px 14px',
                        marginTop: '6px',
                        fontSize: '13px'
                      }}
                    >
                      <span style={{ color: '#FF7900', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                        Response from Kitchen:
                      </span>
                      <span style={{ color: '#A3A3A3' }}>{rev.vendorReply.comment}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title={`Review ${restaurant.name}`}
      >
        <form onSubmit={handlePostReview} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', color: '#A3A3A3', display: 'block', marginBottom: '8px' }}>
              Rating
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setReviewRating(star)}
                  style={{
                    background: star <= reviewRating ? 'rgba(255, 121, 0, 0.2)' : '#242424',
                    border: star <= reviewRating ? '1px solid #FF7900' : '1px solid #333333',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: star <= reviewRating ? '#FF7900' : '#737373',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 700
                  }}
                >
                  <Star size={16} fill={star <= reviewRating ? '#FF7900' : 'none'} />
                  {star}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '13px', color: '#A3A3A3', display: 'block', marginBottom: '8px' }}>
              Your Feedback
            </label>
            <textarea
              rows={4}
              placeholder="Tell others what you loved about the food, taste, packaging..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
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

          <Button variant="primary" type="submit" loading={submittingReview} icon={Send}>
            Submit Review
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default RestaurantDetailPage;
