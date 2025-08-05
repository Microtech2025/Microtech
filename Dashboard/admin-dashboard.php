<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Micro Tech Center - Admin Dashboard</title>
<script src="https://cdn.tailwindcss.com/3.4.16"></script>
<script>tailwind.config={theme:{extend:{colors:{primary:'#1E3A8A',secondary:'#06B6D4'},borderRadius:{'none':'0px','sm':'4px',DEFAULT:'8px','md':'12px','lg':'16px','xl':'20px','2xl':'24px','3xl':'32px','full':'9999px','button':'8px'}}}}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.min.css">
<style>
:where([class^="ri-"])::before { content: "\f3c2"; }
body {
font-family: 'Poppins', sans-serif;
overflow-x: hidden;
}
h1, h2, h3, h4, h5, h6 {
font-family: 'Inter', sans-serif;
}
.sidebar {
width: 280px;
transition: width 0.3s ease;
}
.sidebar.collapsed {
width: 70px;
}
.main-content {
transition: margin-left 0.3s ease;
}
.sidebar.collapsed ~ .main-content {
margin-left: 70px;
}
.sidebar-link span {
transition: opacity 0.2s ease;
}
.sidebar.collapsed .sidebar-link span {
opacity: 0;
display: none;
}
.sidebar.collapsed .logo-text {
opacity: 0;
display: none;
}
.sidebar.collapsed .collapse-btn i {
transform: rotate(180deg);
}
.chart-container {
height: 300px;
}
input[type="checkbox"].toggle {
height: 0;
width: 0;
visibility: hidden;
position: absolute;
}
.toggle-label {
cursor: pointer;
width: 48px;
height: 24px;
background: #e5e7eb;
display: block;
border-radius: 100px;
position: relative;
}
.toggle-label:after {
content: '';
position: absolute;
top: 2px;
left: 2px;
width: 20px;
height: 20px;
background: white;
border-radius: 90px;
transition: 0.3s;
box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
input:checked + .toggle-label {
background: #06B6D4;
}
input:checked + .toggle-label:after {
left: calc(100% - 2px);
transform: translateX(-100%);
}
.custom-select-wrapper {
position: relative;
}
.custom-select-wrapper .custom-select-icon {
position: absolute;
right: 12px;
top: 50%;
transform: translateY(-50%);
pointer-events: none;
}
.custom-radio {
display: none;
}
.custom-radio + label {
position: relative;
padding-left: 28px;
cursor: pointer;
display: inline-block;
line-height: 20px;
}
.custom-radio + label:before {
content: '';
position: absolute;
left: 0;
top: 0;
width: 20px;
height: 20px;
border: 2px solid #e5e7eb;
border-radius: 50%;
background: #fff;
}
.custom-radio:checked + label:after {
content: '';
position: absolute;
left: 5px;
top: 5px;
width: 10px;
height: 10px;
border-radius: 50%;
background: #1E3A8A;
}
.custom-checkbox {
display: none;
}
.custom-checkbox + label {
position: relative;
padding-left: 28px;
cursor: pointer;
display: inline-block;
line-height: 20px;
}
.custom-checkbox + label:before {
content: '';
position: absolute;
left: 0;
top: 0;
width: 20px;
height: 20px;
border: 2px solid #e5e7eb;
border-radius: 4px;
background: #fff;
}
.custom-checkbox:checked + label:after {
content: '';
position: absolute;
left: 7px;
top: 3px;
width: 6px;
height: 12px;
border: solid #1E3A8A;
border-width: 0 2px 2px 0;
transform: rotate(45deg);
}
input[type=range] {
  -webkit-appearance: none;
  appearance: none; /* Add this line for compatibility */
  width: 100%;
  height: 6px;
  border-radius: 5px;
  background: #e5e7eb;
  outline: none;
}
input[type=range]::-webkit-slider-thumb {
-webkit-appearance: none;
appearance: none;
width: 18px;
height: 18px;
border-radius: 50%;
background: #1E3A8A;
cursor: pointer;
}
input[type=range]::-moz-range-thumb {
width: 18px;
height: 18px;
border-radius: 50%;
background: #1E3A8A;
cursor: pointer;
border: none;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
-webkit-appearance: none;
margin: 0;
}
</style>
</head>
<body class="bg-gray-50">
<div class="flex min-h-screen">
<!-- Sidebar -->
<aside class="sidebar bg-white shadow-lg fixed h-full z-10">
<div class="flex flex-col h-full">
<!-- Logo -->
<div class="flex items-center justify-between px-6 py-5 border-b">
<div class="flex items-center">
<span class="logo-text ml-2 font-semibold text-gray-800">Micro Tech</span>
</div>
<button class="collapse-btn w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary">
<div class="w-8 h-8 flex items-center justify-center">
<i class="ri-arrow-left-s-line ri-lg"></i>
</div>
</button>
</div>
<!-- Navigation -->
<nav class="flex-1 py-4 overflow-y-auto">
<div class="px-4 mb-4">
<span class="text-xs font-semibold text-gray-400 uppercase tracking-wider logo-text">Main</span>
</div>
<a href="admin-dashboard.php" data-readdy="true" class="sidebar-link flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary rounded-lg mx-2 mb-1 bg-blue-50 text-primary">
<div class="w-6 h-6 flex items-center justify-center">
<i class="ri-dashboard-line"></i>
</div>
<span class="ml-3 font-medium">Dashboard</span>
</a>
<a href="user.php" data-readdy="true" class="sidebar-link flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary rounded-lg mx-2 mb-1">
<div class="w-6 h-6 flex items-center justify-center">
<i class="ri-user-line"></i>
</div>
<span class="ml-3 font-medium">Users</span>
</a>
<a href="course-management.php" class="sidebar-link flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary rounded-lg mx-2 mb-1">
<div class="w-6 h-6 flex items-center justify-center">
<i class="ri-book-open-line"></i>
</div>
<span class="ml-3 font-medium">Courses</span>
</a>
<a href="schedule.php" class="sidebar-link flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary rounded-lg mx-2 mb-1">
<div class="w-6 h-6 flex items-center justify-center">
<i class="ri-calendar-line"></i>
</div>
<span class="ml-3 font-medium">Schedule</span>
</a>
<a href="attendance.php" class="sidebar-link flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary rounded-lg mx-2 mb-1">
<div class="w-6 h-6 flex items-center justify-center">
<i class="ri-file-list-line"></i>
</div>
<span class="ml-3 font-medium">Attendance</span>
</a>
<div class="px-4 mt-6 mb-4">
<span class="text-xs font-semibold text-gray-400 uppercase tracking-wider logo-text">Admin</span>
</div>
<a href="settings.php" class="sidebar-link flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary rounded-lg mx-2 mb-1">
<div class="w-6 h-6 flex items-center justify-center">
<i class="ri-settings-line"></i>
</div>
<span class="ml-3 font-medium">Settings</span>
</a>
<a href="announcements.php" class="sidebar-link flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary rounded-lg mx-2 mb-1">
<div class="w-6 h-6 flex items-center justify-center">
<i class="ri-notification-line"></i>
</div>
<span class="ml-3 font-medium">Announcements</span>
</a>
<a href="#" class="sidebar-link flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary rounded-lg mx-2 mb-1">
<div class="w-6 h-6 flex items-center justify-center">
<i class="ri-database-2-line"></i>
</div>
<span class="ml-3 font-medium">Backup</span>
</a>
</nav>
<!-- User Profile -->
<div class="border-t px-6 py-4">
<div class="flex items-center">
<img src="https://readdy.ai/api/search-image?query=professional%2520headshot%2520of%2520an%2520indian%2520man%2520with%2520glasses%2520in%2520formal%2520attire%2520on%2520white%2520background%2C%2520high%2520quality%2C%2520professional%2520looking%2C%2520warm%2520smile%2C%2520approachable&width=100&height=100&seq=profile1&orientation=squarish" alt="User" class="w-10 h-10 rounded-full object-cover object-top">
<div class="ml-3 logo-text">
<p class="text-sm font-medium text-gray-800">Rajesh Kumar</p>
<p class="text-xs text-gray-500">Administrator</p>
</div>
</div>
</div>
</div>
</aside>
<!-- Main Content -->
<div class="main-content flex-1 ml-[280px]">
<!-- Top Navbar -->
<header class="bg-white shadow-sm h-16 fixed top-0 right-0 left-[280px] z-10">
<div class="flex items-center justify-between h-full px-6">
<!-- Search Bar -->
<div class="relative w-96">
<input type="text" placeholder="Search..." class="w-full h-10 pl-10 pr-4 rounded-lg border-none bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm">
<div class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-400">
<i class="ri-search-line"></i>
</div>
</div>
<!-- Right Side Items -->
<div class="flex items-center space-x-4">
<!-- Notifications -->
<div class="relative">
<button class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100">
<div class="w-5 h-5 flex items-center justify-center">
<i class="ri-notification-3-line"></i>
</div>
<span class="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
</button>
</div>
<!-- Messages -->
<div class="relative">
<button class="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100">
<div class="w-5 h-5 flex items-center justify-center">
<i class="ri-message-3-line"></i>
</div>
<span class="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full text-white text-xs flex items-center justify-center">5</span>
</button>
</div>
<!-- Dark Mode Toggle -->
<div class="flex items-center">
<input type="checkbox" id="dark-mode-toggle" class="toggle">
<label for="dark-mode-toggle" class="toggle-label"></label>
</div>
<!-- User Profile -->
<div class="relative">
<button class="flex items-center space-x-2">
<img src="https://readdy.ai/api/search-image?query=professional%2520headshot%2520of%2520an%2520indian%2520man%2520with%2520glasses%2520in%2520formal%2520attire%2520on%2520white%2520background%2C%2520high%2520quality%2C%2520professional%2520looking%2C%2520warm%2520smile%2C%2520approachable&width=100&height=100&seq=profile1&orientation=squarish" alt="User" class="w-10 h-10 rounded-full object-cover object-top">
<span class="text-sm font-medium text-gray-700 hidden md:block">Rajesh Kumar</span>
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-arrow-down-s-line"></i>
</div>
</button>
</div>
</div>
</div>
</header>
<!-- Page Content -->
<main class="pt-24 pb-8 px-6">
<!-- Welcome Section -->
<div class="flex justify-between items-center mb-8">
<div>
<h1 class="text-2xl font-bold text-gray-800">Welcome back, Rajesh!</h1>
<p class="text-gray-600">Here's what's happening at Micro Tech Center today.</p>
</div>
<div>
<p class="text-sm text-gray-500">Today is <span class="font-medium">June 29, 2025</span></p>
</div>
</div>
<!-- Role Selector -->
<div class="mb-8 bg-white rounded-lg shadow-sm p-4">
<h2 class="text-lg font-semibold text-gray-800 mb-3">View Dashboard As:</h2>
<div class="flex flex-wrap gap-3">
<div>
<input type="radio" id="role-admin" name="role" class="custom-radio" checked>
<label for="role-admin" class="whitespace-nowrap">Administrator</label>
</div>
<div>
<input type="radio" id="role-teacher" name="role" class="custom-radio">
<label for="role-teacher" class="whitespace-nowrap">Teacher</label>
</div>
<div>
<input type="radio" id="role-student" name="role" class="custom-radio">
<label for="role-student" class="whitespace-nowrap">Student</label>
</div>
<div>
<input type="radio" id="role-counselor" name="role" class="custom-radio">
<label for="role-counselor" class="whitespace-nowrap">Counselor</label>
</div>
</div>
</div>
<!-- Stats Cards -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
<!-- Total Students -->
<div class="bg-white rounded-lg shadow-sm p-6">
<div class="flex justify-between items-start">
<div>
<p class="text-sm text-gray-500 mb-1">Total Students</p>
<h3 class="text-2xl font-bold text-gray-800">1,248</h3>
<p class="text-xs text-green-500 mt-2">
<span class="flex items-center">
<div class="w-3 h-3 flex items-center justify-center mr-1">
<i class="ri-arrow-up-line"></i>
</div>
8.2% from last month
</span>
</p>
</div>
<div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary">
<div class="w-6 h-6 flex items-center justify-center">
<i class="ri-user-line"></i>
</div>
</div>
</div>
</div>
<!-- Total Teachers -->
<div class="bg-white rounded-lg shadow-sm p-6">
<div class="flex justify-between items-start">
<div>
<p class="text-sm text-gray-500 mb-1">Total Teachers</p>
<h3 class="text-2xl font-bold text-gray-800">64</h3>
<p class="text-xs text-green-500 mt-2">
<span class="flex items-center">
<div class="w-3 h-3 flex items-center justify-center mr-1">
<i class="ri-arrow-up-line"></i>
</div>
4.5% from last month
</span>
</p>
</div>
<div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
<div class="w-6 h-6 flex items-center justify-center">
<i class="ri-user-star-line"></i>
</div>
</div>
</div>
</div>
<!-- Total Courses -->
<div class="bg-white rounded-lg shadow-sm p-6">
<div class="flex justify-between items-start">
<div>
<p class="text-sm text-gray-500 mb-1">Total Courses</p>
<h3 class="text-2xl font-bold text-gray-800">42</h3>
<p class="text-xs text-green-500 mt-2">
<span class="flex items-center">
<div class="w-3 h-3 flex items-center justify-center mr-1">
<i class="ri-arrow-up-line"></i>
</div>
2.3% from last month
</span>
</p>
</div>
<div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
<div class="w-6 h-6 flex items-center justify-center">
<i class="ri-book-open-line"></i>
</div>
</div>
</div>
</div>
<!-- New Admissions -->
<div class="bg-white rounded-lg shadow-sm p-6">
<div class="flex justify-between items-start">
<div>
<p class="text-sm text-gray-500 mb-1">New Admissions</p>
<h3 class="text-2xl font-bold text-gray-800">86</h3>
<p class="text-xs text-red-500 mt-2">
<span class="flex items-center">
<div class="w-3 h-3 flex items-center justify-center mr-1">
<i class="ri-arrow-down-line"></i>
</div>
3.1% from last month
</span>
</p>
</div>
<div class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
<div class="w-6 h-6 flex items-center justify-center">
<i class="ri-user-add-line"></i>
</div>
</div>
</div>
</div>
</div>
<!-- Main Content Cards -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
<!-- Student Enrollment Chart -->
<div class="bg-white rounded-lg shadow-sm p-6 lg:col-span-2">
<div class="flex justify-between items-center mb-6">
<h3 class="text-lg font-semibold text-gray-800">Student Enrollment</h3>
<div class="custom-select-wrapper">
<select class="bg-gray-100 border-none rounded-lg py-2 pl-4 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
<option>Last 6 Months</option>
<option>Last Year</option>
<option>All Time</option>
</select>
<div class="custom-select-icon w-4 h-4 flex items-center justify-center text-gray-500">
<i class="ri-arrow-down-s-line"></i>
</div>
</div>
</div>
<div id="enrollment-chart" class="chart-container"></div>
</div>
<!-- Recent Announcements -->
<div class="bg-white rounded-lg shadow-sm p-6">
<div class="flex justify-between items-center mb-6">
<h3 class="text-lg font-semibold text-gray-800">Announcements</h3>
<button class="text-primary text-sm font-medium hover:underline !rounded-button whitespace-nowrap">View All</button>
</div>
<div class="space-y-4">
<div class="border-l-4 border-primary pl-4 py-1">
<h4 class="text-sm font-medium text-gray-800">System Maintenance</h4>
<p class="text-xs text-gray-500 mt-1">The system will be down for maintenance on July 2nd from 11 PM to 2 AM.</p>
<p class="text-xs text-gray-400 mt-2">2 hours ago</p>
</div>
<div class="border-l-4 border-green-500 pl-4 py-1">
<h4 class="text-sm font-medium text-gray-800">New Course Added</h4>
<p class="text-xs text-gray-500 mt-1">Advanced Python Programming course is now available for enrollment.</p>
<p class="text-xs text-gray-400 mt-2">Yesterday</p>
</div>
<div class="border-l-4 border-orange-500 pl-4 py-1">
<h4 class="text-sm font-medium text-gray-800">Holiday Notice</h4>
<p class="text-xs text-gray-500 mt-1">The center will remain closed on July 15th for Onam celebrations.</p>
<p class="text-xs text-gray-400 mt-2">2 days ago</p>
</div>
<div class="border-l-4 border-purple-500 pl-4 py-1">
<h4 class="text-sm font-medium text-gray-800">Faculty Meeting</h4>
<p class="text-xs text-gray-500 mt-1">All faculty members are requested to attend the quarterly review meeting.</p>
<p class="text-xs text-gray-400 mt-2">3 days ago</p>
</div>
</div>
</div>
</div>
<!-- User Management Section -->
<div class="bg-white rounded-lg shadow-sm p-6 mb-8">
<div class="flex justify-between items-center mb-6">
<h3 class="text-lg font-semibold text-gray-800">User Management</h3>
<button class="bg-primary text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-primary/90 flex items-center whitespace-nowrap">
<div class="w-4 h-4 flex items-center justify-center mr-1">
<i class="ri-user-add-line"></i>
</div>
Add New User
</button>
</div>
<!-- Filters -->
<div class="flex flex-wrap gap-4 mb-6">
<div class="custom-select-wrapper">
<select class="bg-gray-100 border-none rounded-lg py-2 pl-4 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
<option>All Roles</option>
<option>Admin</option>
<option>Teacher</option>
<option>Student</option>
<option>Counselor</option>
</select>
<div class="custom-select-icon w-4 h-4 flex items-center justify-center text-gray-500">
<i class="ri-arrow-down-s-line"></i>
</div>
</div>
<div class="custom-select-wrapper">
<select class="bg-gray-100 border-none rounded-lg py-2 pl-4 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
<option>All Status</option>
<option>Active</option>
<option>Inactive</option>
<option>Pending</option>
</select>
<div class="custom-select-icon w-4 h-4 flex items-center justify-center text-gray-500">
<i class="ri-arrow-down-s-line"></i>
</div>
</div>
<div class="relative flex-1 min-w-[200px]">
<input type="text" placeholder="Search users..." class="w-full h-10 pl-10 pr-4 rounded-lg border-none bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm">
<div class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-400">
<i class="ri-search-line"></i>
</div>
</div>
</div>
<!-- Users Table -->
<div class="overflow-x-auto">
<table class="w-full">
<thead>
<tr class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
<th class="px-4 py-3">Name</th>
<th class="px-4 py-3">Email</th>
<th class="px-4 py-3">Role</th>
<th class="px-4 py-3">Status</th>
<th class="px-4 py-3">Joined Date</th>
<th class="px-4 py-3">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-gray-100">
<tr class="text-sm text-gray-700">
<td class="px-4 py-3">
<div class="flex items-center">
<img src="https://readdy.ai/api/search-image?query=professional%2520headshot%2520of%2520an%2520indian%2520woman%2520with%2520long%2520black%2520hair%2520in%2520formal%2520attire%2520on%2520white%2520background%2C%2520high%2520quality%2C%2520professional%2520looking%2C%2520warm%2520smile%2C%2520approachable&width=100&height=100&seq=profile2&orientation=squarish" alt="User" class="w-8 h-8 rounded-full object-cover object-top mr-3">
<span class="font-medium">Priya Sharma</span>
</div>
</td>
<td class="px-4 py-3">priya.sharma@microtech.edu</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Teacher</span>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
</td>
<td class="px-4 py-3">May 12, 2023</td>
<td class="px-4 py-3">
<div class="flex space-x-2">
<button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-edit-line"></i>
</div>
</button>
<button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-delete-bin-line"></i>
</div>
</button>
</div>
</td>
</tr>
<tr class="text-sm text-gray-700">
<td class="px-4 py-3">
<div class="flex items-center">
<img src="https://readdy.ai/api/search-image?query=professional%2520headshot%2520of%2520a%2520young%2520indian%2520man%2520in%2520casual%2520business%2520attire%2520on%2520white%2520background%2C%2520high%2520quality%2C%2520professional%2520looking%2C%2520warm%2520smile%2C%2520approachable&width=100&height=100&seq=profile3&orientation=squarish" alt="User" class="w-8 h-8 rounded-full object-cover object-top mr-3">
<span class="font-medium">Arjun Nair</span>
</div>
</td>
<td class="px-4 py-3">arjun.nair@microtech.edu</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Student</span>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
</td>
<td class="px-4 py-3">Jan 5, 2024</td>
<td class="px-4 py-3">
<div class="flex space-x-2">
<button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-edit-line"></i>
</div>
</button>
<button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-delete-bin-line"></i>
</div>
</button>
</div>
</td>
</tr>
<tr class="text-sm text-gray-700">
<td class="px-4 py-3">
<div class="flex items-center">
<img src="https://readdy.ai/api/search-image?query=professional%2520headshot%2520of%2520a%2520middle-aged%2520indian%2520woman%2520with%2520short%2520hair%2520in%2520formal%2520business%2520attire%2520on%2520white%2520background%2C%2520high%2520quality%2C%2520professional%2520looking%2C%2520warm%2520smile%2C%2520approachable&width=100&height=100&seq=profile4&orientation=squarish" alt="User" class="w-8 h-8 rounded-full object-cover object-top mr-3">
<span class="font-medium">Lakshmi Menon</span>
</div>
</td>
<td class="px-4 py-3">lakshmi.m@microtech.edu</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">Counselor</span>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
</td>
<td class="px-4 py-3">Nov 18, 2022</td>
<td class="px-4 py-3">
<div class="flex space-x-2">
<button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-edit-line"></i>
</div>
</button>
<button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-delete-bin-line"></i>
</div>
</button>
</div>
</td>
</tr>
<tr class="text-sm text-gray-700">
<td class="px-4 py-3">
<div class="flex items-center">
<img src="https://readdy.ai/api/search-image?query=professional%2520headshot%2520of%2520an%2520indian%2520man%2520in%2520his%252050s%2520with%2520salt%2520and%2520pepper%2520hair%2520in%2520formal%2520attire%2520on%2520white%2520background%2C%2520high%2520quality%2C%2520professional%2520looking%2C%2520warm%2520smile%2C%2520approachable&width=100&height=100&seq=profile5&orientation=squarish" alt="User" class="w-8 h-8 rounded-full object-cover object-top mr-3">
<span class="font-medium">Sanjay Pillai</span>
</div>
</td>
<td class="px-4 py-3">sanjay.p@microtech.edu</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Admin</span>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
</td>
<td class="px-4 py-3">Aug 3, 2021</td>
<td class="px-4 py-3">
<div class="flex space-x-2">
<button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-edit-line"></i>
</div>
</button>
<button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-delete-bin-line"></i>
</div>
</button>
</div>
</td>
</tr>
<tr class="text-sm text-gray-700">
<td class="px-4 py-3">
<div class="flex items-center">
<img src="https://readdy.ai/api/search-image?query=professional%2520headshot%2520of%2520a%2520young%2520indian%2520woman%2520with%2520glasses%2520in%2520casual%2520business%2520attire%2520on%2520white%2520background%2C%2520high%2520quality%2C%2520professional%2520looking%2C%2520warm%2520smile%2C%2520approachable&width=100&height=100&seq=profile6&orientation=squarish" alt="User" class="w-8 h-8 rounded-full object-cover object-top mr-3">
<span class="font-medium">Meera Krishnan</span>
</div>
</td>
<td class="px-4 py-3">meera.k@microtech.edu</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Student</span>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>
</td>
<td class="px-4 py-3">Jun 15, 2024</td>
<td class="px-4 py-3">
<div class="flex space-x-2">
<button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-edit-line"></i>
</div>
</button>
<button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-delete-bin-line"></i>
</div>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<!-- Pagination -->
<div class="flex justify-between items-center mt-6">
<p class="text-sm text-gray-500">Showing 1-5 of 42 users</p>
<div class="flex space-x-1">
<button class="w-8 h-8 rounded flex items-center justify-center hover:bg-gray-100 text-gray-500 disabled:opacity-50" disabled>
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-arrow-left-s-line"></i>
</div>
</button>
<button class="w-8 h-8 rounded flex items-center justify-center bg-primary text-white">1</button>
<button class="w-8 h-8 rounded flex items-center justify-center hover:bg-gray-100 text-gray-700">2</button>
<button class="w-8 h-8 rounded flex items-center justify-center hover:bg-gray-100 text-gray-700">3</button>
<button class="w-8 h-8 rounded flex items-center justify-center hover:bg-gray-100 text-gray-700">4</button>
<button class="w-8 h-8 rounded flex items-center justify-center hover:bg-gray-100 text-gray-700">5</button>
<button class="w-8 h-8 rounded flex items-center justify-center hover:bg-gray-100 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-arrow-right-s-line"></i>
</div>
</button>
</div>
</div>
</div>
<!-- Course Distribution and Recent Activities -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
<!-- Course Distribution -->
<div class="bg-white rounded-lg shadow-sm p-6">
<div class="flex justify-between items-center mb-6">
<h3 class="text-lg font-semibold text-gray-800">Course Distribution</h3>
<div class="custom-select-wrapper">
<select class="bg-gray-100 border-none rounded-lg py-2 pl-4 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
<option>By Department</option>
<option>By Enrollment</option>
<option>By Duration</option>
</select>
<div class="custom-select-icon w-4 h-4 flex items-center justify-center text-gray-500">
<i class="ri-arrow-down-s-line"></i>
</div>
</div>
</div>
<div id="course-distribution-chart" class="chart-container"></div>
</div>
<!-- Recent Activities -->
<div class="bg-white rounded-lg shadow-sm p-6">
<div class="flex justify-between items-center mb-6">
<h3 class="text-lg font-semibold text-gray-800">Recent Activities</h3>
<button class="text-primary text-sm font-medium hover:underline !rounded-button whitespace-nowrap">View All</button>
</div>
<div class="space-y-4">
<div class="flex items-start">
<div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary mr-3 flex-shrink-0">
<div class="w-5 h-5 flex items-center justify-center">
<i class="ri-user-add-line"></i>
</div>
</div>
<div>
<p class="text-sm text-gray-800">
<span class="font-medium">Arjun Nair</span> was added as a new student
</p>
<p class="text-xs text-gray-500 mt-1">30 minutes ago</p>
</div>
</div>
<div class="flex items-start">
<div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 flex-shrink-0">
<div class="w-5 h-5 flex items-center justify-center">
<i class="ri-file-upload-line"></i>
</div>
</div>
<div>
<p class="text-sm text-gray-800">
<span class="font-medium">Priya Sharma</span> uploaded new course materials for Python Programming
</p>
<p class="text-xs text-gray-500 mt-1">2 hours ago</p>
</div>
</div>
<div class="flex items-start">
<div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3 flex-shrink-0">
<div class="w-5 h-5 flex items-center justify-center">
<i class="ri-calendar-check-line"></i>
</div>
</div>
<div>
<p class="text-sm text-gray-800">
<span class="font-medium">Lakshmi Menon</span> scheduled 5 new counseling sessions
</p>
<p class="text-xs text-gray-500 mt-1">Yesterday</p>
</div>
</div>
<div class="flex items-start">
<div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mr-3 flex-shrink-0">
<div class="w-5 h-5 flex items-center justify-center">
<i class="ri-money-dollar-circle-line"></i>
</div>
</div>
<div>
<p class="text-sm text-gray-800">
<span class="font-medium">Sanjay Pillai</span> processed 12 fee payments
</p>
<p class="text-xs text-gray-500 mt-1">Yesterday</p>
</div>
</div>
<div class="flex items-start">
<div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3 flex-shrink-0">
<div class="w-5 h-5 flex items-center justify-center">
<i class="ri-settings-line"></i>
</div>
</div>
<div>
<p class="text-sm text-gray-800">
<span class="font-medium">System</span> completed database backup
</p>
<p class="text-xs text-gray-500 mt-1">2 days ago</p>
</div>
</div>
</div>
</div>
</div>
<!-- Quick Actions -->
<div class="bg-white rounded-lg shadow-sm p-6">
<h3 class="text-lg font-semibold text-gray-800 mb-6">Quick Actions</h3>
<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
<button class="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-blue-50 transition-colors !rounded-button whitespace-nowrap">
<div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary mb-3">
<div class="w-6 h-6 flex items-center justify-center">
<i class="ri-user-add-line"></i>
</div>
</div>
<span class="text-sm font-medium text-gray-700">Add User</span>
</button>
<button class="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-blue-50 transition-colors !rounded-button whitespace-nowrap">
<div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-3">
<div class="w-6 h-6 flex items-center justify-center">
<i class="ri-book-open-line"></i>
</div>
</div>
<span class="text-sm font-medium text-gray-700">Add Course</span>
</button>
<button class="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-blue-50 transition-colors !rounded-button whitespace-nowrap">
<div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-3">
<div class="w-6 h-6 flex items-center justify-center">
<i class="ri-notification-line"></i>
</div>
</div>
<span class="text-sm font-medium text-gray-700">Announcement</span>
</button>
<button class="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-blue-50 transition-colors !rounded-button whitespace-nowrap">
<div class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mb-3">
<div class="w-6 h-6 flex items-center justify-center">
<i class="ri-file-chart-line"></i>
</div>
</div>
<span class="text-sm font-medium text-gray-700">Generate Report</span>
</button>
</div>
</div>
</main>
</div>
</div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/5.5.0/echarts.min.js"></script>
<script id="sidebar-toggle">
document.addEventListener('DOMContentLoaded', function() {
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
const header = document.querySelector('header');
const collapseBtn = document.querySelector('.collapse-btn');
collapseBtn.addEventListener('click', function() {
sidebar.classList.toggle('collapsed');
if (sidebar.classList.contains('collapsed')) {
mainContent.style.marginLeft = '70px';
header.style.left = '70px';
} else {
mainContent.style.marginLeft = '280px';
header.style.left = '280px';
}
});
});
</script>
<script id="enrollment-chart">
document.addEventListener('DOMContentLoaded', function() {
const enrollmentChart = echarts.init(document.getElementById('enrollment-chart'));
const option = {
animation: false,
tooltip: {
trigger: 'axis',
backgroundColor: 'rgba(255, 255, 255, 0.8)',
borderColor: '#E5E7EB',
borderWidth: 1,
textStyle: {
color: '#1F2937'
}
},
legend: {
data: ['New Students', 'Total Students'],
bottom: 0,
textStyle: {
color: '#1F2937'
}
},
grid: {
left: '3%',
right: '4%',
bottom: '15%',
top: '3%',
containLabel: true
},
xAxis: {
type: 'category',
boundaryGap: false,
data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
axisLine: {
lineStyle: {
color: '#E5E7EB'
}
},
axisLabel: {
color: '#1F2937'
}
},
yAxis: {
type: 'value',
axisLine: {
show: false
},
axisLabel: {
color: '#1F2937'
},
splitLine: {
lineStyle: {
color: '#E5E7EB'
}
}
},
series: [
{
name: 'New Students',
type: 'line',
smooth: true,
showSymbol: false,
itemStyle: {
color: 'rgba(87, 181, 231, 1)'
},
areaStyle: {
color: {
type: 'linear',
x: 0,
y: 0,
x2: 0,
y2: 1,
colorStops: [{
offset: 0, color: 'rgba(87, 181, 231, 0.2)'
}, {
offset: 1, color: 'rgba(87, 181, 231, 0.01)'
}]
}
},
data: [42, 58, 65, 53, 78, 86]
},
{
name: 'Total Students',
type: 'line',
smooth: true,
showSymbol: false,
itemStyle: {
color: 'rgba(141, 211, 199, 1)'
},
areaStyle: {
color: {
type: 'linear',
x: 0,
y: 0,
x2: 0,
y2: 1,
colorStops: [{
offset: 0, color: 'rgba(141, 211, 199, 0.2)'
}, {
offset: 1, color: 'rgba(141, 211, 199, 0.01)'
}]
}
},
data: [820, 932, 1001, 1134, 1290, 1330]
}
]
};
enrollmentChart.setOption(option);
window.addEventListener('resize', function() {
enrollmentChart.resize();
});
});
</script>
<script id="course-distribution-chart">
document.addEventListener('DOMContentLoaded', function() {
const courseDistributionChart = echarts.init(document.getElementById('course-distribution-chart'));
const option = {
animation: false,
tooltip: {
trigger: 'item',
backgroundColor: 'rgba(255, 255, 255, 0.8)',
borderColor: '#E5E7EB',
borderWidth: 1,
textStyle: {
color: '#1F2937'
},
formatter: '{a} <br/>{b}: {c} ({d}%)'
},
legend: {
orient: 'horizontal',
bottom: 0,
textStyle: {
color: '#1F2937'
}
},
series: [
{
name: 'Course Distribution',
type: 'pie',
radius: ['40%', '70%'],
avoidLabelOverlap: false,
itemStyle: {
borderRadius: 8,
borderColor: '#fff',
borderWidth: 2
},
label: {
show: false
},
emphasis: {
label: {
show: true,
fontSize: '12',
fontWeight: 'bold'
}
},
labelLine: {
show: false
},
data: [
{ value: 15, name: 'Computer Science', itemStyle: { color: 'rgba(87, 181, 231, 1)' } },
{ value: 10, name: 'Web Development', itemStyle: { color: 'rgba(141, 211, 199, 1)' } },
{ value: 8, name: 'Data Science', itemStyle: { color: 'rgba(251, 191, 114, 1)' } },
{ value: 9, name: 'Mobile Apps', itemStyle: { color: 'rgba(252, 141, 98, 1)' } }
]
}
]
};
courseDistributionChart.setOption(option);
window.addEventListener('resize', function() {
courseDistributionChart.resize();
});
});
</script>
<script id="role-switcher">
document.addEventListener('DOMContentLoaded', function() {
const roleRadios = document.querySelectorAll('input[name="role"]');
roleRadios.forEach(radio => {
radio.addEventListener('change', function() {
// In a real application, this would load different dashboard views
console.log(`Switched to ${this.id} role`);
});
});
});
</script>
</body>
</html>