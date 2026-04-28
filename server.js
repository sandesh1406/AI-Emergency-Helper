const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // if your frontend is in /public

// ✅ Use environment variable for API key
const API_KEY = process.env.GEMINI_API_KEY;

// ✅ API Route
app.post("/get-help", async (req, res) => {
  try {
    const userInput = req.body.problem;

    if (!userInput) {
      return res.json({ reply: "⚠️ Please enter a problem" });
    }

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
                  text: `Give emergency steps for "${userInput}" in 5 short numbered points. No paragraph.`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("API RESPONSE:", JSON.stringify(data, null, 2));

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.json({
        reply: "⚠️ AI did not return proper response"
      });
    }

    res.json({ reply });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.json({
      reply: "⚠️ Server error. Check backend logs."
    });
  }
});

// ✅ IMPORTANT: dynamic port for Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});