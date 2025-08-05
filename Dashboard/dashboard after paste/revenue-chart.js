import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collectionGroup, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  // your firebase config here
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ctxRevenue = document.getElementById('revenueChart').getContext('2d');
const ctxPaymentMode = document.getElementById('paymentModeChart').getContext('2d');

let revenueChart, paymentModeChart;

async function generateRevenueChart() {
  const monthlyTotals = {};
  const paymentModes = { Cash: 0, Online: 0 };

  const querySnapshot = await getDocs(collectionGroup(db, "records"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const amount = parseFloat(data.amount || 0);
    const paymentDate = new Date(data.paymentTime);
    const mode = data.paymentMode || "Unknown";

    if (!isNaN(amount)) {
      const month = paymentDate.toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyTotals[month] = (monthlyTotals[month] || 0) + amount;
    }

    if (mode in paymentModes) {
      paymentModes[mode] += amount;
    } else {
      paymentModes[mode] = amount;
    }
  });

  // Bar Chart: Monthly Revenue
  if (revenueChart) revenueChart.destroy();
  revenueChart = new Chart(ctxRevenue, {
    type: 'bar',
    data: {
      labels: Object.keys(monthlyTotals),
      datasets: [{
        label: 'Revenue (₹)',
        data: Object.values(monthlyTotals),
        backgroundColor: '#0d6efd',
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false }},
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'INR' }
        }
      }
    }
  });

  // Pie Chart: Payment Mode
  if (paymentModeChart) paymentModeChart.destroy();
  paymentModeChart = new Chart(ctxPaymentMode, {
    type: 'doughnut',
    data: {
      labels: Object.keys(paymentModes),
      datasets: [{
        data: Object.values(paymentModes),
        backgroundColor: ['#198754', '#ffc107'],
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        tooltip: { callbacks: {
          label: (tooltipItem) => {
            return `₹${tooltipItem.raw.toLocaleString()}`;
          }
        }}
      }
    }
  });
}

generateRevenueChart();
