import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, getDocs, setDoc, doc, deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

let allStudents = [];

async function loadStudents() {
  const querySnapshot = await getDocs(collection(db, "students"));
  allStudents = [];
  let gamaCount = 0, otherCount = 0;
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const role = (data.role || "").toLowerCase();
    if (role === "gama abacus") gamaCount++;
    else otherCount++;
    allStudents.push({ ...data, uid: docSnap.id });
  });
  document.getElementById("gamaCount").textContent = gamaCount;
  document.getElementById("otherCount").textContent = otherCount;
  document.getElementById("totalCount").textContent = allStudents.length;
  displayStudents(allStudents);
}

function displayStudents(students) {
  const tbody = document.getElementById("studentTableBody");
  tbody.innerHTML = "";
  students.forEach(student => {
    tbody.innerHTML += `
      <tr>
        <td>${student.name || "-"}</td>
        <td>${student.role || "-"}</td>
        <td>${student.course || "-"}</td>
        <td>${student.batch || "-"}</td>
        <td>${student.email || "-"}</td>
        <td>${student.phone || "-"}</td>
        <td>
          <button class="btn btn-sm btn-primary me-1" onclick="openEditStudent('${student.uid}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteStudent('${student.uid}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

// Search/filter
document.getElementById("studentSearchInput").addEventListener("input", function() {
  const val = this.value.toLowerCase();
  const filtered = allStudents.filter(s =>
    (s.name || "").toLowerCase().includes(val) ||
    (s.course || "").toLowerCase().includes(val) ||
    (s.batch || "").toLowerCase().includes(val)
  );
  displayStudents(filtered);
});

// Add/Edit Student Modal
window.openAddStudent = function() {
  document.getElementById("studentModalLabel").textContent = "Add Student";
  document.getElementById("studentUID").value = "";
  document.getElementById("studentName").value = "";
  document.getElementById("studentRole").value = "gama abacus";
  document.getElementById("studentCourse").value = "";
  document.getElementById("studentBatch").value = "";
  document.getElementById("studentEmail").value = "";
  document.getElementById("studentPhone").value = "";
};

window.openEditStudent = function(uid) {
  const student = allStudents.find(s => s.uid === uid);
  if (!student) return;
  document.getElementById("studentModalLabel").textContent = "Edit Student";
  document.getElementById("studentUID").value = student.uid;
  document.getElementById("studentName").value = student.name || "";
  document.getElementById("studentRole").value = student.role || "gama abacus";
  document.getElementById("studentCourse").value = student.course || "";
  document.getElementById("studentBatch").value = student.batch || "";
  document.getElementById("studentEmail").value = student.email || "";
  document.getElementById("studentPhone").value = student.phone || "";
  const modal = new bootstrap.Modal(document.getElementById('studentModal'));
  modal.show();
};

// Save Student (Add/Edit)
document.getElementById("studentForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const uid = document.getElementById("studentUID").value || crypto.randomUUID();
  const student = {
    name: document.getElementById("studentName").value.trim(),
    role: document.getElementById("studentRole").value,
    course: document.getElementById("studentCourse").value.trim(),
    batch: document.getElementById("studentBatch").value.trim(),
    email: document.getElementById("studentEmail").value.trim(),
    phone: document.getElementById("studentPhone").value.trim()
  };
  await setDoc(doc(db, "students", uid), student);
  bootstrap.Modal.getInstance(document.getElementById('studentModal')).hide();
  loadStudents();
});

// Delete Student
window.deleteStudent = async function(uid) {
  if (!confirm("Delete this student?")) return;
  await deleteDoc(doc(db, "students", uid));
  loadStudents();
};

// Initial load
loadStudents();