import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Calendar, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { Skeleton } from '../../components/common/Skeleton';
import { useToast } from '../../context/ToastContext';

const AdminCouponManagement = () => {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderValue, setMinOrderValue] = useState('199');
  const [maxDiscount, setMaxDiscount] = useState('150');
  const [saving, setSaving] = useState(false);

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/coupons');
      if (res.data.success) {
        setCoupons(res.data.coupons);
      }
    } catch (err) {
      console.error('Failed to load coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!code.trim() || !discountValue) {
      showToast('Please provide valid coupon code and discount value', 'warning');
      return;
    }

    setSaving(true);
    try {
      const res = await api.post('/coupons', {
        code: code.trim().toUpperCase(),
        title: title.trim() || `${code.toUpperCase()} Special Deal`,
        discountType,
        discountValue: Number(discountValue),
        minOrderValue: Number(minOrderValue) || 0,
        maxDiscount: Number(maxDiscount) || 500
      });

      if (res.data.success) {
        showToast(`Coupon ${code.toUpperCase()} created!`, 'success');
        setIsModalOpen(false);
        setCode('');
        setDiscountValue('');
        fetchCoupons();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create coupon', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Delete this coupon code?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      showToast('Coupon removed', 'info');
      setCoupons((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      showToast('Failed to delete coupon', 'error');
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0' }}>
            Coupons & Promotional Deals
          </h1>
          <p style={{ color: '#A3A3A3', fontSize: '14px', margin: 0 }}>
            Create platform-wide discount codes and encourage customer feast checkouts.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Create New Coupon
        </Button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height="150px" borderRadius="12px" />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {coupons.map((c) => (
            <div
              key={c._id}
              style={{
                backgroundColor: '#1C1C1C',
                border: '1px solid #333333',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ backgroundColor: 'rgba(255, 121, 0, 0.15)', border: '1px dashed #FF7900', color: '#FF7900', padding: '4px 10px', borderRadius: '6px', fontSize: '14px', fontWeight: 800 }}>
                    {c.code}
                  </div>
                  <button
                    onClick={() => handleDeleteCoupon(c._id)}
                    style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#FFFFFF' }}>{c.title}</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#A3A3A3', lineHeight: 1.4 }}>
                  {c.discountType === 'percentage' ? `${c.discountValue}% OFF up to ₹${c.maxDiscount}` : `Flat ₹${c.discountValue} OFF`}
                </p>
                <div style={{ fontSize: '11px', color: '#737373', marginTop: '6px' }}>
                  Min Order Value: ₹{c.minOrderValue} • Redeemed: {c.usedCount} times
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Coupon Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Platform Promo Code"
      >
        <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Coupon Code *</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. MOJ50"
              style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 50% Weekend Biryani Deal"
              style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Cash (₹)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Value ({discountType === 'percentage' ? '%' : '₹'}) *</label>
              <input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder="20"
                style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Min Order (₹)</label>
              <input
                type="number"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(e.target.value)}
                placeholder="199"
                style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Max Discount (₹)</label>
              <input
                type="number"
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
                placeholder="150"
                style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>

          <Button variant="primary" type="submit" loading={saving} style={{ marginTop: '8px' }}>
            Publish Promo Code
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCouponManagement;
