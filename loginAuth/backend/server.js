"use strict";

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────

// CORS: allow the frontend to talk to this server.
// During development this allows all origins.
// On production, replace '*' with your deployed frontend URL.
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Parse JSON request bodies
app.use(express.json({ limit: "10kb" }));

// ── Routes ─────────────────────────────────────────────────
app.use("/api/auth", authRoutes);

// Health check — useful for Render's uptime checks
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("[server error]", err);
  res.status(500).json({ message: "An unexpected server error occurred." });
});

// ── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
