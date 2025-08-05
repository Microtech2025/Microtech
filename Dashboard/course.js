import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAD_3jmeamJ2QyJk2OPi-ucB2DDQSUCPPw",
  authDomain: "microtech-8e188.firebaseapp.com",
  projectId: "microtech-8e188",
  storageBucket: "microtech-8e188.appspot.com",
  messagingSenderId: "401753262680",
  appId: "1:401753262680:web:fb49631cc511f2457e982d",
  measurementId: "G-JHHD1M22CW",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const courseContainer = document.getElementById("courseContainer");

async function loadCourses() {
  const collections = ["lbs", "capt", "gama", "other"];

  for (const provider of collections) {
    const snap = await getDocs(collection(db, provider));
    snap.forEach((doc) => {
      const course = doc.data();
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <p class="heading">${course.name || "Untitled Course"}</p>
        <p><strong>Provider:</strong> ${provider.toUpperCase()}</p>
        <p><strong>Duration:</strong> ${course.duration || "-"}</p>
        <p><strong>Eligibility:</strong> ${course.eligibility || "-"}</p>
        <p><strong>Fees:</strong> ₹${course.fees || "N/A"}</p>
        <p>${course.description || ""}</p>
      `;
      courseContainer.appendChild(card);
    });
  }
}

loadCourses();

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('course-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalProvider = document.getElementById('modal-provider');
  const modalDesc = document.getElementById('modal-desc');
  const modalDuration = document.getElementById('modal-duration');
  const modalEligibility = document.getElementById('modal-eligibility');
  const modalFees = document.getElementById('modal-fees');
  const modalImage = document.getElementById('modal-image');
  const closeModal = document.querySelector('.close-modal');

  document.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('click', function() {
      modalTitle.textContent = card.dataset.title;
      modalProvider.textContent = card.dataset.provider;
      modalDesc.textContent = card.dataset.desc;
      modalDuration.textContent = card.dataset.duration;
      modalEligibility.textContent = card.dataset.eligibility;
      modalFees.textContent = card.dataset.fees;
      modalImage.src = card.dataset.img || card.querySelector('img')?.src || '';
      modalImage.alt = card.dataset.title || 'Course Image';
      modal.classList.add('show');
    });
  });

  closeModal.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('show');
    }
  });
});
