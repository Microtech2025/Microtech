import { initFirebase } from "./firebase.js";

const { auth, db } = initFirebase();

const loginForm = document.getElementById("loginForm");
const errorEl = document.getElementById("error");
const themeToggle = document.getElementById("themeToggle");

applySavedTheme();

themeToggle?.addEventListener("click", () => {
  const isLight = document.documentElement.classList.toggle("theme-light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorEl.textContent = "";
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  try {
    const cred = await auth.signInWithEmailAndPassword(email, password);
    const uid = cred.user.uid;
    const doc = await db.collection("users").doc(uid).get();
    if (!doc.exists) {
      errorEl.textContent = "No user role assigned. Contact administrator.";
      await auth.signOut();
      return;
    }
    const role = doc.data().role;
    localStorage.setItem("userRole", role);
    localStorage.setItem("userEmail", email);
    window.location.href = "../admin-dashboard.html";
  } catch (err) {
    console.error(err);
    errorEl.textContent = err.message || "Sign-in failed";
  }
});

function applySavedTheme() {
  const saved = localStorage.getItem("theme") || "dark";
  document.documentElement.classList.toggle("theme-light", saved === "light");
}