"use strict";

// All validation returns { valid: bool, message: string }

function validateRegister(body) {
  const { username, email, password } = body;

  if (!username || typeof username !== "string" || !username.trim()) {
    return { valid: false, message: "Username is required." };
  }
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username.trim())) {
    return {
      valid: false,
      message:
        "Username must be 3-20 characters. Letters, numbers, and underscores only.",
    };
  }

  if (!email || typeof email !== "string" || !email.trim()) {
    return { valid: false, message: "Email address is required." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return { valid: false, message: "Enter a valid email address." };
  }

  if (!password || typeof password !== "string") {
    return { valid: false, message: "Password is required." };
  }
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters." };
  }
  if (password.length > 128) {
    return {
      valid: false,
      message: "Password must not exceed 128 characters.",
    };
  }

  return { valid: true };
}

function validateLogin(body) {
  const { username, password } = body;

  if (!username || typeof username !== "string" || !username.trim()) {
    return { valid: false, message: "Username is required." };
  }
  if (!password || typeof password !== "string") {
    return { valid: false, message: "Password is required." };
  }

  return { valid: true };
}

module.exports = { validateRegister, validateLogin };
