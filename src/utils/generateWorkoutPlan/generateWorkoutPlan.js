export async function generateWorkoutPlan(profile) {
  try {
    const res = await fetch("http://localhost:4000/generate-workout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ profile }),
    });

    const rawText = await res.text(); // use .text() instead of .json()
    console.log("🔹 RAW AI RESPONSE:", rawText); // 👈 LOGGING RAW AI RESPONSE HERE

    // Optional: quick check for 500 error
    if (!res.ok) {
      console.error("❌ Server error:", res.status);
      throw new Error(`Server error: ${res.status}`);
    }

    // Try to find first JSON block inside the response
    const match = rawText.match(/\{[\s\S]*\}/); // naive but effective
    if (!match) {
      throw new Error("No JSON found in AI response");
    }

    const jsonOnly = match[0];
    const parsed = JSON.parse(jsonOnly);

    return parsed;
  } catch (err) {
    console.error("❌ generateWorkoutPlan() error:", err.message);
    throw new Error("Invalid JSON from AI");
  }
}
