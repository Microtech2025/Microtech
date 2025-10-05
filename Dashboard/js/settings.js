// Settings Management JavaScript
import { initializeUserProfile, addProfileStyles } from './profile-utils.js';
import { showToast } from './toast.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Settings page loaded');
    
    // Initialize profile functionality
    addProfileStyles();
    initializeUserProfile();
    
    // Initialize settings-specific functionality
    initializeSettings();
});

function initializeSettings() {
    console.log('Initializing settings...');
    // Settings functionality will be implemented here
    showToast('Settings page loaded successfully', 'success');
}