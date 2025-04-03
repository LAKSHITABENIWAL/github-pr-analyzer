const express = require("express");
const cors = require("cors");
const session = require("express-session");
const dotenv = require("dotenv");
require("dotenv").config();
const path = require("path");

const authRoutes = require("./routes/auth");
const aiAnalysisRoutes = require("./routes/aiAnalysis");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://lakshitabeniwal.github.io'  // Your specific GitHub Pages URL
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(
  session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// Routes
app.use("/auth", authRoutes);
app.use("/ai", aiAnalysisRoutes);

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
