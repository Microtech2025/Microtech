import { initApp, getAuth, getDb, formatCurrency } from "./app.js";

const { db } = getDb ? {} : {};

await initApp({ requiredRoles: ["Admin", "Counselor"] });
const auth = getAuth();
const dbRef = getDb();

// UI bindings
const emailEl = document.getElementById("userEmail");
const roleEl = document.getElementById("userRole");
const signOutBtn = document.getElementById("signOut");
const lastUpdatedEl = document.getElementById("lastUpdated");

const kpiStudents = document.getElementById("kpiStudents");
const kpiStaff = document.getElementById("kpiStaff");
const kpiCourses = document.getElementById("kpiCourses");
const kpiRevenueMonth = document.getElementById("kpiRevenueMonth");

emailEl.textContent = localStorage.getItem("userEmail") || "—";
roleEl.textContent = localStorage.getItem("userRole") || "—";

signOutBtn?.addEventListener("click", async (e) => {
  e.preventDefault();
  try { await auth.signOut(); } finally { window.location.href = "./auth/auth.html"; }
});

// Charts
let chartRevenueMonthly, chartRevenueSplit, chartExpenses;

function makeOrUpdateChart(ctx, type, data, options) {
  if (ctx._chart) { ctx._chart.data = data; ctx._chart.options = options || {}; ctx._chart.update(); return ctx._chart; }
  const chart = new Chart(ctx, { type, data, options: options || {} });
  ctx._chart = chart; return chart;
}

function monthLabels() {
  const formatter = new Intl.DateTimeFormat("en", { month: "short" });
  const now = new Date();
  const labels = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(formatter.format(d));
  }
  return labels;
}

function startOfMonth(date) { return new Date(date.getFullYear(), date.getMonth(), 1); }
function endOfMonth(date) { return new Date(date.getFullYear(), date.getMonth()+1, 0, 23, 59, 59, 999); }

function isWithinMonth(ts, date) {
  const d = ts instanceof Date ? ts : ts.toDate ? ts.toDate() : new Date(ts);
  return d >= startOfMonth(date) && d <= endOfMonth(date);
}

function updateLastUpdated() {
  lastUpdatedEl.textContent = new Date().toLocaleString();
}

// Real-time listeners
let unsubscribeStudents = () => {};
let unsubscribeStaff = () => {};
let unsubscribeFees = () => {};
let unsubscribeTransactions = () => {};

function setupRealtime() {
  unsubscribeStudents();
  unsubscribeStaff();
  unsubscribeFees();
  unsubscribeTransactions();

  unsubscribeStudents = dbRef.collection("students").onSnapshot((snap) => {
    kpiStudents.textContent = snap.size.toString();
    // Compute unique active courses from students
    const courseSet = new Set();
    snap.forEach((d) => {
      const c = (d.data().course || "").trim();
      if (c) courseSet.add(c);
    });
    kpiCourses.textContent = String(courseSet.size);
    updateCountsByRole();
    updateLastUpdated();
  });

  unsubscribeStaff = dbRef.collection("staff").onSnapshot((snap) => {
    kpiStaff.textContent = snap.size.toString();
    updateCountsByRole(snap);
    updateLastUpdated();
  });

  unsubscribeFees = dbRef.collection("fees").onSnapshot((snap) => {
    renderRevenue(snap);
    updateLastUpdated();
  });

  unsubscribeTransactions = dbRef.collection("transactions").onSnapshot((snap) => {
    renderExpensesAndProfit(snap);
    updateLastUpdated();
  });
}

function updateCountsByRole(staffSnap) {
  const target = staffSnap || null;
  if (!target) {
    dbRef.collection("staff").get().then(updateCountsByRole);
    return;
  }
  let teachers = 0, counselors = 0;
  target.forEach((doc) => {
    const r = (doc.data().role || "").toLowerCase();
    if (r.includes("teacher")) teachers += 1;
    if (r.includes("counselor")) counselors += 1;
  });
  document.getElementById("statTeachers").textContent = String(teachers);
  document.getElementById("statCounselors").textContent = String(counselors);
}

function renderRevenue(feesSnap) {
  const now = new Date();
  let monthTotal = 0;
  const monthlyBuckets = new Array(12).fill(0);
  const split = { education: 0, business: 0 };
  const byDivision = { capt: 0, lbs: 0, gama: 0, micro: 0, other: 0 };

  feesSnap.forEach((doc) => {
    const f = doc.data();
    const amount = Number(f.amount || f.fees || 0);
    const paidAt = f.paidAt ? (f.paidAt.toDate ? f.paidAt.toDate() : new Date(f.paidAt)) : new Date();

    const monthsDiff = (now.getFullYear() - paidAt.getFullYear()) * 12 + (now.getMonth() - paidAt.getMonth());
    if (monthsDiff >= 0 && monthsDiff < 12) {
      monthlyBuckets[11 - monthsDiff] += amount;
    }

    if (isWithinMonth(paidAt, now)) monthTotal += amount;

    const divisionKey = String((f.division || "other")).toLowerCase();
    if (["capt", "lbs", "gama"].includes(divisionKey)) split.education += amount; else split.business += amount;

    if (byDivision[divisionKey] !== undefined) byDivision[divisionKey] += amount; else byDivision.other += amount;
  });

  kpiRevenueMonth.textContent = formatCurrency(monthTotal);

  const ctxMonthly = document.getElementById("chartRevenueMonthly");
  makeOrUpdateChart(ctxMonthly, "line", {
    labels: monthLabels(),
    datasets: [{ label: "Revenue", data: monthlyBuckets, borderColor: "#6c8cff", backgroundColor: "rgba(108,140,255,.25)", tension: .25, fill: true }]
  }, { plugins: { legend: { display: false } } });

  const ctxSplit = document.getElementById("chartRevenueSplit");
  makeOrUpdateChart(ctxSplit, "doughnut", {
    labels: ["Education", "Business", "CAPT", "LBS", "Gama", "Micro", "Other"],
    datasets: [{
      data: [split.education, split.business, byDivision.capt, byDivision.lbs, byDivision.gama, byDivision.micro, byDivision.other],
      backgroundColor: ["#22c55e","#3756e5","#0ea5e9","#a78bfa","#f59e0b","#ef4444","#6b7280"]
    }]
  });
}

function renderExpensesAndProfit(txSnap) {
  const expensesByCat = { salaries: 0, rent: 0, utilities: 0, ads: 0, supplies: 0, other: 0 };
  let totalExpenses = 0;
  let totalIncome = 0;
  txSnap.forEach((doc) => {
    const t = doc.data();
    const amount = Number(t.amount || 0);
    if ((t.type || "").toLowerCase() === "expense") {
      const cat = (t.category || "other").toLowerCase();
      if (expensesByCat[cat] === undefined) expensesByCat.other += amount; else expensesByCat[cat] += amount;
      totalExpenses += amount;
    } else {
      totalIncome += amount;
    }
  });

  const ctxExpenses = document.getElementById("chartExpenses");
  makeOrUpdateChart(ctxExpenses, "bar", {
    labels: Object.keys(expensesByCat).map((k) => k[0].toUpperCase()+k.slice(1)),
    datasets: [{ label: "Expenses", data: Object.values(expensesByCat), backgroundColor: "#ef4444" }]
  }, { plugins: { legend: { display: false } } });

  const feesThisMonth = document.getElementById("kpiRevenueMonth").textContent.replace(/[^0-9.]/g, "");
  const monthlyRevenue = Number(feesThisMonth || 0);
  const profitLoss = monthlyRevenue + totalIncome - totalExpenses;
  document.getElementById("profitLoss").textContent = formatCurrency(profitLoss);
}

setupRealtime();