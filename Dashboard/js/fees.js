import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy
} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import { app } from '../firebase.js'; // Assuming this is the correct path to your firebase config
import { initializeUserProfile, addProfileStyles } from './profile-utils.js';
import { NotificationManager } from '../notification-manager.js';

const db = getFirestore(app);
const feesCollection = collection(db, 'fees');
let notificationManager = null;

// DOM Elements
const modal = document.getElementById('fee-modal');
const addFeeBtn = document.getElementById('add-fee-btn');
const closeModalBtn = document.querySelector('.close-btn');
const addFeeForm = document.getElementById('add-fee-form');

const totalRevenueEl = document.getElementById('total-revenue');
const gamaRevenueEl = document.getElementById('gama-revenue');
const lbsRevenueEl = document.getElementById('lbs-revenue');
const captRevenueEl = document.getElementById('capt-revenue');

const gamaFeesTable = document.getElementById('gama-fees-table').getElementsByTagName('tbody')[0];
const lbsFeesTable = document.getElementById('lbs-fees-table').getElementsByTagName('tbody')[0];
const captFeesTable = document.getElementById('capt-fees-table').getElementsByTagName('tbody')[0];

const tabLinks = document.querySelectorAll('.tab-link');
const tabContents = document.querySelectorAll('.tab-content');

let revenueChart = null;

// --- Modal Logic ---
addFeeBtn.onclick = () => modal.style.display = 'block';
closeModalBtn.onclick = () => modal.style.display = 'none';
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

// --- Tab Logic ---
tabLinks.forEach(link => {
    link.addEventListener('click', () => {
        const tabId = link.getAttribute('data-tab');

        tabLinks.forEach(l => l.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        link.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// --- Firestore Logic ---

// Add new fee document
addFeeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const studentId = document.getElementById('student-id').value;
    const division = document.getElementById('division').value;
    const feeType = document.getElementById('fee-type').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('payment-date').value;
    const mode = document.getElementById('payment-mode').value;
    const status = document.getElementById('payment-status').value;
    const notes = document.getElementById('notes').value;

    try {
        const receiptNo = `${division.toUpperCase()}-${Date.now().toString().slice(-5)}`;
        await addDoc(feesCollection, {
            studentId,
            division,
            type: feeType,
            amount,
            date,
            mode,
            status,
            notes,
            receiptNo,
            createdAt: new Date()
        });
        addFeeForm.reset();
        modal.style.display = 'none';
        
        // Add fee payment notification
        if (notificationManager) {
            notificationManager.notifyFeeCollected(
                'Fee Payment Recorded',
                `Fee payment of ₹${amount.toLocaleString()} from Student ID: ${studentId} has been recorded successfully.`,
                'success'
            );
        }
        
        alert('Fee payment added successfully!');
    } catch (error) {
        console.error('Error adding document: ', error);
        alert('Failed to add fee payment.');
    }
});

// Listen for real-time updates
onSnapshot(query(feesCollection, orderBy('date', 'desc')), (snapshot) => {
    const allFees = [];
    snapshot.forEach(doc => {
        allFees.push({ id: doc.id, ...doc.data() });
    });

    // Clear existing table rows
    gamaFeesTable.innerHTML = '';
    lbsFeesTable.innerHTML = '';
    captFeesTable.innerHTML = '';

    // Process data for analytics and tables
    let totalRevenue = 0;
    let gamaRevenue = 0;
    let lbsRevenue = 0;
    let captRevenue = 0;
    const monthlyRevenue = {};

    allFees.forEach(fee => {
        if (fee.status === 'paid') {
            totalRevenue += fee.amount;
            const month = fee.date.substring(0, 7); // YYYY-MM
            monthlyRevenue[month] = (monthlyRevenue[month] || 0) + fee.amount;

            if (fee.division === 'gama') {
                gamaRevenue += fee.amount;
                renderFeeRow(gamaFeesTable, fee);
            } else if (fee.division === 'lbs') {
                lbsRevenue += fee.amount;
                renderFeeRow(lbsFeesTable, fee);
            } else if (fee.division === 'capt') {
                captRevenue += fee.amount;
                renderFeeRow(captFeesTable, fee);
            }
        } else {
            // Also render pending fees
            if (fee.division === 'gama') renderFeeRow(gamaFeesTable, fee);
            else if (fee.division === 'lbs') renderFeeRow(lbsFeesTable, fee);
            else if (fee.division === 'capt') renderFeeRow(captFeesTable, fee);
        }
    });

    // Update analytics cards
    totalRevenueEl.textContent = `₹${totalRevenue.toLocaleString()}`;
    gamaRevenueEl.textContent = `₹${gamaRevenue.toLocaleString()}`;
    lbsRevenueEl.textContent = `₹${lbsRevenue.toLocaleString()}`;
    captRevenueEl.textContent = `₹${captRevenue.toLocaleString()}`;

    // Update chart
    updateChart(monthlyRevenue);
});

function renderFeeRow(tableBody, fee) {
    const row = tableBody.insertRow();
    row.innerHTML = `
        <td>${fee.studentId}</td>
        <td>${fee.type}</td>
        <td>₹${fee.amount.toLocaleString()}</td>
        <td>${fee.date}</td>
        <td>${fee.mode}</td>
        <td><span class="status-${fee.status.toLowerCase()}">${fee.status}</span></td>
        <td>${fee.receiptNo}</td>
    `;
}

function updateChart(monthlyRevenue) {
    const ctx = document.getElementById('revenue-chart').getContext('2d');
    const sortedMonths = Object.keys(monthlyRevenue).sort();

    const chartData = {
        labels: sortedMonths,
        datasets: [{
            label: 'Monthly Revenue',
            data: sortedMonths.map(month => monthlyRevenue[month]),
            backgroundColor: 'rgba(0, 123, 255, 0.5)',
            borderColor: 'rgba(0, 123, 255, 1)',
            borderWidth: 1,
            borderRadius: 5
        }]
    };

    if (revenueChart) {
        revenueChart.data = chartData;
        revenueChart.update();
    } else {
        revenueChart = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#f0f0f0'
                        },
                        grid: {
                            color: '#444'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#f0f0f0'
                        },
                        grid: {
                            color: '#444'
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            color: '#f0f0f0'
                        }
                    }
                }
            }
        });
    }
}

// Initialize profile functionality when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Fees management page loaded');
    
    // Initialize notification system
    initializeNotifications();
    
    // Initialize profile functionality
    addProfileStyles();
    initializeUserProfile();
});

function initializeNotifications() {
    notificationManager = new NotificationManager('fee-management');
    
    // Load some default fee notifications if empty
    if (notificationManager.getUnreadCount() === 0) {
        notificationManager.addNotification({
            title: 'Welcome to Fee Management',
            message: 'Track and manage all fee payments across divisions.',
            type: 'info',
            priority: 'medium'
        });
    }
}

// Function to add fee-related notifications
function addFeeNotification(title, message, type = 'info') {
    if (notificationManager) {
        notificationManager.notifyFeeCollected(title, message, type);
    }
}
