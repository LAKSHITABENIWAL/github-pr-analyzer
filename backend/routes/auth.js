const express = require("express");
const axios = require("axios");
const router = express.Router();

// GitHub OAuth credentials
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/auth/github/callback";

// GitHub OAuth Login Route
router.get("/github", (req, res) => {
  const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user:email,repo`;
  res.redirect(githubAuthURL);
});

// GitHub OAuth Callback Route
router.get("/github/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send("No code provided");

  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenResponse.data.access_token;
    req.session.accessToken = accessToken;

    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    req.session.user = userResponse.data;
    res.redirect("http://localhost:3001/dashboard");
  } catch (error) {
    console.error("GitHub OAuth Error:", error.message);
    res.status(500).send("OAuth Error");
  }
});

// Get authenticated user
router.get("/user", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  res.json(req.session.user);
});

// Check Authentication Status
router.get("/status", (req, res) => {
  if (req.session.user) {
    res.json({ authenticated: true, user: req.session.user });
  } else {
    res.json({ authenticated: false });
  }
});

// Fetch user's PRs with filtering and sorting
router.get("/pulls", async (req, res) => {
  if (!req.session.user || !req.session.accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { sort = 'updated', status = 'all', assignee = 'all', dateRange = 'all' } = req.query;

  try {
    // First, get user's repositories
    const reposResponse = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${req.session.accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      params: {
        per_page: 100,
        sort: "updated",
        direction: "desc",
      },
    });

    const repos = reposResponse.data;
    let allPRs = [];

    // Fetch PRs from each repository in parallel
    const prPromises = repos.map(async (repo) => {
      try {
        const prParams = {
          state: status === 'all' ? 'all' : status,
          sort: 'updated',
          direction: 'desc',
          per_page: 100,
        };

        const prsResponse = await axios.get(
          `https://api.github.com/repos/${repo.full_name}/pulls`,
          {
            headers: {
              Authorization: `Bearer ${req.session.accessToken}`,
              Accept: "application/vnd.github.v3+json",
            },
            params: prParams,
          }
        );

        // If assignee filter is set to 'self', filter PRs assigned to the user
        let prs = prsResponse.data;
        if (assignee === 'self') {
          prs = prs.filter(pr => 
            pr.assignees.some(a => a.login === req.session.user.login)
          );
        }

        return prs;
      } catch (error) {
        console.error(`Error fetching PRs for ${repo.full_name}:`, error.message);
        return [];
      }
    });

    // Wait for all PR requests to complete
    const prResults = await Promise.all(prPromises);
    allPRs = prResults.flat();

    // Sort PRs based on the sort parameter
    allPRs.sort((a, b) => {
      switch (sort) {
        case 'created':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'comments':
          return b.comments - a.comments;
        case 'updated':
        default:
          return new Date(b.updated_at) - new Date(a.updated_at);
      }
    });

    // Apply date range filter if specified
    if (dateRange !== 'all') {
      const now = new Date();
      let cutoffDate;

      switch (dateRange) {
        case 'today':
          cutoffDate = new Date(now.setDate(now.getDate() - 1));
          break;
        case 'week':
          cutoffDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'year':
          cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
      }

      if (cutoffDate) {
        allPRs = allPRs.filter(pr => new Date(pr.created_at) >= cutoffDate);
      }
    }

    // Limit to most recent 100 PRs
    allPRs = allPRs.slice(0, 100);

    res.json(allPRs);
  } catch (error) {
    console.error("Error fetching PRs:", error.message);
    res.status(500).json({
      error: "Failed to fetch pull requests",
      message: error.message,
    });
  }
});

// Logout route
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ error: "Failed to logout" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

module.exports = router;