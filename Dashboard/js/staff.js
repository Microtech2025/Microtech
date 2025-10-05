// Staff Management JavaScript
import { initializeUserProfile, addProfileStyles } from './profile-utils.js';
import { showToast } from './toast.js';
import { NotificationManager } from '../notification-manager.js';

let notificationManager = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Staff management page loaded');
    
    // Initialize notification system
    initializeNotifications();
    
    // Initialize profile functionality
    addProfileStyles();
    initializeUserProfile();
    
    // Initialize staff-specific functionality
    initializeStaffManagement();
});

function initializeNotifications() {
    notificationManager = new NotificationManager('staff-management');
    
    // Load some default staff notifications if empty
    if (notificationManager.getUnreadCount() === 0) {
        notificationManager.addNotification({
            title: 'Welcome to Staff Management',
            message: 'Manage all staff members and their information here.',
            type: 'info',
            priority: 'medium'
        });
    }
}

function initializeStaffManagement() {
    console.log('Initializing staff management...');
    // Staff management functionality will be implemented here
    showToast('Staff management page loaded successfully', 'success');
    
    // Add staff-specific notification examples
    addStaffNotification(
        'Staff Database Updated',
        'Staff member information has been synchronized.',
        'success'
    );
}

// Function to add staff-related notifications
function addStaffNotification(title, message, type = 'info') {
    if (notificationManager) {
        notificationManager.notifyStaffAdded(title, message, type);
    }
}