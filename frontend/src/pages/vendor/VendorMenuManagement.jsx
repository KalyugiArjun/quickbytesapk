import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Power, Search, Leaf, Star } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { DietaryBadge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import { useToast } from '../../context/ToastContext';

const VendorMenuManagement = () => {
  const { showToast } = useToast();
  const [restaurant, setRestaurant] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [image, setImage] = useState('');
  const [isVeg, setIsVeg] = useState(false);
  const [categoryName, setCategoryName] = useState('Chef Specials');
  const [spicyLevel, setSpicyLevel] = useState('medium');
  const [preparationTime, setPreparationTime] = useState('20');
  const [isBestseller, setIsBestseller] = useState(false);

  const fetchMenu = async () => {
    try {
      const resRest = await api.get('/restaurants/vendor/me');
      if (resRest.data.success) {
        setRestaurant(resRest.data.restaurant);
        const resMenu = await api.get(`/menu/restaurant/${resRest.data.restaurant._id}`);
        if (resMenu.data.success) {
          setItems(resMenu.data.items);
        }
      }
    } catch (err) {
      console.error('Failed to load vendor menu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setDescription('');
    setPrice('');
    setDiscountPrice('');
    setImage('');
    setIsVeg(false);
    setCategoryName('Chef Specials');
    setSpicyLevel('medium');
    setPreparationTime('20');
    setIsBestseller(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description);
    setPrice(item.price.toString());
    setDiscountPrice(item.discountPrice ? item.discountPrice.toString() : '');
    setImage(item.image);
    setIsVeg(item.isVeg);
    setCategoryName(item.categoryName || 'Chef Specials');
    setSpicyLevel(item.spicyLevel || 'medium');
    setPreparationTime((item.preparationTime || 20).toString());
    setIsBestseller(item.isBestseller || false);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price || !description.trim()) {
      showToast('Please fill out all required fields.', 'warning');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : null,
        image: image.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        isVeg: Boolean(isVeg),
        categoryName,
        spicyLevel,
        preparationTime: Number(preparationTime) || 20,
        isBestseller: Boolean(isBestseller)
      };

      if (editingItem) {
        await api.put(`/menu/${editingItem._id}`, payload);
        showToast('Dish updated successfully!', 'success');
      } else {
        await api.post('/menu', payload);
        showToast('New dish added to menu!', 'success');
      }

      setIsModalOpen(false);
      fetchMenu();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save item', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAvailability = async (itemId) => {
    try {
      const res = await api.patch(`/menu/${itemId}/toggle-availability`);
      if (res.data.success) {
        showToast(res.data.message, 'info');
        setItems((prev) =>
          prev.map((i) => (i._id === itemId ? { ...i, isAvailable: res.data.item.isAvailable } : i))
        );
      }
    } catch (err) {
      showToast('Failed to toggle availability', 'error');
    }
  };

  const handleDeleteItem = async (itemId) => {
    const confirm = window.confirm('Are you sure you want to delete this menu dish?');
    if (!confirm) return;

    try {
      await api.delete(`/menu/${itemId}`);
      showToast('Dish removed from menu', 'info');
      setItems((prev) => prev.filter((i) => i._id !== itemId));
    } catch (err) {
      showToast('Failed to delete item', 'error');
    }
  };

  const filteredItems = items.filter((i) =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.categoryName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '30px', maxWidth: '1200px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0' }}>
            Menu Catalog Management
          </h1>
          <p style={{ color: '#A3A3A3', fontSize: '14px', margin: 0 }}>
            Add new dishes, modify prices, toggle out-of-stock items, and organize categories.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={openAddModal}>
          Add New Dish
        </Button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px', maxWidth: '360px', position: 'relative' }}>
        <Search size={16} color="#A3A3A3" style={{ position: 'absolute', left: '12px', top: '12px' }} />
        <input
          type="text"
          placeholder="Search by dish name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            backgroundColor: '#1C1C1C',
            border: '1px solid #333333',
            borderRadius: '8px',
            padding: '10px 14px 10px 38px',
            color: '#FFFFFF',
            fontSize: '13px',
            outline: 'none'
          }}
        />
      </div>

      {/* Menu Items Table / Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="220px" borderRadius="12px" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#A3A3A3', backgroundColor: '#1C1C1C', borderRadius: '12px', border: '1px solid #333333' }}>
          No items found. Click "Add New Dish" to expand your catalog.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
          {filteredItems.map((dish) => (
            <div
              key={dish._id}
              style={{
                backgroundColor: '#1C1C1C',
                border: dish.isAvailable ? '1px solid #333333' : '1px dashed #EF4444',
                borderRadius: '12px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                opacity: dish.isAvailable ? 1 : 0.65
              }}
            >
              <div style={{ position: 'relative', height: '140px' }}>
                <img
                  src={dish.image}
                  alt={dish.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
                  <DietaryBadge isVeg={dish.isVeg} />
                </div>
                {!dish.isAvailable && (
                  <div style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: '#EF4444', color: '#FFF', fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                    OUT OF STOCK
                  </div>
                )}
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>{dish.name}</h4>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#FF7900' }}>₹{dish.discountPrice || dish.price}</span>
                </div>

                <span style={{ fontSize: '11px', color: '#A3A3A3', textTransform: 'uppercase', fontWeight: 600 }}>
                  {dish.categoryName || 'Chef Special'} • {dish.preparationTime}m
                </span>

                <p style={{ margin: 0, fontSize: '12px', color: '#737373', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {dish.description}
                </p>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #2E2E2E' }}>
                  <button
                    onClick={() => handleToggleAvailability(dish._id)}
                    style={{
                      backgroundColor: dish.isAvailable ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: dish.isAvailable ? '#4ADE80' : '#F87171',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {dish.isAvailable ? 'In Stock' : 'Out of Stock'}
                  </button>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => openEditModal(dish)}
                      style={{ background: '#242424', border: '1px solid #333333', color: '#FFFFFF', borderRadius: '6px', padding: '6px', cursor: 'pointer' }}
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(dish._id)}
                      style={{ background: '#242424', border: '1px solid #333333', color: '#EF4444', borderRadius: '6px', padding: '6px', cursor: 'pointer' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Dish Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Menu Dish' : 'Add New Dish to Menu'}
      >
        <form onSubmit={handleSaveItem} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Dish Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Royal Chicken Dum Biryani"
              style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Description *</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the flavors, spices, and ingredients..."
              style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Price (₹) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="299"
                style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Discount Price (₹)</label>
              <input
                type="number"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="249"
                style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Food Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Category</label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g. Biryani & Bowls"
                style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Prep Time (mins)</label>
              <input
                type="number"
                value={preparationTime}
                onChange={(e) => setPreparationTime(e.target.value)}
                placeholder="20"
                style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#FFFFFF', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isVeg}
                onChange={(e) => setIsVeg(e.target.checked)}
              />
              Pure Vegetarian Dish
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#FFFFFF', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isBestseller}
                onChange={(e) => setIsBestseller(e.target.checked)}
              />
              Mark as Bestseller
            </label>
          </div>

          <Button variant="primary" type="submit" loading={saving} style={{ marginTop: '8px' }}>
            {editingItem ? 'Save Updates' : 'Publish Dish to Menu'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default VendorMenuManagement;
