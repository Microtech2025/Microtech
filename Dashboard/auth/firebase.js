// Firebase initialization
// Replace with your own Firebase config or inject via environment variables if bundling

export const firebaseConfig = {
  apiKey: window.ENV?.FIREBASE_API_KEY || "",
  authDomain: window.ENV?.FIREBASE_AUTH_DOMAIN || "",
  projectId: window.ENV?.FIREBASE_PROJECT_ID || "",
  storageBucket: window.ENV?.FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: window.ENV?.FIREBASE_MESSAGING_SENDER_ID || "",
  appId: window.ENV?.FIREBASE_APP_ID || "",
  measurementId: window.ENV?.FIREBASE_MEASUREMENT_ID || ""
};

// Load Firebase SDK via CDN in HTML pages before this script
// global firebase is expected

let app;
let auth;
let db;
let storage;

export function initFirebase() {
  if (!firebase?.apps?.length) {
    app = firebase.initializeApp(firebaseConfig);
  } else {
    app = firebase.app();
  }
  auth = firebase.auth();
  db = firebase.firestore();
  storage = firebase.storage();
  return { app, auth, db, storage };
}

export function getFirebase() {
  if (!app) return initFirebase();
  return { app, auth, db, storage };
}