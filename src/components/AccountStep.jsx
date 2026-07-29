import React from 'react';

export const AccountStep = ({ formData, onFieldChange, onContinue, error }) => {
  return (
    <form className="signup-form-card step-transition" onSubmit={onContinue}>
      <div className="step-header">
        <p className="eyebrow">Step 1</p>
        <h2>Create your account</h2>
        <p className="step-copy">Start with your personal details and secure password.</p>
      </div>

      {error ? <div className="feedback error">{error}</div> : null}

      <div className="input-grid">
        <label className="input-group">
          <span>First Name</span>
          <input
            type="text"
            value={formData.firstName}
            onChange={(event) => onFieldChange('firstName', event.target.value)}
            placeholder="Enter first name"
          />
        </label>
        <label className="input-group">
          <span>Last Name</span>
          <input
            type="text"
            value={formData.lastName}
            onChange={(event) => onFieldChange('lastName', event.target.value)}
            placeholder="Enter last name"
          />
        </label>
        <label className="input-group full-width">
          <span>Email Address</span>
          <input
            type="email"
            value={formData.email}
            onChange={(event) => onFieldChange('email', event.target.value)}
            placeholder="Enter your email"
          />
        </label>
        <label className="input-group">
          <span>Password</span>
          <input
            type="password"
            value={formData.password}
            onChange={(event) => onFieldChange('password', event.target.value)}
            placeholder="Create a password"
          />
        </label>
        <label className="input-group">
          <span>Confirm Password</span>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(event) => onFieldChange('confirmPassword', event.target.value)}
            placeholder="Confirm your password"
          />
        </label>
      </div>

      <div className="step-actions">
        <button type="submit" className="primary-btn">
          Continue
        </button>
      </div>
    </form>
  );
};
