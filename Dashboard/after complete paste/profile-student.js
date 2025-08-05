import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAD_3jmeamJ2QyJk2OPi-ucB2DDQSUCPPw",
  authDomain: "microtech-8e188.firebaseapp.com",
  projectId: "microtech-8e188",
  storageBucket: "microtech-8e188.firebasestorage.app",
  messagingSenderId: "401753262680",
  appId: "1:401753262680:web:fb49631cc511f2457e982d",
  measurementId: "G-JHHD1M22CW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Load user details
let currentUserId = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUserId = user.uid;
    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const data = userSnap.data();

        document.getElementById("teacherName").textContent = data.name || "";
        document.getElementById("teacherEmail").textContent = data.email || "";
        document.getElementById("teacherAge").value = data.age || "";
        document.getElementById("teacherNumber").value = data.number || "";
        document.getElementById("teacherWhatsApp").value = data.whatsapp || "";
        document.getElementById("teacherAddress").value = data.address || "";
        document.getElementById("teacherDistrict").value = data.district || "";
        document.getElementById("teacherState").value = data.state || "";
        document.getElementById("teacherCountry").value = data.country || "";
        document.getElementById("teacherZip").value = data.zip || "";
      } else {
        alert("❌ teacher data not found.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("❌ Failed to load profile.");
    }
  } else {
    window.location.href = "../index.html"; // Not logged in
  }
});

// Enable editing
window.enableEdit = () => {
  document.querySelectorAll("input[type='text']").forEach(input => input.disabled = false);
  document.getElementById("saveBtn").disabled = false;
};

// Save profile
window.saveProfile = async () => {
  if (!currentUserId) {
    alert("❌ No user logged in.");
    return;
  }

  const updates = {
    age: document.getElementById("teacherAge").value.trim(),
    number: document.getElementById("teacherNumber").value.trim(),
    whatsapp: document.getElementById("teacherWhatsApp").value.trim(),
    address: document.getElementById("teacherAddress").value.trim(),
    district: document.getElementById("teacherDistrict").value.trim(),
    state: document.getElementById("teacherState").value.trim(),
    country: document.getElementById("teacherCountry").value.trim(),
    zip: document.getElementById("teacherZip").value.trim()
  };

  try {
    await updateDoc(doc(db, "users", currentUserId), updates);
    alert("✅ Profile updated successfully.");
    document.querySelectorAll("input[type='text']").forEach(input => input.disabled = true);
    document.getElementById("saveBtn").disabled = true;
  } catch (error) {
    console.error("Update error:", error);
    alert("❌ Failed to update profile.");
  }
};

// Logout
window.logout = () => {
  signOut(auth)
    .then(() => {
      window.location.href = "../index.html";
    })
    .catch((error) => {
      alert("❌ Error logging out: " + error.message);
    });
};
