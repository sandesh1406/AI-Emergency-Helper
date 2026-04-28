async function getHelp() {
  let input = document.getElementById("problem").value;
  let responseBox = document.getElementById("response");

  // ✅ Validation
  if (!input.trim()) {
    responseBox.innerHTML = "⚠️ Please enter your problem";
    return;
  }

  // ✅ LOADING UI
  responseBox.innerHTML = `
    <div class="loader-box">
      <div class="spinner"></div>
      <p>Analyzing your situation...</p>
      <small>Please wait a moment</small>
    </div>
  `;

  try {
    // ✅ IMPORTANT: use relative path (works on Render)
    let res = await fetch("/get-help", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ problem: input })
    });

    let data = await res.json();
    console.log("API:", data);

    let text =
      data.reply ||
      data.message ||
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "";

    // ❌ Handle errors properly
    if (!text || text.toLowerCase().includes("error")) {
      responseBox.innerHTML = "⚠️ AI error. Try again.";
      return;
    }

    // ✅ Convert to clean bullet points
    let points = text
      .replace(/\*\*/g, "")
      .split(/\d+\.|\n|-/)
      .filter(item => item.trim() !== "")
      .map(item => `<li>${item.trim()}</li>`)
      .join("");

    responseBox.innerHTML = `<ul>${points}</ul>`;

  } catch (error) {
    console.error("FRONTEND ERROR:", error);
    responseBox.innerHTML = "⚠️ Server error. Check backend.";
  }
}
