import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // fetch user profile from Firestore
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists() && snap.data().onboardingComplete) {
        toast.success("✅ Welcome back!");
        onLoginSuccess("dashboard"); // redirect to dashboard
      } else {
        toast.info("ℹ️ Please finish onboarding.");
        onLoginSuccess("onboarding"); // redirect to onboarding
      }

    } catch (err) {
      toast.error(`❌ ${err.message}`);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="p-4 rounded bg-dark text-light mx-auto"
      style={{
        maxWidth: 400,
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(0, 255, 255, 0.3)",
        boxShadow: "0 8px 20px rgba(0, 255, 255, 0.1)",
      }}
    >
      <h3 className="mb-4 text-center text-info">Log In</h3>

      <div className="mb-3">
        <input
          type="email"
          className="form-control bg-secondary text-light border-0 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
          autoFocus
        />
      </div>

      <div className="mb-4">
        <input
          type="password"
          className="form-control bg-secondary text-light border-0 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>

      <button type="submit" className="btn btn-info w-100 fw-bold rounded">
        Log In
      </button>
    </form>
  );
}
