"use strict";

const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "users.json");

// Initialise the file if it does not exist
function init() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [] }, null, 2), "utf-8");
  }
}

function readAll() {
  init();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeAll(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function findByUsername(username) {
  const { users } = readAll();
  return (
    users.find((u) => u.username.toLowerCase() === username.toLowerCase()) ||
    null
  );
}

function findByEmail(email) {
  const { users } = readAll();
  return (
    users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null
  );
}

function findById(id) {
  const { users } = readAll();
  return users.find((u) => u.id === id) || null;
}

function createUser(user) {
  const db = readAll();
  db.users.push(user);
  writeAll(db);
  return user;
}

module.exports = { findByUsername, findByEmail, findById, createUser };
