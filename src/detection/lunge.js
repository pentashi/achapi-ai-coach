let leftLungeFlag = false;
let rightLungeFlag = false;
let leftLungeCount = 0;
let rightLungeCount = 0;
let frameCounter = 0;

export function detectLunge(landmarks, prevState = {}) {
  if (!landmarks) return { repCompleted: 0, percentLeft: 0, percentRight: 0, newTips: '', newState: prevState };

  const leftHip = landmarks[23];
  const leftKnee = landmarks[25];
  const leftAnkle = landmarks[27];

  const rightHip = landmarks[24];
  const rightKnee = landmarks[26];
  const rightAnkle = landmarks[28];

  let leftAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  let rightAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

  frameCounter++;

  // Detect left lunge
  if (frameCounter > 30) {
    if (leftAngle < 100) leftLungeFlag = true;
    if (leftAngle > 150 && leftLungeFlag) {
      leftLungeCount++;
      leftLungeFlag = false;
    }

    // Detect right lunge
    if (rightAngle < 100) rightLungeFlag = true;
    if (rightAngle > 150 && rightLungeFlag) {
      rightLungeCount++;
      rightLungeFlag = false;
    }
  }

  // Percentages for progress bars
  const leftPercent = Math.min(Math.max(((180 - leftAngle) / 70) * 100, 0), 100);
  const rightPercent = Math.min(Math.max(((180 - rightAngle) / 70) * 100, 0), 100);

  // Construct tips
  let newTips = '';
  if (leftPercent < 50) newTips += '⬇️ Lower left knee more. ';
  if (rightPercent < 50) newTips += '⬇️ Lower right knee more. ';

  const newState = { leftLungeFlag, rightLungeFlag, frameCounter };

  // Return for centralized rendering
  return {
    repCompleted: leftLungeCount + rightLungeCount,
    percentLeft: leftPercent,
    percentRight: rightPercent,
    newTips,
    newState
  };
}

// Helper: angle calculation
function calculateAngle(a, b, c) {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  return Math.abs((radians * 180.0) / Math.PI);
}
