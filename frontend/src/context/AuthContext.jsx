import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('quickbite_token') || null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Load user data on mount if token exists
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
          if (res.data.restaurant) {
            setRestaurant(res.data.restaurant);
          }
        }
      } catch (err) {
        console.warn('Auth token expired or invalid:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('quickbite_token', res.data.token);
        localStorage.setItem('quickbite_user', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        showToast(res.data.message || 'Logged in successfully!', 'success');
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check credentials.';
      showToast(message, 'error');
      return { success: false, message };
    }
  };

  // One-click demo login for effortless testing of all 3 roles
  const demoLogin = async (role) => {
    let email = 'customer@quickbite.com';
    if (role === 'vendor') email = 'vendor1@quickbite.com';
    if (role === 'admin') email = 'admin@quickbite.com';

    return await login(email, 'password123');
  };

  // Register handler
  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.data.success) {
        localStorage.setItem('quickbite_token', res.data.token);
        localStorage.setItem('quickbite_user', JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        showToast('Registration successful! Welcome to QuickBite.', 'success');
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed.';
      showToast(message, 'error');
      return { success: false, message };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('quickbite_token');
    localStorage.removeItem('quickbite_user');
    setToken(null);
    setUser(null);
    setRestaurant(null);
    showToast('Logged out. See you soon!', 'info');
  };

  // Update profile
  const updateProfile = async (data) => {
    try {
      const res = await api.put('/auth/profile', data);
      if (res.data.success) {
        setUser(res.data.user);
        showToast('Profile updated!', 'success');
        return { success: true };
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update profile', 'error');
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        restaurant,
        setRestaurant,
        role: user?.role || 'guest',
        isAuthenticated: !!user,
        loading,
        login,
        demoLogin,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
