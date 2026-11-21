import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';
import { useToast } from '../../context/ToastContext';

const OtpModal = ({ isOpen, onClose, phoneOrEmail = '+91 98765 43210', onVerified }) => {
  const { showToast } = useToast();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval;
    if (isOpen && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  if (!isOpen) return null;

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // auto focus next
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length === 4) {
      showToast('OTP verified successfully!', 'success');
      if (onVerified) onVerified();
      onClose();
    } else {
      showToast('Please enter complete 4-digit verification code.', 'warning');
    }
  };

  const handleResend = () => {
    setTimer(30);
    setOtp(['', '', '', '']);
    showToast('New verification code sent to ' + phoneOrEmail, 'info');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="OTP Verification" maxWidth="420px">
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ fontSize: '13px', color: '#A3A3A3', margin: 0 }}>
          Enter the 4-digit verification code sent to <strong style={{ color: '#FFFFFF' }}>{phoneOrEmail}</strong>
        </p>

        {/* 4 Pin Inputs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', margin: '10px 0' }}>
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-input-${i}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              style={{
                width: '52px',
                height: '56px',
                textAlign: 'center',
                fontSize: '22px',
                fontWeight: 800,
                backgroundColor: '#242424',
                border: '1px solid #FF7900',
                borderRadius: '10px',
                color: '#FFFFFF',
                outline: 'none'
              }}
            />
          ))}
        </div>

        <Button variant="primary" size="lg" fullWidth onClick={handleVerify}>
          Verify & Continue
        </Button>

        <div style={{ fontSize: '12px', color: '#737373' }}>
          {timer > 0 ? (
            <span>Resend code in <strong style={{ color: '#FF7900' }}>{timer}s</strong></span>
          ) : (
            <button
              onClick={handleResend}
              style={{ background: 'none', border: 'none', color: '#FF7900', cursor: 'pointer', fontWeight: 700 }}
            >
              Resend OTP Code
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default OtpModal;
