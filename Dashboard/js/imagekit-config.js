// ImageKit Configuration
const imagekit = new ImageKit({
  publicKey: "public_GEHNV7hCW4LCDuXu+ctNKt98oG8=",
  urlEndpoint: "https://ik.imagekit.io/microtechcenter",
  authenticationEndpoint: "https://microtechcenter.in/auth.html" // Update to your actual server endpoint
});

/**
 * Upload image to ImageKit
 * @param {File} file - The image file to upload
 * @param {String} studentId - Unique ID for naming the file
 * @returns {Promise<Object>} - Uploaded file details (URL, name, size, etc.)
 */
function uploadPassportPhoto(file, studentId) {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject("No file selected.");
    }

    // Construct a clean filename
    const fileName = `${studentId || "student"}_${Date.now()}.jpg`;

    imagekit.upload(
      {
        file: file,
        fileName: fileName,
        folder: "/students/photos", // Store inside organized folder
        tags: ["passport-photo", studentId]
      },
      (err, result) => {
        if (err) {
          console.error("ImageKit Upload Error:", err);
          reject(err);
        } else {
          console.log("ImageKit Upload Success:", result);
          resolve(result); // Returns URL and other data
        }
      }
    );
  });
}

export { uploadPassportPhoto };
