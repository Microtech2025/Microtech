import { initFirebase } from "./auth/firebase.js";

const { db } = initFirebase();
const form = document.getElementById('captForm');
const statusEl = document.getElementById('status');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  try {
    await db.collection('capt_applications').add({ ...data, createdAt: new Date() });
    statusEl.textContent = 'Submitted successfully!';
    form.reset();
  } catch (e2) {
    statusEl.textContent = e2.message || 'Submission failed';
  }
});