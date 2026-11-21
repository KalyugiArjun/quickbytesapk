import React from 'react';
import { CheckCircle2, Clock, ChefHat, Bike, PackageCheck, XCircle } from 'lucide-react';

const OrderStatusStepper = ({ currentStatus = 'placed' }) => {
  const steps = [
    { key: 'placed', label: 'Order Placed', icon: Clock },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
    { key: 'preparing', label: 'Kitchen Preparing', icon: ChefHat },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: Bike },
    { key: 'delivered', label: 'Delivered', icon: PackageCheck }
  ];

  if (currentStatus === 'cancelled') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid #EF4444',
          borderRadius: '10px',
          color: '#EF4444'
        }}
      >
        <XCircle size={28} />
        <div>
          <h4 style={{ margin: 0, fontWeight: 700 }}>Order Cancelled</h4>
          <p style={{ margin: 0, fontSize: '13px', color: '#A3A3A3' }}>
            This order has been cancelled and any paid funds refunded.
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = steps.findIndex((s) => s.key === currentStatus);

  return (
    <div style={{ padding: '20px 0', width: '100%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        {/* Background Connecting Line */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '30px',
            right: '30px',
            height: '4px',
            backgroundColor: '#333333',
            zIndex: 1
          }}
        />

        {/* Active Progress Connecting Line */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '30px',
            height: '4px',
            width: `${Math.max(0, (currentIndex / (steps.length - 1)) * 90)}%`,
            background: 'linear-gradient(90deg, #FF7900, #22C55E)',
            zIndex: 2,
            transition: 'width 0.4s ease'
          }}
        />

        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          let iconBg = '#242424';
          let iconBorder = '#333333';
          let iconColor = '#737373';

          if (isCompleted) {
            iconBg = '#22C55E';
            iconBorder = '#22C55E';
            iconColor = '#FFFFFF';
          } else if (isCurrent) {
            iconBg = '#FF7900';
            iconBorder = '#FF7900';
            iconColor = '#FFFFFF';
          }

          return (
            <div
              key={step.key}
              style={{
                position: 'relative',
                zIndex: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <div
                className={isCurrent ? 'pulse-glow' : ''}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: iconBg,
                  border: `2px solid ${iconBorder}`,
                  color: iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                <StepIcon size={18} />
              </div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: isCurrent ? 700 : 500,
                  color: isCurrent ? '#FF7900' : isCompleted ? '#FFFFFF' : '#737373',
                  textAlign: 'center',
                  maxWidth: '75px'
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusStepper;
