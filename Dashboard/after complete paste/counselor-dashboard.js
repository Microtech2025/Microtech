import { auth, db } from '../firebase-init.js';
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  getDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const nameEl = document.getElementById("counselor-name");
const roleEl = document.getElementById("counselor-role");
const inquiryList = document.getElementById("inquiry-list");
const admissionList = document.getElementById("admission-list");
const timetableList = document.getElementById("timetable-list");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists() && userSnap.data().role === "counselor") {
      const data = userSnap.data();
      nameEl.textContent = data.name;
      roleEl.textContent = data.role;

      loadInquiries();
      loadAdmissions();
      loadTimetables();
    } else {
      alert("❌ Unauthorized access.");
      window.location.href = "index.html";
    }
  } else {
    window.location.href = "index.html";
  }
});

async function loadInquiries() {
  const ref = collection(db, "inquiries");
  const snapshot = await getDocs(ref);
  inquiryList.innerHTML = "";

  if (snapshot.empty) {
    inquiryList.innerHTML = "<li>No inquiries found.</li>";
  } else {
    snapshot.forEach(doc => {
      const li = document.createElement("li");
      li.textContent = `${doc.data().name} - ${doc.data().status}`;
      inquiryList.appendChild(li);
    });
  }
}

async function loadAdmissions() {
  const ref = collection(db, "admissions");
  const snapshot = await getDocs(ref);
  admissionList.innerHTML = "";

  if (snapshot.empty) {
    admissionList.innerHTML = "<li>No admissions found.</li>";
  } else {
    snapshot.forEach(doc => {
      const li = document.createElement("li");
      li.textContent = `${doc.data().teacherName} - ${doc.data().followUpStatus}`;
      admissionList.appendChild(li);
    });
  }
}

async function loadTimetables() {
  const ref = collection(db, "timetables");
  const snapshot = await getDocs(ref);
  timetableList.innerHTML = "";

  if (snapshot.empty) {
    timetableList.innerHTML = "<li>No timetables found.</li>";
  } else {
    snapshot.forEach(doc => {
      const li = document.createElement("li");
      li.textContent = `${doc.data().className}: ${doc.data().schedule}`;
      timetableList.appendChild(li);
    });
  }
}

document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAD_3jmeamJ2QyJk2OPi-ucB2DDQSUCPPw",
  authDomain: "microtech-8e188.firebaseapp.com",
  projectId: "microtech-8e188",
  storageBucket: "microtech-8e188.firebasestorage.app",
  messagingSenderId: "401753262680",
  appId: "1:401753262680:web:fb49631cc511f2457e982d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../auth.html"; // not logged in
  } else {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const role = userDoc.data()?.role;

    if (role !== "teacher") {
      alert("Access Denied.");
      window.location.href = "../auth.html";
    }
  }
});