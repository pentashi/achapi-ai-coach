import React, { useState, useRef, useEffect } from 'react';
import Settings from './Settings';
import ProgressTracker from './ProgressTracker';
import GoalsOverview from './GoalsOverview';
// import PoseTracer from './PoseTracker';
import PhysiqueRating from './PhysiqueRating';
import ChatWithCoach from './ChatWithCoach';
import FullPlan from './FullPlan';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { onAuthStateChanged } from 'firebase/auth';

const tabs = [
  { id: 'plan', label: '🗓️ Workout Plan' },
  { id: 'progress', label: '📈 Progress' },
  { id: 'goals', label: '🎯 Goals' },
  // { id: 'pose', label: '🧍‍♂️ Pose Tracker' },
  { id: 'physique', label: '💪 Physique Rating' },
  { id: 'chat', label: '💬 Chat with Coach' },
  { id: 'settings', label: '⚙️ Settings' },
];

export default function Dashboard({ profile }) {
  const [activeTab, setActiveTab] = useState('progress');
  const navRef = useRef(null);
  const [underlineStyle, setUnderlineStyle] = useState({});

  const [localProfile, setLocalProfile] = useState(() => {
    const cached = localStorage.getItem('achapiUser');
    return cached ? JSON.parse(cached) : { ...profile, uid: auth.currentUser?.uid };
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user?.uid) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            const userData = { ...data, uid: user.uid };
            setLocalProfile(userData);
            localStorage.setItem('achapiUser', JSON.stringify(userData));
          } else {
            console.warn('No user profile found in Firestore');
            setLocalProfile({ ...profile, uid: user.uid });
          }
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
          setLocalProfile({ ...profile, uid: user.uid });
        }
      } else {
        setLocalProfile({ ...profile, uid: null });
      }
    });

    return () => unsubscribe();
  }, [profile]);

  useEffect(() => {
    setLocalProfile((prev) => ({ ...prev, ...profile }));
  }, [profile]);

  const handleSaveProfile = async (updatedProfile) => {
    const user = auth.currentUser;
    if (!user?.uid) throw new Error('User not logged in');

    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, updatedProfile);

      const merged = { ...localProfile, ...updatedProfile };
      setLocalProfile(merged);
      localStorage.setItem('achapiUser', JSON.stringify(merged));

      toast.success('✅ Profile updated successfully!');
    } catch (error) {
      console.error('❌ Failed to update profile:', error);
      toast.error('❌ Failed to save settings.');
      throw error;
    }
  };

  useEffect(() => {
    if (!navRef.current) return;

    const activeBtn = navRef.current.querySelector(`[aria-selected="true"]`);
    if (!activeBtn) return;

    const { offsetLeft, offsetWidth } = activeBtn;
    setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
  }, [activeTab]);

  return (
    <div
      className="bg-dark text-light min-vh-100 py-4 px-2 px-sm-4 d-flex flex-column"
      style={{ overflowX: 'hidden' }}
    >
      {/* <ToastContainer theme="dark" /> */}

      <header className="text-center mb-4 px-3">
        <h1 className="fw-bold text-info fs-4 fs-sm-3">
          Welcome back, {localProfile?.name || 'Athlete'} 😎💪❤️
        </h1>
        <p className="text-muted mb-0">Let’s dominate today’s session.</p>
      </header>

      {/* Tab Navigation */}
      <nav
        ref={navRef}
        role="tablist"
        className="position-relative d-flex flex-nowrap justify-content-start justify-content-sm-center gap-2 gap-sm-3 mb-4 border-bottom border-secondary pb-2"
        style={{
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          userSelect: 'none',
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`btn btn-sm rounded-pill fw-semibold text-nowrap px-4 py-2 ${
                isActive ? 'btn-info shadow text-dark' : 'btn-outline-light text-light'
              }`}
              style={{
                transition: 'all 0.3s ease',
                boxShadow: isActive ? '0 4px 12px rgb(14 240 255 / 0.6)' : 'none',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              <span style={{ fontSize: '1.2em', marginRight: 6 }}>{tab.label.split(' ')[0]}</span>
              <span className="d-none d-sm-inline">{tab.label.replace(/^[^\s]+\s/, '')}</span>
            </button>
          );
        })}

        {/* Underline */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            height: 3,
            borderRadius: 2,
            backgroundColor: '#0ef',
            transition: 'left 0.3s ease, width 0.3s ease',
            left: underlineStyle.left || 0,
            width: underlineStyle.width || 0,
          }}
        />
      </nav>

      {/* Tab Content */}
      <section className="container-fluid flex-grow-1 px-0 px-sm-3">
        {activeTab === 'plan' && <FullPlan />}
        {activeTab === 'progress' && <ProgressTracker />}
        {activeTab === 'goals' && (
          <GoalsOverview initialGoals={localProfile?.fitnessGoals || []} profile={localProfile} />
        )}
        {/* {activeTab === 'pose' && <PoseTracer />} */}
        {activeTab === 'physique' && <PhysiqueRating metrics={localProfile?.physiqueMetrics || {}} />}
        {activeTab === 'chat' && <ChatWithCoach />}
        {activeTab === 'settings' && <Settings profile={localProfile} onSave={handleSaveProfile} />}
      </section>
    </div>
  );
}
