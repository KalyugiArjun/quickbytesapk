import React, { useState } from 'react';
import { UtensilsCrossed, Star, Search, ShieldAlert, CheckCircle, Flame } from 'lucide-react';
import { MOCK_DISHES } from '../../data/mockData';
import { DietaryBadge } from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

const AdminFoodManagement = () => {
  const { showToast } = useToast();
  const [dishes, setDishes] = useState(MOCK_DISHES);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const handleToggleFeatured = (id) => {
    setDishes((prev) =>
      prev.map((d) => {
        if (d._id === id) {
          const updated = !d.isBestseller;
          showToast(updated ? 'Dish boosted on Homepage!' : 'Dish unboosted', 'info');
          return { ...d, isBestseller: updated };
        }
        return d;
      })
    );
  };

  const handleModerateDish = (id) => {
    setDishes((prev) => prev.filter((d) => d._id !== id));
    showToast('Listing taken down for moderation review.', 'warning');
  };

  const filtered = dishes.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.restaurantName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || d.categoryName === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ padding: '30px', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0' }}>
          Global Food Listings & Moderation
        </h1>
        <p style={{ color: '#A3A3A3', fontSize: '14px', margin: 0 }}>
          Manage catalog hygiene, boost featured menu items, and enforce platform dietary accuracy.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by dish or restaurant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            maxWidth: '360px',
            backgroundColor: '#1C1C1C',
            border: '1px solid #333333',
            borderRadius: '8px',
            padding: '10px 14px',
            color: '#FFFFFF',
            fontSize: '13px',
            outline: 'none'
          }}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            backgroundColor: '#1C1C1C',
            color: '#FFFFFF',
            border: '1px solid #333333',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '13px',
            outline: 'none'
          }}
        >
          <option value="All">All Categories</option>
          <option value="Biryani">Biryani</option>
          <option value="Pizza">Pizza</option>
          <option value="Burger">Burger</option>
          <option value="Momos">Momos</option>
          <option value="South Indian">South Indian</option>
          <option value="Snacks">Snacks</option>
          <option value="Desserts">Desserts</option>
        </select>
      </div>

      {/* Food Listings Table */}
      <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 2fr 1.5fr 1fr 1fr 180px', padding: '14px 20px', borderBottom: '1px solid #333333', fontSize: '12px', fontWeight: 700, color: '#A3A3A3', textTransform: 'uppercase' }}>
          <span>Item</span>
          <span>Dish & Kitchen</span>
          <span>Category</span>
          <span>Price</span>
          <span>Rating</span>
          <span style={{ textAlign: 'right' }}>Actions</span>
        </div>

        {filtered.map((dish) => (
          <div
            key={dish._id}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 2fr 1.5fr 1fr 1fr 180px',
              padding: '14px 20px',
              borderBottom: '1px solid #242424',
              alignItems: 'center',
              fontSize: '13px'
            }}
          >
            <img src={dish.image} alt={dish.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#FFFFFF' }}>
                <DietaryBadge isVeg={dish.isVeg} />
                <span>{dish.name}</span>
                {dish.isBestseller && <Flame size={14} color="#FF7900" />}
              </div>
              <span style={{ fontSize: '12px', color: '#A3A3A3' }}>{dish.restaurantName}</span>
            </div>

            <span style={{ color: '#E5E5E5' }}>{dish.categoryName || 'Main'}</span>

            <span style={{ fontWeight: 800, color: '#FF7900' }}>₹{dish.discountPrice || dish.price}</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#4ADE80', fontWeight: 700 }}>
              <Star size={12} fill="#4ADE80" /> {dish.rating || 4.8}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                onClick={() => handleToggleFeatured(dish._id)}
                style={{
                  backgroundColor: dish.isBestseller ? 'rgba(255, 121, 0, 0.2)' : '#242424',
                  color: dish.isBestseller ? '#FF7900' : '#A3A3A3',
                  border: '1px solid #333333',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {dish.isBestseller ? 'Featured' : 'Promote'}
              </button>

              <button
                onClick={() => handleModerateDish(dish._id)}
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  color: '#EF4444',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Delist
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFoodManagement;
