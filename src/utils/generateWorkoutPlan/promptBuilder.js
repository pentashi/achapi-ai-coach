// utils/generateWorkoutPlan/promptBuilder.js

export function buildWorkoutPrompt(profile) {
  // Helper: sanitize fields, fallback to "N/A" if empty
  const safe = (val) => {
    if (val === null || val === undefined) return "N/A";
    if (typeof val === "string" && val.trim() === "") return "N/A";
    if (Array.isArray(val) && val.length === 0) return "N/A";
    return val;
  };

  const {
    name, age, gender, height, weight,
    fitnessGoals, experienceLevel, workoutSplit,
    trainingDaysPerWeek, workoutDurationMinutes,
    preferredTrainingTime, trainingEnvironment,
    injuryHistory, mobilityRestrictions, exerciseRestrictions,
    physicalActivityLevel, bodyFatPercentage, muscleMass,
    waistCircumference, dietaryPreference, sleepQuality,
    stressLevel, motivationLevel, goalTimeline,
    additionalNotes, accountabilityPreferences, motivation,
  } = profile;

  // Join goals or default to general fitness
  const prioritizedGoals = Array.isArray(fitnessGoals) && fitnessGoals.length
    ? fitnessGoals.join(", ")
    : "general fitness";

  return `
You are a world-class AI fitness coach. Based on the client profile below, generate a hyper-personalized workout plan focused primarily on the following goal(s): ${prioritizedGoals}.

Plan duration: next ${safe(goalTimeline)}.

Requirements:
- Exclude any exercises that conflict with the client's injury history, mobility, or exercise restrictions.
- Use only equipment available in the client's training environment (${safe(trainingEnvironment)}).
- Create a weekly training split based on their preferred split (${safe(workoutSplit)}) and training days per week (${safe(trainingDaysPerWeek)}).
- Prescribe workout duration of approximately ${safe(workoutDurationMinutes)} minutes per session.
- Adjust intensity, sets, reps, and rest periods according to experience level (${safe(experienceLevel)}) and motivation level (${safe(motivationLevel)}).
- Include progression guidelines across weeks.
- Suggest rest or active recovery days appropriate to training frequency and motivation.
- Include notes on form, safety, and recovery.
- Provide simple diet tips aligned with the client's dietary preference (${safe(dietaryPreference)}).
- Format output strictly as JSON with keys: summary, weeklySchedule, notes, dietTips.

Client Profile:
- Name: ${safe(name)}
- Age: ${safe(age)}
- Gender: ${safe(gender)}
- Height: ${safe(height)} cm
- Weight: ${safe(weight)} kg
- Body Fat %: ${safe(bodyFatPercentage)}
- Muscle Mass: ${safe(muscleMass)}
- Waist Circumference: ${safe(waistCircumference)}
- Physical Activity Level: ${safe(physicalActivityLevel)}
- Sleep Quality: ${safe(sleepQuality)}
- Stress Level: ${safe(stressLevel)}
- Accountability Preferences: ${safe(accountabilityPreferences)}
- Additional Notes: ${safe(additionalNotes)}
- Injury History: ${safe(injuryHistory)}
- Mobility Restrictions: ${safe(mobilityRestrictions)}
- Exercise Restrictions: ${safe(exerciseRestrictions)}
- Motivation / Mindset: ${safe(motivation)}

Return only the JSON output, no additional text or explanation.
  `.trim();
}
