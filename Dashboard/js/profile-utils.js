// Profile and Authentication Utilities
import { auth, db } from '../firebase.js';
import { signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { showToast } from './toast.js';

/**
 * Initialize user profile dropdown and authentication state
 */
export function initializeUserProfile() {
    console.log('Initializing user profile...');
    
    // Load user data and setup profile
    loadUserProfile();
    
    // Setup profile dropdown functionality
    setupProfileDropdown();
    
    // Setup authentication state listener
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            // User is signed out, redirect to main index page
            window.location.href = '../index.html';
        }
    });
}

/**
 * Load and display user profile information
 */
async function loadUserProfile() {
    try {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log('User authenticated:', user.email);
                
                // Get user document from Firestore
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                const userData = userDoc.exists() ? userDoc.data() : {};
                
                // Update UI elements
                const userNameElement = document.querySelector('.user-name');
                const userRoleElement = document.querySelector('.user-role');
                const userAvatarElement = document.querySelector('.user-avatar');
                
                if (userNameElement) {
                    userNameElement.textContent = userData.name || user.displayName || user.email || 'Admin User';
                }
                
                if (userRoleElement) {
                    userRoleElement.textContent = userData.role || 'Administrator';
                }
                
                // Update avatar if photo URL exists
                if (userData.photoURL || user.photoURL) {
                    if (userAvatarElement) {
                        userAvatarElement.innerHTML = `<img src="${userData.photoURL || user.photoURL}" alt="Profile" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">`;
                    }
                }
                
                console.log('User profile loaded successfully');
            } else {
                console.log('No user authenticated');
            }
        });
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

/**
 * Setup profile dropdown menu functionality
 */
function setupProfileDropdown() {
    // Create dropdown menu HTML
    const dropdownHTML = `
        <div class="profile-dropdown" id="profile-dropdown">
            <div class="dropdown-item" id="view-profile-btn">
                <i class="fas fa-user"></i>
                <span>View Profile</span>
            </div>
            <div class="dropdown-item" id="edit-profile-btn">
                <i class="fas fa-edit"></i>
                <span>Edit Profile</span>
            </div>
            <div class="dropdown-item" id="account-settings-btn">
                <i class="fas fa-cog"></i>
                <span>Account Settings</span>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-item logout-item" id="logout-btn">
                <i class="fas fa-sign-out-alt"></i>
                <span>Logout</span>
            </div>
        </div>
    `;
    
    // Add dropdown to user profile
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.style.position = 'relative';
        userProfile.insertAdjacentHTML('beforeend', dropdownHTML);
        
        // Add click event to toggle dropdown
        userProfile.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleProfileDropdown();
        });
        
        // Setup dropdown item event listeners
        setupDropdownEvents();
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            closeProfileDropdown();
        });
    }
}

/**
 * Setup event listeners for dropdown items
 */
function setupDropdownEvents() {
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // View profile
    const viewProfileBtn = document.getElementById('view-profile-btn');
    if (viewProfileBtn) {
        viewProfileBtn.addEventListener('click', showProfileModal);
    }
    
    // Edit profile
    const editProfileBtn = document.getElementById('edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', showEditProfileModal);
    }
    
    // Account settings
    const accountSettingsBtn = document.getElementById('account-settings-btn');
    if (accountSettingsBtn) {
        accountSettingsBtn.addEventListener('click', () => {
            showToast('Account settings feature coming soon!', 'info');
        });
    }
}

/**
 * Toggle profile dropdown visibility
 */
function toggleProfileDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) {
        const isVisible = dropdown.style.display === 'block';
        dropdown.style.display = isVisible ? 'none' : 'block';
    }
}

/**
 * Close profile dropdown
 */
function closeProfileDropdown() {
    const dropdown = document.getElementById('profile-dropdown');
    if (dropdown) {
        dropdown.style.display = 'none';
    }
}

/**
 * Handle user logout
 */
export async function handleLogout() {
    try {
        console.log('Logging out user...');
        
        // Show loading state
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            const originalContent = logoutBtn.innerHTML;
            logoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Logging out...</span>';
            logoutBtn.style.pointerEvents = 'none';
        }
        
        // Sign out from Firebase
        await signOut(auth);
        
        // Clear any local storage
        localStorage.clear();
        sessionStorage.clear();
        
        // Show success message
        showToast('Logged out successfully!', 'success');
        
        // Redirect to main index page after a short delay
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
        
    } catch (error) {
        console.error('Error during logout:', error);
        showToast('Error logging out: ' + error.message, 'error');
        
        // Reset button state
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> <span>Logout</span>';
            logoutBtn.style.pointerEvents = 'auto';
        }
    }
}

/**
 * Show profile view modal
 */
function showProfileModal() {
    const user = auth.currentUser;
    if (!user) {
        showToast('Please log in to view profile', 'error');
        return;
    }
    
    // Create and show profile modal
    const modalHTML = `
        <div id="profile-modal" class="modal show">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">My Profile</h2>
                    <button class="modal-close" onclick="closeProfileModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="profile-info">
                        <div class="profile-avatar">
                            ${user.photoURL ? 
                                `<img src="${user.photoURL}" alt="Profile" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">` :
                                '<i class="fas fa-user-circle" style="font-size: 80px; color: #3B82F6;"></i>'
                            }
                        </div>
                        <div class="profile-details">
                            <div class="detail-row">
                                <span class="detail-label">Name:</span>
                                <span class="detail-value">${user.displayName || 'Not provided'}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Email:</span>
                                <span class="detail-value">${user.email}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Account Created:</span>
                                <span class="detail-value">${new Date(user.metadata.creationTime).toLocaleDateString()}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Last Sign In:</span>
                                <span class="detail-value">${new Date(user.metadata.lastSignInTime).toLocaleDateString()}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Email Verified:</span>
                                <span class="detail-value">${user.emailVerified ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="sm-btn sm-btn-outline" onclick="closeProfileModal()">Close</button>
                    <button class="sm-btn sm-blue" onclick="showEditProfileModal(); closeProfileModal();">Edit Profile</button>
                </div>
            </div>
        </div>
    `;
    
    // Remove any existing profile modal
    const existingModal = document.getElementById('profile-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Close dropdown
    closeProfileDropdown();
}

/**
 * Show edit profile modal
 */
function showEditProfileModal() {
    const user = auth.currentUser;
    if (!user) {
        showToast('Please log in to edit profile', 'error');
        return;
    }
    
    showToast('Profile editing feature coming soon!', 'info');
    closeProfileDropdown();
}

/**
 * Close profile modal
 */
window.closeProfileModal = function() {
    const modal = document.getElementById('profile-modal');
    if (modal) {
        modal.remove();
    }
};

/**
 * Add required CSS styles for profile dropdown
 */
export function addProfileStyles() {
    const styles = `
        <style>
        .profile-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            background: #2A2F3E;
            border: 1px solid #374151;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            min-width: 200px;
            z-index: 1000;
            display: none;
            margin-top: 8px;
        }
        
        .dropdown-item {
            padding: 12px 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            color: #D1D5DB;
            cursor: pointer;
            transition: background-color 0.2s;
            font-size: 14px;
        }
        
        .dropdown-item:hover {
            background: #374151;
            color: #ffffff;
        }
        
        .dropdown-item.logout-item {
            color: #F87171;
        }
        
        .dropdown-item.logout-item:hover {
            background: #EF4444;
            color: #ffffff;
        }
        
        .dropdown-divider {
            height: 1px;
            background: #374151;
            margin: 8px 0;
        }
        
        .profile-dropdown .dropdown-item i {
            width: 16px;
            text-align: center;
        }
        
        .user-profile {
            cursor: pointer;
        }
        
        .profile-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            padding: 20px;
        }
        
        .profile-details {
            width: 100%;
            max-width: 400px;
        }
        
        .profile-details .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #374151;
        }
        
        .profile-details .detail-row:last-child {
            border-bottom: none;
        }
        
        .profile-details .detail-label {
            font-weight: 500;
            color: #9CA3AF;
        }
        
        .profile-details .detail-value {
            font-weight: 400;
            color: #ffffff;
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}