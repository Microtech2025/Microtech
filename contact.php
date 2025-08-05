<?php
// You can add PHP session/auth logic here if needed
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Contact Us</title>
  <link rel="stylesheet" href="contact.css" />
</head>
<body>

<!-- Contact Section -->
<section class="contact-section" id="contact">
  <div class="contact-container">
    <!-- Info Cards -->
    <div class="contact-info">
      <h2 class="section-title">Contact Us</h2>
      <p class="section-subtitle">Reach out to us through the following details or send us a message using the form.</p>
      <div class="contact-cards">
        <div class="contact-card">
          <h3>Main Contact</h3>
          <p><strong>Phone:</strong> <a href="tel:+919447332451">9447332451</a></p>
          <p><strong>Email:</strong> <a href="mailto:jenjkp269@gmail.com">jenjkp269@gmail.com</a></p>
        </div>
        <div class="contact-card"><h3>Gama Abacus</h3><p><strong>Email:</strong> <a href="mailto:gamaabacusperambra@gmail.com">gamaabacusperambra@gmail.com</a></p><p><strong>Phone:</strong> 9447332451</p></div>
        <div class="contact-card"><h3>LBS</h3><p><strong>Email:</strong> <a href="mailto:lbsperambra1109@gmail.com">lbsperambra1109@gmail.com</a></p></div>
        <div class="contact-card"><h3>CAPT</h3><p><strong>Email:</strong> <a href="mailto:captperambra@gmail.com">captperambra@gmail.com</a></p></div>
        <div class="contact-card"><h3>Micro Computer</h3><p><strong>Phone:</strong> 9447332451</p></div>
      </div>
    </div>

    <!-- Contact Form -->
    <form class="contact-form" id="contactForm">
      <input type="text" name="name" placeholder="Your Name" required />
      <input type="email" name="email" placeholder="Your Email" required />
      <input type="tel" name="phone" placeholder="Your Phone Number" />
      <textarea name="message" rows="5" placeholder="Your Message" required></textarea>
      <input type="hidden" name="time" />
      <button type="submit" class="btn-submit">Send Message</button>
    </form>
  </div>
</section>

<!-- Loading Overlay -->
<div id="loadingOverlay">
  <div class="loader"></div>
</div>

<!-- Scripts -->
<script src="https://cdn.emailjs.com/dist/email.min.js"></script>
<script>
  // Initialize EmailJS
  (function () {
    emailjs.init("1x6VQjc--qgidiSdN"); // Use your own EmailJS public key
  })();

  // Handle form submission
  document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();
    document.getElementById("loadingOverlay").style.display = "flex"; // Show loader

    emailjs.sendForm("service_abc123", "template_s7mz7ms", this)
      .then(() => {
        document.getElementById("loadingOverlay").style.display = "none";
        window.location.href = "thankyou.php";
      })
      .catch((error) => {
        document.getElementById("loadingOverlay").style.display = "none";
        alert("Failed to send message. Please try again.");
        console.error(error);
      });

    this.reset();
  });
</script>
<script src="contact.js"></script>
</body>
</html>
