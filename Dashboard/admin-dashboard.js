import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

  const firebaseConfig = {
    apiKey: "AIzaSyAD_3jmeamJ2QyJk2OPi-ucB2DDQSUCPPw",
    authDomain: "microtech-8e188.firebaseapp.com",
    projectId: "microtech-8e188",
    storageBucket: "microtech-8e188.appspot.com",
    messagingSenderId: "401753262680",
    appId: "1:401753262680:web:fb49631cc511f2457e982d",
    measurementId: "G-JHHD1M22CW"
  };

  // Initialize Firebase App
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  // ✅ Logout function
  window.logout = function () {
    signOut(auth)
      .then(() => {
        window.location.href = "../index.html"; // or login page
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        alert("Failed to logout. Please try again.");
      });
  };

  // Get both theme toggle buttons and icons
  const toggleBtn = document.getElementById("themeToggle");
  const icon = document.getElementById("themeIcon");
  const toggleBtnMobile = document.getElementById("themeToggleMobile");
  const iconMobile = document.getElementById("themeIconMobile");

  function applyTheme(theme) {
    document.body.classList.toggle("dark-theme", theme === "dark");
    if (icon) icon.className = theme === "dark" ? "bi bi-brightness-high-fill" : "bi bi-moon-stars-fill";
    if (iconMobile) iconMobile.className = theme === "dark" ? "bi bi-brightness-high-fill" : "bi bi-moon-stars-fill";
  }

  function toggleTheme() {
    const isDark = document.body.classList.contains("dark-theme");
    const newTheme = isDark ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    applyTheme(savedTheme);
  });

  if (toggleBtn) toggleBtn.addEventListener("click", toggleTheme);
  if (toggleBtnMobile) toggleBtnMobile.addEventListener("click", toggleTheme);

  // Section switching logic for sidebar navigation
  document.querySelectorAll('.sidebar .nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      // Remove active from all links
      document.querySelectorAll('.sidebar .nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      // Hide all sections
      document.querySelectorAll('.section-window').forEach(sec => sec.style.display = 'none');
      // Show the selected section
      const sectionId = this.getAttribute('data-section');
      const section = document.getElementById(sectionId);
      if (section) section.style.display = '';
    });
  });