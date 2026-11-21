import React, { useState, useEffect } from 'react';
import { Settings, Image, Store, MapPin, DollarSign, Clock, Leaf } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { useToast } from '../../context/ToastContext';

const VendorRestaurantSettings = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [cuisines, setCuisines] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [logo, setLogo] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('35');
  const [minOrderValue, setMinOrderValue] = useState('149');
  const [deliveryTimeMinutes, setDeliveryTimeMinutes] = useState('25');
  const [isPureVeg, setIsPureVeg] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/restaurants/vendor/me');
        if (res.data.success) {
          const r = res.data.restaurant;
          setName(r.name || '');
          setTagline(r.tagline || '');
          setDescription(r.description || '');
          setCuisines(r.cuisineType ? r.cuisineType.join(', ') : '');
          setStreet(r.address?.street || '');
          setCity(r.address?.city || 'Mumbai');
          setPhone(r.phone || '');
          setBannerImage(r.bannerImage || '');
          setLogo(r.logo || '');
          setDeliveryFee((r.deliveryFee || 35).toString());
          setMinOrderValue((r.minOrderValue || 149).toString());
          setDeliveryTimeMinutes((r.deliveryTimeMinutes || 25).toString());
          setIsPureVeg(r.isPureVeg || false);
        }
      } catch (err) {
        console.error('Failed to load restaurant profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name,
        tagline,
        description,
        cuisineType: cuisines.split(',').map((c) => c.trim()).filter(Boolean),
        address: { street, city, state: 'Maharashtra', zipCode: '400001' },
        phone,
        bannerImage,
        logo,
        deliveryFee: Number(deliveryFee),
        minOrderValue: Number(minOrderValue),
        deliveryTimeMinutes: Number(deliveryTimeMinutes),
        isPureVeg
      };

      const res = await api.put('/restaurants/vendor/me', payload);
      if (res.data.success) {
        showToast('Restaurant profile successfully updated!', 'success');
      }
    } catch (err) {
      showToast('Failed to update restaurant profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '30px', maxWidth: '800px' }}>
        <Skeleton height="350px" borderRadius="14px" />
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', maxWidth: '900px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0' }}>
          Kitchen Profile & Logistics Settings
        </h1>
        <p style={{ color: '#A3A3A3', fontSize: '14px', margin: 0 }}>
          Manage your storefront details, delivery pricing, operational radius, and branding.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Basic Brand Identity */}
        <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '14px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', color: '#FF7900' }}>
            Storefront Identity
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
                Restaurant Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
                Tagline / Pitch
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
                About / Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
                Cuisines (Comma separated)
              </label>
              <input
                type="text"
                value={cuisines}
                onChange={(e) => setCuisines(e.target.value)}
                placeholder="Biryani, Mughlai, Kebabs"
                style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Photography & Imagery */}
        <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '14px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', color: '#FF7900' }}>
            Storefront Imagery
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
                Banner Cover Image URL
              </label>
              <input
                type="text"
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
                Restaurant Logo URL
              </label>
              <input
                type="text"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Pricing & Logistics */}
        <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '14px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', color: '#FF7900' }}>
            Order & Delivery Parameters
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
                Delivery Fee (₹)
              </label>
              <input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
                Min Order Value (₹)
              </label>
              <input
                type="number"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(e.target.value)}
                style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
                Est Delivery Time (mins)
              </label>
              <input
                type="number"
                value={deliveryTimeMinutes}
                onChange={(e) => setDeliveryTimeMinutes(e.target.value)}
                style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#FFFFFF', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isPureVeg}
                onChange={(e) => setIsPureVeg(e.target.checked)}
              />
              This is a 100% Pure Vegetarian Kitchen
            </label>
          </div>
        </div>

        <Button variant="primary" size="lg" type="submit" loading={saving} style={{ alignSelf: 'flex-start' }}>
          Save Kitchen Settings
        </Button>
      </form>
    </div>
  );
};

export default VendorRestaurantSettings;
