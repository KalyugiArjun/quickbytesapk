import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Leaf, Star, ArrowUpDown } from 'lucide-react';
import api from '../../services/api';
import RestaurantCard from '../../components/common/RestaurantCard';
import { Skeleton } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';

const RestaurantListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentSearch = searchParams.get('search') || '';
  const currentCuisine = searchParams.get('cuisine') || 'All';
  const currentVegOnly = searchParams.get('isPureVeg') === 'true';
  const currentSort = searchParams.get('sort') || 'rating';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (currentSearch) queryParams.set('search', currentSearch);
        if (currentCuisine && currentCuisine !== 'All') queryParams.set('cuisine', currentCuisine);
        if (currentVegOnly) queryParams.set('isPureVeg', 'true');
        if (currentSort) queryParams.set('sort', currentSort);

        const [resRest, resCat] = await Promise.all([
          api.get(`/restaurants?${queryParams.toString()}`),
          api.get('/categories')
        ]);

        if (resRest.data.success) setRestaurants(resRest.data.data);
        if (resCat.data.success) setCategories(resCat.data.categories);
      } catch (err) {
        console.error('Failed to fetch restaurants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentSearch, currentCuisine, currentVegOnly, currentSort]);

  const updateParam = (key, val) => {
    const newParams = new URLSearchParams(searchParams);
    if (!val || val === 'All' || val === false) {
      newParams.delete(key);
    } else {
      newParams.set(key, val.toString());
    }
    setSearchParams(newParams);
  };

  return (
    <div style={{ minHeight: '80vh', padding: '40px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px 0' }}>
            Restaurants & Cloud Kitchens
          </h1>
          <p style={{ color: '#A3A3A3', fontSize: '14px', margin: 0 }}>
            Discover Mumbai's best handpicked cuisines and hot meals delivered in minutes.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div
          style={{
            backgroundColor: '#1C1C1C',
            border: '1px solid #333333',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '32px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          {/* Cuisines Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => updateParam('cuisine', 'All')}
              style={{
                backgroundColor: currentCuisine === 'All' ? '#FF7900' : '#242424',
                color: currentCuisine === 'All' ? '#FFFFFF' : '#A3A3A3',
                border: '1px solid #333333',
                borderRadius: '9999px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              All Cuisines
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => updateParam('cuisine', cat.name)}
                style={{
                  backgroundColor: currentCuisine === cat.name ? '#FF7900' : '#242424',
                  color: currentCuisine === cat.name ? '#FFFFFF' : '#A3A3A3',
                  border: '1px solid #333333',
                  borderRadius: '9999px',
                  padding: '6px 14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Quick Veg & Sort toggles */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Pure Veg Switch */}
            <button
              onClick={() => updateParam('isPureVeg', !currentVegOnly)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: currentVegOnly ? 'rgba(34, 197, 94, 0.2)' : '#242424',
                color: currentVegOnly ? '#4ADE80' : '#A3A3A3',
                border: currentVegOnly ? '1px solid #22C55E' : '1px solid #333333',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Leaf size={14} color={currentVegOnly ? '#4ADE80' : '#A3A3A3'} />
              Pure Veg Only
            </button>

            {/* Sort Select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowUpDown size={14} color="#A3A3A3" />
              <select
                value={currentSort}
                onChange={(e) => updateParam('sort', e.target.value)}
                style={{
                  backgroundColor: '#242424',
                  color: '#FFFFFF',
                  border: '1px solid #333333',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  fontSize: '13px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="rating">Highest Rated</option>
                <option value="deliveryTime">Fastest Delivery</option>
                <option value="deliveryFee">Lowest Delivery Fee</option>
              </select>
            </div>
          </div>
        </div>

        {/* Restaurant Cards Grid */}
        {loading ? (
          <div className="grid-responsive-cards">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} height="320px" borderRadius="14px" />
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          <EmptyState
            title="No restaurants matched your filters"
            message="Try resetting your cuisine or vegetarian filters to view other kitchens."
            actionText="Reset Filters"
            onAction={() => setSearchParams({})}
          />
        ) : (
          <div className="grid-responsive-cards">
            {restaurants.map((rest) => (
              <RestaurantCard key={rest._id} restaurant={rest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantListingPage;
