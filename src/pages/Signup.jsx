import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignupStepper } from '../components/SignupStepper';
import { AccountStep } from '../components/AccountStep';
import { ProfileStep } from '../components/ProfileStep';
import './Signup.css';

const initialFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  otp: '',
  gender: '',
  dob: '',
  location: '',
  height: '',
  weight: '',
  bloodGroup: '',
};

export const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    if (error) {
      setError('');
    }
  };

  const handleAccountContinue = (event) => {
    event.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword) {
      setError('Please complete all account fields before continuing.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setStep(2);
  };

  const handleFinishSignup = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const body = {
        username: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        email: formData.email,
        password: formData.password,
        gender: formData.gender === 'male' ? true : false,
        country: formData.location,
        dob: formData.dob,
        height: Number(formData.height),
        weight: Number(formData.weight),
        bloodGroup: formData.bloodGroup,
      };

      const response = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.status === 200) {
        navigate('/dashboard');
      } else {
        setError('Signup could not be completed. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setError('Signup could not be completed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-page">
      <aside className="signup-sidebar">
        <div className="brand-pill">
          <span className="brand-icon">✦</span>
          <span>Signup</span>
        </div>
        <SignupStepper step={step} />
      </aside>

      <main className="signup-main">
        <div className="signup-form-wrapper">
          {step === 1 ? (
            <AccountStep
              formData={formData}
              onFieldChange={handleFieldChange}
              onContinue={handleAccountContinue}
              error={error}
            />
          ) : null}

          {step === 2 ? (
            <ProfileStep
              formData={formData}
              onFieldChange={handleFieldChange}
              onBack={() => setStep(1)}
              onFinish={handleFinishSignup}
              error={error}
              isSubmitting={isSubmitting}
            />
          ) : null}

          <div className="auth-switch">
            <span>Already have an account?</span>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
