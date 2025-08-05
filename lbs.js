document.getElementById('admissionForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const status = document.getElementById("status");
  const form = e.target;
  const photoFile = document.getElementById("photo").files[0];

  if (!photoFile) {
    status.innerText = "Please select a photo.";
    return;
  }

  // Convert photo to Base64
  const reader = new FileReader();
  reader.readAsDataURL(photoFile);

  reader.onload = async function () {
    const base64Image = reader.result;

    const formData = new FormData(form);
    formData.append("photoBase64", base64Image);
    formData.delete("photo"); // Remove original file field

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbys1Sw7Ml5FoSFoTpYAKHIW1qWamVWiSiDxlhhHQI25AVBn_UGOCtgjiW4Az_9FQGsR/exec", {
        method: "POST",
        body: formData,
      });

      const text = await response.text();
      if (text.includes("success") || text.includes("Success") || text.includes("submitted")) {
  window.location.href = "thankyou.html";
} else {
  status.innerText = text;
}

    } catch (err) {
      console.error(err);
      status.innerText = "Error submitting form.";
    }
  };
});
