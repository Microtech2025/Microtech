const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  const isLoggedIn = false; // Change to true if logged in

  const profileContainer = document.getElementById('profile-container');
  const profileLabel = document.getElementById('profile-label');
  const profileDropdown = document.getElementById('profile-dropdown');
  const logoutBtn = document.getElementById('logout-btn');

  // Toggle dropdown
  document.getElementById('profile-icon').addEventListener('click', () => {
    if (isLoggedIn) {
      profileDropdown.style.display = profileDropdown.style.display === 'flex' ? 'none' : 'flex';
    } else {
      // Redirect to login
      window.location.href = "auth.php";
    }
  });

  // Handle login/logout display
  window.addEventListener('DOMContentLoaded', () => {
    if (!isLoggedIn) {
      profileLabel.innerText = "Login";
      profileDropdown.style.display = "none";
    } else {
      profileLabel.innerText = "My Account";
      profileDropdown.style.display = "none";
    }
  });

  // Handle logout
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Logic to log out (e.g., clear tokens)
    alert("Logged out!");
    window.location.reload();
  });

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.fade-img');
  let current = 0;

  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 4000); // 4 seconds
});

document.querySelector('.explore-course').addEventListener('click', function(e) {
  e.preventDefault();
  document.querySelector('#courses').scrollIntoView({ behavior: 'smooth' });
});



// Placeholder for future interactive functionality
console.log("Hero section loaded!");

// Placeholder for scroll animation or dynamic counters
console.log("About Micro Tech Center loaded");

// Optional: scroll effect or interactive features
console.log("Micro Computers section loaded.");

// Optional: You can later animate cards on scroll
console.log("Courses Offered section loaded.");

// Optional: Add fade-in animation on scroll
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll('.admission-card');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(card => observer.observe(card));
});

// You can expand this for a lightbox or interactive gallery
document.addEventListener('DOMContentLoaded', () => {
  console.log("Gallery section loaded");
});

/*-------------------------------*/
// testimonials.js
let current = 0;
const cards = document.querySelectorAll(".testimonial-card");

function showNextTestimonial() {
  cards[current].classList.remove("active");
  current = (current + 1) % cards.length;
  cards[current].classList.add("active");
}

setInterval(showNextTestimonial, 4000);
