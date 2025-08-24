import React from "react";
import { genders } from "../../utils/constants";

export default function Step1_BasicInfo({ profile, updateField }) {
  return (
    <>
      <div className="mb-3">
        <label className="form-label">Full Name *</label>
        <input
          type="text"
          className="form-control"
          value={profile.name}
          onChange={(e) => updateField("name", e.target.value)}
          placeholder="Your full name"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Age *</label>
        <input
          type="number"
          className="form-control"
          min={10}
          max={120}
          value={profile.age}
          onChange={(e) => updateField("age", e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Gender *</label>
        <select
          className="form-select"
          value={profile.gender}
          onChange={(e) => updateField("gender", e.target.value)}
          required
        >
          <option value="">Choose...</option>
          {genders.map((g) => (
            <option key={g} value={g}>
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="row">
        <div className="col-6 mb-3">
          <label className="form-label">Height (cm) *</label>
          <input
            type="number"
            className="form-control"
            min={50}
            max={300}
            value={profile.height}
            onChange={(e) => updateField("height", e.target.value)}
            required
          />
        </div>

        <div className="col-6 mb-3">
          <label className="form-label">Weight (kg) *</label>
          <input
            type="number"
            className="form-control"
            min={20}
            max={500}
            value={profile.weight}
            onChange={(e) => updateField("weight", e.target.value)}
            required
          />
        </div>
      </div>
    </>
  );
}
