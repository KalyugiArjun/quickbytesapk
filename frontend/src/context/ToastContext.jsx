import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString();
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color="#22C55E" />;
      case 'error':
        return <AlertCircle size={18} color="#EF4444" />;
      case 'warning':
        return <AlertTriangle size={18} color="#F59E0B" />;
      default:
        return <Info size={18} color="#3B82F6" />;
    }
  };

  const getToastBorder = (type) => {
    switch (type) {
      case 'success': return '1px solid #22C55E';
      case 'error': return '1px solid #EF4444';
      case 'warning': return '1px solid #F59E0B';
      default: return '1px solid #3B82F6';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast floating container */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          pointerEvents: 'none'
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              minWidth: '280px',
              maxWidth: '380px',
              backgroundColor: '#1C1C1C',
              color: '#FFFFFF',
              border: getToastBorder(toast.type),
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
              borderRadius: '8px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              animation: 'modalFadeIn 0.2s ease forwards'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {getToastIcon(toast.type)}
              <span style={{ fontSize: '14px', fontWeight: 500 }}>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#A3A3A3',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '2px'
              }}
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
