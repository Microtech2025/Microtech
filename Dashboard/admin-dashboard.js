// Admin Dashboard JavaScript
import { initializeUserProfile, addProfileStyles, handleLogout } from './js/profile-utils.js';
import { NotificationManager } from './notification-manager.js';

class AdminDashboard {
    constructor() {
        this.notificationManager = null;
        this.init();
    }

    init() {
        // Initialize notification system
        this.initializeNotifications();
        
        // Initialize profile functionality
        addProfileStyles();
        initializeUserProfile();
        
        this.setupEventListeners();
        this.loadDashboardData();
        this.setupSearchFunctionality();
    }

    initializeNotifications() {
        this.notificationManager = new NotificationManager('admin-dashboard');
        
        // Load some default admin notifications if empty
        if (this.notificationManager.getUnreadCount() === 0) {
            this.notificationManager.addNotification({
                title: 'Welcome to Admin Dashboard',
                message: 'All systems are operational and ready for management.',
                type: 'info',
                priority: 'medium'
            });
            
            this.notificationManager.addNotification({
                title: 'Monthly Revenue Report',
                message: 'October revenue report is now available for review.',
                type: 'success',
                priority: 'high'
            });
        }
    }

    setupEventListeners() {
        // Mobile sidebar toggle
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        menuToggle.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1001;
            background: #3B82F6;
            border: none;
            color: white;
            padding: 12px;
            border-radius: 8px;
            cursor: pointer;
            display: none;
        `;
        
        document.body.appendChild(menuToggle);

        menuToggle.addEventListener('click', () => {
            const sidebar = document.querySelector('.left-sidebar');
            sidebar.classList.toggle('open');
        });

        // User profile dropdown
        const userProfile = document.querySelector('.user-profile');
        if (userProfile) {
            userProfile.addEventListener('click', () => {
                this.toggleUserDropdown();
            });
        }

        // Navigation item clicks
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(item);
            });
        });

        // Notification click - Remove old notification handling
        // Universal notification system is already initialized
        
        // Remove old notification code that created custom panels

        // Responsive behavior
        window.addEventListener('resize', () => {
            this.handleResponsive();
        });

        // Hide mobile menu on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.left-sidebar') && !e.target.closest('.menu-toggle')) {
                const sidebar = document.querySelector('.left-sidebar');
                if (sidebar) {
                    sidebar.classList.remove('open');
                }
            }
        });
    }

    setupSearchFunctionality() {
        const searchInputs = document.querySelectorAll('input[placeholder*="Search"]');
        
        searchInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(e.target.value);
                }
            });
        });
    }

    handleSearch(query) {
        if (query.length < 2) return;
        
        // Implement search logic here
        console.log('Searching for:', query);
    }

    performSearch(query) {
        // Implement search execution here
        console.log('Executing search for:', query);
    }

    handleNavigation(item) {
        // Remove active class from all items
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });

        // Add active class to clicked item
        item.classList.add('active');

        // Handle navigation based on text content
        const navText = item.querySelector('.nav-text').textContent.toLowerCase();
        
        switch (navText) {
            case 'dashboard':
                this.showDashboard();
                break;
            case 'revenue management':
                this.navigateToPage('revenue.html');
                break;
            case 'students':
                this.navigateToPage('student.html');
                break;
            case 'staff':
                this.navigateToPage('staff.html');
                break;    
            case 'counselors':
                this.navigateToPage('counselors.html');
                break;
            case 'courses & academics':
                this.navigateToPage('courses.html');
                break;
            case 'fee management':
                this.navigateToPage('fees.html');
                break;
            case 'communication':
                this.navigateToPage('communication.html');
                break;
            case 'advertisement':
                this.navigateToPage('advertisement.html');
                break;
            case 'alumni portal':
                this.navigateToPage('alumni.html');
                break;
            case 'scholarship & offers':
                this.navigateToPage('scholarship.html');
                break;
            case 'referral program':
                this.navigateToPage('referral.html');
                break;
            case 'analytics & reports':
                this.navigateToPage('analytics.html');
                break;
            case 'notifications':
                this.navigateToPage('notifications.html');
                break;
            case 'expenses':
                this.navigateToPage('expenses.html');
                break;
            case 'cloud':
                this.navigateToPage('cloud.html');
                break;
            case 'settings':
                this.navigateToPage('settings.html');
                break;
            default:
                console.log('Navigation to:', navText);
        }

        // Close mobile sidebar if open
        if (window.innerWidth <= 768) {
            const sidebar = document.querySelector('.left-sidebar');
            if (sidebar) {
                sidebar.classList.remove('open');
            }
        }
    }

    navigateToPage(page) {
        window.location.href = page;
    }

    showDashboard() {
        // Dashboard is already visible
        console.log('Showing dashboard');
    }

    toggleUserDropdown() {
        // Create dropdown menu if it doesn't exist
        let dropdown = document.querySelector('.user-dropdown-menu');
        
        if (!dropdown) {
            dropdown = document.createElement('div');
            dropdown.className = 'user-dropdown-menu';
            dropdown.style.cssText = `
                position: absolute;
                top: 100%;
                right: 0;
                background: #2A2F3E;
                border: 1px solid #374151;
                border-radius: 8px;
                padding: 8px 0;
                min-width: 200px;
                z-index: 1000;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            `;
            
            dropdown.innerHTML = `
                <div class="dropdown-item">
                    <i class="fas fa-user"></i>
                    <span>Profile</span>
                </div>
                <div class="dropdown-item">
                    <i class="fas fa-cog"></i>
                    <span>Settings</span>
                </div>
                <div class="dropdown-item">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </div>
            `;
            
            document.querySelector('.user-profile').appendChild(dropdown);
            
            // Add styles for dropdown items
            const style = document.createElement('style');
            style.textContent = `
                .dropdown-item {
                    padding: 12px 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: #D1D5DB;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .dropdown-item:hover {
                    background: #374151;
                    color: #ffffff;
                }
                .dropdown-item i {
                    width: 16px;
                    color: #9CA3AF;
                }
            `;
            document.head.appendChild(style);
            
            // Handle dropdown item clicks
            dropdown.querySelectorAll('.dropdown-item').forEach(item => {
                item.addEventListener('click', () => {
                    const action = item.querySelector('span').textContent.toLowerCase();
                    this.handleUserAction(action);
                });
            });
        } else {
            dropdown.remove();
        }
    }

    handleUserAction(action) {
        switch (action) {
            case 'profile':
                console.log('Opening profile');
                break;
            case 'settings':
                this.navigateToPage('settings.html');
                break;
            case 'logout':
                this.logout();
                break;
        }
    }

    logout() {
        if (confirm('Are you sure you want to logout?')) {
            // Use centralized logout from profile-utils
            if (typeof handleLogout === 'function') {
                handleLogout();
            } else {
                // Fallback logout logic
                console.log('Logging out...');
                // Clear any local storage
                localStorage.clear();
                sessionStorage.clear();
                // Redirect to main index page
                window.location.href = '../index.html';
            }
        }
    }

    // Add method to demonstrate notifications
    addAdminNotification(title, message, type = 'info') {
        if (this.notificationManager) {
            this.notificationManager.addNotification({
                title,
                message,
                type,
                priority: 'medium'
            });
        }
    }

    // Simulate some admin dashboard activities
    simulateAdminActivity() {
        // This can be called to test notifications
        setTimeout(() => {
            this.addAdminNotification(
                'New Student Registration',
                'A new student has registered for the CAPT course.',
                'success'
            );
        }, 3000);

        setTimeout(() => {
            this.addAdminNotification(
                'Payment Received',
                'Fee payment of ₹15,000 received from John Doe.',
                'success'
            );
        }, 6000);

        setTimeout(() => {
            this.addAdminNotification(
                'System Maintenance',
                'Scheduled maintenance will begin at 2:00 AM tonight.',
                'warning'
            );
        }, 9000);
    }

    loadDashboardData() {
        // Simulate loading dashboard data
        this.animateMetricCards();
        
        // Start simulation of admin activities (for demo purposes)
        // Comment out in production
        this.simulateAdminActivity();
        
        // Load real data from Firebase or API here
        // this.loadStudentsCount();
        // this.loadRevenueData();
        // this.loadStaffCount();
    }

    animateMetricCards() {
        const cards = document.querySelectorAll('.metric-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });
    }

    handleResponsive() {
        const sidebar = document.querySelector('.left-sidebar');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (window.innerWidth <= 768) {
            if (menuToggle) menuToggle.style.display = 'block';
            if (sidebar) sidebar.classList.remove('open');
        } else {
            if (menuToggle) menuToggle.style.display = 'none';
            if (sidebar) sidebar.classList.remove('open');
        }
    }

    // Utility methods
    showLoading(element) {
        element.classList.add('loading');
    }

    hideLoading(element) {
        element.classList.remove('loading');
    }

    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        // Add message styles
        const style = document.createElement('style');
        style.textContent = `
            .message-info { background: #3B82F6; }
            .message-success { background: #10B981; }
            .message-warning { background: #F59E0B; }
            .message-error { background: #EF4444; }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(messageDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdminDashboard();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminDashboard;
}
