import React, { useState } from 'react';
import { ShieldCheck, FileText, CheckCircle, XCircle, Eye, AlertCircle } from 'lucide-react';
import { MOCK_VENDOR_APPROVALS } from '../../data/mockData';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';

const AdminVendorApprovals = () => {
  const { showToast } = useToast();
  const [applications, setApplications] = useState(MOCK_VENDOR_APPROVALS);
  const [selectedApp, setSelectedApp] = useState(null);
  const [rejectingApp, setRejectingApp] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = (id) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'approved' } : app))
    );
    showToast('Vendor approved! Storefront is now live on QuickBite.', 'success');
    setSelectedApp(null);
  };

  const handleReject = (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) return;

    setApplications((prev) =>
      prev.map((app) => (app.id === rejectingApp.id ? { ...app, status: 'rejected', rejectionReason } : app))
    );
    showToast(`Application rejected. Reason dispatched to vendor email.`, 'info');
    setRejectingApp(null);
    setRejectionReason('');
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0' }}>
          Vendor Onboarding & Document Approvals
        </h1>
        <p style={{ color: '#A3A3A3', fontSize: '14px', margin: 0 }}>
          Verify FSSAI certificates, GSTIN registration, kitchen hygiene proof, and commercial storefronts.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {applications.map((app) => (
          <div
            key={app.id}
            style={{
              backgroundColor: '#1C1C1C',
              border: '1px solid #333333',
              borderRadius: '14px',
              padding: '20px 24px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                  {app.restaurantName}
                </h3>
                <Badge variant={app.status === 'approved' ? 'success' : app.status === 'rejected' ? 'danger' : 'warning'}>
                  {app.status.toUpperCase()}
                </Badge>
              </div>

              <div style={{ fontSize: '13px', color: '#A3A3A3', marginBottom: '6px' }}>
                Owner: <strong style={{ color: '#FFFFFF' }}>{app.ownerName}</strong> • {app.email} • {app.phone}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: '#737373' }}>
                <span>FSSAI: <strong style={{ color: '#FF7900' }}>{app.fssaiLicense}</strong></span>
                <span>GSTIN: <strong style={{ color: '#FF7900' }}>{app.gstin}</strong></span>
                <span>Cuisine: {app.cuisine}</span>
                <span>Submitted: {new Date(app.submittedAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Button
                variant="secondary"
                size="sm"
                icon={Eye}
                onClick={() => setSelectedApp(app)}
              >
                Inspect Docs
              </Button>

              {app.status === 'pending' && (
                <>
                  <Button
                    variant="success"
                    size="sm"
                    icon={CheckCircle}
                    onClick={() => handleApprove(app.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    icon={XCircle}
                    onClick={() => setRejectingApp(app)}
                  >
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Inspect Document Modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title={`Vendor Dossier: ${selectedApp?.restaurantName}`}
      >
        {selectedApp && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
            <div style={{ width: '100%', height: '180px', borderRadius: '10px', overflow: 'hidden' }}>
              <img src={selectedApp.docUrl} alt="Document Proof" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#A3A3A3' }}>FSSAI Certificate:</span>
              <span style={{ fontWeight: 700, color: '#4ADE80' }}>Verified Valid</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#A3A3A3' }}>Kitchen Address:</span>
              <span style={{ color: '#FFFFFF' }}>{selectedApp.location}</span>
            </div>

            {selectedApp.status === 'pending' && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <Button variant="success" fullWidth onClick={() => handleApprove(selectedApp.id)}>
                  Approve Application
                </Button>
                <Button variant="danger" fullWidth onClick={() => { setRejectingApp(selectedApp); setSelectedApp(null); }}>
                  Reject Application
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Rejection Reason Modal */}
      <Modal
        isOpen={!!rejectingApp}
        onClose={() => setRejectingApp(null)}
        title="Reason for Rejection"
      >
        <form onSubmit={handleReject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#A3A3A3' }}>
            Provide clear feedback so the applicant can correct their business documents and re-apply.
          </p>

          <textarea
            rows={4}
            required
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="e.g. FSSAI registration certificate expired, or kitchen photos unclear..."
            style={{
              width: '100%',
              backgroundColor: '#242424',
              border: '1px solid #333333',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#FFFFFF',
              fontSize: '13px',
              outline: 'none'
            }}
          />

          <Button variant="danger" type="submit">
            Confirm Rejection & Send Notice
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminVendorApprovals;
