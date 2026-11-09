
document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("mediaFile");
  const preview = document.getElementById("preview");
  const status = document.getElementById("status");

  if (!fileInput || !preview || !status) {
    console.warn("K.S SOCIAL media elements not found.");
    return;
  }

  let currentPreviewUrl = null;

  fileInput.addEventListener("change", function () {
    const file = fileInput.files[0];

    preview.innerHTML = "";

    if (currentPreviewUrl) {
      URL.revokeObjectURL(currentPreviewUrl);
      currentPreviewUrl = null;
    }

    if (!file) {
      status.textContent = "কোনো ফাইল নির্বাচন করা হয়নি।";
      return;
    }

    const allowedExtensions = [
      "pdf", "doc", "docx", "xls", "xlsx", "txt"
    ];

    const extension = file.name.split(".").pop().toLowerCase();

    const validType =
      file.type.startsWith("image/") ||
      file.type.startsWith("video/") ||
      file.type.startsWith("audio/") ||
      allowedExtensions.includes(extension);

    if (!validType) {
      status.textContent = "এই ফাইলের ধরন সমর্থিত নয়।";
      fileInput.value = "";
      return;
    }

    const maxSize = 20 * 1024 * 1024;

    if (file.size > maxSize) {
      status.textContent = "ফাইলের আকার ২০ MB-এর বেশি হতে পারবে না।";
      fileInput.value = "";
      return;
    }

    currentPreviewUrl = URL.createObjectURL(file);

    if (file.type.startsWith("image/")) {
      const image = document.createElement("img");
      image.src = currentPreviewUrl;
      image.alt = "Selected image";
      image.style.maxWidth = "100%";
      preview.appendChild(image);

    } else if (file.type.startsWith("video/")) {
      const video = document.createElement("video");
      video.src = currentPreviewUrl;
      video.controls = true;
      video.style.maxWidth = "100%";
      preview.appendChild(video);

    } else if (file.type.startsWith("audio/")) {
      const audio = document.createElement("audio");
      audio.src = currentPreviewUrl;
      audio.controls = true;
      preview.appendChild(audio);

    } else {
      const documentInfo = document.createElement("p");
      documentInfo.textContent = "নির্বাচিত ডকুমেন্ট: " + file.name;
      preview.appendChild(documentInfo);
    }

    status.textContent =
      "ফাইল নির্বাচন সফল হয়েছে। এখনো সার্ভারে আপলোড করা হয়নি।";
  });
});
