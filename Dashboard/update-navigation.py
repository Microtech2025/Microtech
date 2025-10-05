#!/usr/bin/env python3
"""
Script to update navigation across all dashboard HTML files
"""

import os
import re

# Define the base path
base_path = r"h:\Alanove\visual studio\Micro Computers\Dashboard"

# Navigation template
nav_template = '''            <nav class="nav-menu">
                <a href="admin-dashboard.html" class="nav-item{active_dashboard}">
                    <i class="fas fa-home nav-icon"></i>
                    <span class="nav-text">Dashboard</span>
                </a>
                <a href="revenue.html" class="nav-item{active_revenue}">
                    <i class="fas fa-dollar-sign nav-icon"></i>
                    <span class="nav-text">Revenue Management</span>
                </a>
                <a href="student.html" class="nav-item{active_student}">
                    <i class="fas fa-users nav-icon"></i>
                    <span class="nav-text">Students</span>
                </a>
                <a href="staff.html" class="nav-item{active_staff}">
                    <i class="fas fa-user-tie nav-icon"></i>
                    <span class="nav-text">Staff</span>
                </a>
                <a href="counselors.html" class="nav-item{active_counselors}">
                    <i class="fas fa-phone nav-icon"></i>
                    <span class="nav-text">Counselors</span>
                </a>
                <a href="courses.html" class="nav-item{active_courses}">
                    <i class="fas fa-book-open nav-icon"></i>
                    <span class="nav-text">Courses & Academics</span>
                </a>
                <a href="fees.html" class="nav-item{active_fees}">
                    <i class="fas fa-credit-card nav-icon"></i>
                    <span class="nav-text">Fee Management</span>
                </a>
                <a href="communication.html" class="nav-item{active_communication}">
                    <i class="fas fa-comments nav-icon"></i>
                    <span class="nav-text">Communication</span>
                </a>
                <a href="advertisement.html" class="nav-item{active_advertisement}">
                    <i class="fas fa-bullhorn nav-icon"></i>
                    <span class="nav-text">Advertisement</span>
                </a>
                <a href="alumni.html" class="nav-item{active_alumni}">
                    <i class="fas fa-graduation-cap nav-icon"></i>
                    <span class="nav-text">Alumni Portal</span>
                </a>
                <a href="scholarship.html" class="nav-item{active_scholarship}">
                    <i class="fas fa-shield-alt nav-icon"></i>
                    <span class="nav-text">Scholarship & Offers</span>
                </a>
                <a href="referral.html" class="nav-item{active_referral}">
                    <i class="fas fa-share-alt nav-icon"></i>
                    <span class="nav-text">Referral Program</span>
                </a>
                <a href="analytics.html" class="nav-item{active_analytics}">
                    <i class="fas fa-chart-bar nav-icon"></i>
                    <span class="nav-text">Analytics & Reports</span>
                </a>
                <a href="notifications.html" class="nav-item{active_notifications}">
                    <i class="fas fa-bell nav-icon"></i>
                    <span class="nav-text">Notifications</span>
                </a>
                <a href="settings.html" class="nav-item{active_settings}">
                    <i class="fas fa-cog nav-icon"></i>
                    <span class="nav-text">Settings</span>
                </a>
                <a href="cloud.html" class="nav-item{active_cloud}">
                    <i class="fas fa-cloud nav-icon"></i>
                    <span class="nav-text">Cloud</span>
                </a>
                <a href="expenses.html" class="nav-item{active_expenses}">
                    <i class="fas fa-wallet nav-icon"></i>
                    <span class="nav-text">Expenses</span>
                </a>
                <a href="finance.html" class="nav-item{active_finance}">
                    <i class="fas fa-chart-line nav-icon"></i>
                    <span class="nav-text">Finance</span>
                </a>
            </nav>'''

# File mappings with subtitles
file_configs = {
    'admin-dashboard.html': {
        'subtitle': 'Admin Dashboard',
        'active': 'dashboard'
    },
    'student.html': {
        'subtitle': 'Student Management System',
        'active': 'student'
    },
    'staff.html': {
        'subtitle': 'Staff Management System',
        'active': 'staff'
    },
    'fees.html': {
        'subtitle': 'Fee Management System',
        'active': 'fees'
    },
    'courses.html': {
        'subtitle': 'Courses & Academics',
        'active': 'courses'
    },
    'analytics.html': {
        'subtitle': 'Analytics & Reports',
        'active': 'analytics'
    },
    'finance.html': {
        'subtitle': 'Finance Management',
        'active': 'finance'
    },
    'alumni.html': {
        'subtitle': 'Alumni Portal',
        'active': 'alumni'
    },
    'scholarship.html': {
        'subtitle': 'Scholarship & Offers',
        'active': 'scholarship'
    },
    'referral.html': {
        'subtitle': 'Referral Program',
        'active': 'referral'
    },
    'communication.html': {
        'subtitle': 'Communication Center',
        'active': 'communication'
    },
    'advertisement.html': {
        'subtitle': 'Advertisement Management',
        'active': 'advertisement'
    },
    'cloud.html': {
        'subtitle': 'Cloud Storage',
        'active': 'cloud'
    },
    'expenses.html': {
        'subtitle': 'Expense Management',
        'active': 'expenses'
    },
    'settings.html': {
        'subtitle': 'System Settings',
        'active': 'settings'
    },
    'notifications.html': {
        'subtitle': 'Notification Center',
        'active': 'notifications'
    },
    'counselors.html': {
        'subtitle': 'Counselor Management',
        'active': 'counselors'
    },
    'revenue.html': {
        'subtitle': 'Revenue Management',
        'active': 'revenue'
    }
}

def update_file(filename, config):
    filepath = os.path.join(base_path, filename)
    
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
        
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Create active states
        active_states = {}
        for key in ['dashboard', 'revenue', 'student', 'staff', 'counselors', 'courses', 
                   'fees', 'communication', 'advertisement', 'alumni', 'scholarship', 
                   'referral', 'analytics', 'notifications', 'settings', 'cloud', 
                   'expenses', 'finance']:
            active_states[f'active_{key}'] = ' active' if key == config['active'] else ''
        
        # Replace navigation
        nav_content = nav_template.format(**active_states)
        
        # Pattern to match existing nav-menu
        nav_pattern = r'<nav class="nav-menu">.*?</nav>'
        if re.search(nav_pattern, content, re.DOTALL):
            content = re.sub(nav_pattern, nav_content, content, flags=re.DOTALL)
            print(f"Updated navigation in {filename}")
        else:
            print(f"No nav-menu found in {filename}")
        
        # Update subtitle
        subtitle_pattern = r'<div class="sidebar-subtitle">.*?</div>'
        if re.search(subtitle_pattern, content):
            new_subtitle = f'<div class="sidebar-subtitle">{config["subtitle"]}</div>'
            content = re.sub(subtitle_pattern, new_subtitle, content)
            print(f"Updated subtitle in {filename}")
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
            
        print(f"✅ Successfully updated {filename}")
        
    except Exception as e:
        print(f"❌ Error updating {filename}: {e}")

def main():
    print("Starting navigation update for all dashboard files...")
    
    for filename, config in file_configs.items():
        print(f"\n--- Processing {filename} ---")
        update_file(filename, config)
    
    print("\n✨ Navigation update complete!")

if __name__ == "__main__":
    main()