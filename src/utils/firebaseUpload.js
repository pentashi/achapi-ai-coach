// utils/firebaseUpload.js
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "../firebase";

const db = getFirestore(app);
const storage = getStorage(app);

export async function uploadPhoto(file, userId, label) {
  if (!file) return null;
  const fileRef = ref(storage, `users/${userId}/progressPhotos/${label}_${Date.now()}`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}

export async function saveUserProfile(profile) {
  const userDocRef = await addDoc(collection(db, "users"), {
    createdAt: Timestamp.now(),
  });
  const userId = userDocRef.id;

  const frontUrl = await uploadPhoto(profile.progressPhotoFront, userId, "front");
  const sideUrl = await uploadPhoto(profile.progressPhotoSide, userId, "side");
  const backUrl = await uploadPhoto(profile.progressPhotoBack, userId, "back");

  const dataToSave = {
    ...profile,
    age: Number(profile.age),
    height: Number(profile.height),
    weight: Number(profile.weight),
    trainingDaysPerWeek: Number(profile.trainingDaysPerWeek),
    workoutDurationMinutes: Number(profile.workoutDurationMinutes),
    bodyFatPercentage: profile.bodyFatPercentage ? Number(profile.bodyFatPercentage) : null,
    muscleMass: profile.muscleMass ? Number(profile.muscleMass) : null,
    waistCircumference: profile.waistCircumference ? Number(profile.waistCircumference) : null,
    progressPhotos: { front: frontUrl, side: sideUrl, back: backUrl },
    createdAt: Timestamp.now(),
  };

  await userDocRef.set(dataToSave);
  return dataToSave;
}
