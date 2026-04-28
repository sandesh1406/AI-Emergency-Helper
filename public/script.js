const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Serve frontend
app.use(express.static("public"));

const API_KEY = process.env.GEMINI_API_KEY;

app.post("/get-help", async (req, res) => {
  try {
    const userInput = req.body.problem;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Give emergency steps for "${userInput}" in 5 short numbered points.`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    res.json({ reply: reply || "⚠️ No response" });

  } catch (err) {
    res.json({ reply: "⚠️ Server error" });
  }
});

// ✅ Render port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
