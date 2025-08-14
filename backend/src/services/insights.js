'use strict';

// Activity factors for TDEE calculation
const ActivityFactor = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

// PUBLIC_INTERFACE
function estimateTargets(user) {
  /** Estimates daily calorie target and macro split using Mifflin-St Jeor equation.
   * Returns { bmr, tdee, targetCalories, macros: { protein, carbs, fat } }
   */
  const age = Number(user.age || 30);
  const weight = Number(user.weightKg || 70);
  const height = Number(user.heightCm || 170);
  const gender = user.gender || 'other';
  const activity = user.activityLevel || 'sedentary';
  const factor = ActivityFactor[activity] || ActivityFactor.sedentary;

  // Mifflin-St Jeor BMR
  let bmr = 10 * weight + 6.25 * height - 5 * age;
  if (gender === 'male') bmr += 5;
  else if (gender === 'female') bmr -= 161;

  const tdee = bmr * factor;
  const targetCalories = Math.round(tdee);

  // Macro split: 30% protein, 40% carbs, 30% fat
  const macros = {
    protein: Math.round((0.3 * targetCalories) / 4),
    carbs: Math.round((0.4 * targetCalories) / 4),
    fat: Math.round((0.3 * targetCalories) / 9),
  };

  return { bmr: Math.round(bmr), tdee: Math.round(tdee), targetCalories, macros };
}

// PUBLIC_INTERFACE
function generateTips(user, avgCalories) {
  /** Generates simple personalized tips based on profile and average calories. */
  const tips = [];

  const targets = estimateTargets(user);
  if (avgCalories > targets.targetCalories + 200) {
    tips.push('Your average intake is above your estimated needs. Consider reducing portion sizes or increasing activity.');
  } else if (avgCalories < targets.targetCalories - 200) {
    tips.push('Your average intake is below your estimated needs. Ensure adequate fueling to support your goals.');
  } else {
    tips.push('Your intake is close to your estimated needs. Keep maintaining a balanced diet.');
  }

  if (!user.weightKg || !user.heightCm) {
    tips.push('Add your height and weight in profile for more accurate recommendations.');
  }

  if (user.activityLevel === 'sedentary') {
    tips.push('Incorporate short walks or light activity throughout the day.');
  } else if (user.activityLevel === 'very_active') {
    tips.push('Prioritize recovery: sleep, hydration, and nutrient timing.');
  }

  tips.push('Aim for a macro balance around 30% protein, 40% carbs, 30% fat.');
  return { tips, targets };
}

module.exports = {
  estimateTargets,
  generateTips,
};
