import React, { useState, useEffect } from 'react';
import { Plus, Trash2, FolderTree, Edit2 } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { Skeleton } from '../../components/common/Skeleton';
import { useToast } from '../../context/ToastContext';

const AdminCategoryManagement = () => {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      const res = await api.post('/categories', {
        name: name.trim(),
        image: image.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
        description: description.trim()
      });
      if (res.data.success) {
        showToast('Category created!', 'success');
        setIsModalOpen(false);
        setName('');
        setImage('');
        setDescription('');
        fetchCategories();
      }
    } catch (err) {
      showToast('Failed to create category', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      showToast('Category removed', 'info');
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      showToast('Failed to delete', 'error');
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0' }}>
            Cuisine Categories Directory
          </h1>
          <p style={{ color: '#A3A3A3', fontSize: '14px', margin: 0 }}>
            Configure the platform taxonomy for Biryani, Pizza, Thalis, South Indian, and Desserts.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Add New Category
        </Button>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height="120px" borderRadius="12px" />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {categories.map((cat) => (
            <div
              key={cat._id}
              style={{
                backgroundColor: '#1C1C1C',
                border: '1px solid #333333',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', color: '#FFFFFF' }}>{cat.name}</h4>
                  <span style={{ fontSize: '11px', color: '#737373' }}>/{cat.slug}</span>
                </div>
              </div>

              <button
                onClick={() => handleDeleteCategory(cat._id)}
                style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Food Cuisine Category"
      >
        <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Category Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chinese & Wok"
              style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Cover Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Short Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Noodles, dimsums, hot soups..."
              style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <Button variant="primary" type="submit" loading={saving} style={{ marginTop: '8px' }}>
            Save Category
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCategoryManagement;
