require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const prompt = "Explain how AI models work in simple terms.";

    const result = await model.generateContent(prompt);

    // Debugging: Print the full response
    console.log("Full API Response:", JSON.stringify(result, null, 2));

    // ✅ Correct way to extract the response text
    const aiResponse =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response received";

    console.log("Gemini AI Response:", aiResponse);
  } catch (error) {
    console.error("Error testing Gemini API:", error);
  }
}

testGemini();
