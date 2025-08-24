import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { generateWorkoutPlan } from "../utils/generateWorkoutPlan/generateWorkoutPlan";
import Spinner from "../components/spinner";
import { saveWorkoutPlanToFirestore } from "../saveworkoutplan";
import { auth } from "../firebase";
import {
  FaDumbbell, FaHeartbeat, FaUtensils, FaNotesMedical, FaCheckCircle,
  FaRunning, FaBed, FaLeaf, FaInfoCircle, FaFireAlt
} from "react-icons/fa";

export default function GenerateWorkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [planArray, setPlanArray] = useState(null);

  const profile = location.state?.profile;

  useEffect(() => {
    if (!profile) {
      navigate("/", { replace: true });
      return;
    }

    const createPlan = async () => {
      try {
        const generatedResponse = await generateWorkoutPlan(profile);
        const workoutPlanData = generatedResponse.workoutPlan;
        if (!workoutPlanData) throw new Error("Invalid workout plan data");

        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error("User not logged in");

        await saveWorkoutPlanToFirestore(userId, workoutPlanData);

        setWorkoutPlan(workoutPlanData);

        const schedule = workoutPlanData.weeklySchedule || {};
        const arr = Object.entries(schedule).map(([day, dayData]) => ({
          day,
          focus: dayData.focus || "General Focus",
          restDay: !dayData.exercises || dayData.exercises.length === 0,
          exercises: (dayData.exercises || []).map((ex) =>
            typeof ex === "string" ? { name: ex } : { ...ex, name: ex.exercise }
          ),
        }));

        setPlanArray(arr);
      } catch (err) {
        console.error("Workout generation failed:", err);
        setError("Failed to generate workout plan. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    createPlan();
  }, [profile, navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <Spinner size={80} color="cyan" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-5 text-info">
        <p>{error}</p>
        <button className="btn btn-outline-info" onClick={() => navigate("/")}>
          Go Back
        </button>
      </div>
    );
  }

  if (!planArray || !Array.isArray(planArray)) {
    return (
      <div className="text-center mt-5 text-warning">
        <p>No workout plan available. Please try again.</p>
        <button className="btn btn-outline-warning" onClick={() => navigate("/dashboard")}>
          Return to Dashboard
        </button>
      </div>
    );
  }

  const glassCardStyle = {
    background: "rgba(0, 128, 128, 0.2)",
    backdropFilter: "blur(12px)",
    borderRadius: "16px",
    border: "1px solid rgba(0, 128, 128, 0.6)",
    boxShadow: "0 6px 20px rgba(0, 255, 255, 0.15)",
    color: "#b0ffff",
    marginBottom: "1.5rem",
    padding: "1rem",
    animation: "fadeIn 0.5s ease-in-out",
  };

  const sectionTitle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#7fffd4",
    fontSize: "1.3rem",
    marginBottom: "0.8rem",
  };

  const exerciseItemStyle = {
    background: "rgba(0, 128, 128, 0.15)",
    borderRadius: 8,
    boxShadow: "inset 0 0 6px rgba(0, 255, 255, 0.1)",
    color: "#e0ffff",
    padding: "0.5rem 0.75rem",
    marginBottom: "0.5rem",
    lineHeight: 1.5,
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="container py-4" style={{ maxWidth: 720, minHeight: "100vh", backgroundColor: "#101010" }}>
      <h2 className="text-center mb-4" style={{ color: "#00f5d4" }}>
        <FaCheckCircle className="mb-1" /> Your Personalized Workout Plan
      </h2>

      {workoutPlan.summary && (
        <div style={glassCardStyle}>
          <div style={sectionTitle}><FaInfoCircle /> Summary</div>
          <p>{workoutPlan.summary}</p>
        </div>
      )}

      {workoutPlan.progression && (
        <div style={glassCardStyle}>
          <div style={sectionTitle}><FaFireAlt /> Progression</div>
          <ul>
            {Object.entries(workoutPlan.progression).map(([phase, text]) => (
              <li key={phase}><strong>{capitalize(phase)}:</strong> {text}</li>
            ))}
          </ul>
        </div>
      )}

      {workoutPlan.restRecovery && (
        <div style={glassCardStyle}>
          <div style={sectionTitle}><FaBed /> Rest & Recovery</div>
          <ul>
            {Object.entries(workoutPlan.restRecovery).map(([key, val]) => (
              <li key={key}><strong>{capitalize(key)}:</strong> {val}</li>
            ))}
          </ul>
        </div>
      )}

      {workoutPlan.notes && (
        <div style={glassCardStyle}>
          <div style={sectionTitle}><FaNotesMedical /> Notes</div>
          <ul>
            {Object.entries(workoutPlan.notes).map(([key, val]) => (
              <li key={key}><strong>{capitalize(key)}:</strong> {val}</li>
            ))}
          </ul>
        </div>
      )}

      {workoutPlan.dietTips && (
        <div style={glassCardStyle}>
          <div style={sectionTitle}><FaUtensils /> Diet Tips</div>
          <ul>
            {Object.entries(workoutPlan.dietTips).map(([key, val]) => (
              <li key={key}><strong>{capitalize(key)}:</strong> {val}</li>
            ))}
          </ul>
        </div>
      )}

      {planArray.map((day, idx) => (
        <div key={idx} style={glassCardStyle}>
          <h4>{day.day}</h4>
          <p><strong>Focus:</strong> {day.focus}</p>

          {day.restDay ? (
            <p className="fst-italic text-center" style={{ color: "#a0f0f0" }}>
              <FaBed className="me-2" /> Rest / Recovery Day
            </p>
          ) : (
            <ul className="list-unstyled">
              {day.exercises.map((ex, i) => (
                <li key={i} style={exerciseItemStyle}>
                  <FaDumbbell className="me-2" />
                  <strong>{ex.name}</strong> —{" "}
                  {ex.sets && ex.reps ? `${ex.sets} sets x ${ex.reps} reps` : ex.duration || ""}
                  {ex.rest && <div style={{ fontSize: "0.85rem", marginTop: 4 }}>Rest: {ex.rest}</div>}
                  {ex.equipment && <div style={{ fontSize: "0.85rem", marginTop: 4 }}>Equipment: {ex.equipment}</div>}
                  {ex.alternatives && Array.isArray(ex.alternatives) && (
                    <div style={{ fontSize: "0.8rem", marginTop: 6 }}>
                      <em>Alternatives:</em> {ex.alternatives.join(", ")}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-outline-light" onClick={() => navigate("/dashboard")}>
          🏠 Dashboard
        </button>
        <button className="btn btn-info" onClick={() => navigate("/today")}>
          ▶️ Start Today’s Workout
        </button>
      </div>
    </div>
  );
}
