import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5pgNOjCXdkopJW_mtqTpnaa-8MyUZzHc",
  authDomain: "microtech-88235.firebaseapp.com",
  databaseURL: "https://microtech-88235-default-rtdb.firebaseio.com",
  projectId: "microtech-88235",
  storageBucket: "microtech-88235.appspot.com",
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

// Export for use in other modules
export { app, db, analytics, storage, auth };
