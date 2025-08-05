// admin-dashboard-overview.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore, collection, getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ✅ Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAD_3jmeamJ2QyJk2OPi-ucB2DDQSUCPPw",
  authDomain: "microtech-8e188.firebaseapp.com",
  projectId: "microtech-8e188",
  storageBucket: "microtech-8e188.appspot.com",
  messagingSenderId: "401753262680",
  appId: "1:401753262680:web:fb49631cc511f2457e982d",
  measurementId: "G-JHHD1M22CW"
};

initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth();

async function loadOverviewData() {
  try {
    const studentSnap = await getDocs(collection(db, "students"));
    const teacherSnap = await getDocs(collection(db, "teachers"));
    const courseSnap = await getDocs(collection(db, "courses"));
    const feesSnap = await getDocs(collection(db, "fees"));

    document.getElementById("studentCount").textContent = studentSnap.size;
    document.getElementById("teacherCount").textContent = teacherSnap.size;
    document.getElementById("courseCount").textContent = courseSnap.size;

    let totalFees = 0;
    for (const doc of feesSnap.docs) {
      const recordsRef = collection(db, "fees", doc.id, "records");
      const recordsSnap = await getDocs(recordsRef);
      recordsSnap.forEach(record => {
        const data = record.data();
        if (data.status === "Paid") {
          totalFees += Number(data.amount || 0);
        }
      });
    }
    document.getElementById("feesCollected").textContent = `₹${totalFees.toLocaleString()}`;
  } catch (err) {
    console.error("Error loading overview:", err);
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    loadOverviewData();
  } else {
    window.location.href = "../index.html";
  }
});

