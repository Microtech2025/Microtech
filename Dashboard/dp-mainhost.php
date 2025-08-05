<?php
$host = "sql111.infinityfree.com";
$user = "if0_39250892";
$pass = "jennypaulose22"; // your MySQL password
$dbname = "if0_39250892_microtech";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
?>
