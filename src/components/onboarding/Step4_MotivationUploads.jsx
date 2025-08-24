import React from "react";
import { motivationLevels, goalTimelines } from "../../utils/constants";

export default function Step4_MotivationUploads({
  profile,
  updateField,
  handleFileChange,
}) {
  return (
    <>
      <div className="mb-3">
        <label className="form-label">Why do you want to achieve your goal? *</label>
        <textarea
          className="form-control"
          rows={3}
          value={profile.motivation}
          onChange={(e) => updateField("motivation", e.target.value)}
          placeholder="e.g., confidence, health, performance, etc."
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Motivation Level *</label>
        <select
          className="form-select"
          value={profile.motivationLevel}
          onChange={(e) => updateField("motivationLevel", e.target.value)}
          required
        >
          <option value="">Choose...</option>
          {motivationLevels.map((level) => (
            <option key={level} value={level}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Goal Timeline *</label>
        <select
          className="form-select"
          value={profile.goalTimeline}
          onChange={(e) => updateField("goalTimeline", e.target.value)}
          required
        >
          <option value="">Choose...</option>
          {goalTimelines.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Upload Progress/Body Photo *</label>
        <input
          type="file"
          accept="image/*"
          className="form-control"
          onChange={handleFileChange}
          required={!profile.photoUrl}
        />
        {profile.photoUrl && (
          <div className="mt-2">
            <img
              src={profile.photoUrl}
              alt="Preview"
              style={{
                width: "100%",
                maxWidth: "300px",
                borderRadius: "1rem",
                boxShadow: "0 0 10px rgba(0,0,0,0.3)",
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}
