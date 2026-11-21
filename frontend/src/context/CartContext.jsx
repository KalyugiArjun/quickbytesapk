import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import api from '../services/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('quickbite_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [restaurant, setRestaurant] = useState(() => {
    try {
      const saved = localStorage.getItem('quickbite_cart_restaurant');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [coupon, setCoupon] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('quickbite_cart', JSON.stringify(items));
    localStorage.setItem('quickbite_cart_restaurant', JSON.stringify(restaurant));
  }, [items, restaurant]);

  // Add Item to cart
  const addToCart = (dish, currentRestaurant) => {
    // If cart has items from another restaurant, confirm reset
    if (items.length > 0 && restaurant && restaurant._id !== currentRestaurant._id) {
      const confirmReplace = window.confirm(
        `Your cart contains items from "${restaurant.name}". Do you want to discard your previous cart and start a fresh order from "${currentRestaurant.name}"?`
      );
      if (!confirmReplace) return;
      setItems([{ ...dish, quantity: 1 }]);
      setRestaurant(currentRestaurant);
      setCoupon(null);
      showToast(`Added ${dish.name} from ${currentRestaurant.name}`, 'success');
      return;
    }

    if (!restaurant) {
      setRestaurant(currentRestaurant);
    }

    setItems((prev) => {
      const existing = prev.find((i) => i._id === dish._id);
      if (existing) {
        return prev.map((i) =>
          i._id === dish._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...dish, quantity: 1 }];
    });

    showToast(`Added ${dish.name} to cart`, 'success');
  };

  // Update item quantity
  const updateQuantity = (dishId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(dishId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i._id === dishId ? { ...i, quantity: newQty } : i))
    );
  };

  // Remove single item
  const removeFromCart = (dishId) => {
    setItems((prev) => {
      const filtered = prev.filter((i) => i._id !== dishId);
      if (filtered.length === 0) {
        setRestaurant(null);
        setCoupon(null);
      }
      return filtered;
    });
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
    setRestaurant(null);
    setCoupon(null);
    localStorage.removeItem('quickbite_cart');
    localStorage.removeItem('quickbite_cart_restaurant');
  };

  // Apply Coupon code
  const applyCoupon = async (code) => {
    try {
      const res = await api.post('/coupons/validate', {
        code,
        cartTotal: subtotal
      });
      if (res.data.success) {
        setCoupon(res.data.coupon);
        showToast(res.data.message, 'success');
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid coupon code';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Remove coupon
  const removeCoupon = () => {
    setCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Calculations
  const itemCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = items.reduce((acc, curr) => {
    const itemPrice = curr.discountPrice || curr.price;
    return acc + itemPrice * curr.quantity;
  }, 0);

  const deliveryFee = items.length > 0 ? (restaurant?.deliveryFee || 35) : 0;
  const tax = items.length > 0 ? Math.round(subtotal * 0.05) : 0; // 5% GST
  const discount = coupon ? coupon.discount : 0;
  const total = Math.max(0, subtotal + deliveryFee + tax - discount);

  return (
    <CartContext.Provider
      value={{
        items,
        restaurant,
        itemCount,
        subtotal,
        deliveryFee,
        tax,
        discount,
        coupon,
        total,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
