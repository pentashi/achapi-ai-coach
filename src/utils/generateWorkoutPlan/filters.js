import { exerciseLibrary } from './exerciseLibrary';

const levelHierarchy = {
  beginner: ["beginner", "all"],
  intermediate: ["beginner", "intermediate", "all"],
  advanced: ["beginner", "intermediate", "advanced", "all"],
  elite: ["beginner", "intermediate", "advanced", "elite", "all"],
};

const goalMapping = {
  bulk: "muscleGain",
  cut: "fatLoss",
  recomp: ["muscleGain", "fatLoss"],
  maintain: "endurance", // or both strength and cardio
};

const normalizeEnvironment = (env) => {
  if (!env) return "home";
  if (env.includes("gym")) return "gym";
  if (env.includes("home")) return "home";
  return "home";
};

export const filterExercises = ({
  goals,
  experienceLevel,
  equipment,
  environment,
  injuryHistory,
  mobilityRestrictions,
  exerciseRestrictions,
}) => {
  const userLevels = levelHierarchy[experienceLevel] || levelHierarchy.beginner;
  const userEquipment = equipment?.map(e => e.toLowerCase()) || [];
  const userEnvironment = normalizeEnvironment(environment?.toLowerCase());

  const restrictions = [
    ...(injuryHistory ? injuryHistory.toLowerCase().split(",") : []),
    ...(mobilityRestrictions ? mobilityRestrictions.toLowerCase().split(",") : []),
    ...(exerciseRestrictions ? exerciseRestrictions.toLowerCase().split(",") : []),
  ].map(s => s.trim());

  const mappedGoals = (goals || []).flatMap(goal => goalMapping[goal] || []);

  return exerciseLibrary.filter(ex => {
    // Match goals
    const goalMatch = mappedGoals.some(goal => ex.goals.includes(goal));
    if (!goalMatch) return false;

    // Match level
    if (!userLevels.includes(ex.level) && ex.level !== "all") return false;

    // Match equipment
    if (ex.equipment !== "none" && !userEquipment.includes(ex.equipment.toLowerCase())) return false;

    // Match environment
    if (!ex.environment.includes(userEnvironment)) return false;

    // Check restrictions
    for (const restr of restrictions) {
      if (ex.name.toLowerCase().includes(restr)) return false;
      if (ex.muscleGroups.some(mg => mg.toLowerCase().includes(restr))) return false;
    }

    return true;
  });
};
