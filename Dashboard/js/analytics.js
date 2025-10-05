// Analytics Management JavaScript
import { initializeUserProfile, addProfileStyles } from './profile-utils.js';
import { showToast } from './toast.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Analytics page loaded');
    
    // Initialize profile functionality
    addProfileStyles();
    initializeUserProfile();
    
    // Initialize analytics-specific functionality
    initializeAnalytics();
});

function initializeAnalytics() {
    console.log('Initializing analytics...');
    // Analytics functionality will be implemented here
    showToast('Analytics page loaded successfully', 'success');
}