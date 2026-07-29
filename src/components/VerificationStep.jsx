import React from 'react';

export const VerificationStep = ({ formData, onFieldChange, onVerify, onResendOtp, onBack, error, successMessage }) => {
  const otpDigits = Array.from({ length: 6 }, (_, index) => formData.otp[index] || '');

  const handleOtpChange = (index, value) => {
    const sanitizedValue = value.replace(/\D/g, '').slice(-1);
    const nextOtp = `${formData.otp.slice(0, index)}${sanitizedValue}${formData.otp.slice(index + 1)}`.slice(0, 6);
    onFieldChange('otp', nextOtp);
  };

  return (
    <form className="signup-form-card step-transition" onSubmit={onVerify}>
      <div className="step-header">
        <p className="eyebrow">Step 2</p>
        <h2>Verify your email</h2>
        <p className="step-copy">Enter the 6-digit code we just sent to your inbox.</p>
      </div>

      {error ? <div className="feedback error">{error}</div> : null}
      {successMessage ? <div className="feedback success">{successMessage}</div> : null}

      <div className="otp-grid">
        {otpDigits.map((digit, index) => (
          <input
            key={`otp-${index}`}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            onChange={(event) => handleOtpChange(index, event.target.value)}
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
      </div>

      <div className="step-actions two-buttons">
        <button type="button" className="secondary-btn" onClick={onBack}>
          Previous
        </button>
        <button type="button" className="secondary-btn" onClick={onResendOtp}>
          Resend OTP
        </button>
        <button type="submit" className="primary-btn">
          Verify
        </button>
      </div>
    </form>
  );
};
