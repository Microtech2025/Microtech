const loader = document.getElementById("loaderOverlay");

  ({
  {
    {
 // Show loader
  loader.style.display = "flex";
  status.innerText = "";

  const reader = new FileReader();
  reader.readAsDataURL(photoFile);


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
