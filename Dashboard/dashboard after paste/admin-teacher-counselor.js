import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase Config
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
const db = getFirestore(app);
const auth = getAuth(app);

let allStaff = [];
let isAdmin = false;

// On auth, load data
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const token = await user.getIdTokenResult();
    isAdmin = token.claims.role === "admin";
    loadStaff();
  } else {
    alert("You must be logged in to view staff data.");
  }
});

// Load teachers and counselors
async function loadStaff() {
  const querySnapshot = await getDocs(collection(db, "users"));
  allStaff = [];
  let teacherCount = 0;
  let counselorCount = 0;

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const role = data.role?.toLowerCase();
    if (role === "teacher" || role === "counselor") {
      allStaff.push(data);
      if (role === "teacher") teacherCount++;
      if (role === "counselor") counselorCount++;
    }
  });

  document.getElementById("teacherCount").textContent = teacherCount;
  document.getElementById("counselorCount").textContent = counselorCount;

  displayStaff(allStaff);
}

// Show in table
function displayStaff(staff) {
  const tbody = document.getElementById("staffTableBody");
  tbody.innerHTML = "";

  staff.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.name || "-"}</td>
      <td>${user.role || "-"}</td>
      <td>${user.email || "-"}</td>
      <td>${user.phone || "-"}</td>
      <td>
        ${isAdmin ? `
          <button class="btn btn-sm btn-primary me-1">Edit</button>
          <button class="btn btn-sm btn-danger">Delete</button>
        ` : `<span class="text-muted">No access</span>`}
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Filters
window.filterStaff = function (type) {
  if (type === "All") {
    displayStaff(allStaff);
  } else {
    const filtered = allStaff.filter(u => u.role?.toLowerCase() === type.toLowerCase());
    displayStaff(filtered);
  }
};
