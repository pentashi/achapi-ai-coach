import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

// Detection functions
import { detectPushup } from "../detection/pushup";
import { detectPlank } from "../detection/plank";
import { detectLunge } from "../detection/lunge";

// Mapping of exercise types to detection functions
const DETECTION_FUNCTIONS = {
  pushup: detectPushup,
  plank: detectPlank,
  lunge: detectLunge,
};

const ExerciseTracer = () => {
  const location = useLocation();
  const workout = location.state?.workout;
  const dayKey = location.state?.dayKey || "DAY1";

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const exercises = workout?.exercises || [];
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentRep, setCurrentRep] = useState(0);
  const [detectionState, setDetectionState] = useState(null);
  const [tips, setTips] = useState("");

  const extractMin = (val) => {
    if (!val) return 1;
    const match = val.toString().match(/\d+/);
    return match ? parseInt(match[0], 10) : 1;
  };

  const drawProgressBar = (ctx, x, y, width, height, percent, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);

    const filledHeight = (percent / 100) * height;
    ctx.fillStyle = color;
    ctx.fillRect(x, y + height - filledHeight, width, filledHeight);

    ctx.fillStyle = "#fff";
    ctx.font = "16px Arial";
    ctx.fillText(`${Math.round(percent)}%`, x - 10, y + height + 20);
  };

  useEffect(() => {
    if (!videoRef.current) return;

    const pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onResults);

    videoRef.current.onloadedmetadata = () => {
      if (canvasRef.current) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
      }
    };

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) await pose.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });
    camera.start();

    return () => camera.stop();
  }, [currentExerciseIndex]);

  const onResults = (results) => {
    const landmarks = results.poseLandmarks;
    if (!landmarks || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw skeleton
    drawConnectors(ctx, landmarks, POSE_CONNECTIONS, { color: "#0ef", lineWidth: 4 });
    drawLandmarks(ctx, landmarks, { color: "#fff", lineWidth: 2 });

    const currentExercise = exercises[currentExerciseIndex];
    if (!currentExercise) return;

    const type = currentExercise?.type?.toLowerCase() || "pushup";
    const detectFn = DETECTION_FUNCTIONS[type];
    if (!detectFn) return;

    const result = detectFn(landmarks, detectionState);
    const {
      repCompleted,
      percentLeft,
      percentRight,
      percent,
      duration,
      newTips,
      newState
    } = result;

    setDetectionState(newState);
    setTips(newTips || "");

    if (repCompleted > currentRep) completeRep();

    // Draw progress bars
    if (percentLeft !== undefined)
      drawProgressBar(ctx, 50, 50, 20, 200, percentLeft, "lime");

    if (percentRight !== undefined)
      drawProgressBar(ctx, 100, 50, 20, 200, percentRight, "cyan");

    if (percent !== undefined && duration !== undefined) {
      drawProgressBar(ctx, 75, 50, 20, 200, percent, "orange");
      ctx.fillStyle = "#fff";
      ctx.font = "18px Arial";
      ctx.fillText(`Time: ${duration.toFixed(1)}s`, 20, 280);
    }

    // Optional: show angles if available (from pushup)
    if (newState?.leftAngle !== undefined) {
      ctx.fillStyle = "#ff0";
      ctx.font = "20px Arial";
      const leftElbow = landmarks[13];
      ctx.fillText(
        `${Math.round(newState.leftAngle)}°`,
        leftElbow.x * canvasRef.current.width,
        leftElbow.y * canvasRef.current.height - 10
      );
    }

    if (newState?.rightAngle !== undefined) {
      ctx.fillStyle = "#ff0";
      ctx.font = "20px Arial";
      const rightElbow = landmarks[14];
      ctx.fillText(
        `${Math.round(newState.rightAngle)}°`,
        rightElbow.x * canvasRef.current.width,
        rightElbow.y * canvasRef.current.height - 10
      );
    }
  };

  const completeRep = () => {
    const currentExercise = exercises[currentExerciseIndex];
    if (!currentExercise) return;

    if (currentRep + 1 >= extractMin(currentExercise.reps)) completeSet();
    else setCurrentRep((prev) => prev + 1);
  };

  const completeSet = () => {
    const currentExercise = exercises[currentExerciseIndex];
    if (!currentExercise) return;

    if (currentSet >= extractMin(currentExercise.sets)) {
      if (currentExerciseIndex + 1 < exercises.length) {
        setCurrentExerciseIndex((prev) => prev + 1);
        setCurrentSet(1);
        setCurrentRep(0);
        setDetectionState(null);
        setTips("");
      } else {
        alert("🎉 Workout complete!");
      }
    } else {
      setCurrentSet((prev) => prev + 1);
      setCurrentRep(0);
    }
  };

  const currentExercise = exercises[currentExerciseIndex];
  const totalSets = extractMin(currentExercise?.sets);
  const totalReps = extractMin(currentExercise?.reps);

  if (!workout || exercises.length === 0) {
    return (
      <div style={{ padding: 20, color: "#0ef", fontSize: 22 }}>
        No workout data or it’s a rest day.
      </div>
    );
  }

  return (
    <div style={{ padding: 24, color: "#fff", background: "#121212", maxWidth: 900, margin: "auto", borderRadius: 12 }}>
      <h2 style={{ color: "#0ef" }}>
        Workout for {dayKey.toUpperCase()} — {currentExercise?.name || "Exercise"}
      </h2>

      <div style={{ display: "flex", gap: 20, marginTop: 24, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 300px" }}>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {exercises.map((ex, i) => (
              <li key={i} style={{
                padding: 12,
                marginBottom: 6,
                borderRadius: 8,
                backgroundColor: i === currentExerciseIndex ? "#0ef" : "#222",
                color: i === currentExerciseIndex ? "#000" : "#ccc",
                fontWeight: i === currentExerciseIndex ? "700" : "400",
              }}>
                {ex.name} — {ex.sets} sets x {ex.reps} {ex.type === "plank" ? "seconds" : "reps"}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: "1 1 300px", position: "relative" }}>
          <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "auto", borderRadius: 12, backgroundColor: "#000" }} />
          <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: 12, pointerEvents: "none" }} />
        </div>
      </div>

      <div style={{ marginTop: 24, fontSize: 20 }}>
        <strong>Set:</strong> {currentSet} / {totalSets} &nbsp; | &nbsp;
        <strong>Rep:</strong> {currentRep} / {totalReps}
      </div>

      <div style={{ marginTop: 12, color: "#0ef", fontWeight: "600", fontSize: 18, minHeight: 28, fontStyle: "italic" }}>
        {tips}
      </div>
    </div>
  );
};

export default ExerciseTracer;
