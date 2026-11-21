import React, { useState } from 'react';
import { Star, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';
import { MOCK_COMPLAINTS } from '../../data/mockData';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';

const AdminReviewsComplaints = () => {
  const { showToast } = useToast();
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [activeTab, setActiveTab] = useState('complaints'); // 'complaints' or 'reviews'

  const [reviews, setReviews] = useState([
    { id: 1, customer: 'Aarav Sharma', restaurant: 'The Royal Dum Biryani', rating: 5, comment: 'Hands down the best Mutton Dum Biryani in Mumbai! Fragrant, generous meat pieces, and delivered hot within 25 mins.', date: '2026-11-21', status: 'Published' },
    { id: 2, customer: 'Neha Kapoor', restaurant: 'Crust & Craft Pizza', rating: 4, comment: 'Truffle pizza crust was incredible, would love slightly more mozzarella next time.', date: '2026-11-20', status: 'Published' }
  ]);

  const handleResolveComplaint = (id) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'Resolved', resolutionNote: 'Investigated with kitchen manager & compensated user.' } : c))
    );
    showToast('Complaint marked as resolved!', 'success');
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0' }}>
          Customer Reviews & Dispute Resolutions
        </h1>
        <p style={{ color: '#A3A3A3', fontSize: '14px', margin: 0 }}>
          Monitor food ratings, moderate inappropriate feedback, and settle order complaints.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #333333', paddingBottom: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('complaints')}
          style={{
            backgroundColor: activeTab === 'complaints' ? '#FF7900' : '#1C1C1C',
            color: activeTab === 'complaints' ? '#FFFFFF' : '#A3A3A3',
            border: '1px solid #333333',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Customer Complaints ({complaints.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          style={{
            backgroundColor: activeTab === 'reviews' ? '#FF7900' : '#1C1C1C',
            color: activeTab === 'reviews' ? '#FFFFFF' : '#A3A3A3',
            border: '1px solid #333333',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Storefront Reviews ({reviews.length})
        </button>
      </div>

      {activeTab === 'complaints' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {complaints.map((c) => (
            <div
              key={c.id}
              style={{
                backgroundColor: '#1C1C1C',
                border: '1px solid #333333',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>{c.id}</span>
                  <span style={{ fontSize: '13px', color: '#FF7900' }}>Order #{c.orderNumber}</span>
                  <Badge variant={c.status === 'Resolved' ? 'success' : 'danger'}>{c.status}</Badge>
                </div>

                <p style={{ margin: '4px 0', fontSize: '14px', color: '#FFFFFF' }}>
                  "{c.issue}"
                </p>

                <div style={{ fontSize: '12px', color: '#A3A3A3' }}>
                  Raised by: <strong style={{ color: '#FFFFFF' }}>{c.customerName}</strong> against <strong>{c.restaurantName}</strong> on {c.date}
                </div>

                {c.resolutionNote && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#4ADE80' }}>
                    Resolution: {c.resolutionNote}
                  </div>
                )}
              </div>

              {c.status !== 'Resolved' && (
                <Button variant="success" size="sm" onClick={() => handleResolveComplaint(c.id)}>
                  Resolve & Settle Dispute
                </Button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {reviews.map((r) => (
            <div
              key={r.id}
              style={{
                backgroundColor: '#1C1C1C',
                border: '1px solid #333333',
                borderRadius: '12px',
                padding: '18px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <strong style={{ color: '#FFFFFF' }}>{r.customer}</strong>
                  <span style={{ color: '#737373', fontSize: '12px' }}>reviewed {r.restaurant}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#4ADE80', fontSize: '12px', fontWeight: 700 }}>
                    <Star size={12} fill="#4ADE80" /> {r.rating} / 5
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#A3A3A3' }}>"{r.comment}"</p>
              </div>

              <Badge variant="success">Active</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviewsComplaints;
