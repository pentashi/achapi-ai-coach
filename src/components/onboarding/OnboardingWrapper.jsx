import React, { useState } from "react";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { app, db } from "../../firebase";

import { steps } from "../../utils/constants";

import StepRenderer from "./StepRenderer";
import StepNavigator from "./StepNavigator";
import { useNavigate } from "react-router-dom";

const storage = getStorage(app);

export default function OnboardingWrapper({ onComplete }) {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

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
    progressPhotoFront: null,
    progressPhotoSide: null,
    progressPhotoBack: null,
  });

  const updateField = (field, value) =>
    setProfile((prev) => ({ ...prev, [field]: value }));

  const toggleGoal = (goalId) => {
    setProfile((prev) => {
      const goals = prev.fitnessGoals.includes(goalId)
        ? prev.fitnessGoals.filter((g) => g !== goalId)
        : [...prev.fitnessGoals, goalId];
      return { ...prev, fitnessGoals: goals };
    });
  };

  const validateStep = () => {
    switch (step) {
      case 0:
        return (
          profile.name.trim() &&
          Number(profile.age) >= 10 &&
          ["male", "female", "other"].includes(profile.gender) &&
          Number(profile.height) > 50 &&
          Number(profile.weight) > 20
        );
      case 1:
        return (
          profile.fitnessGoals.length > 0 &&
          ["beginner", "intermediate", "advanced", "elite"].includes(profile.experienceLevel) &&
          ["full body", "push/pull/legs", "upper/lower body", "custom"].includes(profile.workoutSplit) &&
          Number(profile.trainingDaysPerWeek) >= 1 &&
          Number(profile.trainingDaysPerWeek) <= 7 &&
          Number(profile.workoutDurationMinutes) >= 10 &&
          ["morning", "afternoon", "evening"].includes(profile.preferredTrainingTime) &&
          [
            "gym with full equipment",
            "home with limited equipment",
            "no equipment (bodyweight only)",
          ].includes(profile.trainingEnvironment)
        );
      case 2:
        return true; // optional
      case 3:
        return (
          ["low", "medium", "high"].includes(profile.motivationLevel) &&
          ["3 months", "6 months", "1 year", "more than 1 year"].includes(profile.goalTimeline)
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

  const uploadPhoto = async (file, userId, label) => {
    if (!file) return null;
    const fileRef = ref(storage, `users/${userId}/progressPhotos/${label}_${Date.now()}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

const handleSubmit = async () => {
  setError(null);
  setSubmitting(true);

  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.error("No user signed in!");
    setError("You must be signed in to submit your profile.");
    setSubmitting(false);
    return;
  }

  // Clean helper same as before
  const cleanData = (data) => {
    const cleaned = {};
    for (const key in data) {
      const value = data[key];
      if (
        value !== null &&
        value !== undefined &&
        value !== "" &&
        value !== "N/A" &&
        value !== "None"
      ) {
        cleaned[key] = value;
      }
    }
    return cleaned;
  };

  try {
    const [frontUrl, sideUrl, backUrl] = await Promise.all([
      uploadPhoto(profile.progressPhotoFront, user.uid, "front"),
      uploadPhoto(profile.progressPhotoSide, user.uid, "side"),
      uploadPhoto(profile.progressPhotoBack, user.uid, "back"),
    ]);

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
      progressPhotos: {
        ...(frontUrl && { front: frontUrl }),
        ...(sideUrl && { side: sideUrl }),
        ...(backUrl && { back: backUrl }),
      },
      createdAt: Timestamp.now(),
    };

    const cleanedDataToSave = cleanData(dataToSave);

    await setDoc(doc(db, "users", user.uid), cleanedDataToSave);

    setSubmitting(false);

    // NO navigate here! Instead, notify parent to handle completion
    onComplete(cleanedDataToSave);
    navigate("/generate-workout", { state: { profile: cleanedDataToSave } });

  } catch (err) {
    console.error(err);
    setError("Failed to save profile, please try again.");
    setSubmitting(false);
  }
};

  const handleFileChange = (field) => (e) => {
    const file = e.target.files[0];
    if (file) {
      updateField(field, file);
    }
  };

  // --- Styles ---

  const containerStyle = {
    maxWidth: "80vw",
    maxHeight: "90vh",
    margin: "2rem auto",
    padding: "0",
    background: "rgba(5, 20, 35, 0.9)",
    borderRadius: 20,
    boxShadow: "0 0 15px 2px rgba(0, 180, 220, 0.6)",
    backdropFilter: "blur(8px)",
    color: "#a0e9ff",
    display: "flex",
    flexDirection: "column",
  };

  const headerStyle = {
    background: "linear-gradient(90deg, #00d8ff, #0077aa)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: "1.2rem 1.5rem",
    textAlign: "center",
    fontWeight: "700",
    fontSize: "1.6rem",
    color: "#e0f7ff",
  };

  const smallTextStyle = {
    opacity: 0.75,
    fontSize: "0.9rem",
    marginTop: 4,
    fontWeight: "500",
  };

  const bodyStyle = {
    flexGrow: 1,
    padding: "1.5rem 2rem",
    overflowY: "auto",
  };

  const footerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    background: "rgba(0, 60, 90, 0.35)",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  };

  const errorStyle = {
    marginTop: "1rem",
    padding: "0.75rem 1rem",
    backgroundColor: "rgba(255, 80, 80, 0.25)",
    borderRadius: 10,
    color: "#ffb3b3",
    fontWeight: "600",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        {steps[step]}
        <div style={smallTextStyle}>
          Step {step + 1} of {steps.length}
        </div>
      </div>

      <div style={bodyStyle}>
        <StepRenderer
          step={step}
          profile={profile}
          updateField={updateField}
          toggleGoal={toggleGoal}
          handleFileChange={handleFileChange}
        />
      </div>

      <div style={footerStyle}>
        <StepNavigator
          step={step}
          stepsLength={steps.length}
          onNext={nextStep}
          onBack={prevStep}
          onSubmit={handleSubmit}
          isNextDisabled={!validateStep()}
          isSubmitting={submitting}
        />
      </div>

      {error && <div style={errorStyle}>{error}</div>}
    </div>
  );
}
