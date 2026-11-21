import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon = null,
  fullWidth = false,
  type = 'button',
  className = '',
  style = {}
}) => {
  // Styles based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #FF7900 0%, #FF5A00 100%)',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: '0 4px 14px rgba(255, 121, 0, 0.35)'
        };
      case 'secondary':
        return {
          background: '#242424',
          color: '#FFFFFF',
          border: '1px solid #333333'
        };
      case 'outline':
        return {
          background: 'transparent',
          color: '#FF7900',
          border: '1px solid #FF7900'
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: '#A3A3A3',
          border: 'none'
        };
      case 'danger':
        return {
          background: '#EF4444',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
        };
      case 'success':
        return {
          background: '#22C55E',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
        };
      default:
        return {};
    }
  };

  // Styles based on size
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '6px 12px', fontSize: '13px', borderRadius: '6px' };
      case 'lg':
        return { padding: '14px 28px', fontSize: '16px', borderRadius: '12px' };
      case 'md':
      default:
        return { padding: '10px 20px', fontSize: '14px', borderRadius: '8px' };
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: 600,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        width: fullWidth ? '100%' : 'auto',
        transition: 'all 0.2s ease',
        transform: disabled || loading ? 'none' : 'translateY(0)',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          if (variant === 'primary') {
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 121, 0, 0.5)';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.transform = 'translateY(0)';
          if (variant === 'primary') {
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(255, 121, 0, 0.35)';
          }
        }
      }}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
