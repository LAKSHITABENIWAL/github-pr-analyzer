const express = require("express");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const aiAnalysisRoutes = require("./routes/aiAnalysis");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3001", // Allow requests from the frontend
    credentials: true, // Allow cookies to be sent
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
