<?php
include("db.php");

// Filter students by ID or name
function getStudent($filter) {
  global $conn;
  $filter = $conn->real_escape_string($filter);
  $sql = "SELECT * FROM students WHERE unique_id = '$filter' OR name LIKE '%$filter%'";
  return $conn->query($sql);
}

// Reset Gama fees at month start
function resetGamaFees($month) {
  global $conn;
  $gamaQuery = $conn->query("SELECT * FROM students WHERE type='gama'");
  while ($student = $gamaQuery->fetch_assoc()) {
    $sid = $student['id'];
    $check = $conn->query("SELECT * FROM fees WHERE student_id=$sid AND month_year='$month'");
    if ($check->num_rows == 0) {
      $conn->query("INSERT INTO fees (student_id, payment_time, amount, mode, status, month_year) 
                    VALUES ($sid, NOW(), 0, 'cash', 'pending', '$month')");
    }
  }
}
?>
