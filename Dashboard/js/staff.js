// Staff Management JavaScript
import { db, auth } from '../firebase.js';
import { 
    collection, 
    getDocs, 
    query, 
    where, 
    orderBy, 
    limit, 
    startAfter, 
    getCountFromServer, 
    doc, 
    getDoc, 
    addDoc, 
    updateDoc,
    deleteDoc,
    Timestamp 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { showToast } from './toast.js';
import { initializeUserProfile, addProfileStyles } from './profile-utils.js';

// =============================================================================
// GLOBAL VARIABLES
// =============================================================================

let allStaff = [];
let filteredStaff = [];
let currentPage = 1;
let itemsPerPage = 10;
let totalStaff = 0;
let currentView = 'table'; // 'table' or 'grid'
let selectedStaff = new Set();
let isLoading = false;

// Filter states
let currentFilters = {
    search: '',
    department: '',
    status: '',
    position: '',
    experience: '',
    gender: '',
    hireDateFrom: '',
    hireDateTo: '',
    ageFrom: '',
    ageTo: '',
    salaryFrom: '',
    salaryTo: '',
    quickFilter: ''
};

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Staff management system initializing...');
    
    // Initialize Firebase auth state listener
    onAuthStateChanged(auth, (user) => {
        if (user) {
            initializeStaffManagement();
        } else {
            console.log('User not authenticated');
            window.location.href = '../login.html';
        }
    });
});

async function initializeStaffManagement() {
    try {
        // Initialize profile functionality
        addProfileStyles();
        initializeUserProfile();
        
        // Initialize all components
        setupEventListeners();
        setupBulkOperations();
        setupFilters();
        setupViewToggle();
        setupPagination();
        initializeAdvancedSearch();
        initializeAdvancedFilters();
        
        // Load initial data
        await loadStaffData();
        
        // Generate employee ID for new staff
        await generateEmployeeId();
        
        showToast('Staff management system loaded successfully', 'success');
        
    } catch (error) {
        console.error('Error initializing staff management:', error);
        showToast('Error loading staff management system', 'error');
    }
}

// =============================================================================
// EVENT LISTENERS SETUP
// =============================================================================

function setupEventListeners() {
    // Add staff form submission
    const addStaffForm = document.getElementById('addStaffForm');
    if (addStaffForm) {
        addStaffForm.addEventListener('submit', handleAddStaff);
    }
    
    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Header search input
    const headerSearchInput = document.querySelector('.header-search input');
    if (headerSearchInput) {
        headerSearchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Sidebar search input
    const sidebarSearchInput = document.querySelector('.sidebar-search input');
    if (sidebarSearchInput) {
        sidebarSearchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Modal close buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-close') || e.target.closest('.modal-close')) {
            closeAllModals();
        }
        if (e.target.classList.contains('modal') && !e.target.closest('.modal-content')) {
            closeAllModals();
        }
    });
    
    // Refresh button
    const refreshBtn = document.querySelector('[onclick="refreshStaffList()"]');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshStaffList);
    }
    
    // Export button
    const exportBtn = document.querySelector('[onclick="exportStaffData()"]');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportStaffData);
    }
    
    // Bulk upload button
    const bulkUploadBtn = document.querySelector('[onclick="openBulkUploadModal()"]');
    if (bulkUploadBtn) {
        bulkUploadBtn.addEventListener('click', openBulkUploadModal);
    }
    
    // Add staff button
    const addStaffBtn = document.querySelector('[onclick="openAddStaffModal()"]');
    if (addStaffBtn) {
        addStaffBtn.addEventListener('click', openAddStaffModal);
    }
}

function setupFilters() {
    // Department filter
    const departmentFilter = document.getElementById('departmentFilter');
    if (departmentFilter) {
        departmentFilter.addEventListener('change', handleFilterChange);
    }
    
    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', handleFilterChange);
    }
    
    // View filter
    const viewFilter = document.getElementById('viewFilter');
    if (viewFilter) {
        viewFilter.addEventListener('change', handleViewChange);
    }
    
    // Setup master checkbox for bulk operations
    const masterCheckbox = document.querySelector('#staffTable thead input[type="checkbox"]');
    if (masterCheckbox) {
        masterCheckbox.addEventListener('change', handleMasterCheckboxChange);
    }
}

function setupViewToggle() {
    const viewFilter = document.getElementById('viewFilter');
    if (viewFilter) {
        viewFilter.addEventListener('change', (e) => {
            currentView = e.target.value;
            toggleView();
        });
    }
}

function setupPagination() {
    // Pagination will be setup dynamically when data loads
}

// =============================================================================
// STAFF DATA MANAGEMENT
// =============================================================================

async function loadStaffData() {
    if (isLoading) return;
    
    isLoading = true;
    showLoadingState(true);
    
    try {
        console.log('Loading staff data from Firestore...');
        
        // Create query for staff collection
        const staffRef = collection(db, 'staff');
        const q = query(staffRef, orderBy('createdAt', 'desc'));
        
        // Get staff documents
        const querySnapshot = await getDocs(q);
        
        allStaff = [];
        querySnapshot.forEach((doc) => {
            const staffData = doc.data();
            allStaff.push({
                id: doc.id,
                ...staffData,
                createdAt: staffData.createdAt?.toDate?.() || new Date(),
                joiningDate: staffData.joiningDate?.toDate?.() || new Date(),
                dateOfBirth: staffData.dateOfBirth?.toDate?.() || null
            });
        });
        
        totalStaff = allStaff.length;
        console.log(`Loaded ${totalStaff} staff members`);
        
        // If no data loaded (for development/testing), add test data
        if (totalStaff === 0) {
            console.log('No staff data found, loading test data...');
            await addTestStaffData();
            return;
        }
        
        // Apply current filters
        applyFilters();
        
        // Update UI
        updateStaffStatistics();
        renderStaffList();
        
    } catch (error) {
        console.error('Error loading staff data:', error);
        showToast('Error loading staff data: ' + error.message, 'error');
    } finally {
        isLoading = false;
        showLoadingState(false);
    }
}

function applyFilters() {
    console.log('ApplyFilters called with:', currentFilters);
    console.log('AllStaff length:', allStaff.length);
    
    filteredStaff = allStaff.filter(staff => {
        // Search filter - enhanced to search multiple fields
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            const searchFields = [
                staff.name,
                staff.email,
                staff.phone,
                staff.employeeId,
                staff.position,
                staff.department
            ].filter(field => field) // Remove null/undefined values
             .join(' ').toLowerCase();
            
            if (!searchFields.includes(searchTerm)) {
                return false;
            }
        }
        
        // Department filter
        if (currentFilters.department && currentFilters.department !== '' && staff.department !== currentFilters.department) {
            return false;
        }
        
        // Status filter
        if (currentFilters.status && currentFilters.status !== '' && staff.status !== currentFilters.status) {
            return false;
        }
        
        // Position filter
        if (currentFilters.position && currentFilters.position !== '') {
            if (!staff.position || !staff.position.toLowerCase().includes(currentFilters.position.toLowerCase())) {
                return false;
            }
        }
        
        // Experience filter
        if (currentFilters.experience && currentFilters.experience !== '') {
            const experience = calculateExperience(staff.hireDate);
            const experienceLevel = getExperienceLevel(experience);
            if (experienceLevel !== currentFilters.experience) {
                return false;
            }
        }
        
        // Gender filter
        if (currentFilters.gender && currentFilters.gender !== '' && staff.gender !== currentFilters.gender) {
            return false;
        }
        
        // Hire date range filter
        if (currentFilters.hireDateFrom || currentFilters.hireDateTo) {
            const hireDate = new Date(staff.hireDate);
            
            if (currentFilters.hireDateFrom) {
                const fromDate = new Date(currentFilters.hireDateFrom);
                if (hireDate < fromDate) {
                    return false;
                }
            }
            
            if (currentFilters.hireDateTo) {
                const toDate = new Date(currentFilters.hireDateTo);
                if (hireDate > toDate) {
                    return false;
                }
            }
        }
        
        // Age range filter
        if (currentFilters.ageFrom || currentFilters.ageTo) {
            const age = calculateAge(staff.dateOfBirth);
            
            if (currentFilters.ageFrom && age < parseInt(currentFilters.ageFrom)) {
                return false;
            }
            
            if (currentFilters.ageTo && age > parseInt(currentFilters.ageTo)) {
                return false;
            }
        }
        
        // Salary range filter
        if (currentFilters.salaryFrom || currentFilters.salaryTo) {
            const salary = parseFloat(staff.salary) || 0;
            
            if (currentFilters.salaryFrom && salary < parseFloat(currentFilters.salaryFrom)) {
                return false;
            }
            
            if (currentFilters.salaryTo && salary > parseFloat(currentFilters.salaryTo)) {
                return false;
            }
        }
        
        // Quick filter
        if (currentFilters.quickFilter && currentFilters.quickFilter !== '') {
            if (!applyQuickFilter(staff, currentFilters.quickFilter)) {
                return false;
            }
        }
        
        return true;
    });
    
    console.log(`Filtered to ${filteredStaff.length} staff members from ${allStaff.length} total`);
    
    // Update search result count if there are filters applied
    updateSearchResultsInfo();
}

// =============================================================================
// FILTER UTILITY FUNCTIONS
// =============================================================================

function calculateExperience(hireDate) {
    if (!hireDate) return 0;
    const hire = new Date(hireDate);
    const now = new Date();
    const diffTime = Math.abs(now - hire);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25)); // Convert to years
}

function getExperienceLevel(years) {
    if (years <= 2) return 'entry';
    if (years <= 5) return 'mid';
    if (years <= 10) return 'senior';
    return 'expert';
}

function calculateAge(dateOfBirth) {
    if (!dateOfBirth) return 0;
    const birth = new Date(dateOfBirth);
    const now = new Date();
    const diffTime = Math.abs(now - birth);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25)); // Convert to years
}

function applyQuickFilter(staff, filterType) {
    const now = new Date();
    
    switch (filterType) {
        case 'recently_hired':
            // Hired in the last 30 days
            const hireDate = new Date(staff.hireDate);
            const daysDiff = (now - hireDate) / (1000 * 60 * 60 * 24);
            return daysDiff <= 30;
            
        case 'birthdays_this_month':
            // Birthday this month
            if (!staff.dateOfBirth) return false;
            const birthDate = new Date(staff.dateOfBirth);
            return birthDate.getMonth() === now.getMonth();
            
        case 'senior_staff':
            // More than 5 years experience
            const experience = calculateExperience(staff.hireDate);
            return experience > 5;
            
        case 'high_performers':
            // Staff with high performance ratings (if available)
            return staff.performanceRating && parseFloat(staff.performanceRating) >= 4.0;
            
        default:
            return true;
    }
}

function updateStaffStatistics() {
    // Total staff
    const totalStaffElement = document.getElementById('totalStaff');
    if (totalStaffElement) {
        totalStaffElement.textContent = totalStaff;
    }
    
    // Active staff
    const activeStaff = allStaff.filter(staff => staff.status === 'Active').length;
    const activeStaffElement = document.getElementById('activeStaff');
    if (activeStaffElement) {
        activeStaffElement.textContent = activeStaff;
    }
    
    // New staff this month
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const newStaff = allStaff.filter(staff => 
        staff.createdAt && staff.createdAt >= thisMonth
    ).length;
    const newStaffElement = document.getElementById('newStaff');
    if (newStaffElement) {
        newStaffElement.textContent = newStaff;
    }
    
    // Teaching staff
    const teachingStaff = allStaff.filter(staff => 
        staff.department === 'Academic' || 
        staff.position?.toLowerCase().includes('teacher') ||
        staff.position?.toLowerCase().includes('instructor')
    ).length;
    const teachingStaffElement = document.getElementById('teachingStaff');
    if (teachingStaffElement) {
        teachingStaffElement.textContent = teachingStaff;
    }
    
    // Log current highest employee ID for reference
    let maxNumber = 0;
    allStaff.forEach(staff => {
        if (staff.employeeId && staff.employeeId.startsWith('MTS')) {
            const numberPart = staff.employeeId.substring(3);
            const currentNumber = parseInt(numberPart, 10);
            if (!isNaN(currentNumber) && currentNumber > maxNumber) {
                maxNumber = currentNumber;
            }
        }
    });
    
    if (maxNumber > 0) {
        console.log(`Highest existing employee ID: MTS${maxNumber.toString().padStart(3, '0')}`);
        console.log(`Next employee ID will be: MTS${(maxNumber + 1).toString().padStart(3, '0')}`);
    } else {
        console.log('No existing employee IDs found. Next ID will be: MTS001');
    }
}

// =============================================================================
// UI RENDERING
// =============================================================================

function renderStaffList() {
    if (currentView === 'table') {
        renderTableView();
    } else {
        renderGridView();
    }
    updatePagination();
}

function renderTableView() {
    const tableBody = document.getElementById('staffTableBody');
    if (!tableBody) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageStaff = filteredStaff.slice(startIndex, endIndex);
    
    if (pageStaff.length === 0) {
        const hasFilters = currentFilters.search || currentFilters.department || currentFilters.status || 
                          currentFilters.position || currentFilters.experience || currentFilters.gender ||
                          currentFilters.hireDateFrom || currentFilters.hireDateTo || currentFilters.ageFrom ||
                          currentFilters.ageTo || currentFilters.salaryFrom || currentFilters.salaryTo ||
                          currentFilters.quickFilter;
        
        if (hasFilters) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="no-results-message text-center" style="padding: 40px;">
                        <i class="fas fa-search" style="font-size: 48px; color: #9CA3AF; margin-bottom: 16px;"></i>
                        <div style="font-size: 18px; color: #374151; font-weight: 600; margin-bottom: 8px;">No staff members found</div>
                        <div style="font-size: 14px; color: #6B7280; margin-bottom: 20px;">No staff members match your current search criteria.</div>
                        <button onclick="clearAllFilters()" class="btn btn-primary btn-sm">
                            <i class="fas fa-times"></i> Clear Filters
                        </button>
                    </td>
                </tr>
            `;
        } else {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="no-results-message text-center" style="padding: 40px;">
                        <i class="fas fa-users" style="font-size: 48px; color: #9CA3AF; margin-bottom: 16px;"></i>
                        <div style="font-size: 18px; color: #374151; font-weight: 600; margin-bottom: 8px;">No staff members yet</div>
                        <div style="font-size: 14px; color: #6B7280; margin-bottom: 20px;">Add your first staff member to get started.</div>
                        <button onclick="openAddStaffModal()" class="btn btn-primary btn-sm">
                            <i class="fas fa-plus"></i> Add Staff Member
                        </button>
                    </td>
                </tr>
            `;
        }
        return;
    }
    
    tableBody.innerHTML = pageStaff.map(staff => `
        <tr>
            <td>
                <input type="checkbox" class="staff-checkbox" data-staff-id="${staff.id}" 
                       onchange="handleStaffCheckboxChange(this)">
            </td>
            <td>
                <div class="staff-info">
                    <div class="staff-avatar">
                        ${staff.photoURL ? 
                            `<img src="${staff.photoURL}" alt="${staff.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` :
                            `<i class="fas fa-user"></i>`
                        }
                    </div>
                    <div class="staff-details">
                        <div class="staff-name">${staff.name || 'N/A'}</div>
                        <div class="staff-id">${staff.employeeId || 'N/A'}</div>
                    </div>
                </div>
            </td>
            <td>${staff.position || 'N/A'}</td>
            <td>${staff.department || 'N/A'}</td>
            <td>${staff.phone || 'N/A'}</td>
            <td>${staff.email || 'N/A'}</td>
            <td>
                <span class="badge badge-${getStatusBadgeClass(staff.status)}">
                    ${staff.status || 'Active'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-outline" onclick="viewStaffDetails('${staff.id}')" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline" onclick="editStaff('${staff.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteStaff('${staff.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Update bulk selection state
    updateBulkDeleteButton();
    updateMasterCheckboxState();
}

function renderGridView() {
    const gridContainer = document.getElementById('staffGrid');
    if (!gridContainer) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageStaff = filteredStaff.slice(startIndex, endIndex);
    
    if (pageStaff.length === 0) {
        const hasFilters = currentFilters.search || currentFilters.department || currentFilters.status || 
                          currentFilters.position || currentFilters.experience || currentFilters.gender ||
                          currentFilters.hireDateFrom || currentFilters.hireDateTo || currentFilters.ageFrom ||
                          currentFilters.ageTo || currentFilters.salaryFrom || currentFilters.salaryTo ||
                          currentFilters.quickFilter;
        
        if (hasFilters) {
            gridContainer.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-search" style="font-size: 48px; color: #9CA3AF; margin-bottom: 16px;"></i>
                    <div style="font-size: 18px; color: #374151; font-weight: 600; margin-bottom: 8px;">No staff members found</div>
                    <div style="font-size: 14px; color: #6B7280; margin-bottom: 20px;">No staff members match your current search criteria.</div>
                    <button onclick="clearAllFilters()" class="btn btn-primary btn-sm">
                        <i class="fas fa-times"></i> Clear Filters
                    </button>
                </div>
            `;
        } else {
            gridContainer.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-users" style="font-size: 48px; color: #9CA3AF; margin-bottom: 16px;"></i>
                    <div style="font-size: 18px; color: #374151; font-weight: 600; margin-bottom: 8px;">No staff members yet</div>
                    <div style="font-size: 14px; color: #6B7280; margin-bottom: 20px;">Add your first staff member to get started.</div>
                    <button onclick="openAddStaffModal()" class="btn btn-primary btn-sm">
                        <i class="fas fa-plus"></i> Add Staff Member
                    </button>
                </div>
            `;
        }
        return;
    }
    
    gridContainer.innerHTML = pageStaff.map(staff => `
        <div class="staff-card">
            <div class="staff-card-header">
                <input type="checkbox" class="staff-checkbox" data-staff-id="${staff.id}" 
                       onchange="handleStaffCheckboxChange(this)">
                <div class="staff-avatar-large">
                    ${staff.photoURL ? 
                        `<img src="${staff.photoURL}" alt="${staff.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` :
                        `<i class="fas fa-user"></i>`
                    }
                </div>
            </div>
            <div class="staff-card-body">
                <h4>${staff.name || 'N/A'}</h4>
                <p class="staff-position">${staff.position || 'N/A'}</p>
                <p class="staff-department">${staff.department || 'N/A'}</p>
                <div class="staff-contact">
                    <div><i class="fas fa-phone"></i> ${staff.phone || 'N/A'}</div>
                    <div><i class="fas fa-envelope"></i> ${staff.email || 'N/A'}</div>
                </div>
                <span class="badge badge-${getStatusBadgeClass(staff.status)}">
                    ${staff.status || 'Active'}
                </span>
            </div>
            <div class="staff-card-actions">
                <button class="btn btn-sm btn-outline" onclick="viewStaffDetails('${staff.id}')" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline" onclick="editStaff('${staff.id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteStaff('${staff.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function getStatusBadgeClass(status) {
    switch (status?.toLowerCase()) {
        case 'active': return 'success';
        case 'inactive': return 'danger';
        case 'on leave': return 'warning';
        case 'probation': return 'info';
        default: return 'success';
    }
}

function toggleView() {
    const tableView = document.getElementById('tableView');
    const gridView = document.getElementById('gridView');
    
    if (currentView === 'table') {
        tableView.style.display = 'block';
        gridView.style.display = 'none';
    } else {
        tableView.style.display = 'none';
        gridView.style.display = 'block';
    }
    
    renderStaffList();
}

// =============================================================================
// SEARCH AND FILTERING
// =============================================================================

function handleSearch(e) {
    currentFilters.search = e.target.value.trim();
    currentPage = 1;
    applyFilters();
    renderStaffList();
}

function handleFilterChange(e) {
    const filterId = e.target.id;
    const value = e.target.value;
    
    console.log('Filter change:', filterId, 'value:', value);
    
    switch (filterId) {
        case 'departmentFilter':
            currentFilters.department = value;
            break;
        case 'statusFilter':
            currentFilters.status = value;
            break;
        case 'positionFilter':
            currentFilters.position = value;
            break;
    }
    
    currentPage = 1; // Reset to first page when filtering
    applyFilters();
    renderStaffList();
    
    // Show filter feedback
    showFilterFeedback();
}

function handleViewChange(e) {
    currentView = e.target.value;
    toggleView();
}

// =============================================================================
// MODAL MANAGEMENT
// =============================================================================

function openAddStaffModal() {
    const modal = document.getElementById('addStaffModal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Generate new employee ID when modal opens
        generateEmployeeId();
        
        // Set default joining date to today
        const joiningDateInput = document.getElementById('staffJoiningDate');
        if (joiningDateInput) {
            joiningDateInput.value = new Date().toISOString().split('T')[0];
        }
    }
}

function closeAddStaffModal() {
    const modal = document.getElementById('addStaffModal');
    if (modal) {
        modal.style.display = 'none';
        document.getElementById('addStaffForm').reset();
    }
}

function openBulkUploadModal() {
    const modal = document.getElementById('bulkUploadModal');
    if (modal) {
        modal.style.display = 'flex';
        // Reset the bulk upload wizard to step 1
        resetBulkUpload();
    }
}

function closeBulkUploadModal() {
    const modal = document.getElementById('bulkUploadModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function openStaffDetailsModal() {
    const modal = document.getElementById('staffDetailsModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeStaffDetailsModal() {
    const modal = document.getElementById('staffDetailsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// =============================================================================
// STAFF OPERATIONS
// =============================================================================

async function handleAddStaff(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding Staff...';
        
        // Collect form data
        const formData = new FormData(e.target);
        const staffData = {
            name: document.getElementById('staffName').value.trim(),
            phone: document.getElementById('staffPhone').value.trim(),
            email: document.getElementById('staffEmail').value.trim(),
            department: document.getElementById('staffDepartment').value,
            position: document.getElementById('staffPosition').value.trim(),
            employeeId: document.getElementById('staffEmployeeId').value.trim() || await generateEmployeeId(),
            dateOfBirth: document.getElementById('staffDOB').value ? new Date(document.getElementById('staffDOB').value) : null,
            gender: document.getElementById('staffGender').value,
            nationality: document.getElementById('staffNationality').value.trim(),
            presentAddress: document.getElementById('staffPresentAddress').value.trim(),
            permanentAddress: document.getElementById('staffPermanentAddress').value.trim(),
            education: document.getElementById('staffEducation').value.trim(),
            experience: document.getElementById('staffExperience').value.trim(),
            joiningDate: new Date(document.getElementById('staffJoiningDate').value),
            salary: parseFloat(document.getElementById('staffSalary').value) || 0,
            emergencyContact: document.getElementById('staffEmergencyContact').value.trim(),
            photoURL: document.getElementById('staffPhotoURL').value.trim(),
            notes: document.getElementById('staffNotes').value.trim(),
            status: 'Active',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        // Validate required fields
        if (!staffData.name || !staffData.phone || !staffData.email || !staffData.department || !staffData.position) {
            throw new Error('Please fill in all required fields');
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(staffData.email)) {
            throw new Error('Please enter a valid email address');
        }
        
        // Check if email already exists
        const existingStaff = allStaff.find(staff => staff.email === staffData.email);
        if (existingStaff) {
            throw new Error('A staff member with this email already exists');
        }
        
        // Add to Firestore
        const docRef = await addDoc(collection(db, 'staff'), {
            ...staffData,
            dateOfBirth: staffData.dateOfBirth ? Timestamp.fromDate(staffData.dateOfBirth) : null,
            joiningDate: Timestamp.fromDate(staffData.joiningDate),
            createdAt: Timestamp.fromDate(staffData.createdAt),
            updatedAt: Timestamp.fromDate(staffData.updatedAt)
        });
        
        console.log('Staff added with ID:', docRef.id);
        
        // Close modal and reset form
        closeAddStaffModal();
        
        // Reload data
        await loadStaffData();
        
        showToast('Staff member added successfully', 'success');
        
    } catch (error) {
        console.error('Error adding staff:', error);
        showToast('Error adding staff: ' + error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

async function deleteStaff(staffId) {
    const staff = allStaff.find(s => s.id === staffId);
    if (!staff) {
        showToast('Staff member not found', 'error');
        return;
    }
    
    // Show confirmation modal instead of simple confirm
    showDeleteConfirmationModal(staff);
}

function showDeleteConfirmationModal(staff) {
    const modal = document.getElementById('deleteConfirmModal');
    if (!modal) {
        createDeleteConfirmationModal();
        showDeleteConfirmationModal(staff);
        return;
    }
    
    // Update modal content with staff details
    const staffNameElement = document.getElementById('deleteStaffName');
    const staffDetailsElement = document.getElementById('deleteStaffDetails');
    
    if (staffNameElement) {
        staffNameElement.textContent = staff.name || 'Unknown Staff';
    }
    
    if (staffDetailsElement) {
        staffDetailsElement.innerHTML = `
            <div class="delete-staff-info">
                <div class="info-row">
                    <span class="label">Employee ID:</span>
                    <span class="value">${staff.employeeId || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="label">Position:</span>
                    <span class="value">${staff.position || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="label">Department:</span>
                    <span class="value">${staff.department || 'N/A'}</span>
                </div>
                <div class="info-row">
                    <span class="label">Email:</span>
                    <span class="value">${staff.email || 'N/A'}</span>
                </div>
            </div>
        `;
    }
    
    // Store staff ID for deletion
    modal.setAttribute('data-staff-id', staff.id);
    
    // Show modal
    modal.style.display = 'flex';
}

function createDeleteConfirmationModal() {
    const modalHTML = `
        <div id="deleteConfirmModal" class="modal">
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <div class="modal-title">
                        <i class="fas fa-exclamation-triangle" style="color: #EF4444; margin-right: 8px;"></i>
                        Confirm Delete Staff
                    </div>
                    <button class="modal-close" onclick="closeDeleteConfirmModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="modal-body">
                    <div class="delete-warning">
                        <p style="color: #EF4444; font-weight: 500; margin-bottom: 16px;">
                            ⚠️ This action cannot be undone!
                        </p>
                        <p style="margin-bottom: 20px;">
                            Are you sure you want to delete this staff member?
                        </p>
                    </div>
                    
                    <div class="delete-staff-details">
                        <h4 id="deleteStaffName" style="color: #ffffff; margin-bottom: 12px;"></h4>
                        <div id="deleteStaffDetails"></div>
                    </div>
                </div>
                
                <div class="card-actions" style="justify-content: flex-end; margin-top: 24px;">
                    <button type="button" class="btn btn-outline" onclick="closeDeleteConfirmModal()">
                        Cancel
                    </button>
                    <button type="button" class="btn btn-danger" onclick="confirmDeleteStaff()">
                        <i class="fas fa-trash"></i>
                        Delete Staff
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeDeleteConfirmModal() {
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) {
        modal.style.display = 'none';
        modal.removeAttribute('data-staff-id');
    }
}

async function confirmDeleteStaff() {
    const modal = document.getElementById('deleteConfirmModal');
    const staffId = modal.getAttribute('data-staff-id');
    
    if (!staffId) {
        showToast('Error: Staff ID not found', 'error');
        return;
    }
    
    const deleteBtn = modal.querySelector('.btn-danger');
    const originalText = deleteBtn.innerHTML;
    
    try {
        deleteBtn.disabled = true;
        deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
        
        await deleteDoc(doc(db, 'staff', staffId));
        
        closeDeleteConfirmModal();
        await loadStaffData();
        showToast('Staff member deleted successfully', 'success');
        
    } catch (error) {
        console.error('Error deleting staff:', error);
        showToast('Error deleting staff: ' + error.message, 'error');
    } finally {
        deleteBtn.disabled = false;
        deleteBtn.innerHTML = originalText;
    }
}

function editStaff(staffId) {
    const staff = allStaff.find(s => s.id === staffId);
    if (!staff) {
        showToast('Staff member not found', 'error');
        return;
    }
    
    // Open edit modal with pre-filled data
    openEditStaffModal(staff);
}

function openEditStaffModal(staff) {
    // First create the edit modal if it doesn't exist
    if (!document.getElementById('editStaffModal')) {
        createEditStaffModal();
    }
    
    const modal = document.getElementById('editStaffModal');
    
    // Pre-fill the form with staff data
    populateEditForm(staff);
    
    // Store staff ID for updating
    modal.setAttribute('data-staff-id', staff.id);
    
    // Show modal
    modal.style.display = 'flex';
}

function createEditStaffModal() {
    const modalHTML = `
        <div id="editStaffModal" class="modal">
            <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <div class="modal-title">
                        <i class="fas fa-edit" style="color: #3B82F6; margin-right: 8px;"></i>
                        Edit Staff Member
                    </div>
                    <button class="modal-close" onclick="closeEditStaffModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <form id="editStaffForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Full Name *</label>
                            <input type="text" class="form-control" id="editStaffName" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Phone Number *</label>
                            <input type="tel" class="form-control" id="editStaffPhone" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Email *</label>
                            <input type="email" class="form-control" id="editStaffEmail" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Department *</label>
                            <select class="form-control" id="editStaffDepartment" required>
                                <option value="">Select Department</option>
                                <option value="Academic">Academic</option>
                                <option value="Administration">Administration</option>
                                <option value="IT">Information Technology</option>
                                <option value="Finance">Finance</option>
                                <option value="Marketing">Marketing</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Position *</label>
                            <input type="text" class="form-control" id="editStaffPosition" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Employee ID</label>
                            <input type="text" class="form-control" id="editStaffEmployeeId" readonly>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Date of Birth</label>
                            <input type="date" class="form-control" id="editStaffDOB">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Gender</label>
                            <select class="form-control" id="editStaffGender">
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Nationality</label>
                            <input type="text" class="form-control" id="editStaffNationality">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Present Address</label>
                            <textarea class="form-control" id="editStaffPresentAddress" rows="3"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Permanent Address</label>
                            <textarea class="form-control" id="editStaffPermanentAddress" rows="3"></textarea>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Educational Qualifications</label>
                            <textarea class="form-control" id="editStaffEducation" rows="3"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Work Experience</label>
                            <textarea class="form-control" id="editStaffExperience" rows="3"></textarea>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Joining Date *</label>
                            <input type="date" class="form-control" id="editStaffJoiningDate" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Salary (₹)</label>
                            <input type="number" class="form-control" id="editStaffSalary" min="0" step="100">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Status</label>
                            <select class="form-control" id="editStaffStatus">
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="On Leave">On Leave</option>
                                <option value="Probation">Probation</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Emergency Contact</label>
                            <input type="tel" class="form-control" id="editStaffEmergencyContact">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Photo URL</label>
                            <input type="url" class="form-control" id="editStaffPhotoURL" placeholder="https://example.com/photo.jpg">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Additional Notes</label>
                        <textarea class="form-control" id="editStaffNotes" rows="3"></textarea>
                    </div>
                    
                    <div class="card-actions" style="justify-content: flex-end; margin-top: 20px;">
                        <button type="button" class="btn btn-outline" onclick="closeEditStaffModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i>
                            Update Staff
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add form submit event listener
    const editForm = document.getElementById('editStaffForm');
    if (editForm) {
        editForm.addEventListener('submit', handleEditStaff);
    }
}

function populateEditForm(staff) {
    // Populate all form fields with staff data
    document.getElementById('editStaffName').value = staff.name || '';
    document.getElementById('editStaffPhone').value = staff.phone || '';
    document.getElementById('editStaffEmail').value = staff.email || '';
    document.getElementById('editStaffDepartment').value = staff.department || '';
    document.getElementById('editStaffPosition').value = staff.position || '';
    document.getElementById('editStaffEmployeeId').value = staff.employeeId || '';
    document.getElementById('editStaffDOB').value = staff.dateOfBirth ? staff.dateOfBirth.toISOString().split('T')[0] : '';
    document.getElementById('editStaffGender').value = staff.gender || '';
    document.getElementById('editStaffNationality').value = staff.nationality || '';
    document.getElementById('editStaffPresentAddress').value = staff.presentAddress || '';
    document.getElementById('editStaffPermanentAddress').value = staff.permanentAddress || '';
    document.getElementById('editStaffEducation').value = staff.education || '';
    document.getElementById('editStaffExperience').value = staff.experience || '';
    document.getElementById('editStaffJoiningDate').value = staff.joiningDate ? staff.joiningDate.toISOString().split('T')[0] : '';
    document.getElementById('editStaffSalary').value = staff.salary || '';
    document.getElementById('editStaffStatus').value = staff.status || 'Active';
    document.getElementById('editStaffEmergencyContact').value = staff.emergencyContact || '';
    document.getElementById('editStaffPhotoURL').value = staff.photoURL || '';
    document.getElementById('editStaffNotes').value = staff.notes || '';
}

function closeEditStaffModal() {
    const modal = document.getElementById('editStaffModal');
    if (modal) {
        modal.style.display = 'none';
        modal.removeAttribute('data-staff-id');
        document.getElementById('editStaffForm').reset();
    }
}

async function handleEditStaff(e) {
    e.preventDefault();
    
    const modal = document.getElementById('editStaffModal');
    const staffId = modal.getAttribute('data-staff-id');
    
    if (!staffId) {
        showToast('Error: Staff ID not found', 'error');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
        
        // Collect updated form data
        const updatedData = {
            name: document.getElementById('editStaffName').value.trim(),
            phone: document.getElementById('editStaffPhone').value.trim(),
            email: document.getElementById('editStaffEmail').value.trim(),
            department: document.getElementById('editStaffDepartment').value,
            position: document.getElementById('editStaffPosition').value.trim(),
            dateOfBirth: document.getElementById('editStaffDOB').value ? new Date(document.getElementById('editStaffDOB').value) : null,
            gender: document.getElementById('editStaffGender').value,
            nationality: document.getElementById('editStaffNationality').value.trim(),
            presentAddress: document.getElementById('editStaffPresentAddress').value.trim(),
            permanentAddress: document.getElementById('editStaffPermanentAddress').value.trim(),
            education: document.getElementById('editStaffEducation').value.trim(),
            experience: document.getElementById('editStaffExperience').value.trim(),
            joiningDate: new Date(document.getElementById('editStaffJoiningDate').value),
            salary: parseFloat(document.getElementById('editStaffSalary').value) || 0,
            status: document.getElementById('editStaffStatus').value,
            emergencyContact: document.getElementById('editStaffEmergencyContact').value.trim(),
            photoURL: document.getElementById('editStaffPhotoURL').value.trim(),
            notes: document.getElementById('editStaffNotes').value.trim(),
            updatedAt: new Date()
        };
        
        // Validate required fields
        if (!updatedData.name || !updatedData.phone || !updatedData.email || !updatedData.department || !updatedData.position) {
            throw new Error('Please fill in all required fields');
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updatedData.email)) {
            throw new Error('Please enter a valid email address');
        }
        
        // Check if email already exists (excluding current staff)
        const existingStaff = allStaff.find(staff => staff.email === updatedData.email && staff.id !== staffId);
        if (existingStaff) {
            throw new Error('A staff member with this email already exists');
        }
        
        // Update in Firestore
        const staffRef = doc(db, 'staff', staffId);
        await updateDoc(staffRef, {
            ...updatedData,
            dateOfBirth: updatedData.dateOfBirth ? Timestamp.fromDate(updatedData.dateOfBirth) : null,
            joiningDate: Timestamp.fromDate(updatedData.joiningDate),
            updatedAt: Timestamp.fromDate(updatedData.updatedAt)
        });
        
        console.log('Staff updated successfully:', staffId);
        
        // Close modal and reload data
        closeEditStaffModal();
        await loadStaffData();
        
        showToast('Staff member updated successfully', 'success');
        
    } catch (error) {
        console.error('Error updating staff:', error);
        showToast('Error updating staff: ' + error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

function viewStaffDetails(staffId) {
    const staff = allStaff.find(s => s.id === staffId);
    if (!staff) return;
    
    const detailsContent = document.getElementById('staffDetailsContent');
    if (detailsContent) {
        detailsContent.innerHTML = `
            <div class="staff-details-header">
                <div class="staff-photo-section">
                    <div class="staff-photo-large">
                        ${staff.photoURL ? 
                            `<img src="${staff.photoURL}" alt="${staff.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;">` :
                            `<i class="fas fa-user"></i>`
                        }
                    </div>
                    <div class="staff-basic-info">
                        <h2>${staff.name || 'N/A'}</h2>
                        <p class="staff-position-large">${staff.position || 'N/A'}</p>
                        <span class="badge badge-${getStatusBadgeClass(staff.status)} badge-large">
                            ${staff.status || 'Active'}
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="staff-details-grid">
                <div class="detail-section">
                    <h3><i class="fas fa-user"></i> Personal Information</h3>
                    <div class="detail-row">
                        <label>Full Name:</label>
                        <span>${staff.name || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <label>Employee ID:</label>
                        <span class="employee-id-badge">${staff.employeeId || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <label>Date of Birth:</label>
                        <span>${staff.dateOfBirth ? staff.dateOfBirth.toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <label>Gender:</label>
                        <span>${staff.gender || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <label>Nationality:</label>
                        <span>${staff.nationality || 'N/A'}</span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3><i class="fas fa-phone"></i> Contact Information</h3>
                    <div class="detail-row">
                        <label>Phone:</label>
                        <span class="contact-info">
                            <i class="fas fa-phone-alt"></i>
                            <a href="tel:${staff.phone}" style="color: #3B82F6; text-decoration: none;">
                                ${staff.phone || 'N/A'}
                            </a>
                        </span>
                    </div>
                    <div class="detail-row">
                        <label>Email:</label>
                        <span class="contact-info">
                            <i class="fas fa-envelope"></i>
                            <a href="mailto:${staff.email}" style="color: #3B82F6; text-decoration: none;">
                                ${staff.email || 'N/A'}
                            </a>
                        </span>
                    </div>
                    <div class="detail-row">
                        <label>Emergency Contact:</label>
                        <span class="contact-info">
                            <i class="fas fa-exclamation-triangle"></i>
                            <a href="tel:${staff.emergencyContact}" style="color: #F59E0B; text-decoration: none;">
                                ${staff.emergencyContact || 'N/A'}
                            </a>
                        </span>
                    </div>
                    <div class="detail-row">
                        <label>Present Address:</label>
                        <span class="address-text">${staff.presentAddress || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <label>Permanent Address:</label>
                        <span class="address-text">${staff.permanentAddress || 'N/A'}</span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3><i class="fas fa-briefcase"></i> Professional Information</h3>
                    <div class="detail-row">
                        <label>Department:</label>
                        <span class="department-badge">${staff.department || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <label>Position:</label>
                        <span>${staff.position || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <label>Joining Date:</label>
                        <span>${staff.joiningDate ? staff.joiningDate.toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <label>Salary:</label>
                        <span class="salary-info">
                            ${staff.salary ? '₹' + staff.salary.toLocaleString() + ' per month' : 'N/A'}
                        </span>
                    </div>
                    <div class="detail-row">
                        <label>Status:</label>
                        <span class="badge badge-${getStatusBadgeClass(staff.status)}">${staff.status || 'Active'}</span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3><i class="fas fa-graduation-cap"></i> Education & Experience</h3>
                    <div class="detail-row">
                        <label>Educational Qualifications:</label>
                        <span class="multiline-text">${staff.education || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <label>Work Experience:</label>
                        <span class="multiline-text">${staff.experience || 'N/A'}</span>
                    </div>
                    <div class="detail-row">
                        <label>Additional Notes:</label>
                        <span class="multiline-text">${staff.notes || 'N/A'}</span>
                    </div>
                </div>
            </div>
            
            <div class="staff-action-buttons">
                <button class="btn btn-primary" onclick="editStaff('${staff.id}')">
                    <i class="fas fa-edit"></i>
                    Edit Staff Details
                </button>
                <button class="btn btn-danger" onclick="deleteStaff('${staff.id}')">
                    <i class="fas fa-trash"></i>
                    Delete Staff
                </button>
                <button class="btn btn-outline" onclick="exportStaffMemberData('${staff.id}')">
                    <i class="fas fa-download"></i>
                    Export Details
                </button>
            </div>
        `;
    }
    
    openStaffDetailsModal();
}

// Function to export individual staff member data
function exportStaffMemberData(staffId) {
    const staff = allStaff.find(s => s.id === staffId);
    if (!staff) {
        showToast('Staff member not found', 'error');
        return;
    }
    
    try {
        const staffData = [
            ['Field', 'Value'],
            ['Name', staff.name || ''],
            ['Employee ID', staff.employeeId || ''],
            ['Position', staff.position || ''],
            ['Department', staff.department || ''],
            ['Phone', staff.phone || ''],
            ['Email', staff.email || ''],
            ['Date of Birth', staff.dateOfBirth ? staff.dateOfBirth.toLocaleDateString() : ''],
            ['Gender', staff.gender || ''],
            ['Nationality', staff.nationality || ''],
            ['Present Address', staff.presentAddress || ''],
            ['Permanent Address', staff.permanentAddress || ''],
            ['Education', staff.education || ''],
            ['Experience', staff.experience || ''],
            ['Joining Date', staff.joiningDate ? staff.joiningDate.toLocaleDateString() : ''],
            ['Salary', staff.salary ? '₹' + staff.salary.toLocaleString() : ''],
            ['Status', staff.status || ''],
            ['Emergency Contact', staff.emergencyContact || ''],
            ['Photo URL', staff.photoURL || ''],
            ['Notes', staff.notes || '']
        ];
        
        const csvContent = staffData.map(row => 
            row.map(field => `"${field}"`).join(',')
        ).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `staff_${staff.employeeId || 'unknown'}_${staff.name?.replace(/\s+/g, '_') || 'details'}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showToast('Staff details exported successfully', 'success');
    } catch (error) {
        console.error('Error exporting staff details:', error);
        showToast('Error exporting staff details', 'error');
    }
}

// =============================================================================
// BULK OPERATIONS
// =============================================================================

function setupBulkOperations() {
    // Master checkbox
    const masterCheckbox = document.getElementById('select-all-staff');
    if (masterCheckbox) {
        masterCheckbox.addEventListener('change', handleMasterCheckboxChange);
    }
    
    // Bulk delete button
    const bulkDeleteBtn = document.getElementById('bulk-delete-btn');
    if (bulkDeleteBtn) {
        bulkDeleteBtn.addEventListener('click', openBulkDeleteModal);
    }
}

function handleMasterCheckboxChange() {
    const masterCheckbox = document.getElementById('select-all-staff');
    const isChecked = masterCheckbox.checked;
    
    const individualCheckboxes = document.querySelectorAll('.staff-checkbox');
    individualCheckboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
        handleStaffCheckboxChange(checkbox);
    });
}

function handleStaffCheckboxChange(checkbox) {
    const staffId = checkbox.getAttribute('data-staff-id');
    
    if (checkbox.checked) {
        selectedStaff.add(staffId);
    } else {
        selectedStaff.delete(staffId);
        const masterCheckbox = document.getElementById('select-all-staff');
        if (masterCheckbox) {
            masterCheckbox.checked = false;
        }
    }
    
    updateBulkDeleteButton();
    updateMasterCheckboxState();
}

function updateBulkDeleteButton() {
    const bulkDeleteBtn = document.getElementById('bulk-delete-btn');
    const selectedCount = selectedStaff.size;
    
    if (bulkDeleteBtn) {
        if (selectedCount > 0) {
            bulkDeleteBtn.style.display = 'inline-flex';
            const countSpan = bulkDeleteBtn.querySelector('.selected-count');
            if (countSpan) {
                countSpan.textContent = selectedCount;
            }
        } else {
            bulkDeleteBtn.style.display = 'none';
        }
    }
}

function updateMasterCheckboxState() {
    const masterCheckbox = document.getElementById('select-all-staff');
    const individualCheckboxes = document.querySelectorAll('.staff-checkbox');
    const checkedBoxes = document.querySelectorAll('.staff-checkbox:checked');
    
    if (masterCheckbox && individualCheckboxes.length > 0) {
        if (checkedBoxes.length === individualCheckboxes.length) {
            masterCheckbox.checked = true;
            masterCheckbox.indeterminate = false;
        } else if (checkedBoxes.length > 0) {
            masterCheckbox.checked = false;
            masterCheckbox.indeterminate = true;
        } else {
            masterCheckbox.checked = false;
            masterCheckbox.indeterminate = false;
        }
    }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

async function generateEmployeeId() {
    try {
        // Check if we already have staff data loaded to avoid extra queries
        let maxNumber = 0;
        
        if (allStaff && allStaff.length > 0) {
            // Use already loaded staff data
            allStaff.forEach(staff => {
                if (staff.employeeId && staff.employeeId.startsWith('MTS')) {
                    const numberPart = staff.employeeId.substring(3);
                    const currentNumber = parseInt(numberPart, 10);
                    if (!isNaN(currentNumber) && currentNumber > maxNumber) {
                        maxNumber = currentNumber;
                    }
                }
            });
        } else {
            // Query database if data not loaded yet
            const staffRef = collection(db, 'staff');
            const querySnapshot = await getDocs(staffRef);
            
            querySnapshot.forEach((doc) => {
                const staffData = doc.data();
                if (staffData.employeeId && staffData.employeeId.startsWith('MTS')) {
                    const numberPart = staffData.employeeId.substring(3);
                    const currentNumber = parseInt(numberPart, 10);
                    if (!isNaN(currentNumber) && currentNumber > maxNumber) {
                        maxNumber = currentNumber;
                    }
                }
            });
        }
        
        // Generate next employee ID
        const nextNumber = maxNumber + 1;
        const employeeId = `MTS${nextNumber.toString().padStart(3, '0')}`;
        
        // Update the input field if it exists
        const employeeIdInput = document.getElementById('staffEmployeeId');
        if (employeeIdInput) {
            employeeIdInput.value = employeeId;
        }
        
        console.log(`Generated new employee ID: ${employeeId} (next number: ${nextNumber})`);
        return employeeId;
        
    } catch (error) {
        console.error('Error generating employee ID:', error);
        // Fallback to MTS001 if there's an error and no existing data
        const fallbackId = 'MTS001';
        
        const employeeIdInput = document.getElementById('staffEmployeeId');
        if (employeeIdInput) {
            employeeIdInput.value = fallbackId;
        }
        
        return fallbackId;
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showLoadingState(isLoading) {
    const loadingElements = document.querySelectorAll('.loading-state');
    loadingElements.forEach(element => {
        element.style.display = isLoading ? 'block' : 'none';
    });
}

function updatePagination() {
    // Pagination implementation can be added here
    console.log(`Showing ${filteredStaff.length} of ${totalStaff} staff members`);
}

// =============================================================================
// SEARCH AND FILTER UTILITIES
// =============================================================================

function updateSearchResultsInfo() {
    // Check if any filters are applied
    const hasFilters = currentFilters.search || 
                      currentFilters.department || 
                      currentFilters.status || 
                      currentFilters.position ||
                      currentFilters.experience ||
                      currentFilters.gender ||
                      currentFilters.hireDateFrom ||
                      currentFilters.hireDateTo ||
                      currentFilters.ageFrom ||
                      currentFilters.ageTo ||
                      currentFilters.salaryFrom ||
                      currentFilters.salaryTo ||
                      currentFilters.quickFilter;
    
    if (hasFilters && filteredStaff.length !== allStaff.length) {
        // Create or update search results info
        let resultsInfo = document.getElementById('searchResultsInfo');
        if (!resultsInfo) {
            resultsInfo = document.createElement('div');
            resultsInfo.id = 'searchResultsInfo';
            resultsInfo.className = 'search-results-info';
            resultsInfo.style.cssText = `
                background: #374151;
                color: #D1D5DB;
                padding: 8px 16px;
                border-radius: 6px;
                margin-bottom: 16px;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            `;
            
            const tableView = document.getElementById('tableView');
            const gridView = document.getElementById('gridView');
            const currentViewElement = currentView === 'table' ? tableView : gridView;
            
            if (currentViewElement) {
                const cardHeader = currentViewElement.querySelector('.card-header');
                if (cardHeader) {
                    cardHeader.insertAdjacentElement('afterend', resultsInfo);
                }
            }
        }
        
        resultsInfo.innerHTML = `
            <span>
                <i class="fas fa-filter" style="margin-right: 8px; color: #3B82F6;"></i>
                Showing ${filteredStaff.length} of ${allStaff.length} staff members
            </span>
            <button onclick="clearAllFilters()" class="btn btn-sm btn-outline" style="margin-left: 12px;">
                <i class="fas fa-times"></i> Clear Filters
            </button>
        `;
        resultsInfo.style.display = 'flex';
    } else {
        // Hide results info if no filters
        const resultsInfo = document.getElementById('searchResultsInfo');
        if (resultsInfo) {
            resultsInfo.style.display = 'none';
        }
    }
}

function showFilterFeedback() {
    // Brief visual feedback when filters are applied
    const activeFilters = [];
    if (currentFilters.search) activeFilters.push(`Search: "${currentFilters.search}"`);
    if (currentFilters.department) activeFilters.push(`Department: ${currentFilters.department}`);
    if (currentFilters.status) activeFilters.push(`Status: ${currentFilters.status}`);
    if (currentFilters.position) activeFilters.push(`Position: ${currentFilters.position}`);
    
    if (activeFilters.length > 0) {
        console.log('Active filters:', activeFilters.join(', '));
    }
}

function clearAllFilters() {
    // Reset all filters
    currentFilters = {
        search: '',
        department: '',
        status: '',
        position: ''
    };
    
    // Reset UI elements
    const searchInput = document.getElementById('searchInput');
    const headerSearchInput = document.querySelector('.header-search input');
    const sidebarSearchInput = document.querySelector('.sidebar-search input');
    const departmentFilter = document.getElementById('departmentFilter');
    const statusFilter = document.getElementById('statusFilter');
    const positionFilter = document.getElementById('positionFilter');
    
    if (searchInput) searchInput.value = '';
    if (headerSearchInput) headerSearchInput.value = '';
    if (sidebarSearchInput) sidebarSearchInput.value = '';
    if (departmentFilter) departmentFilter.value = '';
    if (statusFilter) statusFilter.value = '';
    if (positionFilter) positionFilter.value = '';
    
    // Reset to first page and reapply filters
    currentPage = 1;
    applyFilters();
    renderStaffList();
    
    showToast('All filters cleared', 'success');
}

function initializeAdvancedSearch() {
    // Add advanced search capabilities
    const searchInputs = [
        document.getElementById('searchInput'),
        document.querySelector('.header-search input'),
        document.querySelector('.sidebar-search input')
    ].filter(input => input);
    
    searchInputs.forEach(input => {
        if (input) {
            // Add placeholder text
            input.placeholder = 'Search by name, ID, phone, email, position...';
            
            // Add search icon styling if not present
            if (!input.parentElement.querySelector('.fas.fa-search')) {
                input.style.paddingLeft = '12px';
            }
        }
    });
}

// =============================================================================
// ADVANCED FILTERS INITIALIZATION
// =============================================================================

function initializeAdvancedFilters() {
    // Toggle advanced filters panel
    const toggleBtn = document.getElementById('toggleAdvancedFilters');
    const advancedFiltersSection = document.querySelector('.advanced-filters');
    const advancedFiltersContent = document.getElementById('advancedFiltersContent');
    
    if (toggleBtn && advancedFiltersSection) {
        toggleBtn.addEventListener('click', () => {
            advancedFiltersSection.classList.toggle('expanded');
        });
    }
    
    // Position filter
    const positionFilter = document.getElementById('positionFilter');
    if (positionFilter) {
        positionFilter.addEventListener('change', (e) => {
            currentFilters.position = e.target.value;
            applyFilters();
            renderStaffList();
        });
    }
    
    // Experience filter
    const experienceFilter = document.getElementById('experienceFilter');
    if (experienceFilter) {
        experienceFilter.addEventListener('change', (e) => {
            currentFilters.experience = e.target.value;
            applyFilters();
            renderStaffList();
        });
    }
    
    // Gender filter
    const genderFilter = document.getElementById('genderFilter');
    if (genderFilter) {
        genderFilter.addEventListener('change', (e) => {
            currentFilters.gender = e.target.value;
            applyFilters();
            renderStaffList();
        });
    }
    
    // Date range filters
    const hireDateFrom = document.getElementById('hireDateFrom');
    const hireDateTo = document.getElementById('hireDateTo');
    
    if (hireDateFrom) {
        hireDateFrom.addEventListener('change', (e) => {
            currentFilters.hireDateFrom = e.target.value;
            applyFilters();
            renderStaffList();
        });
    }
    
    if (hireDateTo) {
        hireDateTo.addEventListener('change', (e) => {
            currentFilters.hireDateTo = e.target.value;
            applyFilters();
            renderStaffList();
        });
    }
    
    // Age range filters
    const ageFrom = document.getElementById('ageFrom');
    const ageTo = document.getElementById('ageTo');
    
    if (ageFrom) {
        ageFrom.addEventListener('change', (e) => {
            currentFilters.ageFrom = e.target.value;
            applyFilters();
            renderStaffList();
        });
    }
    
    if (ageTo) {
        ageTo.addEventListener('change', (e) => {
            currentFilters.ageTo = e.target.value;
            applyFilters();
            renderStaffList();
        });
    }
    
    // Salary range filters
    const salaryFrom = document.getElementById('salaryFrom');
    const salaryTo = document.getElementById('salaryTo');
    
    if (salaryFrom) {
        salaryFrom.addEventListener('change', (e) => {
            currentFilters.salaryFrom = e.target.value;
            applyFilters();
            renderStaffList();
        });
    }
    
    if (salaryTo) {
        salaryTo.addEventListener('change', (e) => {
            currentFilters.salaryTo = e.target.value;
            applyFilters();
            renderStaffList();
        });
    }
    
    // Quick filter buttons
    const quickFilterBtns = document.querySelectorAll('.quick-filter-btn');
    quickFilterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const filterType = btn.getAttribute('data-filter');
            
            // Toggle active state
            if (btn.classList.contains('active')) {
                btn.classList.remove('active');
                currentFilters.quickFilter = '';
            } else {
                // Remove active from all other quick filter buttons
                quickFilterBtns.forEach(otherBtn => otherBtn.classList.remove('active'));
                btn.classList.add('active');
                currentFilters.quickFilter = filterType;
            }
            
            applyFilters();
            renderStaffList();
        });
    });
    
    // Apply advanced filters button
    const applyAdvancedBtn = document.getElementById('applyAdvancedFilters');
    if (applyAdvancedBtn) {
        applyAdvancedBtn.addEventListener('click', () => {
            applyFilters();
            renderStaffList();
            showToast('Advanced filters applied', 'success');
        });
    }
    
    // Clear advanced filters button
    const clearAdvancedBtn = document.getElementById('clearAdvancedFilters');
    if (clearAdvancedBtn) {
        clearAdvancedBtn.addEventListener('click', () => {
            clearAdvancedFilters();
        });
    }
    
    // Save filter preset button
    const savePresetBtn = document.getElementById('saveFilterPreset');
    if (savePresetBtn) {
        savePresetBtn.addEventListener('click', () => {
            saveFilterPreset();
        });
    }
}

function clearAdvancedFilters() {
    // Clear all advanced filter values
    currentFilters.position = '';
    currentFilters.experience = '';
    currentFilters.gender = '';
    currentFilters.hireDateFrom = '';
    currentFilters.hireDateTo = '';
    currentFilters.ageFrom = '';
    currentFilters.ageTo = '';
    currentFilters.salaryFrom = '';
    currentFilters.salaryTo = '';
    currentFilters.quickFilter = '';
    
    // Reset form inputs
    const advancedInputs = [
        'positionFilter', 'experienceFilter', 'genderFilter',
        'hireDateFrom', 'hireDateTo', 'ageFrom', 'ageTo',
        'salaryFrom', 'salaryTo'
    ];
    
    advancedInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.value = '';
        }
    });
    
    // Remove active state from quick filter buttons
    document.querySelectorAll('.quick-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    applyFilters();
    renderStaffList();
    showToast('Advanced filters cleared', 'success');
}

function saveFilterPreset() {
    const presetName = prompt('Enter a name for this filter preset:');
    if (presetName && presetName.trim()) {
        const presets = JSON.parse(localStorage.getItem('staffFilterPresets') || '{}');
        presets[presetName.trim()] = { ...currentFilters };
        localStorage.setItem('staffFilterPresets', JSON.stringify(presets));
        showToast(`Filter preset "${presetName}" saved`, 'success');
    }
}

// =============================================================================
// ENHANCED BULK UPLOAD FUNCTIONALITY
// =============================================================================

let currentStep = 1;
let totalSteps = 4;
let uploadedFileData = null;
let validationResults = null;

// Helper function to parse date in DD/MM/YYYY format
function parseDate(dateStr) {
    if (!dateStr || dateStr.trim() === '') return null;
    
    const trimmed = dateStr.trim();
    
    // Check if it's in DD/MM/YYYY format
    const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match = trimmed.match(ddmmyyyyRegex);
    
    if (match) {
        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const year = parseInt(match[3], 10);
        
        // Create date (month is 0-indexed in JavaScript)
        const date = new Date(year, month - 1, day);
        
        // Validate that the date components match (handles invalid dates like 31/02/2023)
        if (date.getFullYear() === year && 
            date.getMonth() === month - 1 && 
            date.getDate() === day) {
            return date;
        }
    }
    
    // Try to parse as other common formats as fallback
    const date = new Date(trimmed);
    if (!isNaN(date.getTime())) {
        return date;
    }
    
    return null;
}

// Helper function to format date as DD/MM/YYYY
function formatDate(date) {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function downloadTemplate() {
    try {
        const headers = [
            'Name *',
            'Phone *', 
            'Email *',
            'Department *',
            'Position *',
            'Date of Birth (DD/MM/YYYY)',
            'Gender',
            'Nationality',
            'Present Address',
            'Permanent Address',
            'Educational Qualifications',
            'Work Experience',
            'Joining Date * (DD/MM/YYYY)',
            'Salary',
            'Emergency Contact',
            'Photo URL',
            'Additional Notes'
        ];
        
        const sampleData = [
            'John Doe',
            '+91-9876543210',
            'john.doe@microtechcenter.in',
            'Academic',
            'Senior Instructor',
            '15/06/1985',
            'Male',
            'Indian',
            '123 Main Street, City, State 123456',
            '456 Home Street, Hometown, State 654321',
            'M.Sc Computer Science, B.Sc Mathematics',
            '5 years teaching experience in computer science',
            '15/01/2023',
            '45000',
            '+91-9876543211',
            'https://example.com/photo.jpg',
            'Specialized in programming languages. Employee ID will be auto-generated as MTS001, MTS002, etc.'
        ];
        
        const sampleData2 = [
            'Jane Smith',
            '+91-9876543212',
            'jane.smith@microtechcenter.in',
            'Administration',
            'Office Manager',
            '22/03/1990',
            'Female',
            'Indian',
            '789 Business Street, City, State 789012',
            '321 Family Street, Hometown, State 210987',
            'MBA Administration, B.Com',
            '3 years office management experience',
            '01/02/2023',
            '35000',
            '+91-9876543213',
            'https://example.com/photo2.jpg',
            'Excellent organizational skills and team management experience'
        ];
        
        const csvContent = [
            headers.join(','),
            sampleData.map(field => `"${field}"`).join(','),
            sampleData2.map(field => `"${field}"`).join(',')
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'staff_bulk_upload_template.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showToast('Template downloaded successfully', 'success');
        
        // Move to next step if in the bulk upload process
        if (currentStep === 1) {
            updateStepStatus(1, 'completed');
            currentStep = 2;
            updateStepStatus(2, 'active');
            
            // Hide step 1 and show step 2
            const step1 = document.getElementById('stepContent1');
            const step2 = document.getElementById('stepContent2');
            if (step1) step1.style.display = 'none';
            if (step2) step2.style.display = 'block';
        }
        
    } catch (error) {
        console.error('Error downloading template:', error);
        showToast('Error downloading template', 'error');
    }
}

function showSampleData() {
    const modal = document.getElementById('sampleDataModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeSampleDataModal() {
    const modal = document.getElementById('sampleDataModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function skipTemplate() {
    // Move directly to step 2 without downloading template
    if (currentStep === 1) {
        updateStepStatus(1, 'completed');
        currentStep = 2;
        updateStepStatus(2, 'active');
        
        // Hide step 1 and show step 2
        const step1 = document.getElementById('stepContent1');
        const step2 = document.getElementById('stepContent2');
        if (step1) step1.style.display = 'none';
        if (step2) step2.style.display = 'block';
        
        showToast('Template download skipped. You can proceed with your own formatted CSV file.', 'info');
    }
}

function nextStep() {
    if (currentStep < totalSteps) {
        // Validate current step before proceeding
        if (currentStep === 3 && !uploadedFileData) {
            showToast('Please upload a CSV file before proceeding', 'warning');
            return;
        }
        
        // Hide current step
        const currentStepElement = document.getElementById(`stepContent${currentStep}`);
        if (currentStepElement) {
            currentStepElement.style.display = 'none';
        }
        updateStepStatus(currentStep, 'completed');
        
        // Show next step
        currentStep++;
        const nextStepElement = document.getElementById(`stepContent${currentStep}`);
        if (nextStepElement) {
            nextStepElement.style.display = 'block';
        }
        updateStepStatus(currentStep, 'active');
        
        // If moving to step 4, show the CSV preview
        if (currentStep === 4 && uploadedFileData) {
            showCSVPreview();
        }
    }
}

function previousStep() {
    if (currentStep > 1) {
        // Hide current step
        const currentStepElement = document.getElementById(`stepContent${currentStep}`);
        if (currentStepElement) {
            currentStepElement.style.display = 'none';
        }
        updateStepStatus(currentStep, '');
        
        // Show previous step
        currentStep--;
        const previousStepElement = document.getElementById(`stepContent${currentStep}`);
        if (previousStepElement) {
            previousStepElement.style.display = 'block';
        }
        updateStepStatus(currentStep, 'active');
    }
}

function updateStepStatus(stepNumber, status) {
    const step = document.getElementById(`step${stepNumber}`);
    if (step) {
        step.className = 'step';
        if (status) {
            step.classList.add(status);
        }
    }
}

function resetBulkUpload() {
    currentStep = 1;
    uploadedFileData = null;
    validationResults = null;
    
    // Reset all steps
    for (let i = 1; i <= totalSteps; i++) {
        const stepContent = document.getElementById(`stepContent${i}`);
        if (stepContent) {
            stepContent.style.display = i === 1 ? 'block' : 'none';
        }
        updateStepStatus(i, i === 1 ? 'active' : '');
    }
    
    // Clear file input and status
    clearFileUpload();
    
    // Hide all result containers
    const csvPreview = document.getElementById('csvPreview');
    const importProgress = document.getElementById('importProgress');
    const importResults = document.getElementById('importResults');
    
    if (csvPreview) csvPreview.style.display = 'none';
    if (importProgress) importProgress.style.display = 'none';
    if (importResults) importResults.style.display = 'none';
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file
    if (!validateFile(file)) return;
    
    // Show file status
    showFileStatus(file);
    
    // Parse file
    parseCSVFile(file);
}

function handleFileDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const uploadArea = event.currentTarget;
    uploadArea.classList.remove('drag-over');
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        document.getElementById('csvFile').files = files;
        handleFileUpload({ target: { files: [file] } });
    }
}

function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.add('drag-over');
}

function handleDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.remove('drag-over');
}

function validateFile(file) {
    // Check file type
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        showToast('Please select a CSV file', 'error');
        return false;
    }
    
    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        showToast('File size must be less than 10MB', 'error');
        return false;
    }
    
    return true;
}

function showFileStatus(file) {
    const statusDiv = document.getElementById('uploadStatus');
    const fileName = document.getElementById('fileName');
    const fileInfo = document.getElementById('fileInfo');
    const proceedBtn = document.getElementById('proceedToReview');
    
    if (fileName) fileName.textContent = file.name;
    if (fileInfo) fileInfo.textContent = `${(file.size / 1024).toFixed(1)} KB • ${new Date().toLocaleString()}`;
    if (statusDiv) statusDiv.style.display = 'flex';
    if (proceedBtn) proceedBtn.disabled = false;
}

function clearFileUpload() {
    const fileInput = document.getElementById('csvFile');
    const statusDiv = document.getElementById('uploadStatus');
    const proceedBtn = document.getElementById('proceedToReview');
    
    if (fileInput) fileInput.value = '';
    if (statusDiv) statusDiv.style.display = 'none';
    if (proceedBtn) proceedBtn.disabled = true;
    
    uploadedFileData = null;
    validationResults = null;
}

function parseCSVFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const csv = e.target.result;
            const lines = csv.split('\n').filter(line => line.trim());
            
            if (lines.length < 2) {
                showToast('CSV file must contain at least one data row', 'error');
                return;
            }
            
            // Parse headers
            const headers = parseCSVLine(lines[0]);
            
            // Parse data rows
            const data = lines.slice(1).map((line, index) => {
                try {
                    const values = parseCSVLine(line);
                    return {
                        rowNumber: index + 2,
                        data: values,
                        isValid: true,
                        errors: []
                    };
                } catch (error) {
                    return {
                        rowNumber: index + 2,
                        data: [],
                        isValid: false,
                        errors: [`Parse error: ${error.message}`]
                    };
                }
            });
            
            uploadedFileData = { headers, data };
            
            // Validate data
            validateUploadedData();
            
            showToast(`File parsed successfully. ${data.length} records found.`, 'success');
            
        } catch (error) {
            console.error('Error parsing CSV:', error);
            showToast('Error parsing CSV file: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
}

function parseCSVLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                current += '"';
                i++; // Skip next quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current.trim());
    
    return values;
}

function validateUploadedData() {
    if (!uploadedFileData) return;
    
    const { headers, data } = uploadedFileData;
    let validCount = 0;
    let errorCount = 0;
    
    // Required field indices (assuming standard template order)
    const requiredFields = {
        name: 0,
        phone: 1,
        email: 2,
        department: 3,
        position: 4,
        joiningDate: 12
    };
    
    const validDepartments = ['Academic', 'Administration', 'Information Technology', 'Finance', 'Marketing'];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const existingEmails = allStaff.map(staff => staff.email.toLowerCase());
    
    data.forEach(row => {
        row.errors = [];
        
        // Check required fields
        if (!row.data[requiredFields.name] || row.data[requiredFields.name].trim() === '') {
            row.errors.push('Name is required');
        }
        
        if (!row.data[requiredFields.phone] || row.data[requiredFields.phone].trim() === '') {
            row.errors.push('Phone is required');
        }
        
        if (!row.data[requiredFields.email] || row.data[requiredFields.email].trim() === '') {
            row.errors.push('Email is required');
        } else {
            const email = row.data[requiredFields.email].trim().toLowerCase();
            
            // Validate email format
            if (!emailRegex.test(email)) {
                row.errors.push('Invalid email format');
            }
            
            // Check for duplicate emails in existing staff
            if (existingEmails.includes(email)) {
                row.errors.push('Email already exists in system');
            }
            
            // Check for duplicate emails in current upload
            const duplicateInUpload = data.some((otherRow, index) => 
                otherRow !== row && 
                otherRow.data[requiredFields.email] && 
                otherRow.data[requiredFields.email].trim().toLowerCase() === email
            );
            if (duplicateInUpload) {
                row.errors.push('Duplicate email in upload');
            }
        }
        
        if (!row.data[requiredFields.department] || row.data[requiredFields.department].trim() === '') {
            row.errors.push('Department is required');
        } else if (!validDepartments.includes(row.data[requiredFields.department].trim())) {
            row.errors.push(`Invalid department. Must be one of: ${validDepartments.join(', ')}`);
        }
        
        if (!row.data[requiredFields.position] || row.data[requiredFields.position].trim() === '') {
            row.errors.push('Position is required');
        }
        
        if (!row.data[requiredFields.joiningDate] || row.data[requiredFields.joiningDate].trim() === '') {
            row.errors.push('Joining date is required');
        } else {
            const dateStr = row.data[requiredFields.joiningDate].trim();
            const date = parseDate(dateStr);
            if (!date) {
                row.errors.push('Invalid joining date format. Use DD/MM/YYYY (e.g., 15/01/2023)');
            }
        }
        
        // Validate optional date of birth
        if (row.data[5] && row.data[5].trim() !== '') {
            const dobStr = row.data[5].trim();
            const dob = parseDate(dobStr);
            if (!dob) {
                row.errors.push('Invalid date of birth format. Use DD/MM/YYYY (e.g., 15/06/1985)');
            }
        }
        
        // Validate salary if provided
        if (row.data[13] && row.data[13].trim() !== '') {
            const salary = parseFloat(row.data[13].trim());
            if (isNaN(salary) || salary < 0) {
                row.errors.push('Invalid salary amount');
            }
        }
        
        // Update validation status
        row.isValid = row.errors.length === 0;
        if (row.isValid) {
            validCount++;
        } else {
            errorCount++;
        }
    });
    
    validationResults = {
        total: data.length,
        valid: validCount,
        errors: errorCount
    };
    
    console.log('Validation completed:', validationResults);
}

function showCSVPreview() {
    if (!uploadedFileData || !validationResults) return;
    
    const { headers, data } = uploadedFileData;
    const { total, valid, errors } = validationResults;
    
    // Update stats
    const totalRecords = document.getElementById('totalRecords');
    const validRecords = document.getElementById('validRecords');
    const errorRecords = document.getElementById('errorRecords');
    const previewStats = document.getElementById('previewStats');
    
    if (totalRecords) totalRecords.textContent = total;
    if (validRecords) validRecords.textContent = valid;
    if (errorRecords) errorRecords.textContent = errors;
    if (previewStats) previewStats.style.display = 'flex';
    
    // Show preview table
    const previewTable = document.getElementById('previewTable');
    if (!previewTable) return;
    
    let tableHTML = '<table class="table preview-table"><thead><tr>';
    
    // Add status column
    tableHTML += '<th>Status</th>';
    
    // Add data columns (show first 6 columns)
    const displayHeaders = headers.slice(0, 6);
    displayHeaders.forEach(header => {
        tableHTML += `<th>${header}</th>`;
    });
    tableHTML += '<th>Actions</th></tr></thead><tbody>';
    
    // Show first 10 rows or all if less than 10
    const displayData = data.slice(0, 10);
    displayData.forEach((row, index) => {
        const statusClass = row.isValid ? 'success' : 'error';
        const statusIcon = row.isValid ? 'fa-check-circle' : 'fa-exclamation-triangle';
        const statusText = row.isValid ? 'Valid' : `${row.errors.length} error(s)`;
        
        tableHTML += `<tr class="preview-row ${statusClass}">`;
        tableHTML += `<td>
            <span class="status-badge ${statusClass}">
                <i class="fas ${statusIcon}"></i>
                ${statusText}
            </span>
        </td>`;
        
        // Show data cells
        for (let i = 0; i < 6; i++) {
            const cellValue = row.data[i] || '';
            tableHTML += `<td>${cellValue}</td>`;
        }
        
        // Actions column
        tableHTML += `<td>
            <button class="btn btn-outline btn-sm" onclick="showRowDetails(${index})">
                <i class="fas fa-eye"></i>
            </button>
        </td>`;
        
        tableHTML += '</tr>';
        
        // Show errors if any
        if (!row.isValid) {
            tableHTML += `<tr class="error-details">
                <td colspan="${displayHeaders.length + 2}">
                    <div class="error-list">
                        ${row.errors.map(error => `<span class="error-item"><i class="fas fa-exclamation-circle"></i> ${error}</span>`).join('')}
                    </div>
                </td>
            </tr>`;
        }
    });
    
    tableHTML += '</tbody></table>';
    
    if (data.length > 10) {
        tableHTML += `<p style="text-align: center; color: #9CA3AF; margin-top: 12px;">
            Showing 10 of ${data.length} rows
        </p>`;
    }
    
    previewTable.innerHTML = tableHTML;
    
    const csvPreview = document.getElementById('csvPreview');
    if (csvPreview) csvPreview.style.display = 'block';
}

function showErrorsOnly() {
    if (!uploadedFileData) return;
    
    const errorRows = uploadedFileData.data.filter(row => !row.isValid);
    const originalData = uploadedFileData.data;
    
    // Temporarily replace data with error rows only
    uploadedFileData.data = errorRows;
    showCSVPreview();
    
    // Restore original data
    uploadedFileData.data = originalData;
    
    showToast(`Showing ${errorRows.length} rows with errors`, 'info');
}

function showAllRecords() {
    showCSVPreview();
    showToast('Showing all records', 'info');
}

function showRowDetails(index) {
    if (!uploadedFileData) return;
    
    const row = uploadedFileData.data[index];
    const { headers } = uploadedFileData;
    
    let detailsHTML = `Row ${row.rowNumber} Details:\n\n`;
    
    headers.forEach((header, i) => {
        const value = row.data[i] || 'N/A';
        detailsHTML += `${header}: ${value}\n`;
    });
    
    if (!row.isValid) {
        detailsHTML += `\nErrors:\n${row.errors.join('\n')}`;
    }
    
    // Show in a modal or alert (simplified for this example)
    alert(detailsHTML);
}

async function processBulkUpload() {
    if (!uploadedFileData || !validationResults) {
        showToast('No data to process', 'error');
        return;
    }
    
    const skipErrors = document.getElementById('skipErrors')?.checked || false;
    const sendNotification = document.getElementById('sendNotification')?.checked || false;
    
    // Show progress
    const csvPreview = document.getElementById('csvPreview');
    const importProgress = document.getElementById('importProgress');
    
    if (csvPreview) csvPreview.style.display = 'none';
    if (importProgress) importProgress.style.display = 'block';
    
    const processBtn = document.getElementById('importButton');
    if (processBtn) processBtn.disabled = true;
    
    try {
        const { data } = uploadedFileData;
        const validRows = skipErrors ? data.filter(row => row.isValid) : data;
        
        let successCount = 0;
        let errorCount = 0;
        const processingErrors = [];
        
        // Process rows one by one
        for (let i = 0; i < validRows.length; i++) {
            const row = validRows[i];
            
            try {
                // Update progress
                updateImportProgress(i + 1, validRows.length, successCount, errorCount);
                
                // Skip invalid rows if not skipping errors
                if (!skipErrors && !row.isValid) {
                    errorCount++;
                    processingErrors.push(`Row ${row.rowNumber}: ${row.errors.join(', ')}`);
                    continue;
                }
                
                // Create staff data object
                const staffData = {
                    name: row.data[0]?.trim() || '',
                    phone: row.data[1]?.trim() || '',
                    email: row.data[2]?.trim() || '',
                    department: row.data[3]?.trim() || '',
                    position: row.data[4]?.trim() || '',
                    dateOfBirth: row.data[5] ? parseDate(row.data[5].trim()) : null,
                    gender: row.data[6]?.trim() || '',
                    nationality: row.data[7]?.trim() || '',
                    presentAddress: row.data[8]?.trim() || '',
                    permanentAddress: row.data[9]?.trim() || '',
                    education: row.data[10]?.trim() || '',
                    experience: row.data[11]?.trim() || '',
                    joiningDate: parseDate(row.data[12]?.trim()) || new Date(),
                    salary: parseFloat(row.data[13]?.trim()) || 0,
                    emergencyContact: row.data[14]?.trim() || '',
                    photoURL: row.data[15]?.trim() || '',
                    notes: row.data[16]?.trim() || '',
                    employeeId: await generateEmployeeId(),
                    status: 'Active',
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                
                // Add to Firestore
                await addDoc(collection(db, 'staff'), {
                    ...staffData,
                    dateOfBirth: staffData.dateOfBirth ? Timestamp.fromDate(staffData.dateOfBirth) : null,
                    joiningDate: Timestamp.fromDate(staffData.joiningDate),
                    createdAt: Timestamp.fromDate(staffData.createdAt),
                    updatedAt: Timestamp.fromDate(staffData.updatedAt)
                });
                
                successCount++;
                
                // Small delay to prevent overwhelming the database
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (error) {
                errorCount++;
                processingErrors.push(`Row ${row.rowNumber}: ${error.message}`);
                console.error(`Error processing row ${row.rowNumber}:`, error);
            }
        }
        
        // Show final progress
        updateImportProgress(validRows.length, validRows.length, successCount, errorCount);
        
        // Show results
        setTimeout(() => {
            showImportResults(successCount, errorCount, processingErrors, sendNotification);
        }, 1000);
        
    } catch (error) {
        console.error('Bulk upload error:', error);
        showToast('Error processing bulk upload: ' + error.message, 'error');
    } finally {
        if (processBtn) processBtn.disabled = false;
    }
}

function updateImportProgress(processed, total, success, errors) {
    const progressText = document.getElementById('progressText');
    const progressFill = document.getElementById('progressFill');
    const processedCount = document.getElementById('processedCount');
    const successCount = document.getElementById('successCount');
    const errorCount = document.getElementById('errorCount');
    
    const percentage = (processed / total) * 100;
    
    if (progressText) progressText.textContent = `${processed} of ${total} records processed`;
    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (processedCount) processedCount.textContent = processed;
    if (successCount) successCount.textContent = success;
    if (errorCount) errorCount.textContent = errors;
}

function showImportResults(successCount, errorCount, errors, sendNotification) {
    const importProgress = document.getElementById('importProgress');
    const resultsDiv = document.getElementById('importResults');
    const summaryDiv = document.getElementById('resultsSummary');
    
    if (importProgress) importProgress.style.display = 'none';
    if (!resultsDiv || !summaryDiv) return;
    
    let summaryHTML = `
        <div class="results-stats">
            <div class="stat-item success">
                <div class="stat-number">${successCount}</div>
                <div class="stat-label">Successfully Imported</div>
            </div>
            <div class="stat-item error">
                <div class="stat-number">${errorCount}</div>
                <div class="stat-label">Failed to Import</div>
            </div>
        </div>
    `;
    
    if (errorCount > 0) {
        summaryHTML += `
            <div class="error-summary">
                <h4><i class="fas fa-exclamation-triangle"></i> Import Errors</h4>
                <div class="error-log">
                    ${errors.slice(0, 5).map(error => `<div class="error-entry">${error}</div>`).join('')}
                    ${errors.length > 5 ? `<div class="error-more">... and ${errors.length - 5} more errors</div>` : ''}
                </div>
            </div>
        `;
    }
    
    if (sendNotification && successCount > 0) {
        summaryHTML += `
            <div class="notification-status">
                <i class="fas fa-check-circle"></i>
                Email notification will be sent to administrators
            </div>
        `;
    }
    
    summaryDiv.innerHTML = summaryHTML;
    resultsDiv.style.display = 'block';
    
    // Store results for download log
    window.importLog = {
        timestamp: new Date().toISOString(),
        total: successCount + errorCount,
        success: successCount,
        errors: errorCount,
        errorDetails: errors
    };
    
    // Reload staff data
    loadStaffData();
    
    showToast(`Import completed: ${successCount} success, ${errorCount} errors`, 
              errorCount > 0 ? 'warning' : 'success');
}

function downloadImportLog() {
    if (!window.importLog) {
        showToast('No import log available', 'error');
        return;
    }
    
    const log = window.importLog;
    const logContent = [
        'Staff Bulk Import Log',
        `Timestamp: ${new Date(log.timestamp).toLocaleString()}`,
        `Total Records: ${log.total}`,
        `Successful: ${log.success}`,
        `Errors: ${log.errors}`,
        '',
        'Error Details:',
        ...log.errorDetails
    ].join('\n');
    
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `staff_import_log_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showToast('Import log downloaded', 'success');
}

// Legacy function for compatibility
function clearPreview() {
    const csvPreview = document.getElementById('csvPreview');
    const fileInput = document.getElementById('csvFile');
    
    if (csvPreview) csvPreview.style.display = 'none';
    if (fileInput) fileInput.value = '';
    
    uploadedFileData = null;
    validationResults = null;
}

// =============================================================================
// EXPORT FUNCTIONS
// =============================================================================

async function refreshStaffList() {
    await loadStaffData();
    showToast('Staff list refreshed', 'success');
}

function exportStaffData() {
    try {
        // Create CSV content
        const headers = ['Name', 'Employee ID', 'Position', 'Department', 'Phone', 'Email', 'Status', 'Joining Date'];
        const csvContent = [
            headers.join(','),
            ...filteredStaff.map(staff => [
                `"${staff.name || ''}"`,
                `"${staff.employeeId || ''}"`,
                `"${staff.position || ''}"`,
                `"${staff.department || ''}"`,
                `"${staff.phone || ''}"`,
                `"${staff.email || ''}"`,
                `"${staff.status || ''}"`,
                `"${staff.joiningDate ? staff.joiningDate.toLocaleDateString() : ''}"`
            ].join(','))
        ].join('\n');
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `staff_data_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showToast('Staff data exported successfully', 'success');
    } catch (error) {
        console.error('Error exporting staff data:', error);
        showToast('Error exporting staff data', 'error');
    }
}

// =============================================================================
// TEST DATA FUNCTION FOR DEVELOPMENT
// =============================================================================

async function addTestStaffData() {
    if (allStaff.length > 0) {
        console.log('Test data already exists');
        return;
    }
    
    const testStaff = [
        {
            id: 'test1',
            employeeId: 'MTS001',
            name: 'John Smith',
            email: 'john.smith@microtech.com',
            phone: '+1-555-0101',
            department: 'Teaching',
            position: 'Teacher',
            status: 'active',
            hireDate: '2020-03-15',
            dateOfBirth: '1985-06-10',
            salary: 45000,
            gender: 'male',
            performanceRating: 4.2
        },
        {
            id: 'test2',
            employeeId: 'MTS002',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@microtech.com',
            phone: '+1-555-0102',
            department: 'Administration',
            position: 'Administrator',
            status: 'active',
            hireDate: '2019-08-22',
            dateOfBirth: '1990-12-25',
            salary: 50000,
            gender: 'female',
            performanceRating: 4.5
        },
        {
            id: 'test3',
            employeeId: 'MTS003',
            name: 'Michael Brown',
            email: 'michael.brown@microtech.com',
            phone: '+1-555-0103',
            department: 'Management',
            position: 'Manager',
            status: 'active',
            hireDate: '2015-01-10',
            dateOfBirth: '1980-03-18',
            salary: 65000,
            gender: 'male',
            performanceRating: 4.8
        },
        {
            id: 'test4',
            employeeId: 'MTS004',
            name: 'Emily Davis',
            email: 'emily.davis@microtech.com',
            phone: '+1-555-0104',
            department: 'Support',
            position: 'Support Staff',
            status: 'on_leave',
            hireDate: '2024-09-01',
            dateOfBirth: '1995-07-08',
            salary: 38000,
            gender: 'female',
            performanceRating: 3.9
        },
        {
            id: 'test5',
            employeeId: 'MTS005',
            name: 'Robert Wilson',
            email: 'robert.wilson@microtech.com',
            phone: '+1-555-0105',
            department: 'Teaching',
            position: 'Principal',
            status: 'active',
            hireDate: '2010-06-15',
            dateOfBirth: '1975-11-30',
            salary: 75000,
            gender: 'male',
            performanceRating: 4.7
        }
    ];
    
    allStaff = testStaff;
    totalStaff = allStaff.length;
    console.log(`Added ${totalStaff} test staff members`);
    
    applyFilters();
    renderStaffList();
    updateStaffStatistics();
    
    showToast('Test staff data loaded for development', 'info');
}

// =============================================================================
// GLOBAL FUNCTION DECLARATIONS FOR HTML ONCLICK HANDLERS
// =============================================================================

// Make functions globally available for HTML onclick handlers
window.openAddStaffModal = openAddStaffModal;
window.closeAddStaffModal = closeAddStaffModal;
window.openBulkUploadModal = openBulkUploadModal;
window.closeBulkUploadModal = closeBulkUploadModal;
window.openStaffDetailsModal = openStaffDetailsModal;
window.closeStaffDetailsModal = closeStaffDetailsModal;
window.viewStaffDetails = viewStaffDetails;
window.editStaff = editStaff;
window.deleteStaff = deleteStaff;
window.refreshStaffList = refreshStaffList;
window.exportStaffData = exportStaffData;
window.handleStaffCheckboxChange = handleStaffCheckboxChange;
window.downloadTemplate = downloadTemplate;
window.showSampleData = showSampleData;
window.closeSampleDataModal = closeSampleDataModal;
window.skipTemplate = skipTemplate;
window.nextStep = nextStep;
window.previousStep = previousStep;
window.resetBulkUpload = resetBulkUpload;
window.handleFileUpload = handleFileUpload;
window.handleFileDrop = handleFileDrop;
window.handleDragOver = handleDragOver;
window.handleDragLeave = handleDragLeave;
window.clearFileUpload = clearFileUpload;
window.showCSVPreview = showCSVPreview;
window.showErrorsOnly = showErrorsOnly;
window.showAllRecords = showAllRecords;
window.showRowDetails = showRowDetails;
window.processBulkUpload = processBulkUpload;
window.downloadImportLog = downloadImportLog;
window.handleFileUpload = handleFileUpload;
window.processBulkUpload = processBulkUpload;
window.clearPreview = clearPreview;
window.generateEmployeeId = generateEmployeeId;
window.closeDeleteConfirmModal = closeDeleteConfirmModal;
window.confirmDeleteStaff = confirmDeleteStaff;
window.closeEditStaffModal = closeEditStaffModal;
window.exportStaffMemberData = exportStaffMemberData;
window.clearAllFilters = clearAllFilters;
window.clearAdvancedFilters = clearAdvancedFilters;
window.saveFilterPreset = saveFilterPreset;
window.addTestStaffData = addTestStaffData;