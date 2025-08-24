export function detectRussianTwists(landmarks, prevState) {
  let tips = "";
  let repCompleted = 0;
  let newState = { ...prevState };

  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];

  if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) return { repCompleted, tips, newState };

  const shoulderCenterX = (leftShoulder.x + rightShoulder.x) / 2;
  const hipCenterX = (leftHip.x + rightHip.x) / 2;
  const torsoTwist = shoulderCenterX - hipCenterX;

  if (!newState.twisting && Math.abs(torsoTwist) > 0.15) {
    newState.twisting = true;
    tips = "Good twist!";
  }

  if (newState.twisting && Math.abs(torsoTwist) < 0.05) {
    newState.twisting = false;
    repCompleted = 1;
    tips = "Nice rep!";
  }

  return { repCompleted, tips, newState };
}
export function detectRussianTwists(landmarks, prevState) {
  let tips = "";
  let repCompleted = 0;
  let newState = { ...prevState };

  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];

  if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) return { repCompleted, tips, newState };

  const shoulderCenterX = (leftShoulder.x + rightShoulder.x) / 2;
  const hipCenterX = (leftHip.x + rightHip.x) / 2;
  const torsoTwist = shoulderCenterX - hipCenterX;

  if (!newState.twisting && Math.abs(torsoTwist) > 0.15) {
    newState.twisting = true;
    tips = "Good twist!";
  }

  if (newState.twisting && Math.abs(torsoTwist) < 0.05) {
    newState.twisting = false;
    repCompleted = 1;
    tips = "Nice rep!";
  }

  return { repCompleted, tips, newState };
}
