async function getHelp() {
  let input = document.getElementById("problem").value;
  let responseBox = document.getElementById("response");

  // ❌ Empty input check
  if (!input.trim()) {
    responseBox.innerHTML = "⚠️ Please enter your emergency situation.";
    return;
  }

  // ✅ SHOW LOADING UI
  responseBox.innerHTML = `
    <div class="loader-box">
      <div class="spinner"></div>
      <p>Analyzing your situation...</p>
      <small>Please wait a moment</small>
    </div>
  `;

  try {
    // ✅ IMPORTANT FIX (NO localhost)
    let res = await fetch("/get-help", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ problem: input })
    });

    let data = await res.json();

    console.log("API:", data);

    // ✅ Extract response safely
    let text =
      data.reply ||
      data.message ||
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No response from AI";

    // ❌ Handle API error
    if (text.toLowerCase().includes("error")) {
      responseBox.innerHTML = "⚠️ AI error. Try again.";
      return;
    }

    // ✅ Convert response into clean bullet points
    let points = text
      .replace(/\*\*/g, "")
      .split(/\d+\.|\n|-/)
      .filter(item => item.trim() !== "")
      .map(item => `<li>${item.trim()}</li>`)
      .join("");

    responseBox.innerHTML = `<ul>${points}</ul>`;

  } catch (error) {
    console.log(error);
    responseBox.innerHTML = "⚠️ Server error. Check backend.";
  }
}


// 🎤 OPTIONAL: Voice input feature (basic)
function startVoice() {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Voice not supported in this browser");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";

  recognition.start();

  recognition.onresult = function (event) {
    const text = event.results[0][0].transcript;
    document.getElementById("problem").value = text;
  };
}
