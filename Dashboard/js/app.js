// Shared app bootstrap and utilities
// Requires: Firebase compat SDKs loaded in page and ../auth/firebase.js

import { initFirebase, getFirebase } from "../auth/firebase.js";

let currentUser = null;
let currentUserRole = null;

export async function initApp(options = {}) {
  const { auth, db } = initFirebase();

  applySavedTheme();
  setupThemeToggle();
  setupSidebar();

  const requiredRoles = options.requiredRoles || ["Admin", "Counselor"]; // default protected

  await new Promise((resolve) => {
    auth.onAuthStateChanged(async (user) => {
      currentUser = user;
      if (!user) {
        if (requiredRoles && requiredRoles.length) {
          redirectToLogin();
          return resolve();
        }
        return resolve();
      }
      try {
        const userDoc = await db.collection("users").doc(user.uid).get();
        currentUserRole = userDoc.exists ? userDoc.data().role : null;
        localStorage.setItem("userRole", currentUserRole || "");
        localStorage.setItem("userEmail", user.email || "");
        if (requiredRoles && requiredRoles.length && !requiredRoles.includes(currentUserRole)) {
          alert("Access denied. Your role does not have permission to view this page.");
          redirectToLogin();
        }
      } catch (err) {
        console.error("Failed to load user role", err);
      } finally {
        resolve();
      }
    });
  });
}

export function getCurrentUser() { return currentUser; }
export function getCurrentUserRole() { return currentUserRole || localStorage.getItem("userRole"); }

function redirectToLogin() {
  window.location.href = "./auth/auth.html";
}

function applySavedTheme() {
  const saved = localStorage.getItem("theme") || "dark";
  document.documentElement.classList.toggle("theme-light", saved === "light");
}

function setupThemeToggle() {
  const toggle = document.querySelector("#themeToggle");
  if (!toggle) return;
  toggle.addEventListener("click", () => {
    const isLight = document.documentElement.classList.toggle("theme-light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
}

function setupSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const btn = document.querySelector("#sidebarToggle");
  if (!sidebar || !btn) return;
  btn.addEventListener("click", () => sidebar.classList.toggle("open"));
}

export function formatCurrency(value, currency = "INR") {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(amount);
}

export function toDateOnlyString(date) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toISOString().slice(0, 10);
}

export function exportToCSV(filename, rows) {
  const csv = rows.map((r) => r.map((v) => `"${(v ?? "").toString().replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function getDivisionLabel(key) {
  const map = { capt: "CAPT", lbs: "LBS", gama: "Gama Abacus", micro: "Micro Computers", other: "Other" };
  return map[key] || key;
}

export async function ensureRole(requiredRoles) {
  if (!requiredRoles || !requiredRoles.length) return true;
  const role = getCurrentUserRole();
  if (!role || !requiredRoles.includes(role)) {
    alert("Insufficient permissions.");
    redirectToLogin();
    return false;
  }
  return true;
}

export function getDb() { return getFirebase().db; }
export function getAuth() { return getFirebase().auth; }
export function getStorage() { return getFirebase().storage; }