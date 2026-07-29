import React from 'react';

export const ProfileStep = ({ formData, onFieldChange, onBack, onFinish, error, isSubmitting }) => {
  return (
    <form className="signup-form-card step-transition" onSubmit={onFinish}>
      <div className="step-header">
        <p className="eyebrow">Step 3</p>
        <h2>Complete your profile</h2>
        <p className="step-copy">Add a few details so your account feels ready from day one.</p>
      </div>

      {error ? <div className="feedback error">{error}</div> : null}

      <div className="section-block">
        <h3>General Information</h3>
        <div className="input-grid">
          <label className="input-group">
            <span>Gender</span>
            <select value={formData.gender} onChange={(event) => onFieldChange('gender', event.target.value)}>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
          <label className="input-group">
            <span>Date of Birth</span>
            <input type="date" value={formData.dob} onChange={(event) => onFieldChange('dob', event.target.value)} />
          </label>
          <label className="input-group full-width">
            <span>Location</span>
            <input
              type="text"
              value={formData.location}
              onChange={(event) => onFieldChange('location', event.target.value)}
              placeholder="Enter your location"
            />
          </label>
        </div>
      </div>

      <div className="section-block">
        <h3>Health Information</h3>
        <div className="input-grid">
          <label className="input-group">
            <span>Height (cm)</span>
            <input
              type="number"
              value={formData.height}
              onChange={(event) => onFieldChange('height', event.target.value)}
              placeholder="Enter height"
            />
          </label>
          <label className="input-group">
            <span>Weight (kg)</span>
            <input
              type="number"
              value={formData.weight}
              onChange={(event) => onFieldChange('weight', event.target.value)}
              placeholder="Enter weight"
            />
          </label>
          <label className="input-group full-width">
            <span>Blood Group</span>
            <input
              type="text"
              value={formData.bloodGroup}
              onChange={(event) => onFieldChange('bloodGroup', event.target.value)}
              placeholder="e.g. O+"
            />
          </label>
        </div>
      </div>

      <div className="step-actions two-buttons">
        <button type="button" className="secondary-btn" onClick={onBack}>
          Previous
        </button>
        <button type="submit" className="primary-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Finish Signup'}
        </button>
      </div>
    </form>
  );
};
