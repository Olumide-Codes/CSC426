"use strict";

// ── Config ─────────────────────────────────────────────────
// Change this to your deployed Render URL when you go live.
// During local development, use http://localhost:5000
const API_BASE = "http://localhost:5000/api";

// ── DOM references ─────────────────────────────────────────
const tabLogin = document.getElementById("tab-login");
const tabRegister = document.getElementById("tab-register");
const tabIndicator = document.getElementById("tab-indicator");
const formLogin = document.getElementById("form-login");
const formRegister = document.getElementById("form-register");
const msgBanner = document.getElementById("message-banner");
const msgText = document.getElementById("message-text");
const msgIcon = document.getElementById("message-icon");

// Login fields
const loginUsername = document.getElementById("login-username");
const loginPassword = document.getElementById("login-password");

// Register fields
const regUsername = document.getElementById("reg-username");
const regEmail = document.getElementById("reg-email");
const regPassword = document.getElementById("reg-password");
const regConfirm = document.getElementById("reg-confirm");

// Strength meter
const strengthFill = document.getElementById("strength-fill");
const strengthLabel = document.getElementById("strength-label");

// ── Tab switching ──────────────────────────────────────────
function switchTab(target) {
  const isLogin = target === "login";

  tabLogin.classList.toggle("active", isLogin);
  tabLogin.setAttribute("aria-selected", isLogin);

  tabRegister.classList.toggle("active", !isLogin);
  tabRegister.setAttribute("aria-selected", !isLogin);

  tabIndicator.classList.toggle("right", !isLogin);

  formLogin.classList.toggle("active", isLogin);
  formRegister.classList.toggle("active", !isLogin);

  hideMessage();
  clearAllErrors();
}

tabLogin.addEventListener("click", () => switchTab("login"));
tabRegister.addEventListener("click", () => switchTab("register"));

// ── Message banner ─────────────────────────────────────────
const CHECK_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const CROSS_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

function showMessage(type, text) {
  msgBanner.className = `message-banner ${type}`;
  msgIcon.innerHTML = type === "success" ? CHECK_SVG : CROSS_SVG;
  msgText.textContent = text;
}

function hideMessage() {
  msgBanner.className = "message-banner hidden";
  msgText.textContent = "";
}

// ── Field error helpers ────────────────────────────────────
function setError(inputEl, errorId, message) {
  const errEl = document.getElementById(errorId);
  if (errEl) errEl.textContent = message;
  inputEl.classList.remove("valid");
  inputEl.classList.add("invalid");
}

function clearError(inputEl, errorId) {
  const errEl = document.getElementById(errorId);
  if (errEl) errEl.textContent = "";
  inputEl.classList.remove("invalid");
}

function setValid(inputEl, errorId) {
  clearError(inputEl, errorId);
  inputEl.classList.add("valid");
}

function clearAllErrors() {
  [
    loginUsername,
    loginPassword,
    regUsername,
    regEmail,
    regPassword,
    regConfirm,
  ].forEach((el) => {
    el.classList.remove("valid", "invalid");
  });
  [
    "err-login-username",
    "err-login-password",
    "err-reg-username",
    "err-reg-email",
    "err-reg-password",
    "err-reg-confirm",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
  });
  resetStrength();
}

// ── Validation rules ───────────────────────────────────────
const rules = {
  username: {
    test: (v) => /^[a-zA-Z0-9_]{3,20}$/.test(v),
    message:
      "Username must be 3-20 characters. Letters, numbers, and underscores only.",
  },
  email: {
    test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    message: "Enter a valid email address.",
  },
  password: {
    test: (v) => v.length >= 8,
    message: "Password must be at least 8 characters.",
  },
};

function validateField(inputEl, ruleName, errorId) {
  const v = inputEl.value.trim();
  if (!v) {
    setError(inputEl, errorId, "This field is required.");
    return false;
  }
  if (ruleName && !rules[ruleName].test(v)) {
    setError(inputEl, errorId, rules[ruleName].message);
    return false;
  }
  setValid(inputEl, errorId);
  return true;
}

// ── Password strength ──────────────────────────────────────
const strengthLevels = [
  { label: "Weak", cls: "s1" },
  { label: "Fair", cls: "s2" },
  { label: "Good", cls: "s3" },
  { label: "Strong", cls: "s4" },
];

function calcStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  // map 0-5 to 0-3
  return Math.min(3, Math.floor(score / 1.25));
}

function updateStrength(pw) {
  if (!pw) {
    resetStrength();
    return;
  }
  const idx = calcStrength(pw);
  const level = strengthLevels[idx];
  strengthFill.className = `strength-fill ${level.cls}`;
  strengthLabel.textContent = level.label;
  strengthLabel.style.color = [
    "var(--danger)",
    "var(--warn)",
    "#84cc16",
    "var(--success)",
  ][idx];
}

function resetStrength() {
  strengthFill.className = "strength-fill";
  strengthLabel.textContent = "Strength";
  strengthLabel.style.color = "";
}

regPassword.addEventListener("input", () => updateStrength(regPassword.value));

// ── Live validation on blur ────────────────────────────────
loginUsername.addEventListener("blur", () =>
  validateField(loginUsername, null, "err-login-username"),
);
loginPassword.addEventListener("blur", () =>
  validateField(loginPassword, null, "err-login-password"),
);
regUsername.addEventListener("blur", () =>
  validateField(regUsername, "username", "err-reg-username"),
);
regEmail.addEventListener("blur", () =>
  validateField(regEmail, "email", "err-reg-email"),
);
regPassword.addEventListener("blur", () =>
  validateField(regPassword, "password", "err-reg-password"),
);
regConfirm.addEventListener("blur", () => {
  if (!regConfirm.value) {
    setError(regConfirm, "err-reg-confirm", "Please confirm your password.");
    return;
  }
  if (regConfirm.value !== regPassword.value) {
    setError(regConfirm, "err-reg-confirm", "Passwords do not match.");
  } else {
    setValid(regConfirm, "err-reg-confirm");
  }
});

// Clear error on input
[
  loginUsername,
  loginPassword,
  regUsername,
  regEmail,
  regPassword,
  regConfirm,
].forEach((el) => {
  el.addEventListener("input", () => el.classList.remove("invalid"));
});

// ── Password visibility toggles ────────────────────────────
function setupToggle(toggleId, inputEl) {
  const btn = document.getElementById(toggleId);
  btn.addEventListener("click", () => {
    const isHidden = inputEl.type === "password";
    inputEl.type = isHidden ? "text" : "password";
    btn.setAttribute(
      "aria-label",
      isHidden ? "Hide password" : "Show password",
    );
    btn
      .querySelectorAll(".eye-open")
      .forEach((el) => el.classList.toggle("hidden", !isHidden));
    btn
      .querySelectorAll(".eye-closed")
      .forEach((el) => el.classList.toggle("hidden", isHidden));
  });
}

setupToggle("toggle-login-pw", loginPassword);
setupToggle("toggle-reg-pw", regPassword);

// ── Loading state ──────────────────────────────────────────
function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  const label = btn.querySelector(".btn-label");
  const spinner = btn.querySelector(".btn-spinner");
  btn.disabled = loading;
  label.classList.toggle("hidden", loading);
  spinner.classList.toggle("hidden", !loading);
}

// ── API helpers ────────────────────────────────────────────
async function apiPost(endpoint, body) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, data };
}

// ── Token storage ──────────────────────────────────────────
function saveSession(token, user) {
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("user", JSON.stringify(user));
}

function clearSession() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
}

function getSession() {
  const token = sessionStorage.getItem("token");
  const user = sessionStorage.getItem("user");
  return token ? { token, user: JSON.parse(user) } : null;
}

// ── Dashboard ──────────────────────────────────────────────
function showDashboard(user) {
  // Hide the tab bar and both forms
  document.querySelector(".tab-bar").style.display = "none";
  formLogin.classList.remove("active");
  formRegister.classList.remove("active");
  hideMessage();

  // Build dashboard HTML
  const dash = document.createElement("div");
  dash.className = "dashboard active";
  dash.id = "dashboard";
  dash.innerHTML = `
    <div class="dash-header">
      <h2>Welcome back, ${escHtml(user.username)}</h2>
      <p>You are now signed in to your account.</p>
    </div>
    <div class="dash-card">
      <h3>Account details</h3>
      <div class="dash-info-row"><span>Username</span><span>${escHtml(user.username)}</span></div>
      <div class="dash-info-row"><span>Email</span><span>${escHtml(user.email)}</span></div>
      <div class="dash-info-row"><span>Account created</span><span>${formatDate(user.createdAt)}</span></div>
      <div class="dash-info-row"><span>Session token</span><span>JWT &bull; Active</span></div>
    </div>
    <button class="btn-signout" id="btn-signout">Sign out</button>
  `;

  document.querySelector(".form-container").appendChild(dash);
  document.getElementById("btn-signout").addEventListener("click", signOut);
}

function signOut() {
  clearSession();
  const dash = document.getElementById("dashboard");
  if (dash) dash.remove();
  document.querySelector(".tab-bar").style.display = "";
  switchTab("login");
  formLogin.reset();
  clearAllErrors();
}

function escHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatDate(iso) {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ── Login submission ───────────────────────────────────────
formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideMessage();

  const usernameOk = validateField(loginUsername, null, "err-login-username");
  const passwordOk = validateField(loginPassword, null, "err-login-password");
  if (!usernameOk || !passwordOk) return;

  setLoading("btn-login", true);

  try {
    const { ok, data } = await apiPost("/auth/login", {
      username: loginUsername.value.trim(),
      password: loginPassword.value,
    });

    if (ok) {
      saveSession(data.token, data.user);
      showMessage("success", "Sign in successful. Redirecting...");
      setTimeout(() => showDashboard(data.user), 800);
    } else {
      showMessage("error", data.message || "Invalid username or password.");
    }
  } catch {
    showMessage("error", "Unable to reach the server. Please try again.");
  } finally {
    setLoading("btn-login", false);
  }
});

// ── Register submission ────────────────────────────────────
formRegister.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideMessage();

  const usernameOk = validateField(regUsername, "username", "err-reg-username");
  const emailOk = validateField(regEmail, "email", "err-reg-email");
  const passwordOk = validateField(regPassword, "password", "err-reg-password");

  let confirmOk = true;
  if (!regConfirm.value) {
    setError(regConfirm, "err-reg-confirm", "Please confirm your password.");
    confirmOk = false;
  } else if (regConfirm.value !== regPassword.value) {
    setError(regConfirm, "err-reg-confirm", "Passwords do not match.");
    confirmOk = false;
  } else {
    setValid(regConfirm, "err-reg-confirm");
  }

  if (!usernameOk || !emailOk || !passwordOk || !confirmOk) return;

  setLoading("btn-register", true);

  try {
    const { ok, data } = await apiPost("/auth/register", {
      username: regUsername.value.trim(),
      email: regEmail.value.trim(),
      password: regPassword.value,
    });

    if (ok) {
      showMessage(
        "success",
        "Account created successfully. You can now sign in.",
      );
      formRegister.reset();
      clearAllErrors();
      setTimeout(() => switchTab("login"), 1500);
    } else {
      showMessage(
        "error",
        data.message || "Registration failed. Please try again.",
      );
    }
  } catch {
    showMessage("error", "Unable to reach the server. Please try again.");
  } finally {
    setLoading("btn-register", false);
  }
});

// ── Reset buttons ──────────────────────────────────────────
document.getElementById("btn-login-reset").addEventListener("click", () => {
  formLogin.reset();
  clearAllErrors();
  hideMessage();
});

document.getElementById("btn-register-reset").addEventListener("click", () => {
  formRegister.reset();
  clearAllErrors();
  hideMessage();
  resetStrength();
});

// ── Restore session on page load ───────────────────────────
(function init() {
  const session = getSession();
  if (session) {
    showDashboard(session.user);
  }
})();
