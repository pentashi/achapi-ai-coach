import React from "react";
import {
  physicalActivityLevels,
  dietaryPreferences,
  sleepQualities,
  stressLevels,
} from "../../utils/constants";

export default function Step3_HealthLifestyle({ profile, updateField }) {
  return (
    <>
      <div className="mb-3">
        <label className="form-label">Activity Level *</label>
        <select
          className="form-select"
          value={profile.activityLevel}
          onChange={(e) => updateField("activityLevel", e.target.value)}
          required
        >
          <option value="">Choose...</option>
          {physicalActivityLevels.map((level) => (
            <option key={level} value={level}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Dietary Preference *</label>
        <select
          className="form-select"
          value={profile.dietaryPreference}
          onChange={(e) => updateField("dietaryPreference", e.target.value)}
          required
        >
          <option value="">Choose...</option>
          {dietaryPreferences.map((diet) => (
            <option key={diet} value={diet}>
              {diet.charAt(0).toUpperCase() + diet.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="row">
        <div className="col-6 mb-3">
          <label className="form-label">Sleep Quality *</label>
          <select
            className="form-select"
            value={profile.sleepQuality}
            onChange={(e) => updateField("sleepQuality", e.target.value)}
            required
          >
            <option value="">Choose...</option>
            {sleepQualities.map((sq) => (
              <option key={sq} value={sq}>
                {sq.charAt(0).toUpperCase() + sq.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="col-6 mb-3">
          <label className="form-label">Stress Level *</label>
          <select
            className="form-select"
            value={profile.stressLevel}
            onChange={(e) => updateField("stressLevel", e.target.value)}
            required
          >
            <option value="">Choose...</option>
            {stressLevels.map((sl) => (
              <option key={sl} value={sl}>
                {sl.charAt(0).toUpperCase() + sl.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Medical Considerations / Notes</label>
        <textarea
          className="form-control"
          rows={3}
          value={profile.medicalNotes}
          onChange={(e) => updateField("medicalNotes", e.target.value)}
          placeholder="e.g., injuries, allergies, medications, etc."
        />
      </div>
    </>
  );
}
