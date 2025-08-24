// ✅ Signup.jsx
import React, { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { toast } from "react-toastify";

export default function Signup({ onSignupSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password || !displayName) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, { displayName });

// toast.success("✅ Signup successful!", { toastId: 'signup-success' });

      // Notify parent that signup succeeded with user object
      onSignupSuccess(userCredential.user);
    } catch (err) {
      console.error("Signup error:", err);

      switch (err.code) {
        case "auth/email-already-in-use":
          toast.error("Email already in use.");
          break;
        case "auth/invalid-email":
          toast.error("Invalid email format.");
          break;
        case "auth/weak-password":
          toast.error("Password should be at least 6 characters.");
          break;
        case "auth/network-request-failed":
          toast.error("Network error. Please try again.");
          break;
        default:
          toast.error(`Signup failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSignup}
      className="p-4 rounded bg-dark text-light mx-auto"
      style={{
        maxWidth: 400,
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(0, 255, 255, 0.3)",
        boxShadow: "0 8px 20px rgba(0, 255, 255, 0.1)",
      }}
    >
      <h3 className="mb-4 text-center text-info">Create Account</h3>

      <div className="mb-3">
        <input
          type="text"
          className="form-control bg-secondary text-light border-0 rounded"
          placeholder="Full Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          autoFocus
        />
      </div>

      <div className="mb-3">
        <input
          type="email"
          className="form-control bg-secondary text-light border-0 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <input
          type="password"
          className="form-control bg-secondary text-light border-0 rounded"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>

      <button
        type="submit"
        className="btn btn-info w-100 fw-bold rounded"
        disabled={loading}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
}
