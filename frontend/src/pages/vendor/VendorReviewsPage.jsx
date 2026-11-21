import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { Skeleton } from '../../components/common/Skeleton';
import { useToast } from '../../context/ToastContext';

const VendorReviewsPage = () => {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const fetchReviews = async () => {
    try {
      const resRest = await api.get('/restaurants/vendor/me');
      if (resRest.data.success) {
        const resRev = await api.get(`/reviews/restaurant/${resRest.data.restaurant._id}`);
        if (resRev.data.success) {
          setReviews(resRev.data.reviews);
        }
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSubmittingReply(true);
    try {
      const res = await api.post(`/reviews/${selectedReview._id}/reply`, {
        comment: replyText.trim()
      });
      if (res.data.success) {
        showToast('Reply published to customer!', 'success');
        setSelectedReview(null);
        setReplyText('');
        fetchReviews();
      }
    } catch (err) {
      showToast('Failed to post reply', 'error');
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1000px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0' }}>
          Customer Reviews & Ratings
        </h1>
        <p style={{ color: '#A3A3A3', fontSize: '14px', margin: 0 }}>
          Read customer reviews and respond directly to build loyal food lovers.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height="120px" borderRadius="12px" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#A3A3A3', backgroundColor: '#1C1C1C', borderRadius: '12px', border: '1px solid #333333' }}>
          No customer reviews received yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviews.map((rev) => (
            <div
              key={rev._id}
              style={{
                backgroundColor: '#1C1C1C',
                border: '1px solid #333333',
                borderRadius: '12px',
                padding: '20px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={rev.customerAvatar}
                    alt={rev.customerName}
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px', color: '#FFFFFF' }}>{rev.customerName}</h4>
                    <span style={{ fontSize: '12px', color: '#737373' }}>
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    color: '#4ADE80',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 800
                  }}
                >
                  <Star size={14} fill="#4ADE80" /> {rev.rating} / 5
                </div>
              </div>

              <p style={{ margin: 0, fontSize: '14px', color: '#E5E5E5', lineHeight: 1.5 }}>
                "{rev.comment}"
              </p>

              {rev.vendorReply?.comment ? (
                <div
                  style={{
                    backgroundColor: '#242424',
                    borderLeft: '3px solid #FF7900',
                    borderRadius: '6px',
                    padding: '10px 14px',
                    fontSize: '13px'
                  }}
                >
                  <span style={{ color: '#FF7900', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                    Your Reply:
                  </span>
                  <span style={{ color: '#A3A3A3' }}>{rev.vendorReply.comment}</span>
                </div>
              ) : (
                <div style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={MessageSquare}
                    onClick={() => {
                      setSelectedReview(rev);
                      setReplyText('');
                    }}
                  >
                    Reply to Customer
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      <Modal
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        title={`Reply to ${selectedReview?.customerName}`}
      >
        <form onSubmit={handleSendReply} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#A3A3A3', fontStyle: 'italic' }}>
            "{selectedReview?.comment}"
          </p>
          <div>
            <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
              Your Response
            </label>
            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Thank you for dining with us! We are thrilled you loved the biryani..."
              style={{
                width: '100%',
                backgroundColor: '#242424',
                border: '1px solid #333333',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#FFFFFF',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          <Button variant="primary" type="submit" loading={submittingReply} icon={Send}>
            Post Reply
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default VendorReviewsPage;
