import React, { useState } from 'react';
import { DollarSign, Wallet, ArrowDownRight, Clock, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

const VendorEarnings = () => {
  const { showToast } = useToast();
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('15000');
  const [requesting, setRequesting] = useState(false);

  const earningsSummary = {
    totalRevenue: 142500,
    withdrawn: 118000,
    availableBalance: 24500,
    platformCommissionPaid: 14250
  };

  const payoutHistory = [
    { id: 'PAY-401', date: '2026-11-20', amount: 35000, status: 'Settled', account: 'HDFC Bank •••• 4492' },
    { id: 'PAY-398', date: '2026-11-13', amount: 42000, status: 'Settled', account: 'HDFC Bank •••• 4492' },
    { id: 'PAY-392', date: '2026-11-06', amount: 41000, status: 'Settled', account: 'HDFC Bank •••• 4492' }
  ];

  const handleRequestPayout = (e) => {
    e.preventDefault();
    setRequesting(true);
    setTimeout(() => {
      setRequesting(false);
      setIsPayoutModalOpen(false);
      showToast(`Payout request of ₹${payoutAmount} submitted to QuickBite finance!`, 'success');
    }, 1000);
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1100px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0' }}>
            Merchant Earnings & Settlements
          </h1>
          <p style={{ color: '#A3A3A3', fontSize: '14px', margin: 0 }}>
            Audit your gross kitchen earnings, platform commission deductions, and request payouts.
          </p>
        </div>

        <Button variant="primary" icon={Wallet} onClick={() => setIsPayoutModalOpen(true)}>
          Request Early Payout
        </Button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#A3A3A3', marginBottom: '4px' }}>Available Balance</div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#22C55E' }}>
            ₹{earningsSummary.availableBalance.toLocaleString()}
          </div>
          <span style={{ fontSize: '11px', color: '#22C55E' }}>Ready to disburse</span>
        </div>

        <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#A3A3A3', marginBottom: '4px' }}>Total Gross Sales</div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#FFFFFF' }}>
            ₹{earningsSummary.totalRevenue.toLocaleString()}
          </div>
          <span style={{ fontSize: '11px', color: '#FF7900' }}>All-time orders volume</span>
        </div>

        <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#A3A3A3', marginBottom: '4px' }}>Total Settled to Bank</div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#FFFFFF' }}>
            ₹{earningsSummary.withdrawn.toLocaleString()}
          </div>
          <span style={{ fontSize: '11px', color: '#A3A3A3' }}>Disbursed via NEFT/IMPS</span>
        </div>

        <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#A3A3A3', marginBottom: '4px' }}>QuickBite Commission (10%)</div>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#FF7900' }}>
            ₹{earningsSummary.platformCommissionPaid.toLocaleString()}
          </div>
          <span style={{ fontSize: '11px', color: '#A3A3A3' }}>Platform tech & delivery service</span>
        </div>
      </div>

      {/* Payout History Table */}
      <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '14px', padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: '#FFFFFF' }}>
          Payout Disbursements History
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {payoutHistory.map((p) => (
            <div
              key={p.id}
              style={{
                backgroundColor: '#242424',
                border: '1px solid #333333',
                borderRadius: '10px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>#{p.id}</span>
                  <Badge variant="success">{p.status}</Badge>
                </div>
                <div style={{ fontSize: '12px', color: '#A3A3A3' }}>
                  Processed on {p.date} • Sent to {p.account}
                </div>
              </div>

              <div style={{ fontSize: '18px', fontWeight: 900, color: '#22C55E' }}>
                ₹{p.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Request Payout Modal */}
      <Modal isOpen={isPayoutModalOpen} onClose={() => setIsPayoutModalOpen(false)} title="Request Merchant Payout">
        <form onSubmit={handleRequestPayout} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#A3A3A3' }}>
            Available for immediate transfer: <strong style={{ color: '#22C55E' }}>₹{earningsSummary.availableBalance.toLocaleString()}</strong>
          </p>

          <div>
            <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
              Withdrawal Amount (₹)
            </label>
            <input
              type="number"
              max={earningsSummary.availableBalance}
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(e.target.value)}
              style={{ width: '100%', backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '10px 14px', color: '#FFFFFF', fontSize: '16px', fontWeight: 700, outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#A3A3A3', display: 'block', marginBottom: '6px' }}>
              Transfer To
            </label>
            <div style={{ backgroundColor: '#242424', border: '1px solid #333333', borderRadius: '8px', padding: '12px', fontSize: '13px', color: '#FFFFFF' }}>
              HDFC Bank • Current A/C •••• 4492 (Verified)
            </div>
          </div>

          <Button variant="primary" type="submit" loading={requesting} style={{ marginTop: '6px' }}>
            Confirm & Initiate Transfer
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default VendorEarnings;
