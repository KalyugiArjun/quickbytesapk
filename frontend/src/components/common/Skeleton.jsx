import React from 'react';

export const Skeleton = ({ width = '100%', height = '20px', borderRadius = '6px', style = {} }) => {
  return (
    <div
      className="skeleton-shimmer"
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
    />
  );
};

export const FoodCardSkeleton = () => {
  return (
    <div
      style={{
        backgroundColor: '#242424',
        border: '1px solid #333333',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      <Skeleton height="160px" borderRadius="10px" />
      <Skeleton width="60%" height="20px" />
      <Skeleton width="90%" height="14px" />
      <Skeleton width="40%" height="14px" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
        <Skeleton width="30%" height="24px" />
        <Skeleton width="80px" height="34px" borderRadius="8px" />
      </div>
    </div>
  );
};

export const TableRowSkeleton = ({ cols = 5 }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '14px 20px',
        borderBottom: '1px solid #2E2E2E'
      }}
    >
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} width={`${100 / cols}%`} height="18px" />
      ))}
    </div>
  );
};

export default Skeleton;
