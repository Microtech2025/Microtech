  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

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