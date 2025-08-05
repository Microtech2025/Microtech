document.getElementById('admissionForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const status = document.getElementById("status");
  const form = e.target;
  const photoFile = document.getElementById("photo").files[0];
  const loader = document.getElementById("loaderOverlay");

  if (!photoFile) {
    status.innerText = "Please select a photo.";
    return;
  }

  // Show loader
  loader.style.display = "flex";
  status.innerText = "";

  const reader = new FileReader();
  reader.readAsDataURL(photoFile);

  reader.onload = async function () {
    const base64Image = reader.result;

    const formData = new FormData(form);
    formData.append("photoBase64", base64Image);
    formData.delete("photo");

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbxpRjEIswPLHBK9GmUyYNHMANPZ2yEAP6DZjqQR6jNW7i5aU_JMvkhivOUkNj6b2ANC/exec", {
        method: "POST",
        body: formData,
      });

      const text = await response.text();

      // Hide loader
      loader.style.display = "none";

      if (text.includes("success") || text.includes("Success") || text.includes("submitted")) {
        window.location.href = "thankyou.html";
      } else {
        status.innerText = text;
      }

    } catch (err) {
      console.error(err);
      loader.style.display = "none";
      status.innerText = "Error submitting form.";
    }
  };
});
