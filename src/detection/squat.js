let squatFlag = false;
let squatCount = 0;

export function detectSquat(landmarks, prevState = {}) {
  if (!landmarks) return { repCompleted: 0, percent: 0, newTips: '', newState: prevState };

  // Hip and knee (using right side as reference)
  const hip = landmarks[24] || landmarks[23];
  const knee = landmarks[26] || landmarks[25];
  const ankle = landmarks[28] || landmarks[27];

  // Calculate knee angle
  const kneeAngle = calculateAngle(hip, knee, ankle);

  // Detect squat
  if (kneeAngle > 160) squatFlag = true; // standing up
  if (kneeAngle < 100 && squatFlag) {
    squatCount++;
    squatFlag = false;
  }

  // Percent for progress bar
  const percent = Math.min(Math.max(((180 - kneeAngle) / 80) * 100, 0), 100);

  // Form tips
  let newTips = '';
  if (percent < 50) newTips = '⬇️ Go lower in squat.';

  const newState = { squatFlag };

  return {
    repCompleted: squatCount,
    percent,
    newTips,
    newState
  };
}

// Helper
function calculateAngle(a, b, c) {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  return Math.abs((radians * 180.0) / Math.PI);
}
