import React from "react";

export default function Step5_SummarySubmit({ profile }) {
  // Helper to render values cleanly
  const renderValue = (value) => {
    if (Array.isArray(value)) {
      return value.length ? value.join(", ") : null;
    }
    if (typeof value === "string" && !value.trim()) {
      return null;
    }
    return value;
  };

  // Define the fields you want to show with labels
  const fields = [
    { key: "name", label: "Name" },
    { key: "age", label: "Age" },
    { key: "gender", label: "Gender" },
    { key: "height", label: "Height", suffix: "cm" },
    { key: "weight", label: "Weight", suffix: "kg" },
    { key: "fitnessGoals", label: "Fitness Goals" },
    { key: "experienceLevel", label: "Experience Level" },
    { key: "workoutSplit", label: "Workout Split" },
    { key: "trainingDaysPerWeek", label: "Training Days per Week" },
    { key: "workoutDurationMinutes", label: "Workout Duration", suffix: "min" },
    { key: "preferredTrainingTime", label: "Preferred Training Time" },
    { key: "trainingEnvironment", label: "Training Environment" },
    { key: "injuryHistory", label: "Injury History" },
    { key: "mobilityRestrictions", label: "Mobility Restrictions" },
    { key: "exerciseRestrictions", label: "Exercise Restrictions" },
    { key: "activityLevel", label: "Physical Activity Level" },
    { key: "bodyFatPercentage", label: "Body Fat %" },
    { key: "muscleMass", label: "Muscle Mass" },
    { key: "waistCircumference", label: "Waist Circumference" },
    { key: "dietaryPreference", label: "Dietary Preference" },
    { key: "sleepQuality", label: "Sleep Quality" },
    { key: "stressLevel", label: "Stress Level" },
    { key: "motivationLevel", label: "Motivation Level" },
    { key: "goalTimeline", label: "Goal Timeline" },
    { key: "motivation", label: "Motivation" },
    { key: "additionalNotes", label: "Additional Notes" },
    { key: "accountabilityPreferences", label: "Accountability Preferences" },
  ];

  return (
    <>
      <h5>Review Your Information</h5>
      <ul className="list-group">
        {fields.map(({ key, label, suffix }) => {
          const value = renderValue(profile[key]);
          if (value === null || value === undefined) return null;
          return (
            <li className="list-group-item" key={key}>
              <strong>{label}:</strong> {value} {suffix || ""}
            </li>
          );
        })}
        {profile.photoUrl && (
          <li className="list-group-item">
            <strong>Uploaded Photo:</strong>
            <div className="mt-2">
              <img
                src={profile.photoUrl}
                alt="Uploaded progress"
                style={{ maxWidth: "100%", borderRadius: "1rem" }}
              />
            </div>
          </li>
        )}
      </ul>
    </>
  );
}
