import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Store, Trash2 } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { DietaryBadge } from '../../components/common/Badge';
import RestaurantCard from '../../components/common/RestaurantCard';

const WishlistPage = () => {
  const { favouriteDishes, favouriteRestaurants, toggleWishlistDish, toggleWishlistRestaurant } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dishes'); // 'dishes' or 'restaurants'

  return (
    <div style={{ minHeight: '80vh', padding: '40px 0' }}>
      <div className="container">
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 6px 0' }}>
            My Wishlist & Favorites
          </h1>
          <p style={{ color: '#A3A3A3', fontSize: '14px', margin: 0 }}>
            Your curated collection of beloved dishes and favorite kitchens.
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #333333', paddingBottom: '12px', marginBottom: '28px' }}>
          <button
            onClick={() => setActiveTab('dishes')}
            style={{
              backgroundColor: activeTab === 'dishes' ? '#FF7900' : '#1C1C1C',
              color: activeTab === 'dishes' ? '#FFFFFF' : '#A3A3A3',
              border: '1px solid #333333',
              borderRadius: '8px',
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Favorite Dishes ({favouriteDishes.length})
          </button>
          <button
            onClick={() => setActiveTab('restaurants')}
            style={{
              backgroundColor: activeTab === 'restaurants' ? '#FF7900' : '#1C1C1C',
              color: activeTab === 'restaurants' ? '#FFFFFF' : '#A3A3A3',
              border: '1px solid #333333',
              borderRadius: '8px',
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Favorite Kitchens ({favouriteRestaurants.length})
          </button>
        </div>

        {/* Tab 1: Dishes */}
        {activeTab === 'dishes' && (
          <div>
            {favouriteDishes.length === 0 ? (
              <EmptyState
                icon={Heart}
                title="Your favorite dishes list is empty"
                message="Tap the heart icon on any mouthwatering dish to save it here for fast ordering."
                actionText="Explore Menu Dishes"
                onAction={() => navigate('/restaurants')}
              />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {favouriteDishes.map((dish) => (
                  <div
                    key={dish._id}
                    style={{
                      backgroundColor: '#1C1C1C',
                      border: '1px solid #333333',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ position: 'relative', height: '160px' }}>
                      <img
                        src={dish.image}
                        alt={dish.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                        <DietaryBadge isVeg={dish.isVeg} />
                      </div>
                      <button
                        onClick={() => toggleWishlistDish(dish)}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          backgroundColor: 'rgba(28, 28, 28, 0.85)',
                          border: 'none',
                          borderRadius: '50%',
                          padding: '6px',
                          color: '#EF4444',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <h4 style={{ margin: 0, fontSize: '15px', color: '#FFFFFF' }}>{dish.name}</h4>
                          <span style={{ fontSize: '16px', fontWeight: 800, color: '#FF7900' }}>
                            ₹{dish.discountPrice || dish.price}
                          </span>
                        </div>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#A3A3A3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {dish.description}
                        </p>
                      </div>

                      <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        icon={ShoppingBag}
                        onClick={() => addToCart(dish, { _id: dish.restaurantId, name: dish.restaurantName || 'Gourmet Kitchen' })}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Restaurants */}
        {activeTab === 'restaurants' && (
          <div>
            {favouriteRestaurants.length === 0 ? (
              <EmptyState
                icon={Store}
                title="No saved restaurants"
                message="Save restaurants you love to quickly reorder your favorite meals anytime."
                actionText="Discover Restaurants"
                onAction={() => navigate('/restaurants')}
              />
            ) : (
              <div className="grid-responsive-cards">
                {favouriteRestaurants.map((rest) => (
                  <RestaurantCard key={rest._id} restaurant={rest} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
