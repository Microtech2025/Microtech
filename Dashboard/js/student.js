import { db, storage } from '../firebase.js';
import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    onSnapshot, 
    query, 
    where, 
    orderBy,
    getDocs,
    writeBatch
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";

class StudentManager {
    constructor() {
        this.students = [];
        this.currentStudent = null;
        this.isEditMode = false;
        this.viewMode = 'table'; // 'table' or 'grid'
        this.selectedStudents = new Set();
        this.initializeEventListeners();
        this.loadStudents();
    }

    initializeEventListeners() {
        // Add Student Button
        const addStudentBtn = document.getElementById('addStudentBtn');
        if (addStudentBtn) {
            addStudentBtn.addEventListener('click', () => this.openModal());
        }

        // Modal Controls
        const modal = document.getElementById('studentModal');
        const closeModal = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');
        const studentForm = document.getElementById('studentForm');

        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal());
        }

        if (studentForm) {
            studentForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Search and Filters
        const searchInput = document.getElementById('searchStudent');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        const divisionFilter = document.getElementById('divisionFilter');
        if (divisionFilter) {
            divisionFilter.addEventListener('change', () => this.applyFilters());
        }

        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.applyFilters());
        }

        const courseFilter = document.getElementById('courseFilter');
        if (courseFilter) {
            courseFilter.addEventListener('change', () => this.applyFilters());
        }

        // Close modal when clicking outside
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // View Mode Toggle
        const viewToggleBtn = document.getElementById('viewToggleBtn');
        if (viewToggleBtn) {
            viewToggleBtn.addEventListener('click', (e) => this.toggleViewMode(e));
        }

        // Bulk Actions
        const bulkActionsBtn = document.querySelector('.bulk-actions-btn');
        if (bulkActionsBtn) {
            bulkActionsBtn.addEventListener('click', () => this.openBulkActionsModal());
        }

        // Bulk Upload
        const bulkUploadBtn = document.querySelector('.bulk-upload-btn');
        if (bulkUploadBtn) {
            bulkUploadBtn.addEventListener('click', () => this.openBulkUploadModal());
        }

        // CSV File Input
        const csvFileInput = document.getElementById('csvFileInput');
        if (csvFileInput) {
            csvFileInput.addEventListener('change', (e) => this.handleCSVFileSelect(e));
        }

        // Document Upload Inputs
        const documentUploadInputs = document.querySelectorAll('.document-upload-input');
        documentUploadInputs.forEach(input => {
            input.addEventListener('change', (e) => this.handleDocumentUpload(input.dataset.type, e));
        });

        // Initialize bulk actions visibility after a short delay to ensure DOM is ready
        setTimeout(() => this.updateBulkActionsVisibility(), 100);
    }

    async loadStudents() {
        try {
            const q = query(collection(db, "students"), orderBy("admissionDate", "desc"));
            
            onSnapshot(q, (snapshot) => {
                this.students = [];
                snapshot.forEach((doc) => {
                    this.students.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                this.updateStatistics();
                
                // Render based on current view mode
                if (this.viewMode === 'grid') {
                    this.renderStudentsGrid();
                } else {
                    this.renderStudentsTable();
                }
                
                // Clear selections when data changes
                this.selectedStudents.clear();
                this.updateBulkActionsVisibility();
                this.updateSelectAllCheckbox();
            });
        } catch (error) {
            console.error("Error loading students:", error);
            this.showNotification("Error loading students", "error");
        }
    }

    updateStatistics() {
        const totalStudents = this.students.length;
        const activeStudents = this.students.filter(s => s.status === 'Active').length;
        const newThisMonth = this.getNewStudentsThisMonth();
        const totalRevenue = this.calculateTotalRevenue();

        // Update DOM elements
        const totalStudentsEl = document.getElementById('totalStudents');
        const activeStudentsEl = document.getElementById('activeStudents');
        const newThisMonthEl = document.getElementById('newThisMonth');
        const totalRevenueEl = document.getElementById('totalRevenue');

        if (totalStudentsEl) totalStudentsEl.textContent = totalStudents;
        if (activeStudentsEl) activeStudentsEl.textContent = activeStudents;
        if (newThisMonthEl) newThisMonthEl.textContent = newThisMonth;
        if (totalRevenueEl) totalRevenueEl.textContent = `₹${totalRevenue.toLocaleString()}`;
    }

    getNewStudentsThisMonth() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        return this.students.filter(student => {
            const admissionDate = student.admissionDate?.toDate ? 
                student.admissionDate.toDate() : new Date(student.admissionDate);
            return admissionDate.getMonth() === currentMonth && 
                   admissionDate.getFullYear() === currentYear;
        }).length;
    }

    calculateTotalRevenue() {
        return this.students.reduce((sum, student) => sum + (student.fees || 0), 0);
    }

    renderStudentsTable() {
        const tbody = document.getElementById('studentsTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (this.students.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="no-data">
                        <div class="empty-state">
                            <i class="fas fa-users"></i>
                            <p>No students found</p>
                            <button class="btn btn-primary" onclick="studentManager.openModal()">
                                Add Your First Student
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        this.students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <input type="checkbox" class="student-checkbox" value="${student.id}" 
                           onchange="studentManager.toggleStudentSelection('${student.id}')"
                           ${this.selectedStudents.has(student.id) ? 'checked' : ''}>
                </td>
                <td>
                    <div class="student-photo">
                        <img src="${student.photoURL || '../whiteclass.png'}" alt="${student.name}" 
                             onerror="this.src='../whiteclass.png'">
                    </div>
                </td>
                <td>
                    <div class="student-info">
                        <strong>${student.name}</strong>
                        <small>ID: ${student.id.slice(-8)}</small>
                    </div>
                </td>
                <td>
                    <span class="division-badge division-${student.division?.toLowerCase().replace(' ', '-')}">
                        ${student.division || 'N/A'}
                    </span>
                </td>
                <td>${student.course || 'N/A'}</td>
                <td>
                    <div class="contact-info">
                        <div>${student.phone || 'N/A'}</div>
                        <small>${student.email || ''}</small>
                    </div>
                </td>
                <td>
                    <span class="status-badge status-${student.status?.toLowerCase()}">
                        ${student.status || 'Active'}
                    </span>
                </td>
                <td>
                    <div class="fee-info">
                        <strong>₹${(student.fees || 0).toLocaleString()}</strong>
                        <small>${student.paymentMode || 'Full'}</small>
                    </div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-primary" onclick="studentManager.editStudent('${student.id}')" 
                                title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-info" onclick="studentManager.viewStudent('${student.id}')" 
                                title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="studentManager.openDocumentModal('${student.id}')" 
                                title="Manage Documents">
                            <i class="fas fa-file-alt"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="studentManager.deleteStudent('${student.id}')" 
                                title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    openModal(studentId = null) {
        const modal = document.getElementById('studentModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('studentForm');
        const submitBtnText = document.getElementById('submitBtnText');

        if (studentId) {
            // Edit mode
            this.currentStudent = this.students.find(s => s.id === studentId);
            this.isEditMode = true;
            modalTitle.textContent = 'Edit Student';
            submitBtnText.textContent = 'Update Student';
            this.populateForm(this.currentStudent);
        } else {
            // Add mode
            this.currentStudent = null;
            this.isEditMode = false;
            modalTitle.textContent = 'Add New Student';
            submitBtnText.textContent = 'Add Student';
            form.reset();
            document.getElementById('studentPhoto').value = '';
            
            // Set default admission date to today
            const today = new Date().toISOString().split('T')[0];
            const admissionDateInput = document.getElementById('studentAdmissionDate');
            if (admissionDateInput) {
                admissionDateInput.value = today;
            }
            
            // Clear photo preview
            const photoPreview = document.getElementById('photoPreview');
            if (photoPreview) {
                photoPreview.style.display = 'none';
                photoPreview.src = '';
            }
            
            // Set default status
            const statusSelect = document.getElementById('studentStatus');
            if (statusSelect) {
                statusSelect.value = 'Active';
            }
            
            // Set default payment mode
            const paymentModeSelect = document.getElementById('studentPaymentMode');
            if (paymentModeSelect) {
                paymentModeSelect.value = 'Full';
            }
        }

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('studentModal');
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        this.currentStudent = null;
        this.isEditMode = false;
    }

    populateForm(student) {
        const form = document.getElementById('studentForm');
        if (!form || !student) return;

        // Populate all form fields
        Object.keys(student).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                if (input.type === 'date') {
                    // Convert timestamp to date string
                    const date = student[key]?.toDate ? student[key].toDate() : new Date(student[key]);
                    input.value = date.toISOString().split('T')[0];
                } else {
                    input.value = student[key] || '';
                }
            }
        });
        
        // Populate photo preview if exists
        if (student.photoURL) {
            const photoPreview = document.getElementById('photoPreview');
            if (photoPreview) {
                photoPreview.src = student.photoURL;
                photoPreview.style.display = 'block';
            }
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        // Map form fields to Firestore fields
        const studentData = {
            name: formData.get('name')?.trim(),
            phone: formData.get('phone')?.trim(),
            email: formData.get('email')?.trim(),
            division: formData.get('division')?.trim(),
            course: formData.get('course')?.trim(),
            fees: parseFloat(formData.get('fees')) || 0,
            paymentMode: formData.get('paymentMode') || 'Full',
            status: formData.get('status') || 'Active',
            admissionDate: formData.get('admissionDate') ? new Date(formData.get('admissionDate')) : new Date(),
            address: formData.get('address')?.trim(),
            guardian: formData.get('guardianName')?.trim(),
            guardianPhone: formData.get('guardianPhone')?.trim(),
            notes: formData.get('notes')?.trim(),
            updatedAt: new Date()
        };

        // Validate required fields
        const requiredFields = ['name', 'phone', 'division', 'course', 'fees', 'admissionDate'];
        const missingFields = requiredFields.filter(field => !studentData[field]);
        if (missingFields.length > 0) {
            this.showNotification(`Please fill in all required fields: ${missingFields.join(', ')}`, 'error');
            return;
        }

        // Validate phone number
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(studentData.phone)) {
            this.showNotification('Please enter a valid 10-digit phone number', 'error');
            return;
        }

        // Validate email if provided
        if (studentData.email && !this.isValidEmail(studentData.email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Handle photo: file or URL
        const photoFile = document.getElementById('studentPhoto').files[0];
        const photoURLInput = document.getElementById('studentPhoto').value;
        if (photoFile) {
            try {
                studentData.photoURL = await this.uploadPhotoToStorage(photoFile);
            } catch (error) {
                this.showNotification('Error uploading photo: ' + error.message, 'error');
                return;
            }
        } else if (photoURLInput && !photoFile) {
            studentData.photoURL = photoURLInput;
        }

        try {
            if (this.isEditMode && this.currentStudent) {
                await updateDoc(doc(db, "students", this.currentStudent.id), studentData);
                this.showNotification("Student updated successfully!", "success");
            } else {
                studentData.createdAt = new Date();
                await addDoc(collection(db, "students"), studentData);
                this.showNotification("Student added successfully!", "success");
            }
            this.closeModal();
        } catch (error) {
            console.error("Error saving student:", error);
            this.showNotification("Error saving student: " + error.message, "error");
        }
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async editStudent(studentId) {
        this.openModal(studentId);
    }

    async viewStudent(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (!student) return;

        // Create a detailed view modal
        this.showStudentDetails(student);
    }

    async deleteStudent(studentId) {
        if (!confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
            return;
        }

        try {
            await deleteDoc(doc(db, "students", studentId));
            this.showNotification("Student deleted successfully!", "success");
        } catch (error) {
            console.error("Error deleting student:", error);
            this.showNotification("Error deleting student", "error");
        }
    }

    showStudentDetails(student) {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Student Details</h2>
                    <button class="close-modal" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="student-details">
                        <div class="detail-row">
                            <div class="detail-item">
                                <label>Name:</label>
                                <span>${student.name}</span>
                            </div>
                            <div class="detail-item">
                                <label>Division:</label>
                                <span class="division-badge division-${student.division?.toLowerCase().replace(' ', '-')}">
                                    ${student.division}
                                </span>
                            </div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-item">
                                <label>Course:</label>
                                <span>${student.course}</span>
                            </div>
                            <div class="detail-item">
                                <label>Status:</label>
                                <span class="status-badge status-${student.status?.toLowerCase()}">
                                    ${student.status}
                                </span>
                            </div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-item">
                                <label>Phone:</label>
                                <span>${student.phone}</span>
                            </div>
                            <div class="detail-item">
                                <label>Email:</label>
                                <span>${student.email || 'N/A'}</span>
                            </div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-item">
                                <label>Fees:</label>
                                <span>₹${(student.fees || 0).toLocaleString()}</span>
                            </div>
                            <div class="detail-item">
                                <label>Payment Mode:</label>
                                <span>${student.paymentMode}</span>
                            </div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-item">
                                <label>Admission Date:</label>
                                <span>${student.admissionDate?.toDate ? 
                                    student.admissionDate.toDate().toLocaleDateString() : 
                                    new Date(student.admissionDate).toLocaleDateString()}</span>
                            </div>
                            <div class="detail-item">
                                <label>Guardian:</label>
                                <span>${student.guardian || 'N/A'}</span>
                            </div>
                        </div>
                        ${student.address ? `
                        <div class="detail-row">
                            <div class="detail-item full-width">
                                <label>Address:</label>
                                <span>${student.address}</span>
                            </div>
                        </div>
                        ` : ''}
                        ${student.notes ? `
                        <div class="detail-row">
                            <div class="detail-item full-width">
                                <label>Notes:</label>
                                <span>${student.notes}</span>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="studentManager.editStudent('${student.id}')">
                        Edit Student
                    </button>
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = 'auto';
            }
        });
    }

    handleSearch(searchTerm) {
        const filteredStudents = this.students.filter(student => {
            const searchLower = searchTerm.toLowerCase();
            return (
                student.name?.toLowerCase().includes(searchLower) ||
                student.phone?.includes(searchTerm) ||
                student.email?.toLowerCase().includes(searchLower) ||
                student.course?.toLowerCase().includes(searchLower) ||
                student.division?.toLowerCase().includes(searchLower)
            );
        });
        
        this.renderFilteredStudents(filteredStudents);
    }

    applyFilters() {
        const divisionFilter = document.getElementById('divisionFilter')?.value;
        const statusFilter = document.getElementById('statusFilter')?.value;
        const courseFilter = document.getElementById('courseFilter')?.value;
        
        let filteredStudents = this.students;
        
        if (divisionFilter) {
            filteredStudents = filteredStudents.filter(s => s.division === divisionFilter);
        }
        
        if (statusFilter) {
            filteredStudents = filteredStudents.filter(s => s.status === statusFilter);
        }

        if (courseFilter) {
            filteredStudents = filteredStudents.filter(s => s.course === courseFilter);
        }
        
        this.renderFilteredStudents(filteredStudents);
    }

    renderFilteredStudents(students) {
        const tbody = document.getElementById('studentsTableBody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (students.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" class="no-data">
                        <div class="empty-state">
                            <i class="fas fa-search"></i>
                            <p>No students match your search criteria</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <input type="checkbox" class="student-checkbox" value="${student.id}" 
                           onchange="studentManager.toggleStudentSelection('${student.id}')"
                           ${this.selectedStudents.has(student.id) ? 'checked' : ''}>
                </td>
                <td>
                    <div class="student-photo">
                        <img src="${student.photoURL || '../whiteclass.png'}" alt="${student.name}" 
                             onerror="this.src='../whiteclass.png'">
                    </div>
                </td>
                <td>
                    <div class="student-info">
                        <strong>${student.name}</strong>
                        <small>ID: ${student.id.slice(-8)}</small>
                    </div>
                </td>
                <td>
                    <span class="division-badge division-${student.division?.toLowerCase().replace(' ', '-')}">
                        ${student.division || 'N/A'}
                    </span>
                </td>
                <td>${student.course || 'N/A'}</td>
                <td>
                    <div class="contact-info">
                        <div>${student.phone || 'N/A'}</div>
                        <small>${student.email || ''}</small>
                    </div>
                </td>
                <td>
                    <span class="status-badge status-${student.status?.toLowerCase()}">
                        ${student.status || 'Active'}
                    </span>
                </td>
                <td>
                    <div class="fee-info">
                        <strong>₹${(student.fees || 0).toLocaleString()}</strong>
                        <small>${student.paymentMode || 'Full'}</small>
                    </div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-primary" onclick="studentManager.editStudent('${student.id}')" 
                                title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-info" onclick="studentManager.viewStudent('${student.id}')" 
                                title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-warning" onclick="studentManager.openDocumentModal('${student.id}')" 
                                title="Manage Documents">
                            <i class="fas fa-file-alt"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="studentManager.deleteStudent('${student.id}')" 
                                title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Enhanced Grid View Implementation
    renderStudentsGrid() {
        const container = document.getElementById('studentsTableBody');
        if (!container) return;

        container.innerHTML = '';

        if (this.students.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="9" class="no-data">
                        <div class="empty-state">
                            <i class="fas fa-users"></i>
                            <p>No students found</p>
                            <button class="btn btn-primary" onclick="studentManager.openModal()">
                                Add Your First Student
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        // Create grid container
        const gridContainer = document.createElement('div');
        gridContainer.className = 'students-grid';
        gridContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
        gridContainer.style.gap = '20px';
        gridContainer.style.padding = '20px';

        this.students.forEach(student => {
            const card = document.createElement('div');
            card.className = 'student-card';
            card.innerHTML = `
                <div class="student-card-header">
                    <img src="${student.photoURL || '../whiteclass.png'}" alt="${student.name}" 
                         onerror="this.src='../whiteclass.png'" class="student-photo">
                    <div class="student-status">
                        <span class="status-badge status-${student.status?.toLowerCase()}">
                            ${student.status || 'Active'}
                        </span>
                    </div>
                </div>
                <div class="student-card-body">
                    <h3>${student.name}</h3>
                    <p class="student-id">ID: ${student.id.slice(-8)}</p>
                    <div class="student-details">
                        <p><i class="fas fa-building"></i> ${student.division || 'N/A'}</p>
                        <p><i class="fas fa-graduation-cap"></i> ${student.course || 'N/A'}</p>
                        <p><i class="fas fa-phone"></i> ${student.phone || 'N/A'}</p>
                        <p><i class="fas fa-envelope"></i> ${student.email || 'N/A'}</p>
                        <p><i class="fas fa-money-bill-wave"></i> ₹${(student.fees || 0).toLocaleString()}</p>
                    </div>
                </div>
                <div class="student-card-actions">
                    <button class="btn btn-sm btn-primary" onclick="studentManager.editStudent('${student.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-info" onclick="studentManager.viewStudent('${student.id}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="studentManager.openDocumentModal('${student.id}')" title="Documents">
                        <i class="fas fa-file-alt"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="studentManager.deleteStudent('${student.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            gridContainer.appendChild(card);
        });

        // Replace table with grid
        container.appendChild(gridContainer);
    }



    // Enhanced bulk actions
    async bulkStatusUpdate() {
        if (this.selectedStudents.size === 0) {
            this.showNotification('Please select students first', 'warning');
            return;
        }

        const newStatus = prompt('Enter new status (Active, Inactive, Graduated, Suspended):');
        if (!newStatus) return;

        const validStatuses = ['Active', 'Inactive', 'Graduated', 'Suspended'];
        if (!validStatuses.includes(newStatus)) {
            this.showNotification('Invalid status. Please use: Active, Inactive, Graduated, or Suspended', 'error');
            return;
        }

        try {
            const batch = writeBatch(db);
            this.selectedStudents.forEach(studentId => {
                const studentRef = doc(db, "students", studentId);
                batch.update(studentRef, { status: newStatus, updatedAt: new Date() });
            });

            await batch.commit();
            this.showNotification(`Status updated to ${newStatus} for ${this.selectedStudents.size} students`, 'success');
            this.selectedStudents.clear();
            this.loadStudents();
        } catch (error) {
            console.error('Error updating status:', error);
            this.showNotification('Error updating status: ' + error.message, 'error');
        }
    }

    async bulkExport() {
        if (this.selectedStudents.size === 0) {
            this.showNotification('Please select students first', 'warning');
            return;
        }

        const selectedStudents = this.students.filter(s => this.selectedStudents.has(s.id));
        const csvContent = this.generateCSV(selectedStudents);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `selected_students_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        this.showNotification(`Exported ${selectedStudents.length} students`, 'success');
    }

    async bulkDelete() {
        if (this.selectedStudents.size === 0) {
            this.showNotification('Please select students first', 'warning');
            return;
        }

        if (!confirm(`Are you sure you want to delete ${this.selectedStudents.size} students? This action cannot be undone.`)) {
            return;
        }

        try {
            const batch = writeBatch(db);
            this.selectedStudents.forEach(studentId => {
                const studentRef = doc(db, "students", studentId);
                batch.delete(studentRef);
            });

            await batch.commit();
            this.showNotification(`Successfully deleted ${this.selectedStudents.size} students`, 'success');
            this.selectedStudents.clear();
            this.loadStudents();
        } catch (error) {
            console.error('Error deleting students:', error);
            this.showNotification('Error deleting students: ' + error.message, 'error');
        }
    }

    // Enhanced CSV generation with selected students
    generateCSV(students = null) {
        const targetStudents = students || this.students;
        const headers = ['Name', 'Phone', 'Email', 'Division', 'Course', 'Status', 'Fees', 'Payment Mode', 'Admission Date', 'Guardian', 'Address', 'Notes'];
        const csvRows = [headers.join(',')];
        
        targetStudents.forEach(student => {
            const row = [
                student.name || '',
                student.phone || '',
                student.email || '',
                student.division || '',
                student.course || '',
                student.status || '',
                student.fees || 0,
                student.paymentMode || '',
                student.admissionDate ? new Date(student.admissionDate).toLocaleDateString() : '',
                student.guardian || '',
                student.address || '',
                student.notes || ''
            ].map(field => `"${field}"`).join(',');
            
            csvRows.push(row);
        });
        
        return csvRows.join('\n');
    }

    // Student selection methods
    toggleStudentSelection(studentId) {
        if (this.selectedStudents.has(studentId)) {
            this.selectedStudents.delete(studentId);
        } else {
            this.selectedStudents.add(studentId);
        }
        this.updateBulkActionsVisibility();
        this.updateSelectAllCheckbox();
    }
    
    updateSelectAllCheckbox() {
        const selectAllCheckbox = document.getElementById('selectAllStudents');
        if (!selectAllCheckbox) return;
        
        const totalStudents = this.students.length;
        const selectedCount = this.selectedStudents.size;
        
        if (selectedCount === 0) {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = false;
        } else if (selectedCount === totalStudents) {
            selectAllCheckbox.checked = true;
            selectAllCheckbox.indeterminate = false;
        } else {
            selectAllCheckbox.checked = false;
            selectAllCheckbox.indeterminate = true;
        }
    }

    toggleSelectAll(checkbox) {
        const studentCheckboxes = document.querySelectorAll('.student-checkbox');
        if (checkbox.checked) {
            studentCheckboxes.forEach(cb => {
                cb.checked = true;
                this.selectedStudents.add(cb.value);
            });
        } else {
            studentCheckboxes.forEach(cb => {
                cb.checked = false;
                this.selectedStudents.delete(cb.value);
            });
        }
        this.updateBulkActionsVisibility();
        
        // Update the select all checkbox state
        const selectAllCheckbox = document.getElementById('selectAllStudents');
        if (selectAllCheckbox) {
            selectAllCheckbox.indeterminate = false;
            selectAllCheckbox.checked = checkbox.checked;
        }
    }

    updateBulkActionsVisibility() {
        const bulkActionsBtn = document.querySelector('.bulk-actions-btn');
        const selectedCount = document.getElementById('selectedCount');
        
        if (bulkActionsBtn) {
            bulkActionsBtn.style.display = this.selectedStudents.size > 0 ? 'block' : 'none';
        }
        
        if (selectedCount) {
            selectedCount.textContent = this.selectedStudents.size;
        }
    }

    openBulkActionsModal() {
        if (this.selectedStudents.size === 0) {
            this.showNotification('Please select students first', 'warning');
            return;
        }
        
        const modal = document.getElementById('bulkActionsModal');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeBulkActionsModal() {
        const modal = document.getElementById('bulkActionsModal');
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    // Fee integration methods
    openFeeManagement(studentId) {
        // Redirect to fees page with student pre-selected
        window.location.href = `fees.html?student=${studentId}`;
    }

    getStudentFeeStatus(studentId) {
        // This would integrate with the fee management system
        // For now, return a placeholder
        return {
            totalFees: 0,
            paidAmount: 0,
            pendingAmount: 0,
            lastPayment: null,
            status: 'No fees recorded'
        };
    }

    // Photo handling methods
    async handlePhotoChange(event) {
        const file = event.target.files[0];
        const photoPreview = document.getElementById('photoPreview');
        
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                this.showNotification('Photo size should be less than 5MB', 'error');
                event.target.value = '';
                return;
            }
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                this.showNotification('Please select an image file', 'error');
                event.target.value = '';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                photoPreview.src = e.target.result;
                photoPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            const urlInput = document.getElementById('studentPhoto');
            if (!file && urlInput && urlInput.value) {
                photoPreview.src = urlInput.value;
                photoPreview.style.display = 'block';
            }
        }
    }
    
    async uploadPhotoToStorage(file) {
        try {
            // For now, we'll store the photo as a data URL
            // In a production environment, you'd want to upload to Firebase Storage
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    resolve(e.target.result);
                };
                reader.readAsDataURL(file);
            });
        } catch (error) {
            console.error('Error uploading photo:', error);
            throw new Error('Failed to upload photo');
        }
    }
    
    clearPhotoPreview() {
        const photoInput = document.getElementById('studentPhoto');
        const photoPreview = document.getElementById('photoPreview');
        
        if (photoInput) {
            photoInput.value = '';
        }
        if (photoPreview) {
            photoPreview.style.display = 'none';
            photoPreview.src = '';
        }
    }
}

// Initialize student manager when DOM is loaded
let studentManager;
document.addEventListener('DOMContentLoaded', () => {
    studentManager = new StudentManager();
});

// Make it globally accessible
window.studentManager = studentManager;
