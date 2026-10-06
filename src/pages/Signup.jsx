import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SignupStepper } from '../components/SignupStepper';
import { AccountStep } from '../components/AccountStep';
import { ProfileStep } from '../components/ProfileStep';
import './Signup.css';
import { apiUrl } from '../api';
import { useQueryClient } from '@tanstack/react-query';

const initialFormData = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  otp: '',
  gender: '',
  dob: '',
  height: '',
  weight: '',
  bloodGroup: '',
};

export const Signup = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setError('');
    setStep(2);
  };

  const handleFinishSignup = async (event) => {
    event.preventDefault();

    if (!formData.gender || !formData.dob || !formData.height || !formData.weight) {
      setError('Gender, date of birth, height, and weight are required.');
      return;
    }
    setIsSubmitting(true);

    try {
      const body = {
        displayName: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        email: formData.email,
        password: formData.password,
        gender: formData.gender === 'male' ? true : false,
        dob: formData.dob,
        height: Number(formData.height),
        weight: Number(formData.weight),
        bloodGroup: formData.bloodGroup,
      };

      const response = await fetch(apiUrl('/signup'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        queryClient.setQueryData(['session'], true);
        await queryClient.invalidateQueries({ queryKey: ['user-data'] });
        navigate('/dashboard');
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.error || 'Signup could not be completed. Please try again.');
      }
    } catch (error) {
      console.error('Signup request failed.');
      setError('Signup could not be completed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-page">
      <aside className="signup-sidebar">
        <div className="brand-pill">
          <span className="brand-icon">N</span>
          <span>Nutrix</span>
        </div>
        <div className="signup-story-copy">
          <p className="signup-kicker">A better starting point</p>
          <h1>Build a routine that fits your life.</h1>
          <p>Tell us a little about yourself and Nutrix will make the everyday details easier to follow.</p>
        </div>
        <SignupStepper step={step} />
        <p className="signup-story-footer">Your information stays in your account.</p>
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

          <div className="auth-switch-copy">
            <span>Already a member?</span>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
