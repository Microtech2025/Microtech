// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD5pgNOjCXdkopJW_mtqTpnaa-8MyUZzHc",
  authDomain: "microtech-88235.firebaseapp.com",
  projectId: "microtech-88235",
  storageBucket: "microtech-88235.firebasestorage.app",
  messagingSenderId: "177325108755",
  appId: "1:177325108755:web:37d5a44e9a721a501359e6",
  measurementId: "G-0NXTJF6L49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

console.log('Firebase initialized successfully');
console.log('Firebase app:', app);
console.log('Firebase db:', db);
console.log('Firebase config:', firebaseConfig);
console.log('Firebase initialization timestamp:', new Date().toISOString());

// Export for use in other modules
export { db, storage, auth, app };