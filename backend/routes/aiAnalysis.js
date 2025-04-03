const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to analyze PR with Gemini
async function analyzePRWithGemini(prData) {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    // Prepare the prompt
    const prompt = `
    Please analyze this GitHub Pull Request and provide a detailed review:

    Title: ${prData.title}
    Description: ${prData.body || 'No description provided'}
    Files Changed: ${prData.changed_files}
    Additions: ${prData.additions}
    Deletions: ${prData.deletions}

    Please provide a structured analysis including:
    1. Summary of Changes:
       - Brief overview of what this PR does
       - Main components affected

    2. Code Impact Analysis:
       - Scope of changes
       - Potential risks
       - Areas needing attention

    3. Best Practices Review:
       - Code quality assessment
       - Adherence to standards
       - Suggestions for improvement

    4. Security Considerations:
       - Potential security implications
       - Data handling concerns
       - Authentication/authorization impacts

    5. Testing Recommendations:
       - Areas that should be tested
       - Suggested test cases
       - Edge cases to consider

    6. Final Recommendation:
       - Overall assessment
       - Whether to approve or request changes
       - Specific points to address before merging

    Please format the response in clear sections with bullet points where appropriate.
    `;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing PR with Gemini:', error);
    if (error.message && error.message.includes('not found')) {
      throw new Error('AI model configuration error. Please check API key and model availability.');
    }
    throw error;
  }
}

// Route to analyze a specific PR
router.post('/analyze-pr', async (req, res) => {
  if (!req.session.user || !req.session.accessToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { owner, repo, pull_number } = req.body;

  if (!owner || !repo || !pull_number) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Fetch detailed PR data from GitHub
    const prResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${pull_number}`,
      {
        headers: {
          Authorization: `Bearer ${req.session.accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!prResponse.ok) {
      throw new Error('Failed to fetch PR details from GitHub');
    }

    const prData = await prResponse.json();

    // Get AI analysis
    const analysis = await analyzePRWithGemini(prData);

    res.json({
      success: true,
      analysis,
      pr: {
        title: prData.title,
        number: prData.number,
        html_url: prData.html_url,
      },
    });
  } catch (error) {
    console.error('Error in PR analysis:', error);
    res.status(500).json({
      error: 'Failed to analyze PR',
      message: error.message || 'An unexpected error occurred',
    });
  }
});

// Route to get analysis history
router.get('/analysis-history', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Here you would typically fetch from a database
    // For now, we'll return an empty array
    res.json([]);
  } catch (error) {
    console.error('Error fetching analysis history:', error);
    res.status(500).json({
      error: 'Failed to fetch analysis history',
      message: error.message,
    });
  }
});

module.exports = router; 