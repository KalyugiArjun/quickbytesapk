import React from 'react';

const Badge = ({ variant = 'default', children, style = {} }) => {
  const getBadgeStyle = () => {
    switch (variant) {
      // Order status
      case 'placed':
        return { bg: 'rgba(59, 130, 246, 0.15)', text: '#60A5FA', border: '#3B82F6' };
      case 'confirmed':
        return { bg: 'rgba(99, 102, 241, 0.15)', text: '#818CF8', border: '#6366F1' };
      case 'preparing':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24', border: '#F59E0B' };
      case 'out_for_delivery':
        return { bg: 'rgba(6, 182, 212, 0.15)', text: '#22D3EE', border: '#06B6D4' };
      case 'delivered':
        return { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ADE80', border: '#22C55E' };
      case 'cancelled':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#F87171', border: '#EF4444' };

      // User roles
      case 'admin':
        return { bg: 'rgba(236, 72, 153, 0.15)', text: '#F472B6', border: '#EC4899' };
      case 'vendor':
        return { bg: 'rgba(255, 121, 0, 0.15)', text: '#FF7900', border: '#FF7900' };
      case 'customer':
        return { bg: 'rgba(168, 85, 247, 0.15)', text: '#C084FC', border: '#A855F7' };

      // General
      case 'success':
        return { bg: 'rgba(34, 197, 94, 0.15)', text: '#4ADE80', border: '#22C55E' };
      case 'warning':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#FBBF24', border: '#F59E0B' };
      case 'danger':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#F87171', border: '#EF4444' };
      case 'primary':
        return { bg: 'rgba(255, 121, 0, 0.2)', text: '#FF7900', border: '#FF7900' };
      default:
        return { bg: '#2E2E2E', text: '#A3A3A3', border: '#444444' };
    }
  };

  const { bg, text, border } = getBadgeStyle();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        backgroundColor: bg,
        color: text,
        border: `1px solid ${border}`,
        ...style
      }}
    >
      {children}
    </span>
  );
};

// Veg / Non-Veg Icon Badges
export const DietaryBadge = ({ isVeg }) => {
  return (
    <span
      title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '18px',
        height: '18px',
        border: `2px solid ${isVeg ? '#22C55E' : '#EF4444'}`,
        borderRadius: '4px',
        backgroundColor: '#1C1C1C',
        padding: '2px'
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: isVeg ? '#22C55E' : '#EF4444'
        }}
      />
    </span>
  );
};

export default Badge;
