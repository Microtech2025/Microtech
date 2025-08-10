import { auth, onAuthStateChanged } from '/src/firebase-init.js';

// If loaded on login page, redirect to app if already signed-in
if (window.location.pathname.endsWith('/login.html')) {
  onAuthStateChanged(auth, (user) => {
    if (user) window.location.href = '/index.html#/admin-dashboard';
  });
}