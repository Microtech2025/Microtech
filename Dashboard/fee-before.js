import { db } from '../firebase.js';
import { 
    collection, 
    onSnapshot, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    where, 
    orderBy, 
    getDocs,
    writeBatch,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { initializeUserProfile, addProfileStyles } from './js/profile-utils.js';
import { showToast } from './js/toast.js';

console.log('Fees.js module loaded');
console.log('Firebase imports:', { db, collection, addDoc });
console.log('Module loading timestamp:', new Date().toISOString());
console.log('Document ready state:', document.readyState);

// Verify Firebase imports
if (!db) {
    console.error('Firebase db is not imported correctly!');
    alert('Firebase db import failed!');
}
if (!collection || !addDoc) {
    console.error('Firebase Firestore functions are not imported correctly!');
    alert('Firebase Firestore imports failed!');
}

class FeeManager {
    constructor() {
        console.log('FeeManager constructor called');
        console.log('Firebase db instance:', db);
        
        this.students = [];
        this.fees = [];
        this.revenueChartInstance = null;
        this.currentFilters = {
            division: 'all',
            status: 'all',
            month: 'all'
        };
        
        console.log('FeeManager instance created with:', {
            studentsCount: this.students.length,
            feesCount: this.fees.length,
            filters: this.currentFilters
        });
        
        console.log('Initializing event listeners...');
        this.initializeEventListeners();
        console.log('Loading data...');
        this.loadData();
        
        // Add instance to window for debugging
        window.feeManagerInstance = this;
    }

    initializeEventListeners() {
        console.log('Setting up event listeners...');
        
        // Add New Student button
        const addNewStudentBtn = document.getElementById('addNewStudentBtn');
        console.log('Add New Student button found:', addNewStudentBtn);
        
        if (addNewStudentBtn) {
            addNewStudentBtn.addEventListener('click', () => {
                console.log('Add New Student button clicked');
                alert('Button clicked! Opening modal...');
                this.openAddStudentModal();
            });
        } else {
            console.error('Add New Student button not found!');
        }

        // Record Payment button
        document.getElementById('recordPaymentBtn').addEventListener('click', () => {
            this.openPaymentModal();
        });

        // Send Notifications button
        document.getElementById('sendNotificationsBtn').addEventListener('click', () => {
            this.openNotificationModal();
        });

        // Search functionality
        document.getElementById('studentSearch').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Filter dropdowns
        document.getElementById('divisionFilter').addEventListener('change', (e) => {
            this.currentFilters.division = e.target.value;
            this.applyFilters();
        });

        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.currentFilters.status = e.target.value;
            this.applyFilters();
        });

        document.getElementById('monthFilter').addEventListener('change', (e) => {
            this.currentFilters.month = e.target.value;
            this.applyFilters();
        });

        // Payment modal form submission
        document.getElementById('paymentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePaymentSubmission();
        });

        // Add Student modal form submission
        const addStudentForm = document.getElementById('addStudentForm');
        console.log('Add Student form found:', addStudentForm);
        
        if (addStudentForm) {
            console.log('Adding submit event listener to Add Student form');
            addStudentForm.addEventListener('submit', (e) => {
                console.log('Add Student form submitted!');
                e.preventDefault();
                console.log('Prevented default form submission');
                this.handleAddStudentSubmission();
            });
            console.log('Submit event listener added successfully');
            
            // Also add click event to submit button as backup
            const submitBtn = addStudentForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                console.log('Adding click event listener to submit button as backup');
                submitBtn.addEventListener('click', (e) => {
                    console.log('Submit button clicked!');
                    // Don't prevent default here, let the form submit event handle it
                });
            }
        } else {
            console.error('Add Student form not found!');
        }

        // Notification modal form submission
        document.getElementById('notificationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNotificationSubmission();
        });

        // Close modal buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModals();
            });
        });

        // Modal backdrop clicks
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModals();
                }
            });
        });
    }

    async loadData() {
        try {
            console.log('Loading data from Firebase...');
            
            // Load students
            const studentsQuery = query(collection(db, "students"), orderBy("name"));
            console.log('Students query created:', studentsQuery);
            
            onSnapshot(studentsQuery, (snapshot) => {
                console.log('Students snapshot received:', snapshot.docs.length, 'students');
                this.students = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                console.log('Students loaded:', this.students);
                
                // Log the structure of the first student to understand the data format
                if (this.students.length > 0) {
                    console.log('First student data structure:', this.students[0]);
                    console.log('Available fields:', Object.keys(this.students[0]));
                }
                
                // Only update stats if both students and fees are loaded
                if (this.students.length > 0 && this.fees.length > 0) {
                this.updateOverviewStats();
                }
                this.renderFeesTable();
            }, (error) => {
                console.error('Error in students snapshot:', error);
            });

            // Load fees/revenue
            const feesQuery = query(collection(db, "revenue"), orderBy("date", "desc"));
            console.log('Fees query created:', feesQuery);
            
            onSnapshot(feesQuery, (snapshot) => {
                console.log('Fees snapshot received:', snapshot.docs.length, 'fees');
                this.fees = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                console.log('Fees loaded:', this.fees);
                
                // Only update stats if both students and fees are loaded
                if (this.students.length > 0 && this.fees.length > 0) {
                this.updateOverviewStats();
                }
                this.renderFeesTable();
            }, (error) => {
                console.error('Error in fees snapshot:', error);
            });
        } catch (error) {
            console.error('Error loading data:', error);
            this.showNotification('Error loading data', 'error');
        }
        
        // Check if we need to update stats after a delay (in case data was already loaded)
        setTimeout(() => {
            if (this.students.length > 0 && this.fees.length > 0) {
                console.log('Delayed stats update triggered');
                this.updateOverviewStats();
            }
        }, 1000);
        
        // Add a public method to manually refresh stats
        window.refreshFeeStats = () => {
            console.log('Manual stats refresh triggered');
            this.updateOverviewStats();
        };
    }

    updateOverviewStats() {
        console.log('Updating overview stats...');
        console.log('Students count:', this.students.length);
        console.log('Fees count:', this.fees.length);
        
        const totalFees = this.fees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
        const pendingFees = this.calculatePendingFees();
        const studentsWithPending = this.students.filter(student => 
            this.getStudentPendingAmount(student.id) > 0
        ).length;
        const thisMonthCollection = this.calculateThisMonthCollection();

        console.log('Overview stats calculated:', {
            totalFees,
            pendingFees,
            studentsWithPending,
            thisMonthCollection
        });

        // Update overview cards
        const totalFeesElement = document.getElementById('totalFeesCollected');
        const pendingFeesElement = document.getElementById('pendingFees');
        const studentsWithPendingElement = document.getElementById('studentsWithPending');
        const thisMonthCollectionElement = document.getElementById('thisMonthCollection');
        
        if (totalFeesElement) totalFeesElement.textContent = `₹${totalFees.toLocaleString()}`;
        if (pendingFeesElement) pendingFeesElement.textContent = `₹${pendingFees.toLocaleString()}`;
        if (studentsWithPendingElement) studentsWithPendingElement.textContent = studentsWithPending;
        if (thisMonthCollectionElement) thisMonthCollectionElement.textContent = `₹${thisMonthCollection.toLocaleString()}`;

        // Update left panel statistics
        this.updateLeftPanelStats();
        this.renderRevenueChart();
        this.renderRecentPayments();
        this.renderPaymentCalendar();
    }

    updateLeftPanelStats() {
        try {
            console.log('Updating left panel stats...');
            
            // Check if DOM elements exist first
            const collectionRateElement = document.getElementById('collectionRate');
            const averagePaymentElement = document.getElementById('averagePayment');
            const paymentFrequencyElement = document.getElementById('paymentFrequency');
            
            if (!collectionRateElement || !averagePaymentElement || !paymentFrequencyElement) {
                console.warn('Left panel stats elements not found:', {
                    collectionRate: !!collectionRateElement,
                    averagePayment: !!averagePaymentElement,
                    paymentFrequency: !!paymentFrequencyElement
                });
                return;
            }
            
            // Calculate total fees based on actual collected fees and pending amounts
        const totalCollected = this.fees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
            const pendingFees = this.calculatePendingFees();
            const totalFees = totalCollected + pendingFees;
            
            // Calculate collection rate based on collected vs total expected
        const collectionRate = totalFees > 0 ? Math.round((totalCollected / totalFees) * 100) : 0;
        
            // Calculate average payment from collected fees
        const averagePayment = this.fees.length > 0 ? 
                totalCollected / this.fees.length : 0;
        
            // Calculate payment frequency for current month
        const paymentFrequency = this.calculatePaymentFrequency();

            console.log('Left panel calculations:', {
                totalFees,
                totalCollected,
                pendingFees,
                collectionRate,
                averagePayment,
                paymentFrequency
            });

            // Update the DOM elements
            collectionRateElement.textContent = `${collectionRate}%`;
            averagePaymentElement.textContent = `₹${Math.round(averagePayment).toLocaleString()}`;
            paymentFrequencyElement.textContent = `${paymentFrequency}/month`;
            
            console.log('Left panel stats updated successfully');
        } catch (error) {
            console.error('Error updating left panel stats:', error);
        }
    }

    calculatePaymentFrequency() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const thisMonthPayments = this.fees.filter(fee => {
            const feeDate = fee.date?.toDate ? fee.date.toDate() : new Date(fee.date);
            return feeDate.getMonth() === currentMonth && feeDate.getFullYear() === currentYear;
        });

        return thisMonthPayments.length;
    }

    renderRevenueChart() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.revenueChartInstance) {
            this.revenueChartInstance.destroy();
        }

        const chartData = this.getRevenueChartData();
        
        this.revenueChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'This Month',
                    data: chartData.thisMonth,
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Last Month',
                    data: chartData.lastMonth,
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    getRevenueChartData() {
        const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        const thisMonth = [0, 0, 0, 0];
        const lastMonth = [0, 0, 0, 0];

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        // Calculate this month's weekly data
        this.fees.forEach(fee => {
            const feeDate = fee.date?.toDate ? fee.date.toDate() : new Date(fee.date);
            if (feeDate.getMonth() === currentMonth && feeDate.getFullYear() === currentYear) {
                const week = Math.floor((feeDate.getDate() - 1) / 7);
                if (week >= 0 && week < 4) {
                    thisMonth[week] += fee.amount || 0;
                }
            }
        });

        // Calculate last month's weekly data
        const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);
        this.fees.forEach(fee => {
            const feeDate = fee.date?.toDate ? fee.date.toDate() : new Date(fee.date);
            if (feeDate.getMonth() === lastMonthDate.getMonth() && feeDate.getFullYear() === lastMonthDate.getFullYear()) {
                const week = Math.floor((feeDate.getDate() - 1) / 7);
                if (week >= 0 && week < 4) {
                    lastMonth[week] += fee.amount || 0;
                }
            }
        });

        return { labels, thisMonth, lastMonth };
    }

    renderRecentPayments() {
        const container = document.getElementById('recentPayments');
        if (!container) return;

        container.innerHTML = '';

        // Get last 5 payments
        const recentPayments = this.fees
            .sort((a, b) => {
                const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
                const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
                return dateB - dateA;
            })
            .slice(0, 5);

        if (recentPayments.length === 0) {
            container.innerHTML = '<p style="color: #666; text-align: center; font-style: italic;">No recent payments</p>';
            return;
        }

        recentPayments.forEach(payment => {
            const student = this.students.find(s => s.id === payment.studentId);
            if (!student) return;

            const paymentItem = document.createElement('div');
            paymentItem.className = 'recent-payment-item';
            
            const paymentDate = payment.date?.toDate ? payment.date.toDate() : new Date(payment.date);
            
            paymentItem.innerHTML = `
                <div class="recent-payment-info">
                    <div class="recent-payment-name">${student.name}</div>
                    <div class="recent-payment-details">${paymentDate.toLocaleDateString()} • ${payment.paymentMethod}</div>
                </div>
                <div class="recent-payment-amount">₹${payment.amount.toLocaleString()}</div>
            `;
            
            container.appendChild(paymentItem);
        });
    }

    renderPaymentCalendar() {
        const container = document.getElementById('paymentCalendar');
        if (!container) return;

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];

        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startingDay = firstDay.getDay();
        const monthLength = lastDay.getDate();

        let calendarHTML = `
            <div class="calendar-header">
                <button class="calendar-nav" onclick="feeManager.previousMonth()">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div class="calendar-title">${monthNames[currentMonth]} ${currentYear}</div>
                <button class="calendar-nav" onclick="feeManager.nextMonth()">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            <div class="calendar-grid">
        `;

        // Add day headers
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            calendarHTML += `<div class="calendar-day-header">${day}</div>`;
        });

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            calendarHTML += '<div class="calendar-day other-month"></div>';
        }

        // Add days of the month
        for (let day = 1; day <= monthLength; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const hasPayment = this.hasPaymentOnDate(date);
            const hasDue = this.hasDueOnDate(date);
            const isToday = this.isToday(date);
            
            let dayClass = 'calendar-day';
            if (isToday) dayClass += ' today';
            if (hasPayment) dayClass += ' has-payment';
            if (hasDue) dayClass += ' has-due';
            
            calendarHTML += `<div class="${dayClass}" onclick="feeManager.showDayDetails(${day})">${day}</div>`;
        }

        calendarHTML += '</div>';
        container.innerHTML = calendarHTML;
    }

    hasPaymentOnDate(date) {
        return this.fees.some(fee => {
            const feeDate = fee.date?.toDate ? fee.date.toDate() : new Date(fee.date);
            return feeDate.toDateString() === date.toDateString();
        });
    }

    hasDueOnDate(date) {
        // Check if any students have due dates on this date
        return this.students.some(student => {
            if (student.dueDate) {
                const dueDate = student.dueDate?.toDate ? student.dueDate.toDate() : new Date(student.dueDate);
                return dueDate.toDateString() === date.toDateString();
            }
            return false;
        });
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    previousMonth() {
        // Implementation for previous month navigation
        this.showNotification('Previous month navigation will be implemented', 'info');
    }

    nextMonth() {
        // Implementation for next month navigation
        this.showNotification('Next month navigation will be implemented', 'info');
    }

    showDayDetails(day) {
        const currentDate = new Date();
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        
        const payments = this.fees.filter(fee => {
            const feeDate = fee.date?.toDate ? fee.date.toDate() : new Date(fee.date);
            return feeDate.toDateString() === date.toDateString();
        });

        if (payments.length > 0) {
            let details = `Payments on ${date.toLocaleDateString()}:\n\n`;
            payments.forEach(payment => {
                const student = this.students.find(s => s.id === payment.studentId);
                details += `• ${student?.name || 'Unknown'}: ₹${payment.amount}\n`;
            });
            this.showNotification(details, 'info', 8000);
        } else {
            this.showNotification(`No payments on ${date.toLocaleDateString()}`, 'info');
        }
    }

    calculatePendingFees() {
        let totalPending = 0;
        let studentsWithFees = 0;
        
        this.students.forEach(student => {
            const pending = this.getStudentPendingAmount(student.id);
            totalPending += pending;
            if (pending > 0) {
                studentsWithFees++;
            }
        });
        
        console.log(`Total pending fees: ₹${totalPending.toLocaleString()} from ${studentsWithFees} students`);
        return totalPending;
    }

    calculateThisMonthCollection() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        return this.fees.reduce((sum, fee) => {
            const feeDate = fee.date?.toDate ? fee.date.toDate() : new Date(fee.date);
            if (feeDate.getMonth() === currentMonth && feeDate.getFullYear() === currentYear) {
                return sum + (fee.amount || 0);
            }
            return sum;
        }, 0);
    }

    getStudentPendingAmount(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (!student) return 0;
        
        // Check if student has totalFees field, if not, assume 0 pending
        let totalFees = student.totalFees || 0;
        
        // If no totalFees field, try to calculate from course fees or use a default
        if (totalFees === 0) {
            // Try to get fees from course field or use a default amount
            if (student.course) {
                // You can add course-specific fee logic here
                totalFees = this.getCourseFees(student.course);
            }
        }
        
        if (totalFees === 0) return 0;
        
        const paidAmount = this.fees
            .filter(fee => fee.studentId === studentId)
            .reduce((sum, fee) => sum + (fee.amount || 0), 0);
        
        const pending = Math.max(0, totalFees - paidAmount);
        
        console.log(`Student ${student.name || 'Unknown'} (${studentId}): totalFees=${totalFees}, paid=${paidAmount}, pending=${pending}`);
        
        return pending;
    }
    
    getCourseFees(courseName) {
        // Default course fees - you can customize this based on your needs
        const courseFees = {
            'CAPT': 5000,
            'LBS': 8000,
            'Gama Abacus': 3000,
            'Micro Computers': 10000,
            'Other': 5000
        };
        
        // Try to find a matching course
        for (const [course, fees] of Object.entries(courseFees)) {
            if (courseName.toLowerCase().includes(course.toLowerCase())) {
                return fees;
            }
        }
        
        // Default fee if no match found
        return 5000;
    }

    renderFeesTable() {
        const tbody = document.getElementById('feesTableBody');
        tbody.innerHTML = '';

        this.students.forEach(student => {
            const pendingAmount = this.getStudentPendingAmount(student.id);
            const totalFees = student.totalFees || 0;
            const paidAmount = totalFees > 0 ? totalFees - pendingAmount : 0;
            const lastPayment = this.getLastPaymentDate(student.id);
            const status = this.getPaymentStatus(pendingAmount);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="student-info">
                        <strong>${student.name || 'Unknown'}</strong>
                        <small>${student.phone || ''}</small>
                    </div>
                </td>
                <td>${student.division || 'N/A'}</td>
                <td>${student.course || 'N/A'}</td>
                <td>₹${totalFees.toLocaleString()}</td>
                <td>₹${paidAmount.toLocaleString()}</td>
                <td>₹${pendingAmount.toLocaleString()}</td>
                <td>${lastPayment || 'No payments'}</td>
                <td>
                    <span class="status-badge ${status.toLowerCase()}">${status}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="feeManager.recordPayment('${student.id}')">
                        Record Payment
                    </button>
                    <button class="btn btn-sm btn-info" onclick="feeManager.viewStudentDetails('${student.id}')">
                        View
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    getLastPaymentDate(studentId) {
        const studentFees = this.fees
            .filter(fee => fee.studentId === studentId)
            .sort((a, b) => {
                const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date);
                const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date);
                return dateB - dateA;
            });

        if (studentFees.length > 0) {
            const lastDate = studentFees[0].date?.toDate ? 
                studentFees[0].date.toDate() : new Date(studentFees[0].date);
            return lastDate.toLocaleDateString();
        }
        return null;
    }

    getPaymentStatus(pendingAmount) {
        if (pendingAmount === 0) return 'Paid';
        if (pendingAmount <= 1000) return 'Low Pending';
        if (pendingAmount <= 5000) return 'Medium Pending';
        return 'High Pending';
    }

    handleSearch(searchTerm) {
        const filteredStudents = this.students.filter(student => 
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.phone?.includes(searchTerm) ||
            student.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderFilteredStudents(filteredStudents);
    }

    applyFilters() {
        let filteredStudents = this.students;

        if (this.currentFilters.division !== 'all') {
            filteredStudents = filteredStudents.filter(student => 
                student.division === this.currentFilters.division
            );
        }

        if (this.currentFilters.status !== 'all') {
            filteredStudents = filteredStudents.filter(student => {
                const pending = this.getStudentPendingAmount(student.id);
                switch (this.currentFilters.status) {
                    case 'paid': return pending === 0;
                    case 'low_pending': return pending > 0 && pending <= 1000;
                    case 'medium_pending': return pending > 1000 && pending <= 5000;
                    case 'high_pending': return pending > 5000;
                    default: return true;
                }
            });
        }

        if (this.currentFilters.month !== 'all') {
            const currentDate = new Date();
            const targetMonth = parseInt(this.currentFilters.month);
            const targetYear = currentDate.getFullYear();
            
            filteredStudents = filteredStudents.filter(student => {
                const joinDate = student.joinDate?.toDate ? 
                    student.joinDate.toDate() : new Date(student.joinDate);
                return joinDate.getMonth() === targetMonth && 
                       joinDate.getFullYear() === targetYear;
            });
        }

        this.renderFilteredStudents(filteredStudents);
    }

    renderFilteredStudents(filteredStudents) {
        const tbody = document.getElementById('feesTableBody');
        tbody.innerHTML = '';

        filteredStudents.forEach(student => {
            const pendingAmount = this.getStudentPendingAmount(student.id);
            const paidAmount = student.totalFees ? student.totalFees - pendingAmount : 0;
            const lastPayment = this.getLastPaymentDate(student.id);
            const status = this.getPaymentStatus(pendingAmount);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="student-info">
                        <strong>${student.name}</strong>
                        <small>${student.phone || ''}</small>
                    </div>
                </td>
                <td>${student.division || 'N/A'}</td>
                <td>${student.course || 'N/A'}</td>
                <td>₹${(student.totalFees || 0).toLocaleString()}</td>
                <td>₹${paidAmount.toLocaleString()}</td>
                <td>₹${pendingAmount.toLocaleString()}</td>
                <td>${lastPayment || 'No payments'}</td>
                <td>
                    <span class="status-badge ${status.toLowerCase().replace(' ', '-')}">${status}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="feeManager.recordPayment('${student.id}')">
                        Record Payment
                    </button>
                    <button class="btn btn-sm btn-info" onclick="feeManager.viewStudentDetails('${student.id}')">
                        View
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    openPaymentModal(studentId = null) {
        const modal = document.getElementById('paymentModal');
        const form = document.getElementById('paymentForm');
        
        // Reset form
        form.reset();
        
        // Populate student dropdown
        this.populateStudentDropdown();
        
        // If studentId is provided, pre-select the student
        if (studentId) {
            document.getElementById('studentSelect').value = studentId;
        }
        
        modal.style.display = 'block';
    }

    openAddStudentModal() {
        console.log('Opening Add Student Modal...');
        const modal = document.getElementById('addStudentModal');
        const form = document.getElementById('addStudentForm');
        
        console.log('Modal element found:', modal);
        console.log('Form element found:', form);
        
        if (!modal || !form) {
            console.error('Modal or form not found!');
            alert('Modal or form not found! Check console for details.');
            return;
        }
        
        // Clear any previous errors and success messages
        this.clearFormErrors();
        
        // Reset form
        form.reset();
        
        // Set default join date to today
        const joinDateInput = document.getElementById('joinDate');
        if (joinDateInput) {
            joinDateInput.value = new Date().toISOString().split('T')[0];
        }
        
        modal.style.display = 'block';
        console.log('Modal opened successfully');
        alert('Modal should now be visible!');
    }

    openNotificationModal() {
        const modal = document.getElementById('notificationModal');
        modal.style.display = 'block';
        
        // Populate student selection
        this.populateNotificationStudentList();
    }

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        
        // Clear any errors and success messages
        this.clearFormErrors();
        
        // Reset forms when closing modals
        document.getElementById('paymentForm').reset();
        document.getElementById('addStudentForm').reset();
        document.getElementById('notificationForm').reset();
    }

    populateStudentDropdown() {
        const select = document.getElementById('studentSelect');
        select.innerHTML = '<option value="">Select Student</option>';
        
        this.students.forEach(student => {
            const pendingAmount = this.getStudentPendingAmount(student.id);
            const option = document.createElement('option');
            option.value = student.id;
            option.textContent = `${student.name} - ${student.division} (Pending: ₹${pendingAmount})`;
            select.appendChild(option);
        });
    }

    populateNotificationStudentList() {
        const container = document.getElementById('notificationStudentList');
        container.innerHTML = '';

        // Add option for all students
        const allOption = document.createElement('div');
        allOption.className = 'notification-option';
        allOption.innerHTML = `
            <input type="radio" name="studentScope" value="all" id="allStudents">
            <label for="allStudents">All Students</label>
        `;
        container.appendChild(allOption);

        // Add option for pending fees students
        const pendingOption = document.createElement('div');
        pendingOption.className = 'notification-option';
        pendingOption.innerHTML = `
            <input type="radio" name="studentScope" value="pending" id="pendingStudents">
            <label for="pendingStudents">Students with Pending Fees</label>
        `;
        container.appendChild(pendingOption);

        // Add option for overdue students
        const overdueOption = document.createElement('div');
        overdueOption.className = 'notification-option';
        overdueOption.innerHTML = `
            <input type="radio" name="studentScope" value="overdue" id="overdueStudents">
            <label for="overdueStudents">Overdue Students (>30 days)</label>
        `;
        container.appendChild(overdueOption);
    }

    async handleAddStudentSubmission() {
        console.log('Handling Add Student submission...');
        const form = document.getElementById('addStudentForm');
        const submitBtn = form.querySelector('button[type="submit"]');
        
        console.log('Form found:', form);
        console.log('Submit button found:', submitBtn);
        
        if (!form || !submitBtn) {
            console.error('Form or submit button not found!');
            return;
        }
        
        const formData = new FormData(form);
        console.log('Form data collected:', Object.fromEntries(formData));
        
        // Test individual field values
        console.log('Student name:', formData.get('studentName'));
        console.log('Student phone:', formData.get('studentPhone'));
        console.log('Student division:', formData.get('studentDivision'));
        console.log('Total fees:', formData.get('totalFees'));
        console.log('Join date:', formData.get('joinDate'));
        
        // Clear any previous error displays
        this.clearFormErrors();
        
        // Validate required fields
        const validationErrors = this.validateStudentForm(formData);
        console.log('Validation errors:', validationErrors);
        
        if (validationErrors.length > 0) {
            this.displayFormErrors(validationErrors);
            return;
        }

        const studentData = {
            name: formData.get('studentName').trim(),
            phone: formData.get('studentPhone').trim(),
            email: formData.get('studentEmail')?.trim() || '',
            division: formData.get('studentDivision'),
            course: formData.get('studentCourse')?.trim() || '',
            totalFees: parseFloat(formData.get('totalFees')),
            joinDate: new Date(formData.get('joinDate')),
            dueDate: formData.get('dueDate') ? new Date(formData.get('dueDate')) : null,
            notes: formData.get('studentNotes')?.trim() || '',
            timestamp: serverTimestamp()
        };

        // Set loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Adding Student...';

        try {
            // Validate email format if provided
            if (studentData.email && !this.isValidEmail(studentData.email)) {
                throw new Error('Invalid email format');
            }

            // Validate phone number format
            if (!this.isValidPhone(studentData.phone)) {
                throw new Error('Invalid phone number format');
            }

            // Validate fees amount
            if (studentData.totalFees <= 0) {
                throw new Error('Total fees must be greater than 0');
            }

            // Validate dates
            if (studentData.dueDate && studentData.dueDate <= studentData.joinDate) {
                throw new Error('Due date must be after join date');
            }

            console.log('Adding student to Firebase collection...');
            console.log('Student data to add:', studentData);
            
            // Add student to students collection
            try {
                console.log('Creating collection reference for "students"...');
                const studentsCollection = collection(db, "students");
                console.log('Students collection reference:', studentsCollection);
                
                console.log('Adding document to collection...');
                const docRef = await addDoc(studentsCollection, studentData);
                console.log('Student added successfully with ID:', docRef.id);
            } catch (firebaseError) {
                console.error('Firebase error adding student:', firebaseError);
                if (firebaseError.code === 'permission-denied') {
                    throw new Error('Permission denied: You do not have permission to add students to this collection');
                } else if (firebaseError.code === 'unavailable') {
                    throw new Error('Firebase service unavailable. Please check your internet connection.');
                } else {
                    throw new Error(`Firebase error: ${firebaseError.message}`);
                }
            }

            // Show success message with enhanced display
            this.showEnhancedSuccess('Student added successfully!', {
                studentId: docRef.id,
                studentName: studentData.name,
                division: studentData.division,
                totalFees: studentData.totalFees
            });

            this.closeModals();
            
            // Refresh the data to show the new student
            this.loadData();

        } catch (error) {
            console.error('Error adding student:', error);
            
            // Show detailed error message
            let errorMessage = 'Error adding student';
            let errorDetails = '';
            
            if (error.message.includes('Invalid email format')) {
                errorMessage = 'Invalid email format';
                errorDetails = 'Please enter a valid email address (e.g., student@example.com)';
            } else if (error.message.includes('Invalid phone number format')) {
                errorMessage = 'Invalid phone number format';
                errorDetails = 'Please enter a valid 10-digit phone number';
            } else if (error.message.includes('Total fees must be greater than 0')) {
                errorMessage = 'Invalid fees amount';
                errorDetails = 'Total fees must be greater than 0';
            } else if (error.message.includes('Due date must be after join date')) {
                errorMessage = 'Invalid due date';
                errorDetails = 'Due date must be after the join date';
            } else if (error.code === 'permission-denied') {
                errorMessage = 'Permission denied';
                errorDetails = 'You do not have permission to add students. Please contact your administrator.';
            } else if (error.code === 'unavailable') {
                errorMessage = 'Network error';
                errorDetails = 'Unable to connect to the server. Please check your internet connection and try again.';
            } else if (error.code === 'resource-exhausted') {
                errorMessage = 'Service temporarily unavailable';
                errorDetails = 'The service is currently experiencing high load. Please try again in a few minutes.';
            } else {
                errorDetails = 'An unexpected error occurred. Please try again or contact support if the problem persists.';
            }
            
            this.showEnhancedError(errorMessage, errorDetails);
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            submitBtn.textContent = 'Add Student';
        }
    }

    async handlePaymentSubmission() {
        const formData = new FormData(document.getElementById('paymentForm'));
        const studentId = formData.get('studentSelect');
        const amount = parseFloat(formData.get('amount'));
        const paymentMethod = formData.get('paymentMethod');
        const date = formData.get('date');
        const month = formData.get('month');
        const year = formData.get('year');
        const notes = formData.get('notes');

        if (!studentId || !amount || !date) {
            this.showNotification('Please fill all required fields', 'error');
            return;
        }

        try {
            const student = this.students.find(s => s.id === studentId);
            const paymentData = {
                studentId,
                studentName: student.name,
                division: student.division,
                amount,
                paymentMethod,
                date: new Date(date),
                month: month || null,
                year: year || null,
                notes: notes || '',
                timestamp: serverTimestamp()
            };

            // Add to revenue collection
            await addDoc(collection(db, "revenue"), paymentData);

            // Update student's payment history
            await this.updateStudentPaymentHistory(studentId, paymentData);

            this.showNotification('Payment recorded successfully!', 'success');
            this.closeModals();
            this.generateReceipt(paymentData);

        } catch (error) {
            console.error('Error recording payment:', error);
            this.showNotification('Error recording payment', 'error');
        }
    }

    async updateStudentPaymentHistory(studentId, paymentData) {
        try {
            const studentRef = doc(db, "students", studentId);
            const student = this.students.find(s => s.id === studentId);
            
            // Calculate new pending amount
            const currentPending = this.getStudentPendingAmount(studentId);
            const newPending = Math.max(0, currentPending - paymentData.amount);
            
            await updateDoc(studentRef, {
                lastPaymentDate: paymentData.date,
                pendingAmount: newPending,
                paymentHistory: [...(student.paymentHistory || []), paymentData]
            });
        } catch (error) {
            console.error('Error updating student payment history:', error);
        }
    }

    async handleNotificationSubmission() {
        const formData = new FormData(document.getElementById('notificationForm'));
        const studentScope = formData.get('studentScope');
        const notificationMethods = formData.getAll('notificationMethods');
        const messageTemplate = formData.get('messageTemplate');
        const customMessage = formData.get('customMessage');
        const scheduledDate = formData.get('scheduledDate');

        if (!studentScope || notificationMethods.length === 0) {
            this.showNotification('Please select student scope and notification methods', 'error');
            return;
        }

        try {
            const targetStudents = this.getTargetStudents(studentScope);
            const message = this.buildNotificationMessage(messageTemplate, customMessage);

            // Send notifications
            await this.sendBulkNotifications(targetStudents, notificationMethods, message, scheduledDate);

            this.showNotification(`Notifications sent to ${targetStudents.length} students`, 'success');
            this.closeModals();

        } catch (error) {
            console.error('Error sending notifications:', error);
            this.showNotification('Error sending notifications', 'error');
        }
    }

    getTargetStudents(scope) {
        switch (scope) {
            case 'all':
                return this.students;
            case 'pending':
                return this.students.filter(student => 
                    this.getStudentPendingAmount(student.id) > 0
                );
            case 'overdue':
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return this.students.filter(student => {
                    const lastPayment = this.getLastPaymentDate(student.id);
                    if (!lastPayment) return true;
                    const lastPaymentDate = new Date(lastPayment);
                    return lastPaymentDate < thirtyDaysAgo;
                });
            default:
                return [];
        }
    }

    buildNotificationMessage(template, customMessage) {
        if (template === 'custom') {
            return customMessage;
        }

        const templates = {
            'fee_reminder': 'Dear {name}, this is a friendly reminder that you have pending fees of ₹{pending}. Please clear the dues at your earliest convenience.',
            'overdue_notice': 'Dear {name}, your fees are overdue. Pending amount: ₹{pending}. Please contact us immediately to avoid any inconvenience.',
            'payment_confirmation': 'Dear {name}, thank you for your payment of ₹{amount}. Your receipt has been generated and will be sent shortly.'
        };

        return templates[template] || customMessage;
    }

    async sendBulkNotifications(students, methods, messageTemplate, scheduledDate) {
        const notifications = [];

        students.forEach(student => {
            const pendingAmount = this.getStudentPendingAmount(student.id);
            const personalizedMessage = messageTemplate
                .replace('{name}', student.name)
                .replace('{pending}', pendingAmount)
                .replace('{amount}', pendingAmount);

            methods.forEach(method => {
                notifications.push({
                    studentId: student.id,
                    studentName: student.name,
                    method,
                    message: personalizedMessage,
                    scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(),
                    status: 'pending',
                    timestamp: serverTimestamp()
                });
            });
        });

        // Add to notifications collection
        const batch = writeBatch(db);
        notifications.forEach(notification => {
            const docRef = doc(collection(db, "notifications"));
            batch.set(docRef, notification);
        });

        await batch.commit();
    }

    generateReceipt(paymentData) {
        // Create receipt content
        const receiptContent = `
            <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; border: 1px solid #ccc;">
                <h2 style="text-align: center; color: #333;">Micro Tech Center</h2>
                <h3 style="text-align: center; color: #666;">Payment Receipt</h3>
                <hr>
                <p><strong>Student:</strong> ${paymentData.studentName}</p>
                <p><strong>Division:</strong> ${paymentData.division}</p>
                <p><strong>Amount:</strong> ₹${paymentData.amount}</p>
                <p><strong>Payment Method:</strong> ${paymentData.paymentMethod}</p>
                <p><strong>Date:</strong> ${paymentData.date.toLocaleDateString()}</p>
                ${paymentData.month ? `<p><strong>Month:</strong> ${paymentData.month}/${paymentData.year}</p>` : ''}
                ${paymentData.notes ? `<p><strong>Notes:</strong> ${paymentData.notes}</p>` : ''}
                <hr>
                <p style="text-align: center; font-size: 12px; color: #999;">
                    Generated on ${new Date().toLocaleString()}
                </p>
            </div>
        `;

        // Create new window for receipt
        const receiptWindow = window.open('', '_blank', 'width=500,height=600');
        receiptWindow.document.write(receiptContent);
        receiptWindow.document.close();
    }

    recordPayment(studentId) {
        this.openPaymentModal(studentId);
    }

    viewStudentDetails(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (!student) return;

        const pendingAmount = this.getStudentPendingAmount(studentId);
        const paidAmount = student.totalFees ? student.totalFees - pendingAmount : 0;

        const details = `
            <strong>Name:</strong> ${student.name}<br>
            <strong>Phone:</strong> ${student.phone || 'N/A'}<br>
            <strong>Email:</strong> ${student.email || 'N/A'}<br>
            <strong>Division:</strong> ${student.division || 'N/A'}<br>
            <strong>Course:</strong> ${student.course || 'N/A'}<br>
            <strong>Total Fees:</strong> ₹${(student.totalFees || 0).toLocaleString()}<br>
            <strong>Paid Amount:</strong> ₹${paidAmount.toLocaleString()}<br>
            <strong>Pending Amount:</strong> ₹${pendingAmount.toLocaleString()}<br>
            <strong>Join Date:</strong> ${student.joinDate ? new Date(student.joinDate).toLocaleDateString() : 'N/A'}
        `;

        this.showNotification(details, 'info', 10000);
    }

    showNotification(message, type = 'info', duration = 5000) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add close functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);
    }

    showEnhancedError(message, details = '') {
        // Remove existing error displays
        const existingErrors = document.querySelectorAll('.error-display');
        existingErrors.forEach(error => error.remove());

        const errorDisplay = document.createElement('div');
        errorDisplay.className = 'error-display';
        
        errorDisplay.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <div>
                <div class="error-message">${message}</div>
                ${details ? `<div class="error-details">${details}</div>` : ''}
            </div>
        `;
        
        // Insert error display at the top of the modal body
        const modalBody = document.querySelector('#addStudentModal .modal-body');
        if (modalBody) {
            modalBody.insertBefore(errorDisplay, modalBody.firstChild);
            
            // Scroll to top of modal to show error
            modalBody.scrollTop = 0;
        }
        
        // Also show notification
        this.showNotification(message, 'error');
    }

    showEnhancedSuccess(message, details = {}) {
        // Remove existing success displays
        const existingSuccess = document.querySelectorAll('.success-display');
        existingSuccess.forEach(success => success.remove());

        const successDisplay = document.createElement('div');
        successDisplay.className = 'success-display';
        
        let detailsHtml = '';
        if (details.studentName) {
            detailsHtml = `
                <div class="success-details">
                    <strong>${details.studentName}</strong> has been added to ${details.division} division.
                    <br>Student ID: ${details.studentId}
                    <br>Total Fees: ₹${details.totalFees}
                </div>
            `;
        }
        
        successDisplay.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <div>
                <div class="success-message">${message}</div>
                ${detailsHtml}
            </div>
        `;
        
        // Insert success display at the top of the modal body
        const modalBody = document.querySelector('#addStudentModal .modal-body');
        if (modalBody) {
            modalBody.insertBefore(successDisplay, modalBody.firstChild);
            
            // Scroll to top of modal to show success
            modalBody.scrollTop = 0;
        }
        
        // Also show notification
        this.showNotification(message, 'success');
    }

    clearFormErrors() {
        // Remove error displays
        const errorDisplays = document.querySelectorAll('.error-display');
        errorDisplays.forEach(error => error.remove());
        
        // Remove success displays
        const successDisplays = document.querySelectorAll('.success-display');
        successDisplays.forEach(success => success.remove());
        
        // Remove error classes from form controls
        const formControls = document.querySelectorAll('#addStudentForm .form-control');
        formControls.forEach(control => {
            control.classList.remove('error', 'success');
        });
        
        // Remove validation messages
        const validationMessages = document.querySelectorAll('.validation-message');
        validationMessages.forEach(message => message.remove());
    }

    validateStudentForm(formData) {
        const errors = [];
        
        // Required field validation
        if (!formData.get('studentName')?.trim()) {
            errors.push({ field: 'studentName', message: 'Student name is required' });
        }
        
        if (!formData.get('studentPhone')?.trim()) {
            errors.push({ field: 'studentPhone', message: 'Phone number is required' });
        }
        
        if (!formData.get('studentDivision')) {
            errors.push({ field: 'studentDivision', message: 'Division is required' });
        }
        
        if (!formData.get('totalFees') || parseFloat(formData.get('totalFees')) <= 0) {
            errors.push({ field: 'totalFees', message: 'Total fees must be greater than 0' });
        }
        
        if (!formData.get('joinDate')) {
            errors.push({ field: 'joinDate', message: 'Join date is required' });
        }
        
        return errors;
    }

    displayFormErrors(errors) {
        errors.forEach(error => {
            const field = document.getElementById(error.field);
            if (field) {
                field.classList.add('error');
                
                // Add validation message below the field
                const validationMessage = document.createElement('div');
                validationMessage.className = 'validation-message error';
                validationMessage.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i>
                    ${error.message}
                `;
                
                field.parentNode.appendChild(validationMessage);
            }
        });
        
        // Show general error notification
        this.showNotification('Please correct the errors below', 'error');
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(phone);
    }

    // AI Assistance Methods
    async predictRevenueCollection() {
        try {
            // Analyze payment patterns
            const paymentPatterns = this.analyzePaymentPatterns();
            const riskStudents = this.identifyHighRiskStudents();
            
            const prediction = {
                monthlyProbability: this.calculateMonthlyProbability(paymentPatterns),
                highRiskStudents: riskStudents,
                recommendations: this.generateRecommendations(paymentPatterns, riskStudents)
            };

            return prediction;
        } catch (error) {
            console.error('Error predicting revenue collection:', error);
            return null;
        }
    }

    analyzePaymentPatterns() {
        const patterns = {
            averagePaymentDelay: 0,
            paymentFrequency: {},
            seasonalTrends: {}
        };

        // Calculate average payment delay
        let totalDelay = 0;
        let delayCount = 0;

        this.students.forEach(student => {
            if (student.lastPaymentDate) {
                const lastPayment = new Date(student.lastPaymentDate);
                const currentDate = new Date();
                const delay = Math.floor((currentDate - lastPayment) / (1000 * 60 * 60 * 24));
                if (delay > 0) {
                    totalDelay += delay;
                    delayCount++;
                }
            }
        });

        if (delayCount > 0) {
            patterns.averagePaymentDelay = totalDelay / delayCount;
        }

        return patterns;
    }

    identifyHighRiskStudents() {
        return this.students.filter(student => {
            const pendingAmount = this.getStudentPendingAmount(student.id);
            const lastPayment = this.getLastPaymentDate(student.id);
            
            if (!lastPayment) return true;
            
            const lastPaymentDate = new Date(lastPayment);
            const currentDate = new Date();
            const daysSincePayment = Math.floor((currentDate - lastPaymentDate) / (1000 * 60 * 60 * 24));
            
            // High risk: pending amount > 5000 and no payment in 30+ days
            return pendingAmount > 5000 && daysSincePayment > 30;
        });
    }

    calculateMonthlyProbability(patterns) {
        // Simple probability calculation based on historical data
        const totalStudents = this.students.length;
        const studentsWithPending = this.students.filter(student => 
            this.getStudentPendingAmount(student.id) > 0
        ).length;
        
        const baseProbability = 0.7; // 70% base probability
        const riskFactor = studentsWithPending / totalStudents;
        
        return Math.max(0.1, Math.min(0.9, baseProbability - (riskFactor * 0.3)));
    }

    generateRecommendations(patterns, riskStudents) {
        const recommendations = [];

        if (patterns.averagePaymentDelay > 30) {
            recommendations.push('Implement stricter payment reminders for overdue accounts');
        }

        if (riskStudents.length > this.students.length * 0.2) {
            recommendations.push('Consider offering payment plans for high-risk students');
        }

        if (patterns.averagePaymentDelay > 60) {
            recommendations.push('Review fee structure and consider early payment discounts');
        }

        return recommendations;
    }

    // Quick Action Methods
    exportFeesReport() {
        try {
            const reportData = this.generateFeesReport();
            this.downloadReport(reportData);
            this.showNotification('Fees report exported successfully!', 'success');
        } catch (error) {
            console.error('Error exporting report:', error);
            this.showNotification('Error exporting report', 'error');
        }
    }

    generateInvoice() {
        this.showNotification('Invoice generation feature will be implemented', 'info');
    }

    viewPaymentHistory() {
        this.showNotification('Payment history view will be implemented', 'info');
    }

    manageFeeStructure() {
        this.showNotification('Fee structure management will be implemented', 'info');
    }

    generateFeesReport() {
        const report = {
            title: 'MicroTech Fee Management Report',
            generatedAt: new Date().toLocaleString(),
            summary: {
                totalStudents: this.students.length,
                totalFees: this.students.reduce((sum, s) => sum + (s.totalFees || 0), 0),
                totalCollected: this.fees.reduce((sum, f) => sum + (f.amount || 0), 0),
                pendingAmount: this.calculatePendingFees()
            },
            students: this.students.map(student => ({
                name: student.name,
                division: student.division,
                totalFees: student.totalFees || 0,
                pendingAmount: this.getStudentPendingAmount(student.id),
                lastPayment: this.getLastPaymentDate(student.id)
            }))
        };

        return report;
    }

    downloadReport(reportData) {
        const csvContent = this.convertToCSV(reportData);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `fees_report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    convertToCSV(reportData) {
        let csv = 'Name,Division,Total Fees,Pending Amount,Last Payment\n';
        
        reportData.students.forEach(student => {
            csv += `"${student.name}","${student.division || 'N/A'}",${student.totalFees},${student.pendingAmount},"${student.lastPayment || 'No payments'}"\n`;
        });
        
        return csv;
    }
}

// Initialize fee manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing fee management...');
    
    // Initialize profile functionality
    addProfileStyles();
    initializeUserProfile();
    
    console.log('Creating FeeManager instance...');
    console.log('FeeManager class available:', typeof FeeManager);
    console.log('Firebase db available:', typeof db);
    
    try {
        window.feeManager = new FeeManager();
        console.log('FeeManager instance created successfully:', window.feeManager);
        
        // Test if the instance is accessible globally
        console.log('Global feeManager:', window.feeManager);
        console.log('Global feeManager type:', typeof window.feeManager);
    } catch (error) {
        console.error('Error creating FeeManager instance:', error);
        alert('Error creating FeeManager: ' + error.message);
    }
});

// Export for module usage
export default FeeManager;