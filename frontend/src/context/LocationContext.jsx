import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(() => {
    return localStorage.getItem('quickbite_location') || 'Powai, Mumbai - 400076';
  });

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const savedPresets = [
    { label: 'Home', address: 'Flat 402, Lotus Residency, Central Avenue, Powai', city: 'Mumbai', pincode: '400076' },
    { label: 'Work', address: 'Tech Park Tower 3, 5th Floor, BKC', city: 'Mumbai', pincode: '400051' },
    { label: 'Other', address: 'Shop 12, Hill Road, Bandra West', city: 'Mumbai', pincode: '400050' },
    { label: 'Lokhandwala', address: 'Main Market Road, Andheri West', city: 'Mumbai', pincode: '400053' }
  ];

  const updateLocation = (newLoc) => {
    setCurrentLocation(newLoc);
    localStorage.setItem('quickbite_location', newLoc);
    setIsLocationModalOpen(false);
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        updateLocation,
        isLocationModalOpen,
        setIsLocationModalOpen,
        savedPresets
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};
