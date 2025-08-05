(function () {
  emailjs.init("1x6VQjc--qgidiSdN"); // Replace with your EmailJS public key
})();

document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Show the loader
  document.getElementById("loadingOverlay").style.display = "flex";
  document.querySelector('input[name="time"]').value = new Date().toLocaleString();

  emailjs.sendForm("service_abc123", "template_s7mz7ms", this)
    .then(function () {
      // Hide loader and redirect
      document.getElementById("loadingOverlay").style.display = "none";
      window.location.href = "thankyou.html";
    }, function (error) {
      // Hide loader and show error
      document.getElementById("loadingOverlay").style.display = "none";
      alert("Failed to send message. Please try again.");
      console.error(error);
    });

  // Reset form
  this.reset();
});
