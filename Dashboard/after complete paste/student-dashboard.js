// Toggle menu for mobile
document.getElementById('menuToggle').addEventListener('click', function () {
  document.getElementById('navLinks').classList.toggle('active');
});

// Dropdown toggle
const profileBtn = document.getElementById('profileBtn');
const dropdownMenu = document.getElementById('dropdownMenu');

profileBtn.addEventListener('click', () => {
  dropdownMenu.style.display = dropdownMenu.style.display === 'flex' ? 'none' : 'flex';
});

// Hide dropdown when clicked outside
document.addEventListener('click', (event) => {
  if (!profileBtn.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.style.display = 'none';
  }
});

function logout() {
  // Optional: Add session clearing here if needed
  window.location.href = '../index.html';
}

// Firebase already initialized...

onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();

        // Populate course info
        document.getElementById("courseName").textContent = data.course || "N/A";
        document.getElementById("courseBatch").textContent = data.batch || "N/A";
        document.getElementById("courseDuration").textContent = data.duration || "N/A";
        document.getElementById("courseInstructor").textContent = data.instructor || "N/A";
        document.getElementById("courseStatus").textContent = data.status || "N/A";

        // Populate progress
        const progress = data.progress || 0;
        const progressBar = document.getElementById("courseProgressBar");
        const progressText = document.getElementById("courseProgressText");
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}% Completed`;

        // Populate modules
        const modules = data.modules || [];
        const moduleList = document.getElementById("completedModules");
        moduleList.innerHTML = modules.length > 0 
          ? modules.map(m => `<li>${m}</li>`).join('')
          : `<li>No modules completed.</li>`;

        // Certificate visibility
        if (data.status && data.status.toLowerCase() === "completed") {
          document.getElementById("downloadCertificateBtn").style.display = "inline-block";
        }

        document.getElementById("downloadCertificateBtn").onclick = () => {
          if (data.certificateUrl) {
            window.open(data.certificateUrl, "_blank");
          } else {
            alert("📄 Certificate not uploaded yet.");
          }
        };

      } else {
        alert("❌ Course info not found.");
      }
    } catch (err) {
      console.error("Error loading course:", err);
      alert("❌ Could not load course.");
    }
  } else {
    window.location.href = "../index.html";
  }
});

function logout() {
  signOut(auth)
    .then(() => window.location.href = "../index.html")
    .catch((err) => alert("Logout failed: " + err.message));
}

function goBack() {
  window.location.href = "teacher-dashboard.html";
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();

        const total = data.totalClasses || 0;
        const attended = data.classesAttended || 0;
        const percentage = total > 0 ? Math.round((attended / total) * 100) : 0;

        document.getElementById("totalClasses").textContent = total;
        document.getElementById("classesAttended").textContent = attended;
        document.getElementById("attendanceProgressBar").style.width = `${percentage}%`;
        document.getElementById("attendancePercentage").textContent = `${percentage}%`;

        const statusEl = document.getElementById("attendanceStatus");

        if (percentage >= 90) {
          statusEl.textContent = "✅ Excellent";
          statusEl.style.color = "green";
        } else if (percentage >= 75) {
          statusEl.textContent = "⚠️ Satisfactory";
          statusEl.style.color = "orange";
        } else {
          statusEl.textContent = "❌ Poor";
          statusEl.style.color = "red";
        }

        const attendanceDates = data.attendanceDates || [];
        const listEl = document.getElementById("attendanceDates");
        listEl.innerHTML = attendanceDates.length
          ? attendanceDates.map(date => `<li>${date}</li>`).join("")
          : "<li>No attendance records found.</li>";

      } else {
        alert("❌ Attendance data not found.");
      }
    } catch (err) {
      console.error("Error loading attendance:", err);
      alert("❌ Could not load attendance.");
    }
  } else {
    window.location.href = "../index.html";
  }
});

import {
  getFirestore,
  collection,
  doc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

async function loadFees(uid) {
  const feesContainer = document.getElementById("feesContainer");
  feesContainer.innerHTML = "";

  try {
    const recordsRef = collection(db, "fees", uid, "records");
    const recordsSnap = await getDocs(recordsRef);

    if (recordsSnap.empty) {
      feesContainer.innerHTML = "<p>ℹ️ No fee records available.</p>";
      return;
    }

    recordsSnap.forEach(doc => {
      const data = doc.data();
      const card = document.createElement("div");
      card.className = "fee-card";

      const statusClass = data.status === "Paid" ? "paid" : "unpaid";

      card.innerHTML = `
        <h4>📅 ${data.month}</h4>
        <p>💵 Amount: ₹${data.amount}</p>
        <span class="fee-status ${statusClass}">${data.status}</span><br/>
        ${
          data.receiptUrl
            ? `<a href="${data.receiptUrl}" target="_blank" class="download-btn">📥 Download Receipt</a>`
            : ""
        }
      `;

      feesContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading fee data:", err);
    feesContainer.innerHTML = "<p>❌ Failed to load fee records.</p>";
  }
}

// Load on auth
onAuthStateChanged(auth, (user) => {
  if (user) {
    loadFees(user.uid);
  } else {
    window.location.href = "../index.html";
  }
});

import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🟢 Realtime Message Listener
function listenForMessages(uid) {
  const messagesRef = collection(db, "communication", uid, "messages");
  const q = query(messagesRef, orderBy("timestamp", "asc"));

  onSnapshot(q, (snapshot) => {
    const chatBox = document.getElementById("chatBox");
    chatBox.innerHTML = "";

    snapshot.forEach((doc) => {
      const data = doc.data();
      const messageDiv = document.createElement("div");
      messageDiv.className = `message ${data.sender.toLowerCase()}`;
      messageDiv.textContent = `${data.sender}: ${data.text}`;
      chatBox.appendChild(messageDiv);
    });
  });
}

// 🟢 Sending a new message
async function sendMessage(uid, sender, text) {
  if (!text.trim()) return;

  try {
    await addDoc(collection(db, "communication", uid, "messages"), {
      text,
      sender,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error("❌ Failed to send message:", err);
    alert("Message failed to send.");
  }
}

