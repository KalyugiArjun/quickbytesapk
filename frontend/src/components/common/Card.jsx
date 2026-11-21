import React from 'react';

const Card = ({
  children,
  className = '',
  style = {},
  hoverable = false,
  onClick = null
}) => {
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        backgroundColor: '#242424',
        border: '1px solid #333333',
        borderRadius: '12px',
        padding: '20px',
        transition: 'all 0.25s ease',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        ...style
      }}
      onMouseEnter={(e) => {
        if (hoverable) {
          e.currentTarget.style.borderColor = '#FF7900';
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 121, 0, 0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          e.currentTarget.style.borderColor = '#333333';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        }
      }}
    >
      {children}
    </div>
  );
};

export default Card;
