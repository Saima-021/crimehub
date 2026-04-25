const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  try {

    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "tinyllama",
      prompt: `
You are a Cybercrime Awareness Assistant for a Cyber Crime Portal.

Rules:
- Only answer about cyber security, phishing, scams, hacking, online fraud.
- Reply in maximum 2–3 short sentences.
- Use simple language.
- Do NOT write long explanations.

Question:
${userMessage}

Answer:
`,
      stream: false,
      options: {
        temperature: 0.3,
        num_predict: 60
      }
    });

    const reply = response.data.response.trim();

    res.json({ reply });

  } catch (error) {

    console.error("AI chatbot error:", error.message);

    res.status(500).json({
      error: "AI service error"
    });

  }
});

module.exports = router;