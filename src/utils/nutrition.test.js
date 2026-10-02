import { calculateAge, calculateMaintenanceCalories, calculateMacroGoals } from './nutrition';

describe('nutrition utilities', () => {
  it('calculates maintenance calories for a male using Mifflin-St Jeor', () => {
    expect(calculateMaintenanceCalories(70, 175, 25, 'male')).toBe(2594);
  });

  it('calculates maintenance calories for a female using Mifflin-St Jeor', () => {
    expect(calculateMaintenanceCalories(65, 160, 30, 'female')).toBe(2075);
  });

  it('treats the stored false gender value as female', () => {
    expect(calculateMaintenanceCalories(65, 160, 30, false)).toBe(2075);
  });

  it('calculates age from a date of birth', () => {
    const today = new Date();
    const birthDate = new Date(today.getFullYear() - 30, today.getMonth(), today.getDate());
    expect(calculateAge(birthDate.toISOString())).toBe(30);
  });

  it('returns rounded macro goals from maintenance calories and body weight', () => {
    const goals = calculateMacroGoals(70, 2594);

    expect(goals).toEqual({
      maintenanceCalories: 2594,
      proteinGoal: 105,
      fatGoal: 56,
      carbGoal: 418,
      proteinCalories: 420,
      fatCalories: 504,
    });
  });
});
