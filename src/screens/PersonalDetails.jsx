import React, { useState } from 'react';
import { User, Eye, EyeOff } from 'lucide-react';
import { calculateBMI, getBMICategory } from '../utils/bmi';
import { calculateAge } from '../utils/nutrition';

const PersonalDetails = ({ userData }) => {
  const [isVisible, setIsVisible] = useState(true);

  // No fake fallback person here on purpose — showing "Prithiv Raj, 24,
  // Male" for every user regardless of who's logged in is worse than
  // showing a loading/placeholder state.
  const name = userData?.displayName || userData?.username;
  const age = calculateAge(userData?.dob);
  const height = userData?.height;
  const weight = userData?.weight;
  // The current database uses true for male and false for female.
  const gender = userData?.gender === undefined || userData?.gender === null
    ? undefined
    : (userData.gender ? 'Male' : 'Female');

  const bmi = calculateBMI(height, weight);
  const bmiInfo = getBMICategory(bmi);

  const display = (value, suffix = '') => {
    if (value === undefined || value === null || value === '') return '—';
    return `${value}${suffix}`;
  };

  return (
    <div className="two-3">
      <div className="personal-details-header">
        <div className="header-title">
          <User className="user-icon" />
          <h3>Personal Details</h3>
        </div>
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="toggle-btn"
          aria-label={isVisible ? "Hide personal details" : "Show personal details"}
          title={isVisible ? "Hide Details" : "Show Details"}
        >
          {isVisible ? <EyeOff className="eye-icon" /> : <Eye className="eye-icon" />}
        </button>
      </div>

      <div className="personal-details-content">
        <div className="field-group">
          <label className="field-label">Name</label>
          <p className="field-value name-value">{isVisible ? display(name) : '***'}</p>
        </div>

        <div className="field-row">
          <div className="field-group">
            <label className="field-label">Age</label>
            <p className="field-value">{isVisible ? display(age, ' years') : '*** years'}</p>
          </div>
          <div className="field-group">
            <label className="field-label">Gender</label>
            <p className="field-value">{isVisible ? display(gender) : '***'}</p>
          </div>
        </div>

        <div className="field-row">
          <div className="field-group">
            <label className="field-label">Height</label>
            <p className="field-value">{isVisible ? display(height, ' cm') : '*** cm'}</p>
          </div>
          <div className="field-group">
            <label className="field-label">Weight</label>
            <p className="field-value">{isVisible ? display(weight, ' kg') : '*** kg'}</p>
          </div>
        </div>

        <div className="bmi-container">
          <label className="field-label">BMI</label>
          <div className="bmi-display">
            <span className="bmi-value">{isVisible ? (bmi ? bmi.toFixed(1) : '—') : '***'}</span>
            <span
              className="bmi-category"
              style={{ backgroundColor: isVisible ? bmiInfo.color : '#6b7280' }}
            >
              {isVisible ? bmiInfo.category : '***'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
