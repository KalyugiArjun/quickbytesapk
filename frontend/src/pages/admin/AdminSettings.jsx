import React, { useState } from 'react';
import { Settings, Shield, Sliders, ToggleLeft, ToggleRight } from 'lucide-react';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

const AdminSettings = () => {
  const { showToast } = useToast();
  const [platformCommission, setPlatformCommission] = useState('10');
  const [baseDeliveryFee, setBaseDeliveryFee] = useState('35');
  const [taxGstRate, setTaxGstRate] = useState('5');
  const [maxRadiusKm, setMaxRadiusKm] = useState('12');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    showToast('Platform configuration updated successfully!', 'success');
  };

  return (
    <div style={{ padding: '30px', maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0' }}>
          Global Platform & Operational Settings
        </h1>
        <p style={{ color: '#A3A3A3', fontSize: '14px', margin: 0 }}>
          Manage global defaults for commissions, taxes, delivery radiuses, and emergency maintenance.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '14px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', color: '#FF7900' }}>
            Commission & Fee Defaults
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Default Commission Rate (%)</label>
              <input
                type="number"
                value={platformCommission}
                onChange={(e) => setPlatformCommission(e.target.value)}
                style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Base Delivery Fee (₹)</label>
              <input
                type="number"
                value={baseDeliveryFee}
                onChange={(e) => setBaseDeliveryFee(e.target.value)}
                style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>GST Tax Rate (%)</label>
              <input
                type="number"
                value={taxGstRate}
                onChange={(e) => setTaxGstRate(e.target.value)}
                style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Max Delivery Radius (km)</label>
              <input
                type="number"
                value={maxRadiusKm}
                onChange={(e) => setMaxRadiusKm(e.target.value)}
                style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Emergency System Controls */}
        <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '14px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', color: '#EF4444' }}>
            System Emergency Controls
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>Platform Maintenance Mode</div>
              <div style={{ fontSize: '12px', color: '#A3A3A3' }}>Disable new customer checkouts while performing server upgrades.</div>
            </div>

            <button
              type="button"
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              style={{
                backgroundColor: maintenanceMode ? '#EF4444' : '#242424',
                color: '#FFFFFF',
                border: '1px solid #333333',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {maintenanceMode ? 'ACTIVE (Paused)' : 'OFF (Normal)'}
            </button>
          </div>
        </div>

        <Button variant="primary" size="lg" type="submit" style={{ alignSelf: 'flex-start' }}>
          Save Configuration
        </Button>
      </form>
    </div>
  );
};

export default AdminSettings;
