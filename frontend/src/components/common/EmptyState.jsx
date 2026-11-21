import React from 'react';
import { UtensilsCrossed } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = UtensilsCrossed,
  title = 'No items found',
  message = 'Try searching with different keywords or check back later.',
  actionText = null,
  onAction = null
}) => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '60px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px'
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: '#242424',
          border: '1px solid #333333',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FF7900'
        }}
      >
        <Icon size={36} />
      </div>

      <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
        {title}
      </h3>
      <p style={{ color: '#A3A3A3', maxWidth: '420px', fontSize: '14px', margin: 0 }}>
        {message}
      </p>

      {actionText && onAction && (
        <div style={{ marginTop: '8px' }}>
          <Button variant="primary" onClick={onAction}>
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
