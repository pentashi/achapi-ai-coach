import React from "react";
import {
  fitnessGoals,
  experienceLevels,
  workoutSplits,
  trainingTimes,
  trainingEnvironments,
} from "../../utils/constants";

export default function Step2_GoalsExperience({ profile, updateField, toggleGoal }) {
  return (
    <>
      <label className="form-label mb-2">Fitness Goals *</label>
      <div className="mb-3">
        {fitnessGoals.map(({ id, label }) => (
          <div className="form-check" key={id}>
            <input
              className="form-check-input"
              type="checkbox"
              id={`goal-${id}`}
              checked={profile.fitnessGoals.includes(id)}
              onChange={() => toggleGoal(id)}
            />
            <label className="form-check-label" htmlFor={`goal-${id}`}>
              {label}
            </label>
          </div>
        ))}
      </div>

      <div className="mb-3">
        <label className="form-label">Training Experience *</label>
        <select
          className="form-select"
          value={profile.experienceLevel}
          onChange={(e) => updateField("experienceLevel", e.target.value)}
          required
        >
          <option value="">Choose...</option>
          {experienceLevels.map((exp) => (
            <option key={exp} value={exp}>
              {exp.charAt(0).toUpperCase() + exp.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Preferred Workout Split *</label>
        <select
          className="form-select"
          value={profile.workoutSplit}
          onChange={(e) => updateField("workoutSplit", e.target.value)}
          required
        >
          <option value="">Choose...</option>
          {workoutSplits.map((ws) => (
            <option key={ws} value={ws}>
              {ws.charAt(0).toUpperCase() + ws.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="row">
        <div className="col-6 mb-3">
          <label className="form-label">Training Days per Week *</label>
          <input
            type="number"
            className="form-control"
            min={1}
            max={7}
            value={profile.trainingDaysPerWeek}
            onChange={(e) => updateField("trainingDaysPerWeek", e.target.value)}
            required
          />
        </div>
        <div className="col-6 mb-3">
          <label className="form-label">Workout Duration (minutes) *</label>
          <input
            type="number"
            className="form-control"
            min={10}
            max={240}
            value={profile.workoutDurationMinutes}
            onChange={(e) => updateField("workoutDurationMinutes", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Preferred Training Time *</label>
        <select
          className="form-select"
          value={profile.preferredTrainingTime}
          onChange={(e) => updateField("preferredTrainingTime", e.target.value)}
          required
        >
          <option value="">Choose...</option>
          {trainingTimes.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Training Environment *</label>
        <select
          className="form-select"
          value={profile.trainingEnvironment}
          onChange={(e) => updateField("trainingEnvironment", e.target.value)}
          required
        >
          <option value="">Choose...</option>
          {trainingEnvironments.map((env) => (
            <option key={env} value={env}>
              {env.charAt(0).toUpperCase() + env.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
