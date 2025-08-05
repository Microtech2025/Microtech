// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase config (same as in your auth.js)
const firebaseConfig = {
  apiKey: "AIzaSyAD_3jmeamJ2QyJk2OPi-ucB2DDQSUCPPw",
  authDomain: "microtech-8e188.firebaseapp.com",
  projectId: "microtech-8e188",
  storageBucket: "microtech-8e188.firebasestorage.app",
  messagingSenderId: "401753262680",
  appId: "1:401753262680:web:fb49631cc511f2457e982d",
  measurementId: "G-JHHD1M22CW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "teacher-dashboard.html"; // Adjust path based on folder structure
  });

// DOM Elements
const nameField = document.getElementById("teacherName");
const emailField = document.getElementById("teacherEmail");
const phoneField = document.getElementById("teacherPhone");
const logoutBtn = document.getElementById("logoutBtn");

// Load Profile Data
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      if (data.role !== "teacher") {
        alert("Unauthorized access. Redirecting...");
        window.location.href = "../auth.html";
      }

      nameField.textContent = data.name || "-";
      emailField.textContent = data.email || "-";
      phoneField.textContent = data.number || "-";
    } else {
      alert("No user data found.");
    }
  } else {
    window.location.href = "../auth.html";
  }
});

// Logout
logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "../auth.html";
  });
});
