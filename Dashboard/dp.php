<?php
$conn = new mysqli("localhost", "root", "", "microtech");
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);
?>