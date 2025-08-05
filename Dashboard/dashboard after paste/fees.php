<?php
include './dp.php';
// DB connection
$conn = new mysqli("localhost", "root", "", "microtech"); // Change credentials as needed
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

// Auto-set all students to pending for the current month if not already set
$current_month = date('Y-m');
$check = $conn->query("SELECT COUNT(*) as cnt FROM fees WHERE month_year='$current_month'");
$row = $check->fetch_assoc();
if ($row['cnt'] == 0) {
    $students_all = $conn->query("SELECT id FROM students");
    while ($stu = $students_all->fetch_assoc()) {
        $sid = $stu['id'];
        $conn->query("INSERT INTO fees (student_id, month_year, status) VALUES ($sid, '$current_month', 'pending')");
    }
}

// Handle Add/Update Fee
if (
    isset($_SERVER['REQUEST_METHOD']) &&
    $_SERVER['REQUEST_METHOD'] === 'POST' &&
    isset($_POST['action']) && $_POST['action'] === 'add_fee'
) {
    $student_id = intval($_POST['student_id']);
    $month_year = $_POST['month_year'];
    $payment_date = $_POST['payment_date'];
    $fee_amount = $_POST['fee_amount'];
    $payment_mode = $_POST['payment_mode'];
    $status = $_POST['status'];

    // Check if fee record exists for this student/month
    $check = $conn->query("SELECT id FROM fees WHERE student_id=$student_id AND month_year='$month_year'");
    if ($check->num_rows > 0) {
        // Update
        $conn->query("UPDATE fees SET payment_date='$payment_date', fee_amount='$fee_amount', payment_mode='$payment_mode', status='$status' WHERE student_id=$student_id AND month_year='$month_year'");
        echo "updated";
    } else {
        // Insert
        $conn->query("INSERT INTO fees (student_id, month_year, payment_date, fee_amount, payment_mode, status) VALUES ($student_id, '$month_year', '$payment_date', '$fee_amount', '$payment_mode', '$status')");
        echo "added";
    }
    exit;
}

// Handle Reset Gama Fees
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'reset_gama') {
    $month_year = $_POST['month_year'];
    $gama_students = $conn->query("SELECT id FROM students WHERE type='gama'");
    while ($row = $gama_students->fetch_assoc()) {
        $sid = $row['id'];
        // Only insert if not already present
        $exists = $conn->query("SELECT id FROM fees WHERE student_id=$sid AND month_year='$month_year'");
        if ($exists->num_rows == 0) {
            $conn->query("INSERT INTO fees (student_id, month_year, status) VALUES ($sid, '$month_year', 'pending')");
        }
    }
    echo "reset";
    exit;
}

// Check fee status (AJAX)
if (isset($_POST['action']) && $_POST['action'] === 'check_status') {
    $student_id = intval($_POST['student_id']);
    $month_year = $_POST['month_year'];
    $res = $conn->query("SELECT status FROM fees WHERE student_id=$student_id AND month_year='$month_year'");
    if ($row = $res->fetch_assoc()) {
        echo $row['status'];
    } else {
        echo 'none';
    }
    exit;
}

// Fetch students for dropdown/autocomplete
$students = [];
$res = $conn->query("SELECT * FROM students ORDER BY category, id");
while ($row = $res->fetch_assoc()) $students[] = $row;

// Fetch fees for table (with filters)
$where = "1";
if (!empty($_GET['filter_month'])) $where .= " AND month_year='" . $conn->real_escape_string($_GET['filter_month']) . "'";
if (!empty($_GET['filter_status'])) $where .= " AND status='" . $conn->real_escape_string($_GET['filter_status']) . "'";
if (!empty($_GET['filter_student'])) $where .= " AND student_id=" . intval($_GET['filter_student']);
$fees = [];
$res = $conn->query("SELECT fees.*, students.unique_id, students.name, students.class, students.class_time, students.category FROM fees JOIN students ON fees.student_id=students.id WHERE $where ORDER BY fees.id DESC");
while ($row = $res->fetch_assoc()) $fees[] = $row;

// For revenue chart: group by month
$revenue = [];
$res = $conn->query("SELECT month_year, SUM(fee_amount) as total FROM fees WHERE status='paid' GROUP BY month_year ORDER BY month_year");
while ($row = $res->fetch_assoc()) $revenue[] = $row;

$total_students = count($students);
$paid = $conn->query("SELECT COUNT(*) as c FROM fees WHERE month_year='$current_month' AND status='paid'")->fetch_assoc()['c'];
$pending = $conn->query("SELECT COUNT(*) as c FROM fees WHERE month_year='$current_month' AND status='pending'")->fetch_assoc()['c'];

// Recent months status for dashboard
$recent_months = $conn->query("SELECT DISTINCT month_year FROM fees ORDER BY month_year DESC LIMIT 3");
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Fees Management</title>
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
      <a href="staff.php"><i class="bi bi-person-badge-fill"></i> <span>Staff Management</span></a>
      <a href="fees.php" class="active"><i class="bi bi-cash-coin"></i> <span>Fees</span></a>
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
    <h2>Fees Management</h2>

    <!-- Fee Form -->
    <div class="fee-form-card">
      <form id="feeForm" autocomplete="off">
        <label for="student_search">Student (Unique ID or Name)</label>
        <input list="students_list" id="student_search" name="student_search" autocomplete="off" required>
        <datalist id="students_list">
          <?php foreach($students as $s): ?>
            <option value="<?= htmlspecialchars($s['unique_id']) ?>"><?= htmlspecialchars($s['name']) ?></option>
            <option value="<?= htmlspecialchars($s['name']) ?>"><?= htmlspecialchars($s['unique_id']) ?></option>
          <?php endforeach; ?>
        </datalist>
        <input type="hidden" id="student_id" name="student_id" required>
        <label for="class">Class</label>
        <input type="text" id="class" name="class" readonly>
        <label for="class_time">Class Time</label>
        <input type="text" id="class_time" name="class_time" readonly>
        <label for="month_year">Month</label>
        <input type="month" id="month_year" name="month_year" required>
        <label for="payment_date">Payment Date</label>
        <input type="date" id="payment_date" name="payment_date">
        <label for="fee_amount">Fee Amount</label>
        <input type="number" id="fee_amount" name="fee_amount" min="0" step="0.01">
        <label for="payment_mode">Payment Mode</label>
        <select id="payment_mode" name="payment_mode">
          <option value="cash">Cash</option>
          <option value="online">Online</option>
        </select>
        <label for="status">Status</label>
        <select id="status" name="status">
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
        <button type="submit" class="btn btn-success">Add/Update Fee</button>
        <div id="feeFormMsg"></div>
      </form>
      <button id="resetGama" class="btn" style="margin-top:1rem;">Reset Gama Fees to Pending (New Month)</button>
    </div>

    <!-- Filters -->
    <div style="margin-bottom:1rem;">
      <form method="get" style="display:flex;gap:1rem;flex-wrap:wrap;">
        <select name="filter_student">
          <option value="">All Students</option>
          <?php foreach($students as $s): ?>
            <option value="<?= $s['id'] ?>" <?= (isset($_GET['filter_student']) && $_GET['filter_student']==$s['id'])?'selected':'' ?>>
              <?= htmlspecialchars($s['unique_id']) ?> - <?= htmlspecialchars($s['name']) ?>
            </option>
          <?php endforeach; ?>
        </select>
        <select name="filter_month">
          <option value="">All Months</option>
          <?php foreach($revenue as $r): ?>
            <option value="<?= htmlspecialchars($r['month_year']) ?>" <?= (isset($_GET['filter_month']) && $_GET['filter_month']==$r['month_year'])?'selected':'' ?>>
              <?= htmlspecialchars($r['month_year']) ?>
            </option>
          <?php endforeach; ?>
        </select>
        <select name="filter_status">
          <option value="">All Status</option>
          <option value="paid" <?= (isset($_GET['filter_status']) && $_GET['filter_status']=='paid')?'selected':'' ?>>Paid</option>
          <option value="pending" <?= (isset($_GET['filter_status']) && $_GET['filter_status']=='pending')?'selected':'' ?>>Pending</option>
        </select>
        <button class="btn" type="submit">Filter</button>
      </form>
    </div>

    <!-- Fee Table -->
    <div class="card">
      <div class="card-title">Fee Records</div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Class</th>
              <th>Class Time</th>
              <th>Month</th>
              <th>Payment Date</th>
              <th>Amount</th>
              <th>Mode</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach($fees as $f): ?>
            <tr>
              <td><?= htmlspecialchars($f['unique_id']) ?> - <?= htmlspecialchars($f['name']) ?></td>
              <td><?= htmlspecialchars($f['class']) ?></td>
              <td><?= htmlspecialchars($f['class_time']) ?></td>
              <td><?= htmlspecialchars($f['month_year']) ?></td>
              <td><?= htmlspecialchars($f['payment_date']) ?></td>
              <td><?= htmlspecialchars($f['fee_amount']) ?></td>
              <td><?= htmlspecialchars($f['payment_mode']) ?></td>
              <td><?= htmlspecialchars($f['status']) ?></td>
            </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Revenue Chart -->
    <div class="card mb-4">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Monthly Revenue Chart</h5>
        <small class="text-muted">Based on Fee Records</small>
      </div>
      <div class="card-body">
        <canvas id="revenueChart" height="100"></canvas>
      </div>
    </div>

    <!-- Fee Status Summary -->
    <div class="fee-status-summary">
      <span>Total Students: <?= $total_students ?></span>
      <span>Paid: <?= $paid ?></span>
      <span>Pending: <?= $pending ?></span>
    </div>

    <!-- Recent Months Status -->
    <div class="recent-months-status">
      <?php
      while ($m = $recent_months->fetch_assoc()) {
        $paid = $conn->query("SELECT COUNT(*) as c FROM fees WHERE month_year='{$m['month_year']}' AND status='paid'")->fetch_assoc()['c'];
        $pending = $conn->query("SELECT COUNT(*) as c FROM fees WHERE month_year='{$m['month_year']}' AND status='pending'")->fetch_assoc()['c'];
        echo "<div>{$m['month_year']}: Paid $paid, Pending $pending</div>";
      }
      ?>
    </div>
    <a href="fees.php?export_csv=1" class="btn" style="margin-bottom:1rem;">Export CSV</a>
    <button id="exportPDF" class="btn" style="margin-bottom:1rem;">Export Fees as PDF</button>

    <!-- Pending Fees Alert -->
    <?php
    $pending_students = $conn->query("SELECT students.unique_id, students.name, students.class, students.class_time, students.category FROM fees JOIN students ON fees.student_id=students.id WHERE fees.month_year='$current_month' AND fees.status='pending' ORDER BY students.category, students.class, students.name");
    if ($pending_students->num_rows > 0) {
      echo '<div class="pending-alert"><strong>Pending Fees:</strong><ul>';
      while ($row = $pending_students->fetch_assoc()) {
        echo "<li>{$row['unique_id']} - {$row['name']} ({$row['category']}, {$row['class']}, {$row['class_time']})</li>";
      }
      echo '</ul></div>';
    }
    ?>

    <?php if (isset($_GET['msg'])): ?>
      <div style="color:green;font-weight:bold;"><?= htmlspecialchars($_GET['msg']) ?></div>
    <?php endif; ?>
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
  <script src="admin-dashboard.js"></script>
  <script>
const studentsData = <?php echo json_encode($students); ?>;
</script>
<script src="fees-management.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <script>
document.getElementById('feeForm').onsubmit = async function(e) {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  data.append('action', 'add_fee');
  const res = await fetch('fees.php', { method: 'POST', body: data });
  const msg = await res.text();
  document.getElementById('feeFormMsg').textContent = msg === 'added' ? "Fee added!" : "Fee updated!";
  setTimeout(()=>location.reload(), 800);
};

document.getElementById('resetGama').onclick = async function() {
  if (!confirm("Reset all Gama students' fees to Pending for the new month?")) return;
  const month_year = new Date().toISOString().slice(0,7);
  const data = new FormData();
  data.append('action', 'reset_gama');
  data.append('month_year', month_year);
  const res = await fetch('fees.php', { method: 'POST', body: data });
  const msg = await res.text();
  alert("Gama fees reset for " + month_year);
  location.reload();
};

// Revenue Chart
const revenueData = <?php echo json_encode($revenue); ?>;
const months = revenueData.map(r => r.month_year);
const totals = revenueData.map(r => parseFloat(r.total));
if (months.length) {
  new Chart(document.getElementById('revenueChart').getContext('2d'), {
    type: 'bar',
    data: {
      labels: months,
      datasets: [{
        label: 'Revenue',
        data: totals,
        backgroundColor: '#eebbc3'
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}

// After selecting student and month, use AJAX to check if status is 'pending'
document.getElementById('student_id').addEventListener('change', checkFeeStatus);
document.getElementById('month_year').addEventListener('change', checkFeeStatus);

async function checkFeeStatus() {
  const studentId = document.getElementById('student_id').value;
  const monthYear = document.getElementById('month_year').value;
  if (!studentId || !monthYear) return;

  const res = await fetch('fees.php', {
    method: 'POST',
    body: new URLSearchParams({
      action: 'check_status',
      student_id: studentId,
      month_year: monthYear
    })
  });
  const status = await res.text();
  document.getElementById('status').value = status;
}
  </script>
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