// src/utils/firestoreHelpers.js
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

// Save onboarding data for a user
export async function saveOnboardingData(userId, data) {
  try {
    // 'users' collection, document id = userId
    await setDoc(doc(db, 'users', userId), data, { merge: true });
    console.log('User data saved successfully!');
  } catch (error) {
    console.error('Error saving user data:', error);
    throw error;
  }
}
export const saveWorkoutPlan = async (userId, plan) => {
  const ref = doc(db, "workoutPlans", userId);
  await setDoc(ref, { plan, createdAt: new Date() });
}
