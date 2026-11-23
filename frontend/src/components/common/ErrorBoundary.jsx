import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('QuickBite Uncaught UI Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    try {
      localStorage.removeItem('quickbite_cart');
      localStorage.removeItem('quickbite_cart_restaurant');
    } catch {
      // Ignore
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            backgroundColor: '#0F0F0F',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '2px solid #EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}
          >
            <AlertCircle size={32} color="#EF4444" />
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', color: '#FFFFFF' }}>
            QuickBite UI Encountered an Issue
          </h2>
          <p style={{ color: '#9E9E9E', maxWidth: '420px', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6 }}>
            Something interrupted the interface rendering. Click below to refresh and restore your clean session.
          </p>

          {this.state.error && (
            <div
              style={{
                backgroundColor: '#1A1A1A',
                border: '1px solid #333333',
                borderRadius: '12px',
                padding: '14px 18px',
                maxWidth: '520px',
                width: '100%',
                marginBottom: '24px',
                textAlign: 'left',
                overflowX: 'auto',
                color: '#FF7200',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}
            >
              {this.state.error.toString()}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={this.handleReset}
              style={{
                backgroundColor: '#FF7200',
                backgroundImage: 'linear-gradient(135deg, #FF7200 0%, #FF5500 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '9999px',
                padding: '12px 28px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(255, 114, 0, 0.35)'
              }}
            >
              <RefreshCw size={16} /> Restore & Reload QuickBite
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
