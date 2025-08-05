<?php
// You can add PHP session/auth logic here if needed
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>teacher Admission Form</title>
  <link rel="stylesheet" href="capt.css" />
</head>
<body>
  <div class="form-container">
    <h2>CAPT Admission Form</h2>
    <form id="admissionForm">
      <label>NAME OF THE teacher</label>
      <input type="text" name="teacherName" required />

      <label>PRESENT ADDRESS</label>
      <textarea name="presentAddress" required></textarea>

      <label>DATE OF BIRTH</label>
      <input type="date" name="dob" required />

      <label>AGE</label>
      <input type="number" name="age" required />

      <label>SEX</label>
      <select name="sex" required>
        <option value="">Select</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>

      <label>NATIONALITY</label>
      <input type="text" name="nationality" required />

      <label>MOBILE NO.</label>
      <input type="tel" name="mobile" required pattern="[0-9]{10}" />

      <label>EMAIL</label>
      <input type="email" name="email" required />

      <label>EDUCATIONAL QUALIFICATIONS</label>
      <textarea name="qualifications" required></textarea>

      <label>NAME OF FATHER/MOTHER/GUARDIAN</label>
      <input type="text" name="parentName" required />

      <label>PERMANENT ADDRESS</label>
      <textarea name="permanentAddress" required></textarea>

      <label>PARENT OCCUPATION</label>
      <input type="text" name="occupation" required />

      <label>PARENT CONTACT NO.</label>
      <input type="tel" name="parentContact" required pattern="[0-9]{10}" />

      <label>NAME OF COURSE ADMITTED</label>
      <input type="text" name="course" required />

      <label>A PASSPORT SIZE PHOTO</label>
      <input type="file" name="photo" id="photo" accept="image/*" required />

      <button type="submit">Submit</button>
      <p id="status"></p>
    </form>
  </div>
  <script src="capt.js"></script>
  <!-- Loader (Initially Hidden) -->
<div id="loaderOverlay" class="loader-overlay" style="display: none;">
  <span class="loader"></span>
</div>

</body>
</html>
