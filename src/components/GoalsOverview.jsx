import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const allGoals = [
  'Strength & Power',
  'Strength + Aesthetic Hybrid',
  'Endurance & Conditioning',
  'Fat Loss',
  'Muscle Gain',
];

export default function GoalsOverview({ initialGoals = [], profile, onUpdate }) {
  const [goals, setGoals] = useState(initialGoals);
  const [goalWeight, setGoalWeight] = useState(profile.goalWeight || '');

  useEffect(() => {
    const storedData = localStorage.getItem('achapiUser');
    if (storedData) {
      const parsed = JSON.parse(storedData);
      if (parsed.profile?.goals) setGoals(parsed.profile.goals);
      if (parsed.profile?.goalWeight) setGoalWeight(parsed.profile.goalWeight);
    }
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem('achapiUser');
    const parsed = storedData ? JSON.parse(storedData) : {};
    const updated = {
      ...parsed,
      profile: {
        ...parsed.profile,
        goalWeight,
        goals,
      },
    };
    localStorage.setItem('achapiUser', JSON.stringify(updated));
    if (typeof onUpdate === 'function') onUpdate(updated.profile);
  }, [goals, goalWeight]);

  const currentWeight = Number(profile.weight);
  const targetWeight = Number(goalWeight);
  const progressPercent =
    currentWeight && targetWeight
      ? Math.min(100, Math.max(0, (currentWeight / targetWeight) * 100))
      : 0;

  const toggleGoal = (goal) => {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  return (
    <section className="container my-4 px-4 py-3 bg-dark text-light rounded shadow">
      <h2 className="text-info mb-4">🎯 Goals Overview</h2>

      <div className="mb-3">
        <h5>Current Goals</h5>
        {goals.length ? (
          <ul className="list-unstyled">
            {goals.map((goal) => (
              <li key={goal} className="ms-3">✅ {goal}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No goals selected.</p>
        )}
      </div>

      <div className="mb-4">
        <h6>Update Goals</h6>
        {allGoals.map((goal) => (
          <div className="form-check" key={goal}>
            <input
              type="checkbox"
              className="form-check-input"
              id={goal}
              checked={goals.includes(goal)}
              onChange={() => toggleGoal(goal)}
            />
            <label className="form-check-label" htmlFor={goal}>
              {goal}
            </label>
          </div>
        ))}
      </div>

      <div className="mb-3">
        <label htmlFor="goalWeightInput" className="form-label">
          Goal Weight (kg)
        </label>
        <input
          type="number"
          id="goalWeightInput"
          className="form-control bg-secondary text-white border-0"
          min="20"
          max="500"
          value={goalWeight}
          onChange={(e) => setGoalWeight(e.target.value)}
          placeholder="Your target weight"
        />
      </div>

      {targetWeight && currentWeight ? (
        <div className="mb-3">
          <div className="progress" role="progressbar" aria-valuenow={progressPercent.toFixed(0)} aria-valuemin="0" aria-valuemax="100">
            <div
              className="progress-bar bg-info"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <small className="text-muted d-block mt-2">
            {progressPercent.toFixed(0)}% toward your goal weight ({targetWeight}kg)
          </small>
        </div>
      ) : null}
    </section>
  );
}
