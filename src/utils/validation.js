// utils/validation.js
import {
  genders,
  experienceLevels,
  workoutSplits,
  trainingTimes,
  trainingEnvironments,
  motivationLevels,
  goalTimelines,
} from "./constants";

export const validateStep = (step, profile) => {
  switch (step) {
    case 0:
      return (
        profile.name.trim() &&
        Number(profile.age) >= 10 &&
        genders.includes(profile.gender) &&
        Number(profile.height) > 50 &&
        Number(profile.weight) > 20
      );
    case 1:
      return (
        profile.fitnessGoals.length > 0 &&
        experienceLevels.includes(profile.experienceLevel) &&
        workoutSplits.includes(profile.workoutSplit) &&
        Number(profile.trainingDaysPerWeek) >= 1 &&
        Number(profile.trainingDaysPerWeek) <= 7 &&
        Number(profile.workoutDurationMinutes) >= 10 &&
        trainingTimes.includes(profile.preferredTrainingTime) &&
        trainingEnvironments.includes(profile.trainingEnvironment)
      );
    case 2:
  return (
    physicalActivityLevels.includes(profile.activityLevel) &&
    dietaryPreferences.includes(profile.dietaryPreference) &&
    sleepQualities.includes(profile.sleepQuality) &&
    stressLevels.includes(profile.stressLevel)
  );

    case 3:
      return (
        motivationLevels.includes(profile.motivationLevel) &&
        goalTimelines.includes(profile.goalTimeline)
      );
    default:
      return true;
  }
};
