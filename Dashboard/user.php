<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Micro Tech Center - User Management</title>
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
.user-detail-panel {
width: 0;
transition: width 0.3s ease, padding 0.3s ease;
overflow: hidden;
}
.user-detail-panel.open {
width: 400px;
padding: 1.5rem;
}
.date-range-picker {
display: none;
position: absolute;
top: 100%;
left: 0;
z-index: 10;
width: 300px;
background: white;
border-radius: 8px;
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
padding: 1rem;
margin-top: 0.5rem;
}
.date-range-picker.show {
display: block;
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
<a href="admin-dashboard.php" data-readdy="true" class="sidebar-link flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary rounded-lg mx-2 mb-1">
<div class="w-6 h-6 flex items-center justify-center">
<i class="ri-dashboard-line"></i>
</div>
<span class="ml-3 font-medium">Dashboard</span>
</a>
<a href="user.php" data-readdy="true" class="sidebar-link flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary rounded-lg mx-2 mb-1 bg-blue-50 text-primary">
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
<img src="https://readdy.ai/api/search-image?query=professional%252520headshot%252520of%252520an%252520indian%252520man%252520with%252520glasses%252520in%252520formal%252520attire%252520on%252520white%252520background%252C%252520high%252520quality%252C%252520professional%252520looking%252C%252520warm%252520smile%252C%252520approachable&width=100&height=100&seq=profile1&orientation=squarish" alt="User" class="w-10 h-10 rounded-full object-cover object-top">
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
<img src="https://readdy.ai/api/search-image?query=professional%252520headshot%252520of%252520an%252520indian%252520man%252520with%252520glasses%252520in%252520formal%252520attire%252520on%252520white%252520background%252C%252520high%252520quality%252C%252520professional%252520looking%252C%252520warm%252520smile%252C%252520approachable&width=100&height=100&seq=profile1&orientation=squarish" alt="User" class="w-10 h-10 rounded-full object-cover object-top">
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
<!-- Breadcrumb -->
<div class="flex items-center mb-6 text-sm">
<a href="https://readdy.ai/home/68e7f43b-ac6c-462a-b951-e25b1fa353ad/27a9fd5d-3509-42f2-b7d0-883e71322654" data-readdy="true" class="text-gray-500 hover:text-primary">Dashboard</a>
<div class="w-4 h-4 flex items-center justify-center text-gray-400 mx-1">
<i class="ri-arrow-right-s-line"></i>
</div>
<span class="text-gray-700 font-medium">Users</span>
</div>
<!-- Page Header -->
<div class="flex justify-between items-center mb-8">
<div>
<h1 class="text-2xl font-bold text-gray-800">User Management</h1>
<p class="text-gray-600">Manage all users, permissions, and activities</p>
</div>
<button class="bg-primary text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-primary/90 flex items-center whitespace-nowrap" id="add-user-btn">
<div class="w-4 h-4 flex items-center justify-center mr-1">
<i class="ri-user-add-line"></i>
</div>
Add New User
</button>
</div>
<div class="flex flex-1">
<!-- Main User List Content -->
<div class="flex-1 transition-all" id="main-content-area">
<!-- Filters and Search -->
<div class="bg-white rounded-lg shadow-sm p-6 mb-6">
<div class="flex flex-wrap gap-4 mb-4">
<div class="custom-select-wrapper">
<select id="role-filter" class="bg-gray-100 border-none rounded-lg py-2 pl-4 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
<option value="all">All Roles</option>
<option value="admin">Admin</option>
<option value="teacher">Teacher</option>
<option value="student">Student</option>
<option value="counselor">Counselor</option>
</select>
<div class="custom-select-icon w-4 h-4 flex items-center justify-center text-gray-500">
<i class="ri-arrow-down-s-line"></i>
</div>
</div>
<div class="custom-select-wrapper">
<select id="status-filter" class="bg-gray-100 border-none rounded-lg py-2 pl-4 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
<option value="all">All Status</option>
<option value="active">Active</option>
<option value="inactive">Inactive</option>
<option value="pending">Pending</option>
</select>
<div class="custom-select-icon w-4 h-4 flex items-center justify-center text-gray-500">
<i class="ri-arrow-down-s-line"></i>
</div>
</div>
<div class="custom-select-wrapper relative">
<button id="date-range-btn" class="bg-gray-100 border-none rounded-lg py-2 pl-4 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none flex items-center whitespace-nowrap">
<div class="w-4 h-4 flex items-center justify-center mr-2 text-gray-500">
<i class="ri-calendar-line"></i>
</div>
<span>Date Joined</span>
</button>
<div class="custom-select-icon w-4 h-4 flex items-center justify-center text-gray-500">
<i class="ri-arrow-down-s-line"></i>
</div>
<div class="date-range-picker" id="date-range-picker">
<div class="mb-4">
<label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
<input type="date" class="w-full bg-gray-100 border-none rounded-lg py-2 px-3 text-sm">
</div>
<div class="mb-4">
<label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
<input type="date" class="w-full bg-gray-100 border-none rounded-lg py-2 px-3 text-sm">
</div>
<div class="flex justify-between">
<button class="bg-gray-200 text-gray-700 px-3 py-1 rounded-button text-sm hover:bg-gray-300 whitespace-nowrap">Clear</button>
<button class="bg-primary text-white px-3 py-1 rounded-button text-sm hover:bg-primary/90 whitespace-nowrap">Apply</button>
</div>
</div>
</div>
<div class="relative flex-1 min-w-[200px]">
<input type="text" placeholder="Search users..." class="w-full h-10 pl-10 pr-4 rounded-lg border-none bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm">
<div class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-400">
<i class="ri-search-line"></i>
</div>
</div>
<div class="custom-select-wrapper ml-auto">
<button id="bulk-actions-btn" class="bg-gray-100 border-none rounded-lg py-2 px-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 flex items-center whitespace-nowrap">
<div class="w-4 h-4 flex items-center justify-center mr-1 text-gray-500">
<i class="ri-settings-line"></i>
</div>
Bulk Actions
<div class="w-4 h-4 flex items-center justify-center ml-1 text-gray-500">
<i class="ri-arrow-down-s-line"></i>
</div>
</button>
</div>
</div>
<div class="flex flex-wrap gap-2 mt-4">
<span class="bg-blue-100 text-blue-800 rounded-full text-xs px-3 py-1 flex items-center">
Role: All
<button class="ml-1 w-4 h-4 flex items-center justify-center text-blue-800">
<i class="ri-close-line"></i>
</button>
</span>
<span class="bg-green-100 text-green-800 rounded-full text-xs px-3 py-1 flex items-center">
Status: Active
<button class="ml-1 w-4 h-4 flex items-center justify-center text-green-800">
<i class="ri-close-line"></i>
</button>
</span>
<span class="bg-purple-100 text-purple-800 rounded-full text-xs px-3 py-1 flex items-center">
Date: Last 30 days
<button class="ml-1 w-4 h-4 flex items-center justify-center text-purple-800">
<i class="ri-close-line"></i>
</button>
</span>
<button class="text-primary text-xs hover:underline ml-2">Clear All</button>
</div>
</div>
<!-- Users Table -->
<div class="bg-white rounded-lg shadow-sm p-6 mb-6">
<div class="overflow-x-auto">
<table class="w-full">
<thead>
<tr class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
<th class="px-4 py-3">
<div class="flex items-center">
<input type="checkbox" id="select-all" class="custom-checkbox">
<label for="select-all" class="sr-only">Select All</label>
</div>
</th>
<th class="px-4 py-3">
<div class="flex items-center">
<span>User</span>
<button class="ml-1 w-4 h-4 flex items-center justify-center text-gray-400">
<i class="ri-arrow-down-s-line"></i>
</button>
</div>
</th>
<th class="px-4 py-3">
<div class="flex items-center">
<span>Role</span>
<button class="ml-1 w-4 h-4 flex items-center justify-center text-gray-400">
<i class="ri-arrow-down-s-line"></i>
</button>
</div>
</th>
<th class="px-4 py-3">
<div class="flex items-center">
<span>Status</span>
<button class="ml-1 w-4 h-4 flex items-center justify-center text-gray-400">
<i class="ri-arrow-down-s-line"></i>
</button>
</div>
</th>
<th class="px-4 py-3">
<div class="flex items-center">
<span>Date Joined</span>
<button class="ml-1 w-4 h-4 flex items-center justify-center text-gray-400">
<i class="ri-arrow-down-s-line"></i>
</button>
</div>
</th>
<th class="px-4 py-3">
<div class="flex items-center">
<span>Last Login</span>
<button class="ml-1 w-4 h-4 flex items-center justify-center text-gray-400">
<i class="ri-arrow-down-s-line"></i>
</button>
</div>
</th>
<th class="px-4 py-3 text-right">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-gray-100">
<tr class="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer user-row" data-user-id="1">
<td class="px-4 py-3">
<div class="flex items-center">
<input type="checkbox" id="user-1" class="custom-checkbox user-checkbox">
<label for="user-1" class="sr-only">Select User</label>
</div>
</td>
<td class="px-4 py-3">
<div class="flex items-center">
<img src="https://readdy.ai/api/search-image?query=professional%252520headshot%252520of%252520an%252520indian%252520woman%252520with%252520long%252520black%252520hair%252520in%252520formal%252520attire%252520on%252520white%252520background%252C%252520high%252520quality%252C%252520professional%252520looking%252C%252520warm%252520smile%252C%252520approachable&width=100&height=100&seq=profile2&orientation=squarish" alt="User" class="w-8 h-8 rounded-full object-cover object-top mr-3">
<div>
<div class="font-medium">Priya Sharma</div>
<div class="text-xs text-gray-500">priya.sharma@microtech.edu</div>
</div>
</div>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Teacher</span>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
</td>
<td class="px-4 py-3">May 12, 2023</td>
<td class="px-4 py-3">June 28, 2025</td>
<td class="px-4 py-3">
<div class="flex space-x-2 justify-end">
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
<button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-more-2-fill"></i>
</div>
</button>
</div>
</td>
</tr>
<tr class="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer user-row" data-user-id="2">
<td class="px-4 py-3">
<div class="flex items-center">
<input type="checkbox" id="user-2" class="custom-checkbox user-checkbox">
<label for="user-2" class="sr-only">Select User</label>
</div>
</td>
<td class="px-4 py-3">
<div class="flex items-center">
<img src="https://readdy.ai/api/search-image?query=professional%252520headshot%252520of%252520a%252520young%252520indian%252520man%252520in%252520casual%252520business%252520attire%252520on%252520white%252520background%252C%252520high%252520quality%252C%252520professional%252520looking%252C%252520warm%252520smile%252C%252520approachable&width=100&height=100&seq=profile3&orientation=squarish" alt="User" class="w-8 h-8 rounded-full object-cover object-top mr-3">
<div>
<div class="font-medium">Arjun Nair</div>
<div class="text-xs text-gray-500">arjun.nair@microtech.edu</div>
</div>
</div>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Student</span>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
</td>
<td class="px-4 py-3">Jan 5, 2024</td>
<td class="px-4 py-3">June 29, 2025</td>
<td class="px-4 py-3">
<div class="flex space-x-2 justify-end">
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
<button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-more-2-fill"></i>
</div>
</button>
</div>
</td>
</tr>
<tr class="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer user-row" data-user-id="3">
<td class="px-4 py-3">
<div class="flex items-center">
<input type="checkbox" id="user-3" class="custom-checkbox user-checkbox">
<label for="user-3" class="sr-only">Select User</label>
</div>
</td>
<td class="px-4 py-3">
<div class="flex items-center">
<img src="https://readdy.ai/api/search-image?query=professional%252520headshot%252520of%252520a%252520middle-aged%252520indian%252520woman%252520with%252520short%252520hair%252520in%252520formal%252520business%252520attire%252520on%252520white%252520background%252C%252520high%252520quality%252C%252520professional%252520looking%252C%252520warm%252520smile%252C%252520approachable&width=100&height=100&seq=profile4&orientation=squarish" alt="User" class="w-8 h-8 rounded-full object-cover object-top mr-3">
<div>
<div class="font-medium">Lakshmi Menon</div>
<div class="text-xs text-gray-500">lakshmi.m@microtech.edu</div>
</div>
</div>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">Counselor</span>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
</td>
<td class="px-4 py-3">Nov 18, 2022</td>
<td class="px-4 py-3">June 25, 2025</td>
<td class="px-4 py-3">
<div class="flex space-x-2 justify-end">
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
<button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-more-2-fill"></i>
</div>
</button>
</div>
</td>
</tr>
<tr class="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer user-row" data-user-id="4">
<td class="px-4 py-3">
<div class="flex items-center">
<input type="checkbox" id="user-4" class="custom-checkbox user-checkbox">
<label for="user-4" class="sr-only">Select User</label>
</div>
</td>
<td class="px-4 py-3">
<div class="flex items-center">
<img src="https://readdy.ai/api/search-image?query=professional%252520headshot%252520of%252520an%252520indian%252520man%252520in%252520his%25252050s%252520with%252520salt%252520and%252520pepper%252520hair%252520in%252520formal%252520attire%252520on%252520white%252520background%252C%252520high%252520quality%252C%252520professional%252520looking%252C%252520warm%252520smile%252C%252520approachable&width=100&height=100&seq=profile5&orientation=squarish" alt="User" class="w-8 h-8 rounded-full object-cover object-top mr-3">
<div>
<div class="font-medium">Sanjay Pillai</div>
<div class="text-xs text-gray-500">sanjay.p@microtech.edu</div>
</div>
</div>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Admin</span>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
</td>
<td class="px-4 py-3">Aug 3, 2021</td>
<td class="px-4 py-3">June 29, 2025</td>
<td class="px-4 py-3">
<div class="flex space-x-2 justify-end">
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
<button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-more-2-fill"></i>
</div>
</button>
</div>
</td>
</tr>
<tr class="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer user-row" data-user-id="5">
<td class="px-4 py-3">
<div class="flex items-center">
<input type="checkbox" id="user-5" class="custom-checkbox user-checkbox">
<label for="user-5" class="sr-only">Select User</label>
</div>
</td>
<td class="px-4 py-3">
<div class="flex items-center">
<img src="https://readdy.ai/api/search-image?query=professional%252520headshot%252520of%252520a%252520young%252520indian%252520woman%252520with%252520glasses%252520in%252520casual%252520business%252520attire%252520on%252520white%252520background%252C%252520high%252520quality%252C%252520professional%252520looking%252C%252520warm%252520smile%252C%252520approachable&width=100&height=100&seq=profile6&orientation=squarish" alt="User" class="w-8 h-8 rounded-full object-cover object-top mr-3">
<div>
<div class="font-medium">Meera Krishnan</div>
<div class="text-xs text-gray-500">meera.k@microtech.edu</div>
</div>
</div>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Student</span>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>
</td>
<td class="px-4 py-3">Jun 15, 2024</td>
<td class="px-4 py-3">Never</td>
<td class="px-4 py-3">
<div class="flex space-x-2 justify-end">
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
<button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-more-2-fill"></i>
</div>
</button>
</div>
</td>
</tr>
<tr class="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer user-row" data-user-id="6">
<td class="px-4 py-3">
<div class="flex items-center">
<input type="checkbox" id="user-6" class="custom-checkbox user-checkbox">
<label for="user-6" class="sr-only">Select User</label>
</div>
</td>
<td class="px-4 py-3">
<div class="flex items-center">
<img src="https://readdy.ai/api/search-image?query=professional%252520headshot%252520of%252520a%252520middle-aged%252520indian%252520man%252520with%252520beard%252520in%252520business%252520casual%252520attire%252520on%252520white%252520background%252C%252520high%252520quality%252C%252520professional%252520looking%252C%252520warm%252520smile%252C%252520approachable&width=100&height=100&seq=profile7&orientation=squarish" alt="User" class="w-8 h-8 rounded-full object-cover object-top mr-3">
<div>
<div class="font-medium">Vikram Iyer</div>
<div class="text-xs text-gray-500">vikram.i@microtech.edu</div>
</div>
</div>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Teacher</span>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Inactive</span>
</td>
<td class="px-4 py-3">Feb 10, 2023</td>
<td class="px-4 py-3">March 15, 2025</td>
<td class="px-4 py-3">
<div class="flex space-x-2 justify-end">
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
<button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-more-2-fill"></i>
</div>
</button>
</div>
</td>
</tr>
<tr class="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer user-row" data-user-id="7">
<td class="px-4 py-3">
<div class="flex items-center">
<input type="checkbox" id="user-7" class="custom-checkbox user-checkbox">
<label for="user-7" class="sr-only">Select User</label>
</div>
</td>
<td class="px-4 py-3">
<div class="flex items-center">
<img src="https://readdy.ai/api/search-image?query=professional%252520headshot%252520of%252520a%252520young%252520indian%252520woman%252520with%252520curly%252520hair%252520in%252520business%252520casual%252520attire%252520on%252520white%252520background%252C%252520high%252520quality%252C%252520professional%252520looking%252C%252520warm%252520smile%252C%252520approachable&width=100&height=100&seq=profile8&orientation=squarish" alt="User" class="w-8 h-8 rounded-full object-cover object-top mr-3">
<div>
<div class="font-medium">Ananya Desai</div>
<div class="text-xs text-gray-500">ananya.d@microtech.edu</div>
</div>
</div>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Student</span>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
</td>
<td class="px-4 py-3">Apr 22, 2024</td>
<td class="px-4 py-3">June 27, 2025</td>
<td class="px-4 py-3">
<div class="flex space-x-2 justify-end">
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
<button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-more-2-fill"></i>
</div>
</button>
</div>
</td>
</tr>
<tr class="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer user-row" data-user-id="8">
<td class="px-4 py-3">
<div class="flex items-center">
<input type="checkbox" id="user-8" class="custom-checkbox user-checkbox">
<label for="user-8" class="sr-only">Select User</label>
</div>
</td>
<td class="px-4 py-3">
<div class="flex items-center">
<img src="https://readdy.ai/api/search-image?query=professional%252520headshot%252520of%252520a%252520young%252520indian%252520man%252520with%252520stylish%252520haircut%252520in%252520business%252520casual%252520attire%252520on%252520white%252520background%252C%252520high%252520quality%252C%252520professional%252520looking%252C%252520warm%252520smile%252C%252520approachable&width=100&height=100&seq=profile9&orientation=squarish" alt="User" class="w-8 h-8 rounded-full object-cover object-top mr-3">
<div>
<div class="font-medium">Rohan Mehta</div>
<div class="text-xs text-gray-500">rohan.m@microtech.edu</div>
</div>
</div>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Student</span>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
</td>
<td class="px-4 py-3">Mar 8, 2024</td>
<td class="px-4 py-3">June 28, 2025</td>
<td class="px-4 py-3">
<div class="flex space-x-2 justify-end">
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
<button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-more-2-fill"></i>
</div>
</button>
</div>
</td>
</tr>
<tr class="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer user-row" data-user-id="9">
<td class="px-4 py-3">
<div class="flex items-center">
<input type="checkbox" id="user-9" class="custom-checkbox user-checkbox">
<label for="user-9" class="sr-only">Select User</label>
</div>
</td>
<td class="px-4 py-3">
<div class="flex items-center">
<img src="https://readdy.ai/api/search-image?query=professional%252520headshot%252520of%252520a%252520middle-aged%252520indian%252520woman%252520with%252520elegant%252520hairstyle%252520in%252520formal%252520business%252520attire%252520on%252520white%252520background%252C%252520high%252520quality%252C%252520professional%252520looking%252C%252520warm%252520smile%252C%252520approachable&width=100&height=100&seq=profile10&orientation=squarish" alt="User" class="w-8 h-8 rounded-full object-cover object-top mr-3">
<div>
<div class="font-medium">Sunita Patel</div>
<div class="text-xs text-gray-500">sunita.p@microtech.edu</div>
</div>
</div>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">Counselor</span>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
</td>
<td class="px-4 py-3">Sep 14, 2022</td>
<td class="px-4 py-3">June 26, 2025</td>
<td class="px-4 py-3">
<div class="flex space-x-2 justify-end">
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
<button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-more-2-fill"></i>
</div>
</button>
</div>
</td>
</tr>
<tr class="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer user-row" data-user-id="10">
<td class="px-4 py-3">
<div class="flex items-center">
<input type="checkbox" id="user-10" class="custom-checkbox user-checkbox">
<label for="user-10" class="sr-only">Select User</label>
</div>
</td>
<td class="px-4 py-3">
<div class="flex items-center">
<img src="https://readdy.ai/api/search-image?query=professional%252520headshot%252520of%252520an%252520indian%252520man%252520in%252520his%25252040s%252520with%252520professional%252520appearance%252520in%252520formal%252520attire%252520on%252520white%252520background%252C%252520high%252520quality%252C%252520professional%252520looking%252C%252520warm%252520smile%252C%252520approachable&width=100&height=100&seq=profile11&orientation=squarish" alt="User" class="w-8 h-8 rounded-full object-cover object-top mr-3">
<div>
<div class="font-medium">Anil Verma</div>
<div class="text-xs text-gray-500">anil.v@microtech.edu</div>
</div>
</div>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Admin</span>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
</td>
<td class="px-4 py-3">Jul 20, 2021</td>
<td class="px-4 py-3">June 29, 2025</td>
<td class="px-4 py-3">
<div class="flex space-x-2 justify-end">
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
<button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-more-2-fill"></i>
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
<p class="text-sm text-gray-500">Showing 1-10 of 42 users</p>
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
<!-- Recent Activity -->
<div class="bg-white rounded-lg shadow-sm p-6">
<div class="flex justify-between items-center mb-6">
<h3 class="text-lg font-semibold text-gray-800">Recent User Activity</h3>
<button class="text-primary text-sm font-medium hover:underline !rounded-button whitespace-nowrap">View All Activity</button>
</div>
<div class="space-y-4">
<div class="flex items-start">
<div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary mr-3 flex-shrink-0">
<div class="w-5 h-5 flex items-center justify-center">
<i class="ri-login-circle-line"></i>
</div>
</div>
<div>
<p class="text-sm text-gray-800">
<span class="font-medium">Arjun Nair</span> logged in from a new device
</p>
<p class="text-xs text-gray-500 mt-1">10 minutes ago</p>
</div>
</div>
<div class="flex items-start">
<div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 flex-shrink-0">
<div class="w-5 h-5 flex items-center justify-center">
<i class="ri-edit-line"></i>
</div>
</div>
<div>
<p class="text-sm text-gray-800">
<span class="font-medium">Sanjay Pillai</span> updated Priya Sharma's role from Student to Teacher
</p>
<p class="text-xs text-gray-500 mt-1">1 hour ago</p>
</div>
</div>
<div class="flex items-start">
<div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3 flex-shrink-0">
<div class="w-5 h-5 flex items-center justify-center">
<i class="ri-delete-bin-line"></i>
</div>
</div>
<div>
<p class="text-sm text-gray-800">
<span class="font-medium">Anil Verma</span> deleted user account for Rahul Gupta
</p>
<p class="text-xs text-gray-500 mt-1">3 hours ago</p>
</div>
</div>
<div class="flex items-start">
<div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3 flex-shrink-0">
<div class="w-5 h-5 flex items-center justify-center">
<i class="ri-user-add-line"></i>
</div>
</div>
<div>
<p class="text-sm text-gray-800">
<span class="font-medium">Lakshmi Menon</span> created a new user account for Meera Krishnan
</p>
<p class="text-xs text-gray-500 mt-1">Yesterday</p>
</div>
</div>
<div class="flex items-start">
<div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mr-3 flex-shrink-0">
<div class="w-5 h-5 flex items-center justify-center">
<i class="ri-lock-line"></i>
</div>
</div>
<div>
<p class="text-sm text-gray-800">
<span class="font-medium">System</span> locked Vikram Iyer's account due to multiple failed login attempts
</p>
<p class="text-xs text-gray-500 mt-1">2 days ago</p>
</div>
</div>
</div>
</div>
</div>
<!-- User Detail Panel (Hidden by default) -->
<div class="user-detail-panel bg-white shadow-lg h-full fixed top-0 right-0 mt-16 overflow-y-auto z-20" id="user-detail-panel">
<div class="flex justify-between items-center mb-6">
<h3 class="text-lg font-semibold text-gray-800">User Details</h3>
<button id="close-detail-panel" class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-close-line"></i>
</div>
</button>
</div>
<!-- User Profile Header -->
<div class="flex flex-col items-center mb-6 pb-6 border-b">
<img src="https://readdy.ai/api/search-image?query=professional%252520headshot%252520of%252520an%252520indian%252520woman%252520with%252520long%252520black%252520hair%252520in%252520formal%252520attire%252520on%252520white%252520background%252C%252520high%252520quality%252C%252520professional%252520looking%252C%252520warm%252520smile%252C%252520approachable&width=100&height=100&seq=profile2&orientation=squarish" alt="User" class="w-24 h-24 rounded-full object-cover object-top mb-3">
<h4 class="text-xl font-semibold text-gray-800">Priya Sharma</h4>
<p class="text-sm text-gray-500">priya.sharma@microtech.edu</p>
<div class="flex mt-3 space-x-2">
<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Teacher</span>
<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
</div>
</div>
<!-- Tabs -->
<div class="flex border-b mb-6">
<button class="px-4 py-2 text-sm font-medium text-primary border-b-2 border-primary">Basic Info</button>
<button class="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Permissions</button>
<button class="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Activity</button>
<button class="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Sessions</button>
</div>
<!-- Basic Information -->
<div class="mb-6">
<h5 class="text-sm font-semibold text-gray-700 mb-3">Basic Information</h5>
<div class="grid grid-cols-1 gap-4">
<div>
<label class="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
<p class="text-sm text-gray-800">Priya Sharma</p>
</div>
<div>
<label class="block text-xs font-medium text-gray-500 mb-1">Email Address</label>
<p class="text-sm text-gray-800">priya.sharma@microtech.edu</p>
</div>
<div>
<label class="block text-xs font-medium text-gray-500 mb-1">Phone Number</label>
<p class="text-sm text-gray-800">+91 98765 43210</p>
</div>
<div>
<label class="block text-xs font-medium text-gray-500 mb-1">Date of Birth</label>
<p class="text-sm text-gray-800">March 15, 1985</p>
</div>
<div>
<label class="block text-xs font-medium text-gray-500 mb-1">Address</label>
<p class="text-sm text-gray-800">123 MG Road, Bangalore, Karnataka, India - 560001</p>
</div>
</div>
</div>
<!-- Employment Information -->
<div class="mb-6">
<h5 class="text-sm font-semibold text-gray-700 mb-3">Employment Information</h5>
<div class="grid grid-cols-1 gap-4">
<div>
<label class="block text-xs font-medium text-gray-500 mb-1">Employee ID</label>
<p class="text-sm text-gray-800">TCH-2023-042</p>
</div>
<div>
<label class="block text-xs font-medium text-gray-500 mb-1">Department</label>
<p class="text-sm text-gray-800">Computer Science</p>
</div>
<div>
<label class="block text-xs font-medium text-gray-500 mb-1">Designation</label>
<p class="text-sm text-gray-800">Senior Instructor</p>
</div>
<div>
<label class="block text-xs font-medium text-gray-500 mb-1">Joined Date</label>
<p class="text-sm text-gray-800">May 12, 2023</p>
</div>
</div>
</div>
<!-- Courses Teaching -->
<div class="mb-6">
<h5 class="text-sm font-semibold text-gray-700 mb-3">Courses Teaching</h5>
<div class="space-y-2">
<div class="bg-gray-50 p-3 rounded">
<p class="text-sm font-medium text-gray-800">Introduction to Programming</p>
<p class="text-xs text-gray-500">CS101 • 42 Students</p>
</div>
<div class="bg-gray-50 p-3 rounded">
<p class="text-sm font-medium text-gray-800">Web Development Fundamentals</p>
<p class="text-xs text-gray-500">CS205 • 38 Students</p>
</div>
<div class="bg-gray-50 p-3 rounded">
<p class="text-sm font-medium text-gray-800">Advanced Python Programming</p>
<p class="text-xs text-gray-500">CS302 • 25 Students</p>
</div>
</div>
</div>
<!-- Action Buttons -->
<div class="flex space-x-3 mt-8">
<button class="flex-1 bg-primary text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-primary/90 flex items-center justify-center whitespace-nowrap">
<div class="w-4 h-4 flex items-center justify-center mr-1">
<i class="ri-edit-line"></i>
</div>
Edit User
</button>
<button class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-button text-sm font-medium hover:bg-gray-200 flex items-center justify-center whitespace-nowrap">
<div class="w-4 h-4 flex items-center justify-center mr-1">
<i class="ri-lock-line"></i>
</div>
Reset Password
</button>
<button class="w-10 h-10 rounded-button flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-delete-bin-line"></i>
</div>
</button>
</div>
</div>
</div>
</main>
</div>
</div>
<!-- Add User Modal -->
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden" id="add-user-modal">
<div class="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
<div class="p-6">
<div class="flex justify-between items-center mb-6">
<h3 class="text-lg font-semibold text-gray-800">Add New User</h3>
<button id="close-modal-btn" class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-close-line"></i>
</div>
</button>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
<div>
<label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
<input type="text" class="w-full bg-gray-100 border-none rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
</div>
<div>
<label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
<input type="text" class="w-full bg-gray-100 border-none rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
</div>
<div>
<label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
<input type="email" class="w-full bg-gray-100 border-none rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
</div>
<div>
<label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
<input type="tel" class="w-full bg-gray-100 border-none rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
</div>
<div>
<label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
<div class="custom-select-wrapper">
<select class="w-full bg-gray-100 border-none rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
<option>Select Role</option>
<option>Admin</option>
<option>Teacher</option>
<option>Student</option>
<option>Counselor</option>
</select>
<div class="custom-select-icon w-4 h-4 flex items-center justify-center text-gray-500">
<i class="ri-arrow-down-s-line"></i>
</div>
</div>
</div>
<div>
<label class="block text-sm font-medium text-gray-700 mb-1">Department</label>
<div class="custom-select-wrapper">
<select class="w-full bg-gray-100 border-none rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
<option>Select Department</option>
<option>Computer Science</option>
<option>Information Technology</option>
<option>Data Science</option>
<option>Networking</option>
<option>Administration</option>
</select>
<div class="custom-select-icon w-4 h-4 flex items-center justify-center text-gray-500">
<i class="ri-arrow-down-s-line"></i>
</div>
</div>
</div>
<div>
<label class="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
<input type="date" class="w-full bg-gray-100 border-none rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
</div>
<div>
<label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
<div class="custom-select-wrapper">
<select class="w-full bg-gray-100 border-none rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
<option>Select Gender</option>
<option>Male</option>
<option>Female</option>
<option>Other</option>
<option>Prefer not to say</option>
</select>
<div class="custom-select-icon w-4 h-4 flex items-center justify-center text-gray-500">
<i class="ri-arrow-down-s-line"></i>
</div>
</div>
</div>
</div>
<div class="mb-6">
<label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
<textarea class="w-full bg-gray-100 border-none rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 h-20"></textarea>
</div>
<div class="mb-6">
<h4 class="text-sm font-semibold text-gray-700 mb-3">Permissions</h4>
<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
<div>
<input type="checkbox" id="perm-view-users" class="custom-checkbox">
<label for="perm-view-users">View Users</label>
</div>
<div>
<input type="checkbox" id="perm-manage-users" class="custom-checkbox">
<label for="perm-manage-users">Manage Users</label>
</div>
<div>
<input type="checkbox" id="perm-view-courses" class="custom-checkbox">
<label for="perm-view-courses">View Courses</label>
</div>
<div>
<input type="checkbox" id="perm-manage-courses" class="custom-checkbox">
<label for="perm-manage-courses">Manage Courses</label>
</div>
<div>
<input type="checkbox" id="perm-view-reports" class="custom-checkbox">
<label for="perm-view-reports">View Reports</label>
</div>
<div>
<input type="checkbox" id="perm-manage-settings" class="custom-checkbox">
<label for="perm-manage-settings">Manage Settings</label>
</div>
</div>
</div>
<div class="mb-6">
<h4 class="text-sm font-semibold text-gray-700 mb-3">Account Settings</h4>
<div class="flex items-center mb-3">
<input type="checkbox" id="send-welcome-email" class="custom-checkbox" checked>
<label for="send-welcome-email">Send welcome email with login instructions</label>
</div>
<div class="flex items-center">
<input type="checkbox" id="require-password-change" class="custom-checkbox" checked>
<label for="require-password-change">Require password change on first login</label>
</div>
</div>
<div class="flex justify-end space-x-3">
<button class="bg-gray-100 text-gray-700 px-4 py-2 rounded-button text-sm font-medium hover:bg-gray-200 whitespace-nowrap">Cancel</button>
<button class="bg-primary text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-primary/90 whitespace-nowrap">Create User</button>
</div>
</div>
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
<script id="user-detail-panel">
document.addEventListener('DOMContentLoaded', function() {
const userRows = document.querySelectorAll('.user-row');
const userDetailPanel = document.getElementById('user-detail-panel');
const closeDetailPanelBtn = document.getElementById('close-detail-panel');
const mainContentArea = document.getElementById('main-content-area');
userRows.forEach(row => {
row.addEventListener('click', function(e) {
// Prevent click on checkbox or action buttons from opening panel
if (e.target.closest('.custom-checkbox') || e.target.closest('button')) {
return;
}
userDetailPanel.classList.add('open');
mainContentArea.classList.add('pr-[400px]');
});
});
closeDetailPanelBtn.addEventListener('click', function() {
userDetailPanel.classList.remove('open');
mainContentArea.classList.remove('pr-[400px]');
});
});
</script>
<script id="date-range-picker">
document.addEventListener('DOMContentLoaded', function() {
const dateRangeBtn = document.getElementById('date-range-btn');
const dateRangePicker = document.getElementById('date-range-picker');
dateRangeBtn.addEventListener('click', function() {
dateRangePicker.classList.toggle('show');
});
// Close date picker when clicking outside
document.addEventListener('click', function(e) {
if (!dateRangeBtn.contains(e.target) && !dateRangePicker.contains(e.target)) {
dateRangePicker.classList.remove('show');
}
});
});
</script>
<script id="add-user-modal">
document.addEventListener('DOMContentLoaded', function() {
const addUserBtn = document.getElementById('add-user-btn');
const addUserModal = document.getElementById('add-user-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
addUserBtn.addEventListener('click', function() {
addUserModal.classList.remove('hidden');
});
closeModalBtn.addEventListener('click', function() {
addUserModal.classList.add('hidden');
});
// Close modal when clicking outside
addUserModal.addEventListener('click', function(e) {
if (e.target === addUserModal) {
addUserModal.classList.add('hidden');
}
});
});
</script>
<script id="select-all-checkboxes">
document.addEventListener('DOMContentLoaded', function() {
const selectAllCheckbox = document.getElementById('select-all');
const userCheckboxes = document.querySelectorAll('.user-checkbox');
selectAllCheckbox.addEventListener('change', function() {
userCheckboxes.forEach(checkbox => {
checkbox.checked = selectAllCheckbox.checked;
});
});
userCheckboxes.forEach(checkbox => {
checkbox.addEventListener('change', function() {
const allChecked = Array.from(userCheckboxes).every(c => c.checked);
const someChecked = Array.from(userCheckboxes).some(c => c.checked);
selectAllCheckbox.checked = allChecked;
// This would require custom styling for indeterminate state
selectAllCheckbox.indeterminate = someChecked && !allChecked;
});
});
});
</script>
</body>
</html>