import React, { useState, useEffect } from "react";
import Signup from "./Signup";
import Login from "./Login";
import { toast } from "react-toastify";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function AuthWrapper({ onAuthSuccess }) {
  const [view, setView] = useState("signup"); // 'signup' or 'login'
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect logged-in users immediately
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.uid) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists() && docSnap.data().onboardingComplete) {
            navigate("/dashboard", { replace: true });
          } else {
            navigate("/onboarding", { replace: true });
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignupSuccess = (user) => {
    toast.success("✅ Signup successful! Proceeding...");
    onAuthSuccess(user);
    navigate("/onboarding", { replace: true }); // force onboarding after signup
  };

  const handleLoginSuccess = (user) => {
    toast.success("✅ Login successful!");
    onAuthSuccess(user);
    // user redirect will be handled by useEffect
  };

  return (
    <div
      className="container mt-5 p-4 rounded glass-card text-white"
      style={{
        maxWidth: "480px",
        backdropFilter: "blur(10px)",
        background: "rgba(0, 255, 255, 0.05)",
        border: "1px solid rgba(0, 255, 255, 0.2)",
        boxShadow: "0 8px 20px rgba(0, 255, 255, 0.1)",
      }}
    >
      <h2 className="mb-4 text-center text-info fw-bold">
        {view === "signup" ? "Create Account" : "Welcome Back"}
      </h2>

      {view === "signup" ? (
        <>
          <Signup onSignupSuccess={handleSignupSuccess} />
          <p className="mt-3 text-center">
            Already have an account?{" "}
            <button
              className="btn btn-link text-info"
              onClick={() => setView("login")}
            >
              Log in
            </button>
          </p>
        </>
      ) : (
        <>
          <Login onLoginSuccess={handleLoginSuccess} />
          <p className="mt-3 text-center">
            Don’t have an account?{" "}
            <button
              className="btn btn-link text-info"
              onClick={() => setView("signup")}
            >
              Sign up
            </button>
          </p>
        </>
      )}
    </div>
  );
}
