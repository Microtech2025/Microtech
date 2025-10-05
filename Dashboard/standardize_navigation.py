#!/usr/bin/env python3
"""
Standardize Navigation Across All Dashboard Files
This script updates all HTML files to have consistent sidebar navigation.
"""

import os
import re
from pathlib import Path

# Standard navigation template
STANDARD_NAVIGATION = '''        <!-- Left Sidebar -->
        <div class="left-sidebar">
        <div class="sidebar-header">
                <div class="sidebar-logo">
                    <div class="logo-icon">
                        <i class="fas fa-building"></i>
        </div>
                    <div class="logo-text">MicroTech Center</div>
                </div>
                <div class="sidebar-subtitle">{subtitle}</div>
            </div>
            
            <div class="sidebar-search">
                <div class="search-container">
                    <i class="fas fa-search search-icon"></i>
                    <input type="text" placeholder="Search students, courses, staff...">
      </div>
    </div>

            <nav class="nav-menu">
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
            </nav>
        </div>'''

# File configurations: filename -> (subtitle, active_page)
FILE_CONFIGS = {
    'admin-dashboard.html': ('Admin Dashboard', 'dashboard'),
    'revenue.html': ('Revenue Management', 'revenue'),
    'student.html': ('Student Management System', 'student'),
    'staff.html': ('Staff Management', 'staff'),
    'counselors.html': ('Counselor Management', 'counselors'),
    'courses.html': ('Course Management', 'courses'),
    'fees.html': ('Fee Management', 'fees'),
    'communication.html': ('Communication Center', 'communication'),
    'advertisement.html': ('Advertisement Management', 'advertisement'),
    'alumni.html': ('Alumni Portal', 'alumni'),
    'scholarship.html': ('Scholarship & Offers', 'scholarship'),
    'referral.html': ('Referral Program', 'referral'),
    'analytics.html': ('Analytics & Reports', 'analytics'),
    'notifications.html': ('Notifications', 'notifications'),
    'settings.html': ('Settings', 'settings'),
    'cloud.html': ('Cloud Storage', 'cloud'),
    'expenses.html': ('Expense Management', 'expenses'),
    'finance.html': ('Financial Management', 'finance')
}

def update_file_navigation(file_path, subtitle, active_page):
    """Update a single file's navigation"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Create active states
        active_states = {
            'active_dashboard': ' active' if active_page == 'dashboard' else '',
            'active_revenue': ' active' if active_page == 'revenue' else '',
            'active_student': ' active' if active_page == 'student' else '',
            'active_staff': ' active' if active_page == 'staff' else '',
            'active_counselors': ' active' if active_page == 'counselors' else '',
            'active_courses': ' active' if active_page == 'courses' else '',
            'active_fees': ' active' if active_page == 'fees' else '',
            'active_communication': ' active' if active_page == 'communication' else '',
            'active_advertisement': ' active' if active_page == 'advertisement' else '',
            'active_alumni': ' active' if active_page == 'alumni' else '',
            'active_scholarship': ' active' if active_page == 'scholarship' else '',
            'active_referral': ' active' if active_page == 'referral' else '',
            'active_analytics': ' active' if active_page == 'analytics' else '',
            'active_notifications': ' active' if active_page == 'notifications' else '',
            'active_settings': ' active' if active_page == 'settings' else '',
            'active_cloud': ' active' if active_page == 'cloud' else '',
            'active_expenses': ' active' if active_page == 'expenses' else '',
            'active_finance': ' active' if active_page == 'finance' else '',
        }
        
        # Generate navigation with active states
        navigation = STANDARD_NAVIGATION.format(
            subtitle=subtitle,
            **active_states
        )
        
        # Pattern to match the entire left sidebar
        sidebar_pattern = r'(\s*)<!-- Left Sidebar -->.*?</div>\s*(?=\s*<!-- Main Content|<div class="main-content")'
        
        # Replace the sidebar
        new_content = re.sub(
            sidebar_pattern,
            lambda m: m.group(1) + navigation + '\n\n        ',
            content,
            flags=re.DOTALL
        )
        
        # If the pattern didn't match, try a different approach
        if new_content == content:
            # Look for the left-sidebar div specifically
            sidebar_pattern2 = r'<div class="left-sidebar">.*?</div>\s*(?=\s*<!-- Main Content|<div class="main-content")'
            new_content = re.sub(
                sidebar_pattern2,
                navigation.strip(),
                content,
                flags=re.DOTALL
            )
        
        # Write the updated content
        if new_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ Updated navigation in {file_path}")
            return True
        else:
            print(f"⚠️  No changes made to {file_path} - pattern not found")
            return False
            
    except Exception as e:
        print(f"❌ Error updating {file_path}: {str(e)}")
        return False

def main():
    """Main function to update all files"""
    script_dir = Path(__file__).parent
    updated_count = 0
    
    print("🚀 Starting navigation standardization...")
    print("=" * 50)
    
    for filename, (subtitle, active_page) in FILE_CONFIGS.items():
        file_path = script_dir / filename
        
        if file_path.exists():
            print(f"📝 Processing {filename}...")
            if update_file_navigation(file_path, subtitle, active_page):
                updated_count += 1
        else:
            print(f"⚠️  File not found: {filename}")
    
    print("=" * 50)
    print(f"✅ Navigation standardization complete!")
    print(f"📊 Updated {updated_count} out of {len(FILE_CONFIGS)} files")

if __name__ == "__main__":
    main()