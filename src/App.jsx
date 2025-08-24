import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

import OnboardingWrapper from './components/onboarding/OnboardingWrapper';
import Dashboard from './components/Dashboard';
import AuthWrapper from './components/AuthWrapper';
import GenerateWorkout from './pages/GenerateWorkout';
import TodayWorkout from './pages/TodayWorkout';
import PoseTracer from './components/PoseTracker';
import { saveOnboardingData } from './utils/firestoreHelpers';
import Spinner from './components/spinner';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        // No user logged in → show signup/login
        setUser(null);
        setUserData(null);
        setCompleted(false);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      try {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData(data);
          const isComplete = data.onboardingComplete === true;
          setCompleted(isComplete);
        } else {
          setUserData(null);
          setCompleted(false);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setUserData(null);
        setCompleted(false);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleOnboardingComplete = async (data) => {
    if (!user) return;
    try {
      await saveOnboardingData(user.uid, { ...data, onboardingComplete: true });
      setUserData(data);
      setCompleted(true);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Failed to save onboarding data:', err);
      toast.error('Failed to save onboarding data.');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('You have been signed out!');
    } catch (err) {
      console.error('Logout failed:', err);
      toast.error('Logout failed. Try again.');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: "#121212" }}>
        <Spinner size={80} color="cyan" />
      </div>
    );
  }

  // 1️⃣ Not logged in → AuthWrapper (signup/login)
  if (!user) return <AuthWrapper onAuthSuccess={setUser} />;

  return (
    <>
      <Routes>
        {/* 2️⃣ Logged in but onboarding not complete */}
        {!completed && <Route path="/*" element={<OnboardingWrapper onComplete={handleOnboardingComplete} />} />}

        {/* 3️⃣ Logged in and onboarding complete → protected routes */}
        {completed && (
          <>
            <Route path="/dashboard" element={<Dashboard profile={userData} />} />
            <Route path="/generate-workout" element={<GenerateWorkout />} />
            <Route path="/today" element={<TodayWorkout />} />
            <Route path="/track" element={<PoseTracer />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>

      {completed && (
        <button
          onClick={handleLogout}
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            padding: '8px 16px',
            backgroundColor: '#f00',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      )}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
    </>
  );
}

export default App;
