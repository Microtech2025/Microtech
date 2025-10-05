#!/usr/bin/env python3
"""
Quick script to add the missing finance navigation item to all dashboard HTML files
"""

import os
import re

# Define the base path
base_path = r"h:\Alanove\visual studio\Micro Computers\Dashboard"

# Finance navigation item to add
finance_nav_item = '''                <a href="finance.html" class="nav-item">
                    <i class="fas fa-chart-line nav-icon"></i>
                    <span class="nav-text">Finance</span>
                </a>'''

# Files to update
html_files = [
    'admin-dashboard.html', 'student.html', 'staff.html', 'courses.html',
    'referral.html', 'communication.html', 'advertisement.html', 'cloud.html',
    'expenses.html', 'settings.html', 'notifications.html', 'counselors.html',
    'revenue.html'
]

def add_finance_nav(filename):
    filepath = os.path.join(base_path, filename)
    
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
        
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if finance nav item already exists
        if 'href="finance.html"' in content:
            print(f"Finance nav already exists in {filename}")
            return
        
        # Pattern to find the expenses nav item and add finance after it
        expenses_pattern = r'(\s*<a href="expenses\.html" class="nav-item[^>]*>.*?</a>)'
        
        if re.search(expenses_pattern, content, re.DOTALL):
            # Add finance after expenses
            replacement = r'\1\n' + finance_nav_item
            content = re.sub(expenses_pattern, replacement, content, flags=re.DOTALL)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
                
            print(f"✅ Added finance nav to {filename}")
        else:
            print(f"❌ Could not find expenses nav in {filename}")
            
    except Exception as e:
        print(f"❌ Error updating {filename}: {e}")

def main():
    print("Adding finance navigation item to all dashboard files...")
    
    for filename in html_files:
        print(f"\n--- Processing {filename} ---")
        add_finance_nav(filename)
    
    print("\n✨ Finance nav update complete!")

if __name__ == "__main__":
    main()