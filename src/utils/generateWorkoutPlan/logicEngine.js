import { filterExercises } from "./filters";

// Simple muscle group splits
const splits = {
  "full body": ["full body"],
  "push/pull/legs": [
    ["chest", "shoulders", "triceps"], // push
    ["back", "biceps"],                // pull
    ["legs", "glutes", "core"],       // legs
  ],
  "upper/lower body": [
    ["chest", "back", "shoulders", "biceps", "triceps", "core"], // upper
    ["legs", "glutes", "core"],                                 // lower
  ],
  "custom": ["full body"], // fallback
};

// Helper to check if exercise targets any muscle group in the list
const targetsMuscleGroup = (exercise, groups) =>
  exercise.muscleGroups.some((mg) => groups.includes(mg));

// Set/get helpers
const getSets = (level) => {
  switch (level) {
    case "beginner": return 2;
    case "intermediate": return 3;
    case "advanced": return 4;
    case "elite": return 5;
    default: return 3;
  }
};

const getRepsRange = (goals) => {
  if (goals.includes("bulk")) return "8-12";
  if (goals.includes("cut")) return "12-15";
  if (goals.includes("recomp")) return "10-15";
  if (goals.includes("maintain")) return "12-20";
  return "10-15";
};

const getRestSeconds = (goals) => {
  if (goals.includes("strength") || goals.includes("bulk")) return 90;
  if (goals.includes("endurance") || goals.includes("cut")) return 30;
  return 60;
};

// Main workout plan generator
export function createWorkoutPlan(profile) {
  const {
    fitnessGoals,
    experienceLevel,
    equipment = [],
    trainingEnvironment,
    injuryHistory,
    mobilityRestrictions,
    exerciseRestrictions,
    trainingDaysPerWeek,
    workoutSplit = "full body",
  } = profile;

  // Filter exercises based on profile
  const filteredExercises = filterExercises({
    goals: fitnessGoals,
    experienceLevel,
    equipment,
    environment: trainingEnvironment,
    injuryHistory,
    mobilityRestrictions,
    exerciseRestrictions,
  });

  if (!filteredExercises.length) {
    throw new Error("No exercises match your profile and restrictions.");
  }

  const muscleGroupsSplit = splits[workoutSplit.toLowerCase()] || splits["full body"];

  const days = [];

  for (let dayIndex = 0; dayIndex < trainingDaysPerWeek; dayIndex++) {
    // Decide if this is a rest day (e.g., for 5 training days, add rest day on 6th)
    if (trainingDaysPerWeek < 7 && dayIndex === trainingDaysPerWeek) {
      days.push({
        day: `Day ${dayIndex + 1}`,
        split: workoutSplit,
        focus: "Rest / Recovery",
        exercises: [],
        restDay: true,
      });
      continue;
    }

    const targetGroups =
      muscleGroupsSplit[dayIndex % muscleGroupsSplit.length] || muscleGroupsSplit[0];

    const exercisesForDay = filteredExercises.filter((ex) =>
      targetGroups === "full body"
        ? true
        : targetsMuscleGroup(ex, targetGroups)
    );

    // Shuffle exercises
    const shuffled = exercisesForDay.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(6, shuffled.length));

    // Add sets/reps/rest details
    const sets = getSets(experienceLevel);
    const reps = getRepsRange(fitnessGoals);
    const rest = getRestSeconds(fitnessGoals);

    days.push({
      day: `Day ${dayIndex + 1}`,
      split: workoutSplit,
      focus: fitnessGoals.join(", "),
      exercises: selected.map((ex) => ({
        ...ex,
        sets,
        reps,
        rest,
      })),
      restDay: false,
    });
  }

  return days;
}
