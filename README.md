🤖 Achapi AI Coach : Personalized AI Fitness App

Achapi AI Coach is a cutting-edge AI-powered fitness platform that generates fully personalized workouts, tracks exercises in real-time, and adapts plans based on your goals, experience, equipment, and injuries. Built for users who want a professional, interactive, and intelligent fitness experience.

✨ Features
Personalized Workout Generation

AI-generated workouts tailored to user goals, experience, equipment, and injury history

Weekly schedule with progression plans, rest/recovery guidance, diet tips, and notes

Alternative exercises dynamically generated if user cannot perform a movement

Real-Time Workout Tracking

PoseTracer AI tracks exercises in real-time via webcam

Auto-counts reps, tracks sets, and advances to next exercise

Includes rest timers, progress bars, and voice coaching

Highlights current exercise with full day’s exercise overview

User Profile & Progress

Stores profile data: name, age, gender, height, weight, fitness goals

Tracks injuries, restrictions, motivation for safer training

Visualizes progress stats and graphs

Adaptive AI

Plans adapt based on completion, performance, and feedback

Dynamic summaries help users understand progress and recommendations

Additional Features

Responsive UI for desktop and mobile

Modern, hyper-AI/cyberpunk inspired interface

Camera-based pose detection (TensorFlow.js & MediaPipe)

Fully integrated with Firebase Auth, Firestore, and Storage

🛠️ Tech Stack

Frontend: React, Vite, Tailwind CSS, Bootstrap, React Icons, React Router

Backend / Data: Firebase (Auth, Firestore, Storage)

AI / Pose Detection: TensorFlow.js, @tensorflow-models/pose-detection, MediaPipe Pose

Notifications: React Toastify

Dev Tools: ESLint, Nodemon, PostCSS, Vite

Deployment: Vercel / Firebase Hosting

🚀 Getting Started
1. Clone the repo
git clone https://github.com/pentashi/achapi-ai-coach.git
cd achapi-ai-coach

2. Install frontend dependencies
npm install

3. Configure frontend environment variables

Create a .env.local file in the frontend folder:

FIREBASE_API_KEY=your-firebase-api-key
FIREBASE_PROJECT_ID=your-project-id

4. Run frontend development server
npm run dev

5. Build frontend for production
npm run build
npm run preview

6. Setup and run backend

Navigate to the backend folder:

cd ai-coach-backend
npm install
npm start


server.js will start your backend server

Ensure backend is running before using frontend

📦 Deployment

Frontend deployed on Vercel (Live Demo
)

Firebase handles backend, auth, database, and storage

Fully containerizable if Docker deployment is needed

🧪 Testing

Run frontend tests:

npm run lint


Ensures code quality with ESLint, React hooks rules, and proper formatting

📖 Roadmap

 Group workout sessions & community challenges

 Notifications and reminders for workouts

 Advanced analytics dashboard for progress tracking

 Dark mode & enhanced AI coaching tips

👨‍💻 Author

Your Name
 — Software Engineer | Remote Full-Stack Dev | AI & Fitness Enthusiast