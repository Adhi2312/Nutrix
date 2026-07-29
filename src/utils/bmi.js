// Single source of truth for BMI. Previously DB.jsx and PersonalDetails.jsx
// each had their own separate, disagreeing BMI logic.

export const calculateBMI = (heightCm, weightKg) => {
  if (!heightCm || !weightKg) return null;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
};

export const getBMICategory = (bmi) => {
  if (bmi === null) return { category: 'Unknown', color: '#9ca3af' };
  if (bmi < 18.5) return { category: 'Underweight', color: '#3b82f6' };
  if (bmi < 25) return { category: 'Normal', color: '#10b981' };
  if (bmi < 30) return { category: 'Overweight', color: '#f59e0b' };
  return { category: 'Obese', color: '#ef4444' };
};

// react-gauge-chart needs a 0–1 value, not a raw BMI number. Real-world BMI
// realistically spans ~10 (severely underweight) to ~45 (extreme obesity),
// so map that range onto 0–1 and clamp — the old formula (bmi / 30 * 100)
// produced values like 1.76 for a real BMI, which just pinned the gauge.
export const bmiToGaugePercent = (bmi) => {
  if (bmi === null) return 0;
  const MIN_BMI = 10;
  const MAX_BMI = 45;
  const percent = (bmi - MIN_BMI) / (MAX_BMI - MIN_BMI);
  return Math.min(1, Math.max(0, percent));
};
