import React from 'react';
import { Check, Circle } from 'lucide-react';

export const SignupStepper = ({ step }) => {
  const steps = [
    { id: 1, label: 'Account' },
    { id: 2, label: 'Complete Profile' },
  ];

  return (
    <div className="signup-stepper" aria-label="Signup progress">
      {steps.map((item) => {
        const state = item.id < step ? 'completed' : item.id === step ? 'active' : 'pending';

        return (
          <div key={item.id} className={`stepper-item ${state}`}>
            <div className="stepper-badge">
              {state === 'completed' ? <Check size={16} /> : <Circle size={16} />}
            </div>
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};
