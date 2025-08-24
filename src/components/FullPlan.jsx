import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import Spinner from '../components/spinner';
import { useNavigate } from 'react-router-dom';

export default function FullPlan() {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error('User not logged in');

        const planRef = collection(db, 'users', userId, 'workoutPlans');
        const q = query(planRef, orderBy('createdAt', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError('No workout plan found.');
          return;
        }

        const planDoc = querySnapshot.docs[0];
        const data = planDoc.data();

        if (
          !data.plan ||
          typeof data.plan.weeklySchedule !== 'object' ||
          data.plan.weeklySchedule === null
        ) {
          setError('Workout plan or weekly schedule is corrupted.');
          return;
        }

        setWorkoutPlan(data.plan.weeklySchedule);
      } catch (err) {
        console.error('Error fetching workout plan:', err);
        setError('Failed to load workout plan.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, []);

  // Calculate today key: treat Sunday (0) as day7 for consistency with your data
  const todayIndex = new Date().getDay();
  const todayKey = `day${todayIndex === 0 ? 7 : todayIndex}`;

  const glassCardStyle = {
    background: 'rgba(0, 128, 128, 0.3)',
    backdropFilter: 'blur(15px)',
    borderRadius: '12px',
    border: '1px solid rgba(0, 128, 128, 0.7)',
    boxShadow: '0 4px 15px rgba(0, 128, 128, 0.4)',
    color: '#7fffd4',
    marginBottom: '1.5rem',
    padding: '1rem',
  };

  const exerciseItemStyle = {
    background: 'rgba(0, 128, 128, 0.25)',
    borderRadius: 8,
    boxShadow: 'inset 0 0 8px rgba(0, 128, 128, 0.3)',
    color: '#b0ffff',
    padding: '0.5rem',
    marginBottom: '0.5rem',
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <Spinner size={60} color="cyan" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-danger mt-4">
        <p>{error}</p>
      </div>
    );
  }

  if (!workoutPlan || Object.keys(workoutPlan).length === 0) {
    return (
      <div className="text-center text-muted mt-4">
        <p>No workout plan available. Generate one first.</p>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: 700, backgroundColor: '#121212' }}>
      <h2 className="mb-4 text-info text-center">Your Full Workout Plan</h2>

      {/* Fixed button at the top to start today's workout */}
      <div className="text-center mb-4">
        <button
          className="btn btn-success"
          onClick={() => navigate('/today')}
          aria-label="Start today's workout"
        >
          Start Today's Workout
        </button>
      </div>

      {Object.entries(workoutPlan).map(([dayKey, dayData]) => {
        const exercises = Array.isArray(dayData.exercises) ? dayData.exercises : [];
        const isToday = dayKey.toLowerCase() === todayKey.toLowerCase();

        return (
          <div
            key={dayKey}
            style={{
              ...glassCardStyle,
              borderColor: isToday ? 'cyan' : 'rgba(0, 128, 128, 0.7)',
              boxShadow: isToday
                ? '0 0 20px 3px cyan'
                : '0 4px 15px rgba(0, 128, 128, 0.4)',
            }}
          >
            <h4 style={{ color: isToday ? 'cyan' : undefined }}>
              {dayKey.toUpperCase()} {isToday && '(Today)'}
            </h4>
            <p><strong>Focus:</strong> {dayData.focus || 'N/A'}</p>

            {dayData.restDay ? (
              <p className="fst-italic text-center" style={{ color: '#a0f0f0' }}>
                Rest / Recovery Day
              </p>
            ) : exercises.length > 0 ? (
              <ul className="list-unstyled">
                {exercises.map((ex, i) => (
                  <li key={i} style={exerciseItemStyle}>
                    <strong>{ex.name || ex.exercise || 'Unnamed Exercise'}</strong> —{' '}
                    {ex.sets && ex.reps
                      ? `${ex.sets} sets x ${ex.reps} reps`
                      : ex.duration || 'N/A'}
                    {ex.rest && (
                      <div style={{ fontSize: '0.9rem', marginTop: 4 }}>
                        Rest: {ex.rest} sec
                      </div>
                    )}
                    {ex.equipment && (
                      <div style={{ fontSize: '0.9rem', marginTop: 4 }}>
                        Equipment: {ex.equipment}
                      </div>
                    )}
                    {Array.isArray(ex.alternatives) && ex.alternatives.length > 0 && (
                      <div style={{ fontSize: '0.85rem', marginTop: 4, fontStyle: 'italic' }}>
                        Alternatives: {ex.alternatives.join(', ')}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-warning text-center">No exercises listed for this day.</p>
            )}

            {/* Per-day start workout button */}
            {!dayData.restDay && (
              <button
      onClick={() => navigate('/today', { state: { dayKey } })}
                className="btn btn-info mt-3"
                aria-label={`Start workout for ${dayKey}`}
              >
                Start Workout
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
