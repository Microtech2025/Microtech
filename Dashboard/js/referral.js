// Referral Management JavaScript
import { initializeUserProfile, addProfileStyles } from './profile-utils.js';
import { showToast } from './toast.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Referral page loaded');
    
    // Initialize profile functionality
    addProfileStyles();
    initializeUserProfile();
    
    // Initialize referral-specific functionality
    initializeReferral();
});

function initializeReferral() {
    console.log('Initializing referral management...');
    // Referral functionality will be implemented here
    showToast('Referral page loaded successfully', 'success');
}