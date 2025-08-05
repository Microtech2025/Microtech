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

let allStudents = [];
let isAdmin = false;

// Check login and load students
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const token = await user.getIdTokenResult();
    isAdmin = token.claims.role === "admin";
    loadStudents();
  } else {
    alert("You must be logged in to view students.");
  }
});

// Load and display students from 'users' collection
async function loadStudents() {
  const querySnapshot = await getDocs(collection(db, "users"));
  allStudents = [];
  let gamaCount = 0;
  let otherCount = 0;

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const role = data.role?.toLowerCase();

    if (role === "gamaabacus" || role === "student") {
      allStudents.push(data);
      if (role === "gamaabacus") gamaCount++;
      else otherCount++;
    }
  });

  document.getElementById("gamaCount").textContent = gamaCount;
  document.getElementById("otherCount").textContent = otherCount;

  displayStudents(allStudents);
}

// Display student rows
function displayStudents(students) {
  const tbody = document.getElementById("studentTableBody");
  tbody.innerHTML = "";

  students.forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.name || "-"}</td>
      <td>${student.role || "-"}</td>
      <td>${student.batch || "-"}</td>
      <td>${student.email || "-"}</td>
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

// Filter students by role
window.filterStudents = function (type) {
  let filtered;

  if (type === "All") {
    filtered = allStudents;
  } else if (type === "Gama Abacus") {
    filtered = allStudents.filter(s => s.role?.toLowerCase() === "gamaabacus");
  } else {
    filtered = allStudents.filter(s => s.role?.toLowerCase() === "student");
  }

  displayStudents(filtered);
};
