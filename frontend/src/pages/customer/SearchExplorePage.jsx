import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, X, ArrowUpDown, Clock, Star, Flame, Sparkles } from 'lucide-react';
import { MOCK_CATEGORIES, MOCK_DISHES, MOCK_RESTAURANTS } from '../../data/mockData';
import FoodCard from '../../components/common/FoodCard';
import RestaurantCard from '../../components/common/RestaurantCard';
import FoodDetailModal from '../../components/common/FoodDetailModal';

const SearchExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryParam = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceFilter, setPriceFilter] = useState('all'); // all, under200, 200to400, above400
  const [ratingFilter, setRatingFilter] = useState('all'); // all, 4.5, 4.0
  const [sortBy, setSortBy] = useState('popularity'); // popularity, priceAsc, priceDesc, rating
  const [isVegOnly, setIsVegOnly] = useState(false);

  // Modal for Food details
  const [selectedDish, setSelectedDish] = useState(null);

  // Recent searches stored in localStorage
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('quickbite_recent_searches');
      return saved ? JSON.parse(saved) : ['Biryani', 'Pizza', 'Momos', 'Pav Bhaji', 'Thali'];
    } catch (e) {
      return ['Biryani', 'Pizza', 'Momos'];
    }
  });

  const suggestions = ['Hyderabadi Dum Biryani', 'Truffle Woodfired Pizza', 'Butter Pav Bhaji', 'Steamed Momos', 'Mango Lassi', 'Double Smash Burger'];

  useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
      if (!recentSearches.includes(searchTerm.trim())) {
        const updated = [searchTerm.trim(), ...recentSearches.slice(0, 4)];
        setRecentSearches(updated);
        localStorage.setItem('quickbite_recent_searches', JSON.stringify(updated));
      }
    } else {
      setSearchParams({});
    }
  };

  const handleChipClick = (term) => {
    setSearchTerm(term);
    setSearchParams({ q: term });
  };

  // Filter Dishes
  const filteredDishes = MOCK_DISHES.filter((dish) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term ||
      dish.name.toLowerCase().includes(term) ||
      dish.description.toLowerCase().includes(term) ||
      dish.categoryName?.toLowerCase().includes(term) ||
      dish.restaurantName?.toLowerCase().includes(term);

    const matchesCat = selectedCategory === 'All' || dish.categoryName === selectedCategory;
    const matchesVeg = !isVegOnly || dish.isVeg;

    let matchesPrice = true;
    const effPrice = dish.discountPrice || dish.price;
    if (priceFilter === 'under200') matchesPrice = effPrice < 200;
    if (priceFilter === '200to400') matchesPrice = effPrice >= 200 && effPrice <= 400;
    if (priceFilter === 'above400') matchesPrice = effPrice > 400;

    let matchesRating = true;
    if (ratingFilter === '4.5') matchesRating = dish.rating >= 4.5;
    if (ratingFilter === '4.0') matchesRating = dish.rating >= 4.0;

    return matchesSearch && matchesCat && matchesVeg && matchesPrice && matchesRating;
  }).sort((a, b) => {
    const pA = a.discountPrice || a.price;
    const pB = b.discountPrice || b.price;
    if (sortBy === 'priceAsc') return pA - pB;
    if (sortBy === 'priceDesc') return pB - pA;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
  });

  return (
    <div style={{ minHeight: '85vh', padding: '40px 0 80px 0' }}>
      <div className="container">
        {/* Header Search Box */}
        <div style={{ maxWidth: '700px', margin: '0 auto 24px auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: '30px', fontWeight: 900, marginBottom: '8px' }}>
            Explore Delicious Food & Kitchens
          </h1>
          <p style={{ color: '#A3A3A3', fontSize: '14px', marginBottom: '20px' }}>
            Search across local kitchens, artisan bakeshops, and street favorites.
          </p>

          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', position: 'relative' }}>
            <Search size={18} color="#A3A3A3" style={{ position: 'absolute', left: '16px', top: '15px' }} />
            <input
              type="text"
              placeholder="Search dishes, restaurants, or cuisines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: '#1C1C1C',
                border: '1px solid #333333',
                borderRadius: '12px',
                padding: '14px 16px 14px 44px',
                color: '#FFFFFF',
                fontSize: '15px',
                outline: 'none'
              }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => { setSearchTerm(''); setSearchParams({}); }}
                style={{ position: 'absolute', right: '110px', top: '14px', background: 'none', border: 'none', color: '#A3A3A3', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            )}
            <button
              type="submit"
              style={{
                backgroundColor: '#FF7900',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '0 24px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Search
            </button>
          </form>

          {/* Recent & Suggested Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px' }}>
            <span style={{ fontSize: '11px', color: '#737373', fontWeight: 700 }}>POPULAR:</span>
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleChipClick(s)}
                style={{
                  backgroundColor: '#242424',
                  border: '1px solid #333333',
                  borderRadius: '9999px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  color: '#A3A3A3',
                  cursor: 'pointer'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Facet Filter Bar */}
        <div
          style={{
            backgroundColor: '#1C1C1C',
            border: '1px solid #333333',
            borderRadius: '14px',
            padding: '16px 20px',
            marginBottom: '30px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          {/* Cuisines categories */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            <button
              onClick={() => setSelectedCategory('All')}
              style={{
                backgroundColor: selectedCategory === 'All' ? '#FF7900' : '#242424',
                color: selectedCategory === 'All' ? '#FFFFFF' : '#A3A3A3',
                border: '1px solid #333333',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              All Items
            </button>
            {MOCK_CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.name)}
                style={{
                  backgroundColor: selectedCategory === c.name ? '#FF7900' : '#242424',
                  color: selectedCategory === c.name ? '#FFFFFF' : '#A3A3A3',
                  border: '1px solid #333333',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {c.icon} {c.name}
              </button>
            ))}
          </div>

          {/* Quick Filters: Price, Veg, Sort */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            {/* Pure veg toggle */}
            <button
              onClick={() => setIsVegOnly(!isVegOnly)}
              style={{
                backgroundColor: isVegOnly ? 'rgba(34, 197, 94, 0.2)' : '#242424',
                color: isVegOnly ? '#4ADE80' : '#A3A3A3',
                border: isVegOnly ? '1px solid #22C55E' : '1px solid #333333',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              🟢 Pure Veg
            </button>

            {/* Price filter */}
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              style={{
                backgroundColor: '#242424',
                color: '#FFFFFF',
                border: '1px solid #333333',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '12px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">Any Price</option>
              <option value="under200">Under ₹200</option>
              <option value="200to400">₹200 - ₹400</option>
              <option value="above400">Above ₹400</option>
            </select>

            {/* Rating Filter */}
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              style={{
                backgroundColor: '#242424',
                color: '#FFFFFF',
                border: '1px solid #333333',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '12px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">Any Rating</option>
              <option value="4.5">⭐ 4.5+ Rating</option>
              <option value="4.0">⭐ 4.0+ Rating</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                backgroundColor: '#242424',
                color: '#FF7900',
                border: '1px solid #333333',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '12px',
                fontWeight: 700,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="popularity">Popularity</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div style={{ marginBottom: '18px', color: '#A3A3A3', fontSize: '13px' }}>
          Found <strong style={{ color: '#FFFFFF' }}>{filteredDishes.length}</strong> delicious dishes
        </div>

        {/* Dishes Grid */}
        <div className="grid-responsive-cards">
          {filteredDishes.map((dish) => (
            <div key={dish._id} onClick={() => setSelectedDish(dish)} style={{ cursor: 'pointer' }}>
              <FoodCard
                item={dish}
                restaurant={{ _id: dish.restaurantId, name: dish.restaurantName }}
              />
            </div>
          ))}
        </div>

        {/* Food Detail Modal */}
        <FoodDetailModal
          isOpen={!!selectedDish}
          onClose={() => setSelectedDish(null)}
          dish={selectedDish}
          restaurant={{ _id: selectedDish?.restaurantId, name: selectedDish?.restaurantName }}
        />
      </div>
    </div>
  );
};

export default SearchExplorePage;
