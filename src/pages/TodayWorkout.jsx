import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import Spinner from "../components/spinner";
import { FaDumbbell, FaClock, FaFire, FaCamera, FaArrowLeft } from "react-icons/fa";

export default function TodayWorkout() {
  const [todayWorkout, setTodayWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const passedDayKey = location.state?.dayKey; // e.g. 'day5'

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error("User not logged in");

        const workoutPlansRef = collection(db, "users", userId, "workoutPlans");
        const q = query(workoutPlansRef, orderBy("createdAt", "desc"), limit(1));
        const snapshot = await getDocs(q);

        if (snapshot.empty) throw new Error("No workout plan found");

        const latest = snapshot.docs[0].data().plan;
        const weekly = latest.weeklySchedule || {};

        // Use passed dayKey or default to today
        const fallbackDayIndex = new Date().getDay(); // 0 = Sunday
        const fallbackDayKey = `day${fallbackDayIndex === 0 ? 7 : fallbackDayIndex}`;
        const targetDayKey = passedDayKey || fallbackDayKey;

        const todayData = weekly[targetDayKey];

        if (!todayData) throw new Error("Workout data missing for selected day");

        setTodayWorkout({
          day: targetDayKey,
          ...todayData,
        });
      } catch (err) {
        console.error("Failed to load today's workout:", err);
        setError("Could not load today's workout.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [location.state]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <Spinner size={80} color="cyan" />
      </div>
    );
  }

  if (error || !todayWorkout) {
    return (
      <div className="text-center mt-5 text-info">
        <p>{error || "No workout found for today."}</p>
        <button
          className="btn btn-outline-info"
          onClick={() => navigate("/dashboard")}
        >
          Go Back
        </button>
      </div>
    );
  }

  const glassCard = {
    background: "rgba(0, 128, 128, 0.2)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(0, 128, 128, 0.5)",
    borderRadius: "12px",
    color: "#7fffd4",
    padding: "1rem",
    marginBottom: "1rem",
  };

  const exStyle = {
    background: "rgba(0, 128, 128, 0.1)",
    borderRadius: "8px",
    padding: "0.75rem",
    marginBottom: "0.75rem",
    color: "#b0ffff",
  };

  return (
    <div
      className="container py-4"
      style={{ maxWidth: 700, minHeight: "100vh", backgroundColor: "#121212" }}
    >
      <button
        className="btn btn-outline-info mb-3"
        onClick={() => navigate("/dashboard")}
        style={{ maxWidth: 150 }}
      >
        <FaArrowLeft style={{ marginRight: 8 }} />
        Back to Dashboard
      </button>

      <h2 className="mb-4 text-center text-info">
        🏋️ Today’s Workout —{" "}
        <span style={{ fontWeight: 400 }}>
          {todayWorkout.day.toUpperCase()}
        </span>
      </h2>

      <div style={glassCard}>
        <h4>
          <FaFire style={{ marginRight: 8 }} />
          Focus: {todayWorkout.focus || "N/A"}
        </h4>
      </div>

      {!todayWorkout.exercises || todayWorkout.exercises.length === 0 ? (
        <p className="fst-italic text-center" style={{ color: "#a0f0f0" }}>
          Rest / Recovery Day
        </p>
      ) : (
        <ul className="list-unstyled">
          {todayWorkout.exercises.map((ex, i) => (
            <li key={i} style={exStyle}>
              <strong>
                <FaDumbbell /> {ex.exercise || ex.name}
              </strong>
              <div>
                {ex.sets && ex.reps && (
                  <div>
                    <FaClock style={{ marginRight: 5 }} />
                    {`${ex.sets} sets x ${ex.reps} reps`}
                  </div>
                )}
                {ex.duration && (
                  <div>
                    <FaClock style={{ marginRight: 5 }} />
                    {ex.duration}
                  </div>
                )}
                {ex.rest && <div>🛑 Rest: {ex.rest}</div>}
                {ex.equipment && <div>🧰 Equipment: {ex.equipment}</div>}
                {Array.isArray(ex.alternatives) &&
                  ex.alternatives.length > 0 && (
                    <div style={{ fontSize: "0.9rem", marginTop: 4 }}>
                      <em>Alternatives:</em> {ex.alternatives.join(", ")}
                    </div>
                  )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-outline-light"
          onClick={() => navigate("/dashboard")}
        >
          🏠 Dashboard
        </button>
        <button
          className="btn btn-info"
onClick={() =>
  navigate("/track", {
    state: {
      workout: todayWorkout
    }
  })
}
        >
          <FaCamera /> Start Workout
        </button>
      </div>
    </div>
  );
}
