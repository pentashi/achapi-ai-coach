import React, { useState } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp,
  setDoc,
  doc
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { app } from "../firebase"; // your initialized Firebase app

import "bootstrap/dist/css/bootstrap.min.css";

const db = getFirestore(app);
const storage = getStorage(app);

const steps = [
  "Basic Info",
  "Goals & Experience",
  "Health & Lifestyle",
  "Motivation & Uploads",
  "Summary & Submit",
];

const genders = ["male", "female", "other"];
const experienceLevels = [
  "beginner",
  "intermediate",
  "advanced",
  "elite",
];
const fitnessGoals = [
  { id: "bulk", label: "Bulk (Muscle Gain)" },
  { id: "cut", label: "Cut (Fat Loss)" },
  { id: "recomp", label: "Recomp (Build & Cut)" },
  { id: "maintain", label: "Maintain" },
];
const workoutSplits = [
  "full body",
  "push/pull/legs",
  "upper/lower body",
  "custom",
];
const trainingTimes = ["morning", "afternoon", "evening"];
const trainingEnvironments = [
  "gym with full equipment",
  "home with limited equipment",
  "no equipment (bodyweight only)",
];
const physicalActivityLevels = ["sedentary", "lightly active", "active"];
const dietaryPreferences = [
  "balanced",
  "keto",
  "vegan",
  "vegetarian",
  "paleo",
  "other",
];
const sleepQualities = ["good", "fair", "poor"];
const stressLevels = ["low", "medium", "high"];
const motivationLevels = ["low", "medium", "high"];
const goalTimelines = [
  "3 months",
  "6 months",
  "1 year",
  "more than 1 year",
];

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Full user profile state
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    fitnessGoals: [],
    experienceLevel: "",
    workoutSplit: "",
    trainingDaysPerWeek: "",
    workoutDurationMinutes: "",
    preferredTrainingTime: "",
    trainingEnvironment: "",
    injuryHistory: "",
    mobilityRestrictions: "",
    exerciseRestrictions: "",
    physicalActivityLevel: "",
    bodyFatPercentage: "",
    muscleMass: "",
    waistCircumference: "",
    dietaryPreference: "",
    sleepQuality: "",
    stressLevel: "",
    motivationLevel: "",
    accountabilityPreferences: "",
    goalTimeline: "",
    additionalNotes: "",
    // photos as File objects
    progressPhotoFront: null,
    progressPhotoSide: null,
    progressPhotoBack: null,
  });

  // Handlers
  const updateField = (field, value) =>
    setProfile((p) => ({ ...p, [field]: value }));

  const toggleGoal = (goalId) => {
    setProfile((p) => {
      const goals = p.fitnessGoals.includes(goalId)
        ? p.fitnessGoals.filter((g) => g !== goalId)
        : [...p.fitnessGoals, goalId];
      return { ...p, fitnessGoals: goals };
    });
  };

  // Validation per step
  const validateStep = () => {
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
        return true; // optional fields can be empty
      case 3:
        return (
          motivationLevels.includes(profile.motivationLevel) &&
          goalTimelines.includes(profile.goalTimeline)
        );
      case 4:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (!validateStep()) return;
    if (step < steps.length - 1) setStep(step + 1);
  };
  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  // Upload photos and get URLs
  async function uploadPhoto(file, userId, label) {
    if (!file) return null;
    const fileRef = ref(storage, `users/${userId}/progressPhotos/${label}_${Date.now()}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  }

  // On submit: upload photos if any, then store data in Firestore
  const handleSubmit = async () => {
  setError(null);
  setSubmitting(true);

  try {
const user = auth.currentUser;
    if (!user) throw new Error("No logged-in user");

    const userId = user.uid;

    // Upload photos if exist
    const frontUrl = await uploadPhoto(profile.progressPhotoFront, userId, "front");
    const sideUrl = await uploadPhoto(profile.progressPhotoSide, userId, "side");
    const backUrl = await uploadPhoto(profile.progressPhotoBack, userId, "back");

    const dataToSave = {
      ...profile,
      age: Number(profile.age),
      height: Number(profile.height),
      weight: Number(profile.weight),
      trainingDaysPerWeek: Number(profile.trainingDaysPerWeek),
      workoutDurationMinutes: Number(profile.workoutDurationMinutes),
      bodyFatPercentage: profile.bodyFatPercentage ? Number(profile.bodyFatPercentage) : null,
      muscleMass: profile.muscleMass ? Number(profile.muscleMass) : null,
      waistCircumference: profile.waistCircumference ? Number(profile.waistCircumference) : null,
      progressPhotos: { front: frontUrl, side: sideUrl, back: backUrl },
      onboardingComplete: true,
      createdAt: Timestamp.now(),
    };

    // Save into Firestore under the user’s UID
    await setDoc(doc(db, "users", userId), dataToSave, { merge: true });

    setSubmitting(false);
    if (onComplete) onComplete(dataToSave);
    else alert("Profile saved successfully!");
  } catch (err) {
    console.error(err);
    setError("Failed to save profile, please try again.");
    setSubmitting(false);
  }
};

  // Render inputs per step

  const renderStepContent = () => {
    switch (step) {
      case 0:
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
      case 1:
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
      case 2:
        return (
          <>
            <div className="mb-3">
              <label className="form-label">Injury History / Medical Conditions</label>
              <textarea
                className="form-control"
                rows={3}
                value={profile.injuryHistory}
                onChange={(e) => updateField("injuryHistory", e.target.value)}
                placeholder="Describe any injuries or medical conditions"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Mobility / Flexibility Restrictions</label>
              <textarea
                className="form-control"
                rows={2}
                value={profile.mobilityRestrictions}
                onChange={(e) => updateField("mobilityRestrictions", e.target.value)}
                placeholder="E.g. knee, shoulder issues"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Exercise Restrictions</label>
              <textarea
                className="form-control"
                rows={2}
                value={profile.exerciseRestrictions}
                onChange={(e) => updateField("exerciseRestrictions", e.target.value)}
                placeholder="E.g. avoid squats or heavy lifting"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Physical Activity Level</label>
              <select
                className="form-select"
                value={profile.physicalActivityLevel}
                onChange={(e) => updateField("physicalActivityLevel", e.target.value)}
              >
                <option value="">Choose...</option>
                {physicalActivityLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="row">
              <div className="col-4 mb-3">
                <label className="form-label">Body Fat Percentage (%)</label>
                <input
                  type="number"
                  className="form-control"
                  min={0}
                  max={70}
                  value={profile.bodyFatPercentage}
                  onChange={(e) => updateField("bodyFatPercentage", e.target.value)}
                  placeholder="Optional"
                />
              </div>
              <div className="col-4 mb-3">
                <label className="form-label">Muscle Mass (kg)</label>
                <input
                  type="number"
                  className="form-control"
                  min={0}
                  value={profile.muscleMass}
                  onChange={(e) => updateField("muscleMass", e.target.value)}
                  placeholder="Optional"
                />
              </div>
              <div className="col-4 mb-3">
                <label className="form-label">Waist Circumference (cm)</label>
                <input
                  type="number"
                  className="form-control"
                  min={0}
                  value={profile.waistCircumference}
                  onChange={(e) => updateField("waistCircumference", e.target.value)}
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Dietary Preference</label>
              <select
                className="form-select"
                value={profile.dietaryPreference}
                onChange={(e) => updateField("dietaryPreference", e.target.value)}
              >
                <option value="">Choose...</option>
                {dietaryPreferences.map((dp) => (
                  <option key={dp} value={dp}>
                    {dp.charAt(0).toUpperCase() + dp.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="row">
              <div className="col-6 mb-3">
                <label className="form-label">Sleep Quality</label>
                <select
                  className="form-select"
                  value={profile.sleepQuality}
                  onChange={(e) => updateField("sleepQuality", e.target.value)}
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
                <label className="form-label">Stress Level</label>
                <select
                  className="form-select"
                  value={profile.stressLevel}
                  onChange={(e) => updateField("stressLevel", e.target.value)}
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
          </>
        );
      case 3:
        return (
          <>
            <div className="mb-3">
              <label className="form-label">Motivation Level *</label>
              <select
                className="form-select"
                value={profile.motivationLevel}
                onChange={(e) => updateField("motivationLevel", e.target.value)}
                required
              >
                <option value="">Choose...</option>
                {motivationLevels.map((m) => (
                  <option key={m} value={m}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Accountability Preferences</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="E.g. coach check-ins, reminders"
                value={profile.accountabilityPreferences}
                onChange={(e) => updateField("accountabilityPreferences", e.target.value)}
              />
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
                {goalTimelines.map((gt) => (
                  <option key={gt} value={gt}>
                    {gt}
                  </option>
                ))}
              </select>
            </div>

            <hr />
            <p className="fw-bold">Optional: Upload Progress Photos (Day 1)</p>
            <div className="mb-3">
              <label className="form-label">Front View</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(e) => updateField("progressPhotoFront", e.target.files[0])}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Side View</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(e) => updateField("progressPhotoSide", e.target.files[0])}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Back View</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(e) => updateField("progressPhotoBack", e.target.files[0])}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Additional Notes</label>
              <textarea
                className="form-control"
                rows={3}
                value={profile.additionalNotes}
                onChange={(e) => updateField("additionalNotes", e.target.value)}
                placeholder="Anything else you want to share"
              />
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h5>Review your information:</h5>
            <ul className="list-group">
              <li className="list-group-item">
                <strong>Name:</strong> {profile.name}
              </li>
              <li className="list-group-item">
                <strong>Age:</strong> {profile.age}
              </li>
              <li className="list-group-item">
                <strong>Gender:</strong> {profile.gender}
              </li>
              <li className="list-group-item">
                <strong>Height:</strong> {profile.height} cm
              </li>
              <li className="list-group-item">
                <strong>Weight:</strong> {profile.weight} kg
              </li>
              <li className="list-group-item">
                <strong>Fitness Goals:</strong> {profile.fitnessGoals.join(", ")}
              </li>
              <li className="list-group-item">
                <strong>Experience Level:</strong> {profile.experienceLevel}
              </li>
              <li className="list-group-item">
                <strong>Workout Split:</strong> {profile.workoutSplit}
              </li>
              <li className="list-group-item">
                <strong>Training Days/Week:</strong> {profile.trainingDaysPerWeek}
              </li>
              <li className="list-group-item">
                <strong>Workout Duration (min):</strong> {profile.workoutDurationMinutes}
              </li>
              <li className="list-group-item">
                <strong>Preferred Training Time:</strong> {profile.preferredTrainingTime}
              </li>
              <li className="list-group-item">
                <strong>Training Environment:</strong> {profile.trainingEnvironment}
              </li>
              <li className="list-group-item">
                <strong>Motivation Level:</strong> {profile.motivationLevel}
              </li>
              <li className="list-group-item">
                <strong>Goal Timeline:</strong> {profile.goalTimeline}
              </li>
              <li className="list-group-item">
                <strong>Accountability:</strong>{" "}
                {profile.accountabilityPreferences || "None"}
              </li>
              <li className="list-group-item">
                <strong>Injury History:</strong> {profile.injuryHistory || "None"}
              </li>
              <li className="list-group-item">
                <strong>Mobility Restrictions:</strong> {profile.mobilityRestrictions || "None"}
              </li>
              <li className="list-group-item">
                <strong>Exercise Restrictions:</strong> {profile.exerciseRestrictions || "None"}
              </li>
              <li className="list-group-item">
                <strong>Physical Activity Level:</strong> {profile.physicalActivityLevel || "None"}
              </li>
              <li className="list-group-item">
                <strong>Body Fat %:</strong> {profile.bodyFatPercentage || "N/A"}
              </li>
              <li className="list-group-item">
                <strong>Muscle Mass:</strong> {profile.muscleMass || "N/A"}
              </li>
              <li className="list-group-item">
                <strong>Waist Circumference:</strong> {profile.waistCircumference || "N/A"}
              </li>
              <li className="list-group-item">
                <strong>Dietary Preference:</strong> {profile.dietaryPreference || "None"}
              </li>
              <li className="list-group-item">
                <strong>Sleep Quality:</strong> {profile.sleepQuality || "None"}
              </li>
              <li className="list-group-item">
                <strong>Stress Level:</strong> {profile.stressLevel || "None"}
              </li>
              <li className="list-group-item">
                <strong>Additional Notes:</strong> {profile.additionalNotes || "None"}
              </li>
            </ul>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container my-4" style={{ maxWidth: 600 }}>
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0 text-center">{steps[step]}</h4>
          <small className="d-block text-center opacity-75">
            Step {step + 1} of {steps.length}
          </small>
        </div>
        <div className="card-body">{renderStepContent()}</div>
        <div className="card-footer d-flex justify-content-between align-items-center">
          <button
            className="btn btn-outline-secondary"
            onClick={prevStep}
            disabled={step === 0 || submitting}
          >
            ← Back
          </button>
          {step < steps.length - 1 && (
            <button
              className="btn btn-primary"
              onClick={nextStep}
              disabled={!validateStep() || submitting}
            >
              Next →
            </button>
          )}
          {step === steps.length - 1 && (
            <button
              className="btn btn-success"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Submit"}
            </button>
          )}
        </div>
        {error && (
          <div className="alert alert-danger m-3" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
