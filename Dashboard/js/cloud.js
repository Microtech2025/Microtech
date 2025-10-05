// Cloud Management JavaScript
import { initializeUserProfile, addProfileStyles } from './profile-utils.js';
import { showToast } from './toast.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Cloud page loaded');
    
    // Initialize profile functionality
    addProfileStyles();
    initializeUserProfile();
    
    // Initialize cloud-specific functionality
    initializeCloud();
});

function initializeCloud() {
    console.log('Initializing cloud management...');
    // Cloud functionality will be implemented here
    showToast('Cloud page loaded successfully', 'success');
}