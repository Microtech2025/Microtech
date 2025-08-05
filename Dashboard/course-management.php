<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Micro Tech Center - Course Management</title>
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
.course-detail-panel {
width: 0;
transition: width 0.3s ease, padding 0.3s ease;
overflow: hidden;
}
.course-detail-panel.open {
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
<a href="user.php" data-readdy="true" class="sidebar-link flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary rounded-lg mx-2 mb-1">
<div class="w-6 h-6 flex items-center justify-center">
<i class="ri-user-line"></i>
</div>
<span class="ml-3 font-medium">Users</span>
</a>
<a href="course-management.php" class="sidebar-link flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-primary rounded-lg mx-2 mb-1 bg-blue-50 text-primary">
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
<img src="./I will do something especial for you.jfif" alt="User" class="w-10 h-10 rounded-full object-cover object-top">
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
<!-- Breadcrumb -->
<div class="flex items-center mb-6 text-sm">
<a href="https://readdy.ai/home/68e7f43b-ac6c-462a-b951-e25b1fa353ad/27a9fd5d-3509-42f2-b7d0-883e71322654" data-readdy="true" class="text-gray-500 hover:text-primary">Dashboard</a>
<div class="w-4 h-4 flex items-center justify-center text-gray-400 mx-1">
<i class="ri-arrow-right-s-line"></i>
</div>
<span class="text-gray-700 font-medium">Courses</span>
</div>
<!-- Page Header -->
<div class="flex justify-between items-center mb-8">
<div>
<h1 class="text-2xl font-bold text-gray-800">Course Management</h1>
<p class="text-gray-600">Manage all courses, schedules, and enrollments</p>
</div>
<button class="bg-primary text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-primary/90 flex items-center whitespace-nowrap" id="add-course-btn">
<div class="w-4 h-4 flex items-center justify-center mr-1">
<i class="ri-add-line"></i>
</div>
Add New Course
</button>
</div>
<div class="flex flex-1">
<!-- Main Course List Content -->
<div class="flex-1 transition-all" id="main-content-area">
<!-- Filters and Search -->
<div class="bg-white rounded-lg shadow-sm p-6 mb-6">
<div class="flex flex-wrap gap-4 mb-4">
<div class="custom-select-wrapper">
<select id="department-filter" class="bg-gray-100 border-none rounded-lg py-2 pl-4 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
<option value="all">All Departments</option>
<option value="cs">Computer Science</option>
<option value="it">Information Technology</option>
<option value="ds">Data Science</option>
<option value="nw">Networking</option>
<option value="cy">Cybersecurity</option>
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
<option value="archived">Archived</option>
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
<span>Start Date</span>
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
<input type="text" placeholder="Search courses..." class="w-full h-10 pl-10 pr-4 rounded-lg border-none bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm">
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
Department: Computer Science
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
Date: Current Term
<button class="ml-1 w-4 h-4 flex items-center justify-center text-purple-800">
<i class="ri-close-line"></i>
</button>
</span>
<button class="text-primary text-xs hover:underline ml-2">Clear All</button>
</div>
</div>
<!-- Courses Table -->
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
<span>Course</span>
<button class="ml-1 w-4 h-4 flex items-center justify-center text-gray-400">
<i class="ri-arrow-down-s-line"></i>
</button>
</div>
</th>
<th class="px-4 py-3">
<div class="flex items-center">
<span>Department</span>
<button class="ml-1 w-4 h-4 flex items-center justify-center text-gray-400">
<i class="ri-arrow-down-s-line"></i>
</button>
</div>
</th>
<th class="px-4 py-3">
<div class="flex items-center">
<span>Instructor</span>
<button class="ml-1 w-4 h-4 flex items-center justify-center text-gray-400">
<i class="ri-arrow-down-s-line"></i>
</button>
</div>
</th>
<th class="px-4 py-3">
<div class="flex items-center">
<span>Students</span>
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
<span>Dates</span>
<button class="ml-1 w-4 h-4 flex items-center justify-center text-gray-400">
<i class="ri-arrow-down-s-line"></i>
</button>
</div>
</th>
<th class="px-4 py-3 text-right">Actions</th>
</tr>
</thead>
<tbody class="divide-y divide-gray-100">
<tr class="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer course-row" data-course-id="1">
<td class="px-4 py-3">
<div class="flex items-center">
<input type="checkbox" id="course-1" class="custom-checkbox course-checkbox">
<label for="course-1" class="sr-only">Select Course</label>
</div>
</td>
<td class="px-4 py-3">
<div>
<div class="font-medium">Introduction to Programming</div>
<div class="text-xs text-gray-500">CS101</div>
</div>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Computer Science</span>
</td>
<td class="px-4 py-3">
<div class="flex items-center">
<img src="https://readdy.ai/api/search-image?query=professional%2520headshot%2520of%2520an%2520indian%2520woman%2520with%2520long%2520black%2520hair%2520in%2520formal%2520attire%2520on%2520white%2520background%2C%2520high%2520quality%2C%2520professional%2520looking%2C%2520warm%2520smile%2C%2520approachable&width=100&height=100&seq=profile2&orientation=squarish" alt="Instructor" class="w-7 h-7 rounded-full object-cover object-top mr-2">
<span>Priya Sharma</span>
</div>
</td>
<td class="px-4 py-3">42</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
</td>
<td class="px-4 py-3">
<div>
<div class="text-xs">Aug 10, 2025 - Dec 20, 2025</div>
</div>
</td>
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
<tr class="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer course-row" data-course-id="2">
<td class="px-4 py-3">
<div class="flex items-center">
<input type="checkbox" id="course-2" class="custom-checkbox course-checkbox">
<label for="course-2" class="sr-only">Select Course</label>
</div>
</td>
<td class="px-4 py-3">
<div>
<div class="font-medium">Web Development Fundamentals</div>
<div class="text-xs text-gray-500">CS205</div>
</div>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Computer Science</span>
</td>
<td class="px-4 py-3">
<div class="flex items-center">
<img src="https://readdy.ai/api/search-image?query=professional%2520headshot%2520of%2520a%2520middle-aged%2520indian%2520man%2520with%2520beard%2520in%2520business%2520casual%2520attire%2520on%2520white%2520background%2C%2520high%2520quality%2C%2520professional%2520looking%2C%2520warm%2520smile%2C%2520approachable&width=100&height=100&seq=profile7&orientation=squarish" alt="Instructor" class="w-7 h-7 rounded-full object-cover object-top mr-2">
<span>Vikram Iyer</span>
</div>
</td>
<td class="px-4 py-3">38</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
</td>
<td class="px-4 py-3">
<div>
<div class="text-xs">Aug 12, 2025 - Dec 18, 2025</div>
</div>
</td>
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
<tr class="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer course-row" data-course-id="3">
<td class="px-4 py-3">
<div class="flex items-center">
<input type="checkbox" id="course-3" class="custom-checkbox course-checkbox">
<label for="course-3" class="sr-only">Select Course</label>
</div>
</td>
<td class="px-4 py-3">
<div>
<div class="font-medium">Database Management Systems</div>
<div class="text-xs text-gray-500">IT202</div>
</div>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Information Technology</span>
</td>
<td class="px-4 py-3">
<div class="flex items-center">
<img src="https://readdy.ai/api/search-image?query=professional%2520headshot%2520of%2520an%2520indian%2520man%2520in%2520his%252050s%2520with%2520salt%2520and%2520pepper%2520hair%2520in%2520formal%2520attire%2520on%2520white%2520background%2C%2520high%2520quality%2C%2520professional%2520looking%2C%2520warm%2520smile%2C%2520approachable&width=100&height=100&seq=profile5&orientation=squarish" alt="Instructor" class="w-7 h-7 rounded-full object-cover object-top mr-2">
<span>Sanjay Pillai</span>
</div>
</td>
<td class="px-4 py-3">35</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
</td>
<td class="px-4 py-3">
<div>
<div class="text-xs">Aug 11, 2025 - Dec 19, 2025</div>
</div>
</td>
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
<tr class="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer course-row" data-course-id="4">
<td class="px-4 py-3">
<div class="flex items-center">
<input type="checkbox" id="course-4" class="custom-checkbox course-checkbox">
<label for="course-4" class="sr-only">Select Course</label>
</div>
</td>
<td class="px-4 py-3">
<div>
<div class="font-medium">Advanced Python Programming</div>
<div class="text-xs text-gray-500">CS302</div>
</div>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Computer Science</span>
</td>
<td class="px-4 py-3">
<div class="flex items-center">
<img src="https://readdy.ai/api/search-image?query=professional%2520headshot%2520of%2520an%2520indian%2520woman%2520with%2520long%2520black%2520hair%2520in%2520formal%2520attire%2520on%2520white%2520background%2C%2520high%2520quality%2C%2520professional%2520looking%2C%2520warm%2520smile%2C%2520approachable&width=100&height=100&seq=profile2&orientation=squarish" alt="Instructor" class="w-7 h-7 rounded-full object-cover object-top mr-2">
<span>Priya Sharma</span>
</div>
</td>
<td class="px-4 py-3">25</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
</td>
<td class="px-4 py-3">
<div>
<div class="text-xs">Aug 14, 2025 - Dec 22, 2025</div>
</div>
</td>
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
<tr class="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer course-row" data-course-id="5">
<td class="px-4 py-3">
<div class="flex items-center">
<input type="checkbox" id="course-5" class="custom-checkbox course-checkbox">
<label for="course-5" class="sr-only">Select Course</label>
</div>
</td>
<td class="px-4 py-3">
<div>
<div class="font-medium">Data Science Fundamentals</div>
<div class="text-xs text-gray-500">DS101</div>
</div>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Data Science</span>
</td>
<td class="px-4 py-3">
<div class="flex items-center">
<img src="https://readdy.ai/api/search-image?query=professional%2520headshot%2520of%2520a%2520middle-aged%2520indian%2520woman%2520with%2520short%2520hair%2520in%2520formal%2520business%2520attire%2520on%2520white%2520background%2C%2520high%2520quality%2C%2520professional%2520looking%2C%2520warm%2520smile%2C%2520approachable&width=100&height=100&seq=profile4&orientation=squarish" alt="Instructor" class="w-7 h-7 rounded-full object-cover object-top mr-2">
<span>Lakshmi Menon</span>
</div>
</td>
<td class="px-4 py-3">30</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
</td>
<td class="px-4 py-3">
<div>
<div class="text-xs">Aug 15, 2025 - Dec 23, 2025</div>
</div>
</td>
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
<tr class="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer course-row" data-course-id="6">
<td class="px-4 py-3">
<div class="flex items-center">
<input type="checkbox" id="course-6" class="custom-checkbox course-checkbox">
<label for="course-6" class="sr-only">Select Course</label>
</div>
</td>
<td class="px-4 py-3">
<div>
<div class="font-medium">Network Security</div>
<div class="text-xs text-gray-500">NW305</div>
</div>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Networking</span>
</td>
<td class="px-4 py-3">
<div class="flex items-center">
<img src="https://readdy.ai/api/search-image?query=professional%2520headshot%2520of%2520an%2520indian%2520man%2520in%2520his%252040s%2520with%2520professional%2520appearance%2520in%2520formal%2520attire%2520on%2520white%2520background%2C%2520high%2520quality%2C%2520professional%2520looking%2C%2520warm%2520smile%2C%2520approachable&width=100&height=100&seq=profile11&orientation=squarish" alt="Instructor" class="w-7 h-7 rounded-full object-cover object-top mr-2">
<span>Anil Verma</span>
</div>
</td>
<td class="px-4 py-3">22</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Inactive</span>
</td>
<td class="px-4 py-3">
<div>
<div class="text-xs">Jan 15, 2026 - May 20, 2026</div>
</div>
</td>
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
<tr class="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer course-row" data-course-id="7">
<td class="px-4 py-3">
<div class="flex items-center">
<input type="checkbox" id="course-7" class="custom-checkbox course-checkbox">
<label for="course-7" class="sr-only">Select Course</label>
</div>
</td>
<td class="px-4 py-3">
<div>
<div class="font-medium">Machine Learning</div>
<div class="text-xs text-gray-500">DS301</div>
</div>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Data Science</span>
</td>
<td class="px-4 py-3">
<div class="flex items-center">
<img src="https://readdy.ai/api/search-image?query=professional%2520headshot%2520of%2520a%2520middle-aged%2520indian%2520woman%2520with%2520short%2520hair%2520in%2520formal%2520business%2520attire%2520on%2520white%2520background%2C%2520high%2520quality%2C%2520professional%2520looking%2C%2520warm%2520smile%2C%2520approachable&width=100&height=100&seq=profile4&orientation=squarish" alt="Instructor" class="w-7 h-7 rounded-full object-cover object-top mr-2">
<span>Lakshmi Menon</span>
</div>
</td>
<td class="px-4 py-3">28</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
</td>
<td class="px-4 py-3">
<div>
<div class="text-xs">Aug 13, 2025 - Dec 21, 2025</div>
</div>
</td>
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
<tr class="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer course-row" data-course-id="8">
<td class="px-4 py-3">
<div class="flex items-center">
<input type="checkbox" id="course-8" class="custom-checkbox course-checkbox">
<label for="course-8" class="sr-only">Select Course</label>
</div>
</td>
<td class="px-4 py-3">
<div>
<div class="font-medium">Cybersecurity Fundamentals</div>
<div class="text-xs text-gray-500">CY101</div>
</div>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs">Cybersecurity</span>
</td>
<td class="px-4 py-3">
<div class="flex items-center">
<img src="https://readdy.ai/api/search-image?query=professional%2520headshot%2520of%2520an%2520indian%2520man%2520in%2520his%252040s%2520with%2520professional%2520appearance%2520in%2520formal%2520attire%2520on%2520white%2520background%2C%2520high%2520quality%2C%2520professional%2520looking%2C%2520warm%2520smile%2C%2520approachable&width=100&height=100&seq=profile11&orientation=squarish" alt="Instructor" class="w-7 h-7 rounded-full object-cover object-top mr-2">
<span>Anil Verma</span>
</div>
</td>
<td class="px-4 py-3">32</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
</td>
<td class="px-4 py-3">
<div>
<div class="text-xs">Aug 16, 2025 - Dec 24, 2025</div>
</div>
</td>
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
<tr class="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer course-row" data-course-id="9">
<td class="px-4 py-3">
<div class="flex items-center">
<input type="checkbox" id="course-9" class="custom-checkbox course-checkbox">
<label for="course-9" class="sr-only">Select Course</label>
</div>
</td>
<td class="px-4 py-3">
<div>
<div class="font-medium">Mobile App Development</div>
<div class="text-xs text-gray-500">CS310</div>
</div>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Computer Science</span>
</td>
<td class="px-4 py-3">
<div class="flex items-center">
<img src="https://readdy.ai/api/search-image?query=professional%2520headshot%2520of%2520a%2520middle-aged%2520indian%2520man%2520with%2520beard%2520in%2520business%2520casual%2520attire%2520on%2520white%2520background%2C%2520high%2520quality%2C%2520professional%2520looking%2C%2520warm%2520smile%2C%2520approachable&width=100&height=100&seq=profile7&orientation=squarish" alt="Instructor" class="w-7 h-7 rounded-full object-cover object-top mr-2">
<span>Vikram Iyer</span>
</div>
</td>
<td class="px-4 py-3">26</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
</td>
<td class="px-4 py-3">
<div>
<div class="text-xs">Aug 17, 2025 - Dec 25, 2025</div>
</div>
</td>
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
<tr class="text-sm text-gray-700 hover:bg-gray-50 cursor-pointer course-row" data-course-id="10">
<td class="px-4 py-3">
<div class="flex items-center">
<input type="checkbox" id="course-10" class="custom-checkbox course-checkbox">
<label for="course-10" class="sr-only">Select Course</label>
</div>
</td>
<td class="px-4 py-3">
<div>
<div class="font-medium">Cloud Computing</div>
<div class="text-xs text-gray-500">IT305</div>
</div>
</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Information Technology</span>
</td>
<td class="px-4 py-3">
<div class="flex items-center">
<img src="https://readdy.ai/api/search-image?query=professional%2520headshot%2520of%2520an%2520indian%2520man%2520in%2520his%252050s%2520with%2520salt%2520and%2520pepper%2520hair%2520in%2520formal%2520attire%2520on%2520white%2520background%2C%2520high%2520quality%2C%2520professional%2520looking%2C%2520warm%2520smile%2C%2520approachable&width=100&height=100&seq=profile5&orientation=squarish" alt="Instructor" class="w-7 h-7 rounded-full object-cover object-top mr-2">
<span>Sanjay Pillai</span>
</div>
</td>
<td class="px-4 py-3">24</td>
<td class="px-4 py-3">
<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>
</td>
<td class="px-4 py-3">
<div>
<div class="text-xs">Aug 18, 2025 - Dec 26, 2025</div>
</div>
</td>
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
<p class="text-sm text-gray-500">Showing 1-10 of 35 courses</p>
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
<h3 class="text-lg font-semibold text-gray-800">Recent Course Activity</h3>
<button class="text-primary text-sm font-medium hover:underline !rounded-button whitespace-nowrap">View All Activity</button>
</div>
<div class="space-y-4">
<div class="flex items-start">
<div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary mr-3 flex-shrink-0">
<div class="w-5 h-5 flex items-center justify-center">
<i class="ri-book-open-line"></i>
</div>
</div>
<div>
<p class="text-sm text-gray-800">
<span class="font-medium">Priya Sharma</span> updated course materials for Introduction to Programming
</p>
<p class="text-xs text-gray-500 mt-1">15 minutes ago</p>
</div>
</div>
<div class="flex items-start">
<div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 flex-shrink-0">
<div class="w-5 h-5 flex items-center justify-center">
<i class="ri-user-add-line"></i>
</div>
</div>
<div>
<p class="text-sm text-gray-800">
<span class="font-medium">Sanjay Pillai</span> added 5 new students to Database Management Systems
</p>
<p class="text-xs text-gray-500 mt-1">2 hours ago</p>
</div>
</div>
<div class="flex items-start">
<div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3 flex-shrink-0">
<div class="w-5 h-5 flex items-center justify-center">
<i class="ri-calendar-event-line"></i>
</div>
</div>
<div>
<p class="text-sm text-gray-800">
<span class="font-medium">Lakshmi Menon</span> rescheduled Machine Learning final exam
</p>
<p class="text-xs text-gray-500 mt-1">Yesterday</p>
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
<span class="font-medium">Anil Verma</span> archived Advanced Network Security course
</p>
<p class="text-xs text-gray-500 mt-1">2 days ago</p>
</div>
</div>
<div class="flex items-start">
<div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mr-3 flex-shrink-0">
<div class="w-5 h-5 flex items-center justify-center">
<i class="ri-add-circle-line"></i>
</div>
</div>
<div>
<p class="text-sm text-gray-800">
<span class="font-medium">Rajesh Kumar</span> created a new course: Artificial Intelligence Fundamentals
</p>
<p class="text-xs text-gray-500 mt-1">3 days ago</p>
</div>
</div>
</div>
</div>
</div>
<!-- Course Detail Panel (Hidden by default) -->
<div class="course-detail-panel bg-white shadow-lg h-full fixed top-0 right-0 mt-16 overflow-y-auto z-20" id="course-detail-panel">
<div class="flex justify-between items-center mb-6">
<h3 class="text-lg font-semibold text-gray-800">Course Details</h3>
<button id="close-detail-panel" class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-close-line"></i>
</div>
</button>
</div>
<!-- Course Header -->
<div class="flex flex-col mb-6 pb-6 border-b">
<div class="bg-blue-50 rounded-lg p-4 mb-4">
<h4 class="text-xl font-semibold text-gray-800">Introduction to Programming</h4>
<div class="flex items-center mt-1">
<span class="text-sm text-gray-500 mr-3">CS101</span>
<span class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Computer Science</span>
</div>
<div class="flex items-center mt-3">
<span class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs mr-2">Active</span>
<span class="text-xs text-gray-500">Aug 10, 2025 - Dec 20, 2025</span>
</div>
</div>
</div>
<!-- Tabs -->
<div class="flex border-b mb-6">
<button class="px-4 py-2 text-sm font-medium text-primary border-b-2 border-primary">Overview</button>
<button class="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Students</button>
<button class="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Schedule</button>
<button class="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">Materials</button>
</div>
<!-- Course Information -->
<div class="mb-6">
<h5 class="text-sm font-semibold text-gray-700 mb-3">Course Information</h5>
<div class="grid grid-cols-1 gap-4">
<div>
<label class="block text-xs font-medium text-gray-500 mb-1">Description</label>
<p class="text-sm text-gray-800">An introductory course to programming concepts using Python. Students will learn fundamental programming principles, data types, control structures, functions, and basic algorithms.</p>
</div>
<div>
<label class="block text-xs font-medium text-gray-500 mb-1">Credits</label>
<p class="text-sm text-gray-800">3 Credits</p>
</div>
<div>
<label class="block text-xs font-medium text-gray-500 mb-1">Prerequisites</label>
<p class="text-sm text-gray-800">None</p>
</div>
<div>
<label class="block text-xs font-medium text-gray-500 mb-1">Location</label>
<p class="text-sm text-gray-800">Tech Building, Room 205</p>
</div>
</div>
</div>
<!-- Instructor Information -->
<div class="mb-6">
<h5 class="text-sm font-semibold text-gray-700 mb-3">Instructor</h5>
<div class="flex items-center p-3 bg-gray-50 rounded">
<img src="https://readdy.ai/api/search-image?query=professional%2520headshot%2520of%2520an%2520indian%2520woman%2520with%2520long%2520black%2520hair%2520in%2520formal%2520attire%2520on%2520white%2520background%2C%2520high%2520quality%2C%2520professional%2520looking%2C%2520warm%2520smile%2C%2520approachable&width=100&height=100&seq=profile2&orientation=squarish" alt="Instructor" class="w-12 h-12 rounded-full object-cover object-top mr-3">
<div>
<p class="text-sm font-medium text-gray-800">Priya Sharma</p>
<p class="text-xs text-gray-500">priya.sharma@microtech.edu</p>
<p class="text-xs text-gray-500 mt-1">Office Hours: Mon/Wed 2-4 PM</p>
</div>
</div>
</div>
<!-- Student Enrollment -->
<div class="mb-6">
<div class="flex justify-between items-center mb-3">
<h5 class="text-sm font-semibold text-gray-700">Student Enrollment</h5>
<span class="text-xs text-gray-500">42 Students</span>
</div>
<div class="flex flex-wrap gap-2 mb-2">
<img src="https://readdy.ai/api/search-image?query=professional%2520headshot%2520of%2520a%2520young%2520indian%2520man%2520in%2520casual%2520business%2520attire%2520on%2520white%2520background%2C%2520high%2520quality%2C%2520professional%2520looking%2C%2520warm%2520smile%2C%2520approachable&width=100&height=100&seq=profile3&orientation=squarish" alt="Student" class="w-8 h-8 rounded-full object-cover object-top">
<img src="https://readdy.ai/api/search-image?query=professional%2520headshot%2520of%2520a%2520young%2520indian%2520woman%2520with%2520glasses%2520in%2520casual%2520business%2520attire%2520on%2520white%2520background%2C%2520high%2520quality%2C%2520professional%2520looking%2C%2520warm%2520smile%2C%2520approachable&width=100&height=100&seq=profile6&orientation=squarish" alt="Student" class="w-8 h-8 rounded-full object-cover object-top">
<img src="https://readdy.ai/api/search-image?query=professional%2520headshot%2520of%2520a%2520young%2520indian%2520woman%2520with%2520curly%2520hair%2520in%2520business%2520casual%2520attire%2520on%2520white%2520background%2C%2520high%2520quality%2C%2520professional%2520looking%2C%2520warm%2520smile%2C%2520approachable&width=100&height=100&seq=profile8&orientation=squarish" alt="Student" class="w-8 h-8 rounded-full object-cover object-top">
<img src="https://readdy.ai/api/search-image?query=professional%2520headshot%2520of%2520a%2520young%2520indian%2520man%2520with%2520stylish%2520haircut%2520in%2520business%2520casual%2520attire%2520on%2520white%2520background%2C%2520high%2520quality%2C%2520professional%2520looking%2C%2520warm%2520smile%2C%2520approachable&width=100&height=100&seq=profile9&orientation=squarish" alt="Student" class="w-8 h-8 rounded-full object-cover object-top">
<div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs">+38</div>
</div>
<button class="text-primary text-sm hover:underline">View All Students</button>
</div>
<!-- Schedule Information -->
<div class="mb-6">
<h5 class="text-sm font-semibold text-gray-700 mb-3">Schedule</h5>
<div class="space-y-2">
<div class="bg-gray-50 p-3 rounded">
<p class="text-sm font-medium text-gray-800">Lecture</p>
<p class="text-xs text-gray-500">Monday, Wednesday, Friday • 10:00 AM - 11:30 AM</p>
</div>
<div class="bg-gray-50 p-3 rounded">
<p class="text-sm font-medium text-gray-800">Lab Session</p>
<p class="text-xs text-gray-500">Tuesday • 2:00 PM - 4:00 PM</p>
</div>
</div>
</div>
<!-- Course Materials -->
<div class="mb-6">
<h5 class="text-sm font-semibold text-gray-700 mb-3">Course Materials</h5>
<div class="space-y-2">
<div class="flex items-center p-3 bg-gray-50 rounded">
<div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-file-text-line"></i>
</div>
</div>
<div class="flex-1">
<p class="text-sm font-medium text-gray-800">Course Syllabus</p>
<p class="text-xs text-gray-500">PDF • 245 KB</p>
</div>
<button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-download-line"></i>
</div>
</button>
</div>
<div class="flex items-center p-3 bg-gray-50 rounded">
<div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-book-line"></i>
</div>
</div>
<div class="flex-1">
<p class="text-sm font-medium text-gray-800">Textbook: Python Programming</p>
<p class="text-xs text-gray-500">ISBN: 978-0134853987</p>
</div>
<button class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-external-link-line"></i>
</div>
</button>
</div>
</div>
</div>
<!-- Action Buttons -->
<div class="flex space-x-3 mt-8">
<button class="flex-1 bg-primary text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-primary/90 flex items-center justify-center whitespace-nowrap">
<div class="w-4 h-4 flex items-center justify-center mr-1">
<i class="ri-edit-line"></i>
</div>
Edit Course
</button>
<button class="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-button text-sm font-medium hover:bg-gray-200 flex items-center justify-center whitespace-nowrap">
<div class="w-4 h-4 flex items-center justify-center mr-1">
<i class="ri-user-add-line"></i>
</div>
Add Students
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
<!-- Add Course Modal -->
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden" id="add-course-modal">
<div class="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
<div class="p-6">
<div class="flex justify-between items-center mb-6">
<h3 class="text-lg font-semibold text-gray-800">Add New Course</h3>
<button id="close-modal-btn" class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500">
<div class="w-4 h-4 flex items-center justify-center">
<i class="ri-close-line"></i>
</div>
</button>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
<div>
<label class="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
<input type="text" class="w-full bg-gray-100 border-none rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
</div>
<div>
<label class="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
<input type="text" class="w-full bg-gray-100 border-none rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
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
<option>Cybersecurity</option>
</select>
<div class="custom-select-icon w-4 h-4 flex items-center justify-center text-gray-500">
<i class="ri-arrow-down-s-line"></i>
</div>
</div>
</div>
<div>
<label class="block text-sm font-medium text-gray-700 mb-1">Credits</label>
<input type="number" class="w-full bg-gray-100 border-none rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
</div>
<div>
<label class="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
<div class="custom-select-wrapper">
<select class="w-full bg-gray-100 border-none rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
<option>Select Instructor</option>
<option>Priya Sharma</option>
<option>Vikram Iyer</option>
<option>Sanjay Pillai</option>
<option>Lakshmi Menon</option>
<option>Anil Verma</option>
</select>
<div class="custom-select-icon w-4 h-4 flex items-center justify-center text-gray-500">
<i class="ri-arrow-down-s-line"></i>
</div>
</div>
</div>
<div>
<label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
<div class="custom-select-wrapper">
<select class="w-full bg-gray-100 border-none rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
<option>Select Status</option>
<option>Active</option>
<option>Inactive</option>
<option>Archived</option>
</select>
<div class="custom-select-icon w-4 h-4 flex items-center justify-center text-gray-500">
<i class="ri-arrow-down-s-line"></i>
</div>
</div>
</div>
<div>
<label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
<input type="date" class="w-full bg-gray-100 border-none rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
</div>
<div>
<label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
<input type="date" class="w-full bg-gray-100 border-none rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
</div>
</div>
<div class="mb-6">
<label class="block text-sm font-medium text-gray-700 mb-1">Course Description</label>
<textarea class="w-full bg-gray-100 border-none rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 h-20"></textarea>
</div>
<div class="mb-6">
<label class="block text-sm font-medium text-gray-700 mb-1">Prerequisites</label>
<input type="text" class="w-full bg-gray-100 border-none rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
</div>
<div class="mb-6">
<h4 class="text-sm font-semibold text-gray-700 mb-3">Schedule</h4>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<label class="block text-sm font-medium text-gray-700 mb-1">Lecture Days</label>
<div class="flex flex-wrap gap-2">
<div>
<input type="checkbox" id="day-mon" class="custom-checkbox">
<label for="day-mon">Mon</label>
</div>
<div>
<input type="checkbox" id="day-tue" class="custom-checkbox">
<label for="day-tue">Tue</label>
</div>
<div>
<input type="checkbox" id="day-wed" class="custom-checkbox">
<label for="day-wed">Wed</label>
</div>
<div>
<input type="checkbox" id="day-thu" class="custom-checkbox">
<label for="day-thu">Thu</label>
</div>
<div>
<input type="checkbox" id="day-fri" class="custom-checkbox">
<label for="day-fri">Fri</label>
</div>
</div>
</div>
<div>
<label class="block text-sm font-medium text-gray-700 mb-1">Lecture Time</label>
<div class="flex space-x-2">
<input type="time" class="bg-gray-100 border-none rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
<span class="self-center">to</span>
<input type="time" class="bg-gray-100 border-none rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
</div>
</div>
</div>
</div>
<div class="mb-6">
<h4 class="text-sm font-semibold text-gray-700 mb-3">Location</h4>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<div>
<label class="block text-sm font-medium text-gray-700 mb-1">Building</label>
<input type="text" class="w-full bg-gray-100 border-none rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
</div>
<div>
<label class="block text-sm font-medium text-gray-700 mb-1">Room</label>
<input type="text" class="w-full bg-gray-100 border-none rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
</div>
</div>
</div>
<div class="flex justify-end space-x-3">
<button class="bg-gray-100 text-gray-700 px-4 py-2 rounded-button text-sm font-medium hover:bg-gray-200 whitespace-nowrap">Cancel</button>
<button class="bg-primary text-white px-4 py-2 rounded-button text-sm font-medium hover:bg-primary/90 whitespace-nowrap">Create Course</button>
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
<script id="course-detail-panel">
document.addEventListener('DOMContentLoaded', function() {
const courseRows = document.querySelectorAll('.course-row');
const courseDetailPanel = document.getElementById('course-detail-panel');
const closeDetailPanelBtn = document.getElementById('close-detail-panel');
const mainContentArea = document.getElementById('main-content-area');
courseRows.forEach(row => {
row.addEventListener('click', function(e) {
// Prevent click on checkbox or action buttons from opening panel
if (e.target.closest('.custom-checkbox') || e.target.closest('button')) {
return;
}
courseDetailPanel.classList.add('open');
mainContentArea.classList.add('pr-[400px]');
});
});
closeDetailPanelBtn.addEventListener('click', function() {
courseDetailPanel.classList.remove('open');
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
<script id="add-course-modal">
document.addEventListener('DOMContentLoaded', function() {
const addCourseBtn = document.getElementById('add-course-btn');
const addCourseModal = document.getElementById('add-course-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
addCourseBtn.addEventListener('click', function() {
addCourseModal.classList.remove('hidden');
});
closeModalBtn.addEventListener('click', function() {
addCourseModal.classList.add('hidden');
});
// Close modal when clicking outside
addCourseModal.addEventListener('click', function(e) {
if (e.target === addCourseModal) {
addCourseModal.classList.add('hidden');
}
});
});
</script>
<script id="select-all-checkboxes">
document.addEventListener('DOMContentLoaded', function() {
const selectAllCheckbox = document.getElementById('select-all');
const courseCheckboxes = document.querySelectorAll('.course-checkbox');
selectAllCheckbox.addEventListener('change', function() {
courseCheckboxes.forEach(checkbox => {
checkbox.checked = selectAllCheckbox.checked;
});
});
courseCheckboxes.forEach(checkbox => {
checkbox.addEventListener('change', function() {
const allChecked = Array.from(courseCheckboxes).every(c => c.checked);
const someChecked = Array.from(courseCheckboxes).some(c => c.checked);
selectAllCheckbox.checked = allChecked;
// This would require custom styling for indeterminate state
selectAllCheckbox.indeterminate = someChecked && !allChecked;
});
});
});
</script>
</body>
</html>