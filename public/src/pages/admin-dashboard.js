import { db, onSnapshot, collection, getDocs } from '/src/firebase-init.js';
import { appSettings } from '/src/firebase-config.js';

let revenueChart, divisionChart, profitChart, expenseChart;

const fromEl = document.getElementById('filterFrom');
const toEl = document.getElementById('filterTo');
const divEl = document.getElementById('filterDivision');
const applyBtn = document.getElementById('applyFilters');
const backupBtn = document.getElementById('backupExport');

applyBtn.addEventListener('click', bind);
backupBtn?.addEventListener('click', exportBackup);

function inRange(ts) {
  const from = fromEl.value ? new Date(fromEl.value) : null;
  const to = toEl.value ? new Date(toEl.value) : null;
  if (!from && !to) return true;
  const d = new Date(ts);
  if (from && d < from) return false;
  if (to) {
    const end = new Date(to);
    end.setHours(23,59,59,999);
    if (d > end) return false;
  }
  return true;
}

let unsubscribers = [];
function clearSubs() { unsubscribers.forEach(u => u()); unsubscribers = []; }

function bind() {
  clearSubs();
  const kpiRevenueEl = document.getElementById('kpiRevenue');
  const kpiStudentsEl = document.getElementById('kpiStudents');
  const kpiStaffEl = document.getElementById('kpiStaff');
  const kpiTeachersEl = document.getElementById('kpiTeachers');
  const divisionFilter = divEl.value;

  let totalRevenue = 0;
  let expensesTotal = 0;

  const unsubFinance = onSnapshot(collection(db, 'finance'), (snap) => {
    const revenueByMonth = new Map();
    const byDivision = new Map();
    const expenseByCategory = new Map();
    totalRevenue = 0;
    expensesTotal = 0;

    snap.docs.forEach(d => {
      const data = d.data();
      if (!inRange(data.date)) return;
      if (divisionFilter !== 'All' && data.division !== divisionFilter) return;
      const monthKey = new Date(data.date).toISOString().slice(0,7);
      if (data.type === 'revenue') {
        totalRevenue += data.amount || 0;
        revenueByMonth.set(monthKey, (revenueByMonth.get(monthKey) || 0) + (data.amount || 0));
        byDivision.set(data.division, (byDivision.get(data.division) || 0) + (data.amount || 0));
      } else if (data.type === 'expense') {
        expensesTotal += data.amount || 0;
        expenseByCategory.set(data.category, (expenseByCategory.get(data.category) || 0) + (data.amount || 0));
      }
    });

    kpiRevenueEl.textContent = `₹${Math.round(totalRevenue).toLocaleString('en-IN')}`;

    const months = Array.from(revenueByMonth.keys()).sort();
    const revValues = months.map(m => revenueByMonth.get(m));
    upsertLineChart('chartRevenue', months, revValues, 'Revenue');

    const divisions = appSettings.divisions;
    const divValues = divisions.map(d => byDivision.get(d) || 0);
    upsertDoughnut('chartDivision', divisions, divValues);

    const profit = totalRevenue - expensesTotal;
    upsertBar('chartProfit', ['Revenue', 'Expenses', 'Profit'], [totalRevenue, expensesTotal, profit]);

    const categories = Array.from(expenseByCategory.keys());
    const catVals = categories.map(c => expenseByCategory.get(c));
    upsertBar('chartExpense', categories, catVals);
  });

  const unsubStudents = onSnapshot(collection(db, 'students'), (snap) => {
    document.getElementById('kpiStudents').textContent = String(snap.size);
  });
  const unsubStaff = onSnapshot(collection(db, 'staff'), (snap) => {
    document.getElementById('kpiStaff').textContent = String(snap.size);
    let teachers = 0;
    snap.docs.forEach(d => { if ((d.data().role || '').toLowerCase() === 'teacher') teachers++; });
    document.getElementById('kpiTeachers').textContent = String(teachers);
  });

  unsubscribers.push(unsubFinance, unsubStudents, unsubStaff);
}

function upsertLineChart(canvasId, labels, data, label) {
  const ctx = document.getElementById(canvasId);
  return new Chart(ctx, { type: 'line', data: { labels, datasets: [{ label, data, borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,.1)' }]}, options: { responsive: true, maintainAspectRatio: false }});
}
function upsertDoughnut(canvasId, labels, data) {
  const ctx = document.getElementById(canvasId);
  return new Chart(ctx, { type: 'doughnut', data: { labels, datasets: [{ data }]}, options: { responsive: true, maintainAspectRatio: false }});
}
function upsertBar(canvasId, labels, data) {
  const ctx = document.getElementById(canvasId);
  return new Chart(ctx, { type: 'bar', data: { labels, datasets: [{ data, backgroundColor: '#0ea5e9' }]}, options: { responsive: true, maintainAspectRatio: false }});
}

async function exportBackup() {
  const colls = ['users','students','staff','courses','finance','fees','ads','alumni','scholarships','scholarshipApplications','referrals','notifications','documents','leads'];
  const out = {};
  for (const c of colls) {
    const snap = await getDocs(collection(db, c));
    out[c] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
  const blob = new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `backup_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
}

bind();