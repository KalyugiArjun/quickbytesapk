import React, { useState } from 'react';
import { DollarSign, ArrowDownRight, ArrowUpRight, CheckCircle2, Clock, RefreshCcw } from 'lucide-react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useToast } from '../../context/ToastContext';

const AdminPayments = () => {
  const { showToast } = useToast();

  const [settlements, setSettlements] = useState([
    {
      id: 'SET-901',
      restaurantName: 'The Royal Dum Biryani & Kebabs',
      bankAccount: 'HDFC •••• 4492',
      period: '14 Nov - 20 Nov',
      grossAmount: 48500,
      commissionCut: 4850, // 10%
      netPayout: 43650,
      status: 'Paid',
      date: '2026-11-21'
    },
    {
      id: 'SET-902',
      restaurantName: 'Crust & Craft Woodfired Pizza',
      bankAccount: 'ICICI •••• 7711',
      period: '14 Nov - 20 Nov',
      grossAmount: 39200,
      commissionCut: 3920, // 10%
      netPayout: 35280,
      status: 'Pending',
      date: '2026-11-21'
    },
    {
      id: 'SET-903',
      restaurantName: 'Green Leaf Pure Veg Delights',
      bankAccount: 'SBI •••• 1092',
      period: '14 Nov - 20 Nov',
      grossAmount: 52100,
      commissionCut: 5210, // 10%
      netPayout: 46890,
      status: 'Paid',
      date: '2026-11-20'
    }
  ]);

  const [refundRequests, setRefundRequests] = useState([
    {
      id: 'REF-301',
      orderNumber: 'QB-44120',
      customerName: 'Priya Mehta',
      amount: 150,
      reason: 'Late delivery due to road block',
      status: 'Pending'
    }
  ]);

  const handlePaySettlement = (id) => {
    setSettlements((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'Paid' } : s))
    );
    showToast('Vendor settlement dispatched to verified bank account!', 'success');
  };

  const handleProcessRefund = (id) => {
    setRefundRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Refunded' } : r))
    );
    showToast('Refund credited to customer QuickBite wallet!', 'success');
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0' }}>
          Payments, Settlements & Commission Management
        </h1>
        <p style={{ color: '#A3A3A3', fontSize: '14px', margin: 0 }}>
          Manage merchant weekly settlements, handle dispute refund approvals, and audit take-rates.
        </p>
      </div>

      {/* Vendor Settlements */}
      <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '14px', padding: '24px', marginBottom: '30px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: '#FFFFFF' }}>
          Weekly Merchant Payout Settlements (10% Take Rate)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {settlements.map((s) => (
            <div
              key={s.id}
              style={{
                backgroundColor: '#242424',
                border: '1px solid #333333',
                borderRadius: '10px',
                padding: '16px 20px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>
                    {s.restaurantName}
                  </span>
                  <Badge variant={s.status === 'Paid' ? 'success' : 'warning'}>{s.status}</Badge>
                </div>
                <div style={{ fontSize: '12px', color: '#A3A3A3' }}>
                  Settlement ID: {s.id} • {s.period} • Bank: {s.bankAccount}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#22C55E' }}>
                    ₹{s.netPayout.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11px', color: '#737373' }}>
                    Gross ₹{s.grossAmount.toLocaleString()} (-₹{s.commissionCut} commission)
                  </div>
                </div>

                {s.status === 'Pending' && (
                  <Button variant="primary" size="sm" onClick={() => handlePaySettlement(s.id)}>
                    Disburse Payout
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Refund Queue */}
      <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '14px', padding: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: '#FFFFFF' }}>
          Customer Refund Review Queue
        </h3>

        {refundRequests.map((r) => (
          <div
            key={r.id}
            style={{
              backgroundColor: '#242424',
              border: '1px solid #333333',
              borderRadius: '10px',
              padding: '14px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>
                Refund #{r.id} for Order {r.orderNumber} ({r.customerName})
              </div>
              <div style={{ fontSize: '12px', color: '#EF4444' }}>
                Reason: "{r.reason}" • Requested: ₹{r.amount}
              </div>
            </div>

            {r.status === 'Pending' ? (
              <Button variant="danger" size="sm" onClick={() => handleProcessRefund(r.id)}>
                Approve Refund (Wallet Credit)
              </Button>
            ) : (
              <Badge variant="success">Refunded</Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPayments;
