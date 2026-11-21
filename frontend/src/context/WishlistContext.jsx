import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [favouriteDishes, setFavouriteDishes] = useState(() => {
    try {
      const saved = localStorage.getItem('quickbite_wishlist_dishes');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [favouriteRestaurants, setFavouriteRestaurants] = useState(() => {
    try {
      const saved = localStorage.getItem('quickbite_wishlist_restaurants');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('quickbite_wishlist_dishes', JSON.stringify(favouriteDishes));
    localStorage.setItem('quickbite_wishlist_restaurants', JSON.stringify(favouriteRestaurants));
  }, [favouriteDishes, favouriteRestaurants]);

  const toggleWishlistDish = (dish) => {
    setFavouriteDishes((prev) => {
      const exists = prev.some((d) => d._id === dish._id);
      if (exists) {
        showToast(`Removed "${dish.name}" from favorites`, 'info');
        return prev.filter((d) => d._id !== dish._id);
      } else {
        showToast(`Added "${dish.name}" to favorites! ❤️`, 'success');
        return [...prev, dish];
      }
    });
  };

  const toggleWishlistRestaurant = (restaurant) => {
    setFavouriteRestaurants((prev) => {
      const exists = prev.some((r) => r._id === restaurant._id);
      if (exists) {
        showToast(`Removed "${restaurant.name}" from favorites`, 'info');
        return prev.filter((r) => r._id !== restaurant._id);
      } else {
        showToast(`Added "${restaurant.name}" to favorites! ❤️`, 'success');
        return [...prev, restaurant];
      }
    });
  };

  const isDishInWishlist = (dishId) => favouriteDishes.some((d) => d._id === dishId);
  const isRestaurantInWishlist = (restId) => favouriteRestaurants.some((r) => r._id === restId);

  return (
    <WishlistContext.Provider
      value={{
        favouriteDishes,
        favouriteRestaurants,
        toggleWishlistDish,
        toggleWishlistRestaurant,
        isDishInWishlist,
        isRestaurantInWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
