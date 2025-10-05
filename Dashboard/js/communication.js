// Communication Management JavaScript
import { initializeUserProfile, addProfileStyles } from './profile-utils.js';
import { showToast } from './toast.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Communication page loaded');
    
    // Initialize profile functionality
    addProfileStyles();
    initializeUserProfile();
    
    // Initialize communication-specific functionality
    initializeCommunication();
});

function initializeCommunication() {
    console.log('Initializing communication...');
    // Communication functionality will be implemented here
    showToast('Communication page loaded successfully', 'success');
}