import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getDatabase, ref, get, update
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAD_3jmeamJ2QyJk2OPi-ucB2DDQSUCPPw",
  authDomain: "microtech-8e188.firebaseapp.com",
  projectId: "microtech-8e188",
  storageBucket: "microtech-8e188.appspot.com",
  messagingSenderId: "401753262680",
  appId: "1:401753262680:web:fb49631cc511f2457e982d",
  measurementId: "G-JHHD1M22CW"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

let isCounselor = false;
let isAdmin = false;
let allStudents = [];
let allFees = [];
let allMonths = [];

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const token = await user.getIdTokenResult();
    isAdmin = token.claims.role === "admin";
    isCounselor = token.claims.role === "counselor";
    await loadStudents();
    await loadFees();
    renderFeeStatusTable();
  }
});

// 1. Load all students
async function loadStudents() {
  const studentsSnap = await get(ref(db, "students"));
  allStudents = [];
  if (studentsSnap.exists()) {
    studentsSnap.forEach(snap => {
      allStudents.push({ uid: snap.key, ...snap.val() });
    });
  }
}

// 2. Load all fees
async function loadFees() {
  allFees = [];
  const feesSnap = await get(ref(db, "fees"));
  if (feesSnap.exists()) {
    feesSnap.forEach(studentSnap => {
      const studentUID = studentSnap.key;
      studentSnap.child('records').forEach(recordSnap => {
        const record = recordSnap.val();
        allFees.push({
          studentUID,
          ...record,
          recordID: recordSnap.key
        });
      });
    });
  }
  // Collect all unique months
  allMonths = [...new Set(allFees.map(f => f.month))].sort();
}

// 3. Render the fee status table
function renderFeeStatusTable() {
  // Table head
  const thead = document.getElementById("feeStatusHead");
  thead.innerHTML = `<tr>
    <th>Student</th>
    <th>Batch</th>
    ${allMonths.map(m => `<th>${m}</th>`).join("")}
  </tr>`;

  // Table body
  const tbody = document.getElementById("feeStatusBody");
  tbody.innerHTML = "";
  allStudents.forEach(student => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${student.name || student.uid}</td>
      <td>${student.batch || "-"}</td>
      ${allMonths.map(month => {
        const fee = allFees.find(f => f.studentUID === student.uid && f.month === month);
        if (!fee) return `<td>-</td>`;
        const statusClass = fee.status === "Paid" ? "fee-status-paid" : "fee-status-pending";
        const editable = isCounselor ? "fee-status-editable" : "";
        return `<td class="${statusClass} ${editable}" 
          onclick="${isCounselor ? `editFeeStatus('${student.uid}','${fee.recordID}','${fee.status}','${month}')` : ""}">
          ${fee.status}
        </td>`;
      }).join("")}
    `;
    tbody.appendChild(tr);
  });
}

// 4. Edit fee status (counselor only)
window.editFeeStatus = async function(studentUID, recordID, currentStatus, month) {
  if (!isCounselor) return;
  const newStatus = prompt(`Set status for ${month} (Paid/Pending):`, currentStatus);
  if (!newStatus || (newStatus !== "Paid" && newStatus !== "Pending")) return;
  await update(ref(db, `fees/${studentUID}/records/${recordID}`), {
    status: newStatus,
    date: new Date().toLocaleDateString(),
    updatedBy: "Counselor"
  });
  await loadFees();
  renderFeeStatusTable();
};