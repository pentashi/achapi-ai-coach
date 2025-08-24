let pushupCount = 0;

export function detectPushup(landmarks, prevState = {}) {
  if (!landmarks) return { repCompleted: 0, percentLeft: 0, percentRight: 0, newTips: '', newState: prevState };

  const newState = { ...prevState };
  if (!newState.stage) newState.stage = 'up'; // up or down

  // Get left side landmarks
  const lShoulder = landmarks[11];
  const lElbow = landmarks[13];
  const lWrist = landmarks[15];

  // Get right side landmarks
  const rShoulder = landmarks[12];
  const rElbow = landmarks[14];
  const rWrist = landmarks[16];

  // Compute angles
  const leftAngle = calculateAngle(lShoulder, lElbow, lWrist);
  const rightAngle = calculateAngle(rShoulder, rElbow, rWrist);

  // Pushup stage detection
  const minAngle = 90; // fully down
  const maxAngle = 170; // fully up
  let repCompleted = pushupCount;

  if (leftAngle < minAngle || rightAngle < minAngle) {
    newState.stage = 'down';
  }

  if ((leftAngle > maxAngle && rightAngle > maxAngle) && newState.stage === 'down') {
    newState.stage = 'up';
    pushupCount++;
    repCompleted = pushupCount;
  }

  // Progress percentage for bars
  const percentLeft = Math.min(Math.max((leftAngle - minAngle) / (maxAngle - minAngle) * 100, 0), 100);
  const percentRight = Math.min(Math.max((rightAngle - minAngle) / (maxAngle - minAngle) * 100, 0), 100);

  // Tips for form
  let newTips = '';
  if (percentLeft < 50 || percentRight < 50) newTips = '⬇️ Lower your chest closer to the floor.';
  if (percentLeft > 95 && percentRight > 95) newTips = '⬆️ Fully extend your arms at the top.';

  newState.leftAngle = leftAngle;
  newState.rightAngle = rightAngle;

  return {
    repCompleted,
    percentLeft,
    percentRight,
    newTips,
    newState
  };
}

// Helper: calculate angle at joint B between points A-B-C
function calculateAngle(A, B, C) {
  const AB = [A.x - B.x, A.y - B.y];
  const CB = [C.x - B.x, C.y - B.y];
  const dot = AB[0] * CB[0] + AB[1] * CB[1];
  const magAB = Math.sqrt(AB[0]**2 + AB[1]**2);
  const magCB = Math.sqrt(CB[0]**2 + CB[1]**2);
  const angleRad = Math.acos(dot / (magAB * magCB));
  return angleRad * (180 / Math.PI);
}
