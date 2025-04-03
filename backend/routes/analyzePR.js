const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Import the GoogleGenerativeAI class
require("dotenv").config();

const router = express.Router();

// Initialize Gemini AI with the API key from the environment variables
const genAI = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

// PR Analysis Route
router.post("/analyze-pr", async (req, res) => {
  try {
    const { pr_description } = req.body;

    // Validate the input
    if (!pr_description) {
      return res.status(400).json({ error: "PR description is required" });
    }

    // Call Gemini AI model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(pr_description);
    const response = await result.response;

    // Extract AI-generated feedback
    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received";

    res.json({ ai_feedback: text });
  } catch (error) {
    console.error("Error analyzing PR:", error.message);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("token"); // Clear the authentication token
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
