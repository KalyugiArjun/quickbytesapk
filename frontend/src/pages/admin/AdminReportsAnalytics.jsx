import React, { useState } from 'react';
import { Download, Calendar, TrendingUp, DollarSign, ShoppingBag, Users } from 'lucide-react';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

const AdminReportsAnalytics = () => {
  const { showToast } = useToast();
  const [dateRange, setDateRange] = useState('30days');

  const handleExport = (format) => {
    showToast(`Exporting QuickBite Financial & Order Report as .${format}... Download initiated!`, 'success');
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1200px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px 0' }}>
            Executive Reports & Platform Analytics
          </h1>
          <p style={{ color: '#A3A3A3', fontSize: '14px', margin: 0 }}>
            Audit Gross Merchandise Value (GMV), customer acquisition trajectories, and vendor settlement reports.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              backgroundColor: '#1C1C1C',
              color: '#FFFFFF',
              border: '1px solid #333333',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '13px',
              outline: 'none'
            }}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="quarter">This Quarter</option>
            <option value="year">Fiscal Year 2026</option>
          </select>

          <Button variant="primary" icon={Download} size="sm" onClick={() => handleExport('csv')}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Highlights Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#A3A3A3', marginBottom: '4px' }}>Monthly Orders</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF' }}>1,842</div>
          <span style={{ fontSize: '11px', color: '#22C55E' }}>+24.5% vs previous month</span>
        </div>

        <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#A3A3A3', marginBottom: '4px' }}>Net Commission Revenue</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#FF7900' }}>₹86,400</div>
          <span style={{ fontSize: '11px', color: '#22C55E' }}>+18.2% EBITDA margin</span>
        </div>

        <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#A3A3A3', marginBottom: '4px' }}>Average Order Value (AOV)</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF' }}>₹482</div>
          <span style={{ fontSize: '11px', color: '#A3A3A3' }}>Driven by Biryani & Pizzas</span>
        </div>

        <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '12px', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#A3A3A3', marginBottom: '4px' }}>On-Time Delivery Rate</div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#22C55E' }}>97.8%</div>
          <span style={{ fontSize: '11px', color: '#22C55E' }}>Avg 26 mins doorstep time</span>
        </div>
      </div>

      {/* Monthly Growth Simulation Visual Table */}
      <div style={{ backgroundColor: '#1C1C1C', border: '1px solid #333333', borderRadius: '14px', padding: '24px' }}>
        <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 16px 0', color: '#FFFFFF' }}>
          Monthly Financial Reconciliation Summary
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', padding: '10px 16px', borderBottom: '1px solid #333333', fontSize: '12px', fontWeight: 700, color: '#A3A3A3', textTransform: 'uppercase' }}>
          <span>Month</span>
          <span>Orders</span>
          <span>Gross Volume (₹)</span>
          <span>Commission Take (₹)</span>
          <span>Vendor Payouts (₹)</span>
        </div>

        {[
          { month: 'November 2026', orders: '1,842', gmv: '864,000', cut: '86,400', net: '777,600' },
          { month: 'October 2026', orders: '1,510', gmv: '710,000', cut: '71,000', net: '639,000' },
          { month: 'September 2026', orders: '1,280', gmv: '598,000', cut: '59,800', net: '538,200' },
          { month: 'August 2026', orders: '1,040', gmv: '482,000', cut: '48,200', net: '433,800' }
        ].map((row, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', padding: '14px 16px', borderBottom: '1px solid #242424', fontSize: '13px', color: '#FFFFFF' }}>
            <strong>{row.month}</strong>
            <span>{row.orders}</span>
            <span style={{ color: '#FF7900', fontWeight: 700 }}>₹{row.gmv}</span>
            <span style={{ color: '#22C55E', fontWeight: 700 }}>₹{row.cut}</span>
            <span style={{ color: '#A3A3A3' }}>₹{row.net}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReportsAnalytics;
