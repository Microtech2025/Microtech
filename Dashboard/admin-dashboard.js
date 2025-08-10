import { db } from './firebase.js';
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

function loadStats() {
    // Students live
    onSnapshot(collection(db, "students"), snap => {
        document.getElementById('totalStudents').textContent = snap.size;
    });

    // Staff live
    onSnapshot(collection(db, "staff"), snap => {
        document.getElementById('totalStaff').textContent = snap.size;
    });

    // Courses live
    onSnapshot(collection(db, "courses"), snap => {
        document.getElementById('totalCourses').textContent = snap.size;
    });

    // Revenue live
    onSnapshot(collection(db, "revenue"), snap => {
        let totalRevenue = 0;
        let divisionRevenue = { CAPT: 0, LBS: 0, Gama: 0, "Micro Computers": 0 };

        snap.forEach(doc => {
            const data = doc.data();
            // Ensure amount is a number
            const amount = typeof data.amount === "number" ? data.amount : Number(data.amount) || 0;
            totalRevenue += amount;
            if (divisionRevenue[data.division] !== undefined) {
                divisionRevenue[data.division] += amount;
            }
        });

        document.getElementById('totalRevenue').textContent = `₹${totalRevenue.toLocaleString()}`;
        renderCharts(divisionRevenue);
    });
}

function renderCharts(divisionRevenue) {
    // Destroy old charts if needed
    if (window.divChart) window.divChart.destroy();
    if (window.studentChart) window.studentChart.destroy();

    window.divChart = new Chart(document.getElementById('studentDivisionChart'), {
        type: 'bar',
        data: {
            labels: Object.keys(divisionRevenue),
            datasets: [{
                label: 'Revenue (₹)',
                data: Object.values(divisionRevenue),
                backgroundColor: ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2']
            }]
        }
    });

    window.studentChart = new Chart(document.getElementById('monthlyRevenueChart'), {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // placeholder
            datasets: [{
                label: 'Monthly Revenue',
                data: [12000, 15000, 8000, 20000, 17000, 22000], // replace with Firestore aggregation later
                borderColor: '#4e79a7',
                fill: true
            }]
        }
    });
}

loadStats();
