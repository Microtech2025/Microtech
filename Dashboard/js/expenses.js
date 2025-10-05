// Expenses Management JavaScript
import { initializeUserProfile, addProfileStyles } from './profile-utils.js';
import { showToast } from './toast.js';

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Expenses page loaded');
    
    // Initialize profile functionality
    addProfileStyles();
    initializeUserProfile();
    
    // Initialize expenses-specific functionality
    initializeExpenses();
});

function initializeExpenses() {
    console.log('Initializing expenses management...');
    // Expenses functionality will be implemented here
    showToast('Expenses page loaded successfully', 'success');
}