// Toggle nav links on small screens
function toggleMenu() {
  const nav = document.getElementById('navLinks');
  nav.classList.toggle('show');
}

// Toggle profile dropdown menu
function toggleProfile() {
  const menu = document.getElementById('profileMenu');
  menu.style.display = (menu.style.display === 'flex') ? 'none' : 'flex';
  menu.style.flexDirection = 'column';
}

// Close profile dropdown if clicked outside
document.addEventListener('click', function (e) {
  const profile = document.querySelector('.profile-dropdown');
  const menu = document.getElementById('profileMenu');
  if (!profile.contains(e.target)) {
    menu.style.display = 'none';
  }
});

// ✅ Logout function: Redirect to index.html
function logout() {
  // Optional: Add session clearing here if needed
  window.location.href = '../index.html';
}

function navigate(section) {
  alert("Navigating to: " + section);
  // Replace with real navigation logic as needed
}


document.addEventListener("DOMContentLoaded", () => {
  const upcomingClasses = [
    { name: "Physics - 10A", time: "2025-06-01T10:00:00" },
    { name: "Maths - 9B", time: "2025-06-01T12:00:00" },
    { name: "Chemistry - 10A", time: "2025-06-02T09:00:00" },
  ];

  const classList = document.getElementById("classList");

  function updateCountdown(time) {
    const now = new Date();
    const diff = new Date(time) - now;
    if (diff < 0) return "Started";
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    return hrs > 0 ? `${hrs}h ${mins % 60}m` : `${mins}m`;
  }

  upcomingClasses.forEach(cls => {
    const div = document.createElement("div");
    div.className = "class-item";
    div.innerHTML = `<span>${cls.name}</span><span>${updateCountdown(cls.time)}</span>`;
    classList.appendChild(div);
  });
});

