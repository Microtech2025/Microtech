<?php
// You can add PHP session/auth logic here if needed
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MicroTech Admin Dashboard</title>
  <link rel="stylesheet" href="admin-dashboard.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" />
</head>
<body>
  <aside class="sidebar">
    <div class="brand">
      <i class="bi bi-grid-1x2-fill"></i> <span>MicroTech Admin</span>
    </div>
    <nav>
      <a href="admin-dashboard.php"><i class="bi bi-bar-chart-fill"></i> <span>Analytics</span></a>
      <a href="students.php"><i class="bi bi-people-fill"></i> <span>Student Management</span></a>
      <a href="staff.php" class="active"><i class="bi bi-person-badge-fill"></i> <span>Staff Management</span></a>
      <a href="fees.php"><i class="bi bi-cash-coin"></i> <span>Fees</span></a>
      <!-- Add more as needed -->
    </nav>
    <div class="bottom mt-auto">
      <button class="theme-toggle" id="themeToggle" title="Toggle Theme">
        <i id="themeIcon" class="bi bi-moon-stars-fill"></i>
        <span>Theme</span>
      </button>
      <a class="profile" href="profile-admin.php">
        <i class="bi bi-person-circle fs-4"></i>
        <span>Profile</span>
      </a>
      <a class="profile" href="#" onclick="logout()">
        <i class="bi bi-box-arrow-right"></i>
        <span>Logout</span>
      </a>
    </div>
  </aside>
  <main class="main-content">
    <h1>Staff Management</h1>
    <!-- Teacher & Counselor Management -->
    <div class="card" id="staff-management">
      <div class="card-title">👥 Teacher & Counselor Management</div>
      <div style="margin-bottom:1rem;">
        <button class="btn" onclick="filterStaff('All')">All</button>
        <button class="btn" onclick="filterStaff('Teacher')">Teachers</button>
        <button class="btn" onclick="filterStaff('Counselor')">Counselors</button>
      </div>
      <div style="display:flex;gap:1.5rem;flex-wrap:wrap;">
        <div>
          <div style="font-weight:600;">Total Teachers</div>
          <div id="teacherCount" style="font-size:2rem;font-weight:bold;">0</div>
        </div>
        <div>
          <div style="font-weight:600;">Total Counselors</div>
          <div id="counselorCount" style="font-size:2rem;font-weight:bold;">0</div>
        </div>
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr><th>Name</th><th>Role</th><th>Email</th><th>Phone</th><th>Actions</th></tr>
          </thead>
          <tbody id="staffTableBody"></tbody>
        </table>
      </div>
    </div>
  </main>

  <!-- Top bar for mobile -->
  <div class="mobile-topbar">
    <button class="theme-toggle" id="themeToggleMobile" title="Toggle Theme">
      <i id="themeIconMobile" class="bi bi-moon-stars-fill"></i>
    </button>
    <a class="profile" href="profile-admin.php" title="Profile">
      <i class="bi bi-person-circle fs-4"></i>
    </a>
    <a class="profile" href="#" onclick="logout()" title="Logout">
      <i class="bi bi-box-arrow-right"></i>
    </a>
  </div>

  <!-- Scripts -->
  <script>
    const toggleBtn = document.getElementById("themeToggle");
    const icon = document.getElementById("themeIcon");

    function applyTheme(theme) {
      document.body.classList.toggle("dark-theme", theme === "dark");
      icon.className = theme === "dark" ? "bi bi-brightness-high-fill" : "bi bi-moon-stars-fill";
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

    toggleBtn.addEventListener("click", toggleTheme);

    // Dummy logout for demo
    window.logout = function () {
      window.location.href = "../index.php";
    };
  </script>
  <script type="module" src="admin-student-management.js"></script>
  <script type="module" src="admin-teacher-counselor.js"></script>
  <script src="admin-dashboard.js"></script>
  <script type="module" src="firebase-init.js"></script>
  <script type="module" src="admin-dashboard-overview.js"></script>
  <script src="fees-management.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.js"></script>
  <script type="module">
    import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

    // Your Firebase config (reuse from your project)
    const firebaseConfig = {
      apiKey: "AIzaSyAD_3jmeamJ2QyJk2OPi-ucB2DDQSUCPPw",
      authDomain: "microtech-8e188.firebaseapp.com",
      projectId: "microtech-8e188",
      storageBucket: "microtech-8e188.appspot.com",
      messagingSenderId: "401753262680",
      appId: "1:401753262680:web:fb49631cc511f2457e982d",
      measurementId: "G-JHHD1M22CW"
    };
    initializeApp(firebaseConfig);

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = "../index.php";
      }
    });
  </script>
  <script type="module">
    import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
    window.logout = function () {
      const auth = getAuth();
      signOut(auth).then(() => {
        window.location.href = "../index.php";
      });
    };
  </script>
</body>
</html>