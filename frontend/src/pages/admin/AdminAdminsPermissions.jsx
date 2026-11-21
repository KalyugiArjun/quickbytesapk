import React, { useState } from 'react';
import { Shield, ShieldAlert, Plus, Edit2, Lock } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

const AdminAdminsPermissions = () => {
  const { showToast } = useToast();

  const [admins, setAdmins] = useState([
    { id: 1, name: 'Super Admin QuickBite', email: 'admin@quickbite.com', role: 'Super Admin', canApproveVendors: true, canRefund: true, canManageAdmins: true },
    { id: 2, name: 'Rohan Joshi', email: 'rohan.ops@quickbite.com', role: 'Normal Admin', canApproveVendors: true, canRefund: true, canManageAdmins: false },
    { id: 3, name: 'Kavita Roy', email: 'kavita.support@quickbite.com', role: 'Support Admin', canApproveVendors: false, canRefund: true, canManageAdmins: false }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Normal Admin');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setAdmins([
      ...admins,
      {
        id: Date.now(),
        name,
        email,
        role,
        canApproveVendors: role !== 'Support Admin',
        canRefund: true,
        canManageAdmins: role === 'Super Admin'
      }
    ]);
    showToast(`New admin profile for ${name} created!`, 'success');
    setIsModalOpen(false);
    setName('');
    setEmail('');
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0' }}>
            Admin Management & Role Permissions
          </h1>
          <p style={{ color: '#A3A3A3', fontSize: '14px', margin: 0 }}>
            Super Admin access governance. Normal Admins are restricted from admin management.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Create New Admin
        </Button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {admins.map((adm) => (
          <div
            key={adm.id}
            style={{
              backgroundColor: '#1C1C1C',
              border: adm.role === 'Super Admin' ? '1px solid #FF7900' : '1px solid #333333',
              borderRadius: '12px',
              padding: '20px 24px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>{adm.name}</span>
                <Badge variant={adm.role === 'Super Admin' ? 'primary' : 'secondary'}>{adm.role}</Badge>
              </div>
              <span style={{ fontSize: '13px', color: '#A3A3A3' }}>{adm.email}</span>

              {/* Permissions Checklist */}
              <div style={{ display: 'flex', gap: '14px', marginTop: '10px', fontSize: '12px' }}>
                <span style={{ color: adm.canApproveVendors ? '#22C55E' : '#737373' }}>
                  {adm.canApproveVendors ? '✓ Vendor Approvals' : '✕ No Vendor Approval'}
                </span>
                <span style={{ color: adm.canRefund ? '#22C55E' : '#737373' }}>
                  {adm.canRefund ? '✓ Issue Refunds' : '✕ No Refunds'}
                </span>
                <span style={{ color: adm.canManageAdmins ? '#22C55E' : '#EF4444' }}>
                  {adm.canManageAdmins ? '✓ Super Admin Governance' : '✕ Restricted from Admin Config'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Administrator Account">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px', color: '#FFF' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Official Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="priya.ops@quickbite.com"
              style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px', color: '#FFF' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>Role Type</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px', color: '#FFF' }}
            >
              <option value="Normal Admin">Normal Admin (Operations & Orders)</option>
              <option value="Support Admin">Support Admin (Complaints & Refunds)</option>
              <option value="Super Admin">Super Admin (Full Governance)</option>
            </select>
          </div>

          <Button variant="primary" type="submit">Create Admin Account</Button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminAdminsPermissions;
