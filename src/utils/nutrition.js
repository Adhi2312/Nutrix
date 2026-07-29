export const calculateMaintenanceCalories = (weight, height, age, gender) => {
  const normalizedWeight = Number(weight);
  const normalizedHeight = Number(height);
  const normalizedAge = Number(age);
  const normalizedGender = String(gender || '').toLowerCase();

  if ([normalizedWeight, normalizedHeight, normalizedAge].some((value) => Number.isNaN(value))) {
    return 0;
  }

  let bmr = 0;

  if (normalizedGender === 'female') {
    bmr = 10 * normalizedWeight + 6.25 * normalizedHeight - 5 * normalizedAge - 161;
  } else {
    bmr = 10 * normalizedWeight + 6.25 * normalizedHeight - 5 * normalizedAge + 5;
  }

  return Math.round(bmr * 1.55);
};

export const calculateMacroGoals = (weight, maintenanceCalories) => {
  const normalizedWeight = Number(weight);
  const normalizedMaintenanceCalories = Number(maintenanceCalories);

  if ([normalizedWeight, normalizedMaintenanceCalories].some((value) => Number.isNaN(value))) {
    return {
      maintenanceCalories: 0,
      proteinGoal: 0,
      fatGoal: 0,
      carbGoal: 0,
      proteinCalories: 0,
      fatCalories: 0,
    };
  }

  const proteinGoal = Math.round(1.5 * normalizedWeight);
  const fatGoal = Math.round(0.8 * normalizedWeight);
  const proteinCalories = proteinGoal * 4;
  const fatCalories = fatGoal * 9;
  const carbGoal = Math.round((normalizedMaintenanceCalories - proteinCalories - fatCalories) / 4);

  return {
    maintenanceCalories: Math.round(normalizedMaintenanceCalories),
    proteinGoal,
    fatGoal,
    carbGoal,
    proteinCalories,
    fatCalories,
  };
};
