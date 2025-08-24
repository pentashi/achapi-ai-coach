let plankStartTime = null;
let totalPlankTime = 0;

export function detectPlank(landmarks, prevState = {}) {
  if (!landmarks) return { percent: 0, duration: 0, newTips: '', newState: prevState };

  // Use right side by default
  const shoulder = landmarks[12] || landmarks[11];
  const hip = landmarks[24] || landmarks[23];
  const ankle = landmarks[28] || landmarks[27];

  // Shoulder-Hip-Ankle angle
  const angle = calculateAngle(shoulder, hip, ankle);

  let duration = prevState.plankDuration || 0;
  let startTime = prevState.plankStartTime || null;
  let tips = '';

  // Check if plank is correct
  if (angle > 165) {
    if (!startTime) startTime = Date.now();
    duration += (Date.now() - startTime) / 1000; // seconds
    startTime = Date.now();
  } else {
    startTime = null;
    if (angle < 150) tips = '⬇️ Keep your back straighter!';
  }

  // Progress percent (based on angle)
  const percent = Math.min(Math.max(((angle - 120) / 60) * 100, 0), 100);

  const newState = { plankStartTime: startTime, plankDuration: duration };

  return { percent, duration, newTips: tips, newState };
}

// Helper
function calculateAngle(a, b, c) {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  return Math.abs((radians * 180.0) / Math.PI);
}
