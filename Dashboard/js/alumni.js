import { initFirebase } from "./auth/firebase.js";

const { db } = initFirebase();

const form = document.getElementById("alumniForm");
const statusEl = document.getElementById("status");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  try {
    await db.collection("alumni").add({ ...data, createdAt: new Date() });
    statusEl.textContent = "Thank you! We have received your registration.";
    form.reset();
  } catch (e2) {
    statusEl.textContent = e2.message || "Failed to submit";
  }
});