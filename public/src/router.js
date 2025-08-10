import { auth, onAuthStateChanged, signOut, getUserRole } from './firebase-init.js';
import { renderToast, toggleSidebar, setActiveNav } from './ui.js';

const contentEl = document.getElementById('content');
const userInfoEl = document.getElementById('userInfo');
const logoutBtn = document.getElementById('logoutBtn');
const sidebarToggle = document.getElementById('sidebarToggle');

sidebarToggle?.addEventListener('click', toggleSidebar);
logoutBtn?.addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = '/login.html';
});

const routes = {
  '/admin-dashboard': { partial: '/partials/admin-dashboard.html', script: '/src/pages/admin-dashboard.js' },
  '/students': { partial: '/partials/students.html', script: '/src/pages/students.js' },
  '/staff': { partial: '/partials/staff.html', script: '/src/pages/staff.js' },
  '/finance': { partial: '/partials/finance.html', script: '/src/pages/finance.js' },
  '/fees': { partial: '/partials/fees.html', script: '/src/pages/fees.js' },
  '/marketing': { partial: '/partials/marketing.html', script: '/src/pages/marketing.js' },
  '/alumni': { partial: '/partials/alumni.html', script: '/src/pages/alumni.js' },
  '/scholarship': { partial: '/partials/scholarship.html', script: '/src/pages/scholarship.js' },
  '/referral': { partial: '/partials/referral.html', script: '/src/pages/referral.js' },
  '/notifications': { partial: '/partials/notifications.html', script: '/src/pages/notifications.js' },
  '/counselor': { partial: '/partials/counselor.html', script: '/src/pages/counselor.js' },
  '/documents': { partial: '/partials/documents.html', script: '/src/pages/documents.js' },
};

async function loadRoute() {
  const hash = window.location.hash.replace('#', '') || '/admin-dashboard';
  const route = routes[hash];
  setActiveNav(hash);
  if (!route) {
    contentEl.innerHTML = '<div class="card">Not Found</div>';
    return;
  }
  // fetch partial
  const res = await fetch(route.partial, { cache: 'no-store' });
  const html = await res.text();
  contentEl.innerHTML = html;
  // load script
  if (route.script) {
    await import(route.script + `?v=${Date.now()}`);
  }
}

window.addEventListener('hashchange', loadRoute);

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = '/login.html';
    return;
  }
  const role = await getUserRole(user.uid);
  userInfoEl.textContent = `${user.email ?? 'User'} • ${role ?? 'Unknown'}`;
  loadRoute();
});