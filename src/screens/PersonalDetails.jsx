import React, { useState } from 'react';
import { User, Eye, EyeOff } from 'lucide-react';

const PersonalDetails = ({ userData = {} }) => {
  const [isVisible, setIsVisible] = useState(true);
  const personalData = {
    name: userData.name || 'Prithiv Raj',
    age: userData.age || 20,
    height: userData.height || 181, // in cm
    weight: userData.weight || 70, // in kg
    gender: userData.gender || 'Male'
  };

  const calculateBMI = () => {
    const heightInM = personalData.height / 100;
    return (personalData.weight / (heightInM * heightInM)).toFixed(1);
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: '#3b82f6' };
    if (bmi < 25) return { category: 'Normal', color: '#10b981' };
    if (bmi < 30) return { category: 'Overweight', color: '#f59e0b' };
    return { category: 'Obese', color: '#ef4444' };
  };

  const bmi = calculateBMI();
  const bmiInfo = getBMICategory(parseFloat(bmi));

  return (
    <div className="two-3">
      <div className="personal-details-header">
        <div className="header-title">
          <User className="user-icon" />
          <h3>Personal Details</h3>
        </div>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="toggle-btn"
          title={isVisible ? "Hide Details" : "Show Details"}
        >
          {isVisible ? <EyeOff className="eye-icon" /> : <Eye className="eye-icon" />}
        </button>
      </div>

      <div className="personal-details-content">
        {/* Name */}
        <div className="field-group">
          <label className="field-label">Name</label>
          <p className="field-value name-value">{isVisible ? personalData.name : '***'}</p>
        </div>

        {/* Age & Gender */}
        <div className="field-row">
          <div className="field-group">
            <label className="field-label">Age</label>
            <p className="field-value">{isVisible ? `${personalData.age} years` : '*** years'}</p>
          </div>
          <div className="field-group">
            <label className="field-label">Gender</label>
            <p className="field-value">{isVisible ? personalData.gender : '***'}</p>
          </div>
        </div>

        {/* Height & Weight */}
        <div className="field-row">
          <div className="field-group">
            <label className="field-label">Height</label>
            <p className="field-value">{isVisible ? `${personalData.height} cm` : '*** cm'}</p>
          </div>
          <div className="field-group">
            <label className="field-label">Weight</label>
            <p className="field-value">{isVisible ? `${personalData.weight} kg` : '*** kg'}</p>
          </div>
        </div>

        {/* BMI Display */}
        <div className="bmi-container">
          <label className="field-label">BMI</label>
          <div className="bmi-display">
            <span className="bmi-value">{isVisible ? bmi : '***'}</span>
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