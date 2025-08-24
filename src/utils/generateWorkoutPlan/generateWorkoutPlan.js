export async function generateWorkoutPlan(profile) {
  try {
    // Use environment variable for API URL; fallback to localhost for dev
    const API_URL = import.meta.env.VITE_API_URL ;

    const res = await fetch(`${API_URL}/generate-workout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ profile }),
    });

    const rawText = await res.text(); // use .text() to capture raw response
    console.log("🔹 RAW AI RESPONSE:", rawText); // debug log

    if (!res.ok) {
      console.error("❌ Server error:", res.status);
      throw new Error(`Server error: ${res.status}`);
    }

    // Extract first JSON object from response
    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("No JSON found in AI response");
    }

    const parsed = JSON.parse(match[0]);
    return parsed;
  } catch (err) {
    console.error("❌ generateWorkoutPlan() error:", err.message);
    throw new Error("Invalid JSON from AI");
  }
}
