"use strict";

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const db = require("../db");
const { validateRegister, validateLogin } = require("../validators");

const router = express.Router();

const SALT_ROUNDS = 12;

// ── Helper: sign a JWT ─────────────────────────────────────
function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// ── Helper: verify a JWT (used in /me route) ───────────────
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }
  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

// ── POST /api/auth/register ────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const check = validateRegister(req.body);
    if (!check.valid) {
      return res.status(400).json({ message: check.message });
    }

    const { username, email, password } = req.body;

    // Check for duplicate username
    if (db.findByUsername(username.trim())) {
      return res
        .status(409)
        .json({ message: "That username is already taken." });
    }

    // Check for duplicate email
    if (db.findByEmail(email.trim())) {
      return res
        .status(409)
        .json({ message: "An account with that email already exists." });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = {
      id: uuidv4(),
      username: username.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    db.createUser(newUser);

    return res.status(201).json({
      message: "Account created successfully.",
    });
  } catch (err) {
    console.error("[register]", err);
    return res
      .status(500)
      .json({ message: "An unexpected error occurred. Please try again." });
  }
});

// ── POST /api/auth/login ───────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const check = validateLogin(req.body);
    if (!check.valid) {
      return res.status(400).json({ message: check.message });
    }

    const { username, password } = req.body;

    const user = db.findByUsername(username.trim());
    if (!user) {
      // Use a generic message to avoid revealing whether the username exists
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    const token = signToken({ id: user.id, username: user.username });

    return res.status(200).json({
      message: "Sign in successful.",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("[login]", err);
    return res
      .status(500)
      .json({ message: "An unexpected error occurred. Please try again." });
  }
});

// ── GET /api/auth/me ───────────────────────────────────────
// Protected route: returns the authenticated user's profile
router.get("/me", verifyToken, (req, res) => {
  const user = db.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  return res.status(200).json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    },
  });
});

module.exports = router;
