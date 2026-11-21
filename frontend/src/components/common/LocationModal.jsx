import React, { useState } from 'react';
import { MapPin, Navigation, Check } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import { useLocationContext } from '../../context/LocationContext';

const LocationModal = () => {
  const { isLocationModalOpen, setIsLocationModalOpen, currentLocation, updateLocation, savedPresets } = useLocationContext();
  const [customInput, setCustomInput] = useState('');

  if (!isLocationModalOpen) return null;

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customInput.trim()) {
      updateLocation(customInput.trim());
      setCustomInput('');
    }
  };

  return (
    <Modal
      isOpen={isLocationModalOpen}
      onClose={() => setIsLocationModalOpen(false)}
      title="Select Your Delivery Location"
      maxWidth="500px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Custom Address Input */}
        <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: '8px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <MapPin size={16} color="#FF7900" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input
              type="text"
              placeholder="Search area, landmark or street in Mumbai..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#242424',
                border: '1px solid #333333',
                borderRadius: '8px',
                padding: '10px 14px 10px 38px',
                color: '#FFFFFF',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>
          <Button variant="primary" type="submit" size="sm">
            Set
          </Button>
        </form>

        {/* Current Location Quick button */}
        <button
          onClick={() => updateLocation('Current GPS: Powai Lake, Mumbai - 400076')}
          style={{
            backgroundColor: '#242424',
            border: '1px solid #FF7900',
            borderRadius: '8px',
            padding: '12px 14px',
            color: '#FF7900',
            fontWeight: 700,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer'
          }}
        >
          <Navigation size={16} />
          Use Current Device Location
        </button>

        {/* Saved Presets */}
        <div>
          <span style={{ fontSize: '12px', color: '#737373', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Popular Delivery Zones
          </span>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {savedPresets.map((preset, idx) => {
              const isCurrent = currentLocation.includes(preset.city) && currentLocation.includes(preset.label);
              return (
                <div
                  key={idx}
                  onClick={() => updateLocation(`${preset.address}, ${preset.city} - ${preset.pincode}`)}
                  style={{
                    backgroundColor: isCurrent ? 'rgba(255, 121, 0, 0.12)' : '#242424',
                    border: isCurrent ? '1px solid #FF7900' : '1px solid #333333',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MapPin size={16} color={isCurrent ? '#FF7900' : '#A3A3A3'} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>{preset.label}</div>
                      <div style={{ fontSize: '11px', color: '#A3A3A3' }}>{preset.address}</div>
                    </div>
                  </div>
                  {isCurrent && <Check size={16} color="#FF7900" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LocationModal;
