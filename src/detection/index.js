import { detectSquat } from './squat';
import { detectPlank } from './plank';
import { detectPushup } from './pushup';
import { detectLunge } from './lunge';

const detectors = {
  Squats: detectSquat,
  Planks: detectPlank,
  Pushups: detectPushup,
  Lunges: detectLunge,
};

export const getDetector = (exerciseName) => detectors[exerciseName] || null;
