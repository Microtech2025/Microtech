function showLoading(show = true) {
  const loader = document.getElementById("loadingOverlay");
  loader.style.display = show ? "flex" : "none";
}

// ==== Firebase Setup ====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  getDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase config
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

// ===== FORM TOGGLE =====
document.addEventListener('DOMContentLoaded', () => {
  const toggleLinks = document.querySelectorAll('.toggle-link');
  const loginFormBox = document.querySelector('.form-box.login');
  const registerFormBox = document.querySelector('.form-box.register');
  const closeButton = document.querySelector('.close-btn-modal');
  const regRole = document.getElementById("regRole");
  const adminSecret = document.getElementById("adminSecret");

  // Toggle login/register
  toggleLinks.forEach(link => {
    link.addEventListener('click', () => {
      const target = link.getAttribute('data-target');
      if (target === 'register') {
        loginFormBox.classList.remove('active');
        registerFormBox.classList.add('active');
      } else {
        registerFormBox.classList.remove('active');
        loginFormBox.classList.add('active');
      }
    });
  });

  // Show admin code field only if admin is selected
  regRole.addEventListener("change", () => {
    adminSecret.style.display = regRole.value === "admin" ? "flex" : "none";
  });

  // Close to home
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      window.location.href = 'index.php';
    });
  }
});


document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const number = document.getElementById("regNumber").value.trim();
  const whatsapp = document.getElementById("regWhatsApp").value.trim();
  const age = document.getElementById("regAge").value.trim();
  const address = document.getElementById("regAddress").value.trim();
  const district = document.getElementById("regDistrict").value.trim();
  const state = document.getElementById("regState").value.trim();
  const country = document.getElementById("regCountry").value.trim();
  const zip = document.getElementById("regZip").value.trim();
  const role = document.getElementById("regRole").value;
  const adminCode = document.getElementById("adminCode")?.value?.trim() || "";

  if (role === "admin" && adminCode !== "adminjenny22*") {
    alert("❌ Invalid admin code.");
    return;
  }

  try {
    showLoading(true);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      number,
      whatsapp,
      age,
      address,
      district,
      state,
      country,
      zip,
      role,
      createdAt: new Date()
    });

    alert("✅ Registered successfully. Please login.");
    document.querySelector('.form-box.register').classList.remove('active');
    document.querySelector('.form-box.login').classList.add('active');
  } catch (error) {
    alert("❌ " + error.message);
  } finally {
    showLoading(false);
  }
});


// ===== LOGIN =====
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const selectedRole = document.getElementById("loginRole").value;

  try {
    showLoading(true);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data();

    if (!userData) {
      alert("❌ No user data found.");
      return;
    }

    if (userData.role !== selectedRole) {
      alert("❌ Role mismatch. Please select the correct role.");
      return;
    }

    // Redirect by role
    switch (userData.role) {
      case "gamaabacus":
        window.location.href = "Dashboard/gama-dashboard.php";
        break;
      case "teacher":
        window.location.href = "Dashboard/teacher-dashboard.php";
        break;
      case "admin":
        window.location.href = "Dashboard/admin-dashboard.php";
        break;
      case "student":
        window.location.href = "Dashboard/student-dashboard.php";
        break;
      default:
        alert("❌ Unknown role.");
    }

  } catch (error) {
    alert("❌ " + error.message);
  } finally {
    showLoading(false);
  }
});
