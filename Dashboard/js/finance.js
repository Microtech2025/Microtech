import { db } from '../firebase.js';
import { collection, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Existing loadStats() stays as is

// Handle revenue form submission
const revenueForm = document.getElementById('revenueForm');
if (revenueForm) {
  revenueForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const division = document.getElementById('divisionSelect').value;
    const amount = parseFloat(document.getElementById('amountInput').value);

    if (!division || isNaN(amount) || amount <= 0) {
      alert("Please select a division and enter a valid amount.");
      return;
    }

    try {
      await addDoc(collection(db, "revenue"), {
        division,
        amount,
        date: serverTimestamp()
      });
      alert("Revenue added successfully!");

      revenueForm.reset();
      loadStats(); // refresh totals automatically
    } catch (error) {
      console.error("Error adding revenue:", error);
    }
  });
}
