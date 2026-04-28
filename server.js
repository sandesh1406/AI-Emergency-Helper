require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/get-help', async (req, res) => {
    try {
        const userEmergency = req.body.emergency;
        if (!userEmergency) {
            return res.status(400).json({ error: "Please describe the emergency." });
        }
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = "Give short emergency safety steps for: " + userEmergency;
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        res.json({ advice: responseText });
    } catch (error) {
        console.error("Error fetching from Gemini API:", error);
        const fallbackResponse = "Stay calm, call emergency services, move to safe place, help others, wait for help";
        res.json({ advice: fallbackResponse });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
