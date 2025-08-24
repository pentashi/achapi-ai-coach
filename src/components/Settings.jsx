import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function Settings({ profile, onSave }) {
  const [form, setForm] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    injuryHistory: '',
  });

  // Sync form state with incoming profile data
  useEffect(() => {
    if (profile && Object.keys(profile).length > 0) {
      setForm({
        name: profile.name || '',
        age: profile.age || '',
        gender: profile.gender || '',
        height: profile.height || '',
        weight: profile.weight || '',
        injuryHistory: profile.injuryHistory || '',
      });
    }
  }, [profile]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(form);
    } catch {
      toast.error('❌ Failed to save settings.');
    }
  };

  return (
    <div className="container mt-5 mb-5 p-4 rounded shadow bg-dark text-light" style={{ maxWidth: 600 }}>
      <h2 className="mb-4 text-info fw-bold">⚙️ User Settings</h2>
      <form onSubmit={handleSubmit}>
        {/* fields here */}
        {/* Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input
            type="text"
            id="name"
            className="form-control"
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
        </div>
        {/* Age */}
        <div className="mb-3">
          <label htmlFor="age" className="form-label">Age</label>
          <input
            type="number"
            id="age"
            className="form-control"
            placeholder="Your age"
            value={form.age}
            min="10"
            max="100"
            onChange={(e) => handleChange('age', e.target.value)}
            required
          />
        </div>
        {/* Gender */}
        <div className="mb-3">
          <label htmlFor="gender" className="form-label">Gender</label>
          <select
            id="gender"
            className="form-select"
            value={form.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
            required
          >
            <option value="" disabled>Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        {/* Height */}
        <div className="mb-3">
          <label htmlFor="height" className="form-label">Height (cm)</label>
          <input
            type="number"
            id="height"
            className="form-control"
            placeholder="Your height in centimeters"
            value={form.height}
            min="50"
            max="300"
            onChange={(e) => handleChange('height', e.target.value)}
            required
          />
        </div>
        {/* Weight */}
        <div className="mb-3">
          <label htmlFor="weight" className="form-label">Weight (kg)</label>
          <input
            type="number"
            id="weight"
            className="form-control"
            placeholder="Your weight in kilograms"
            value={form.weight}
            min="20"
            max="500"
            onChange={(e) => handleChange('weight', e.target.value)}
            required
          />
        </div>
        {/* Injury History */}
        <div className="mb-4">
          <label htmlFor="injuryHistory" className="form-label">Injury / Medical History</label>
          <textarea
            id="injuryHistory"
            className="form-control"
            placeholder="Describe any injuries or medical conditions"
            value={form.injuryHistory}
            rows="4"
            onChange={(e) => handleChange('injuryHistory', e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-info fw-bold w-100 py-2">
          Save Settings
        </button>
      </form>
    </div>
  );
}
