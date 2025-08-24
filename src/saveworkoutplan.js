import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function saveWorkoutPlanToFirestore(userId, workoutPlan) {
  if (!userId) throw new Error("User ID is required to save workout plan");

  const userWorkoutPlansCollectionRef = collection(db, "users", userId, "workoutPlans");

  const planToSave = {
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    plan: workoutPlan,
  };

  await addDoc(userWorkoutPlansCollectionRef, planToSave);
}
