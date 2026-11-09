
const mediaFile = document.getElementById("mediaFile");
const preview = document.getElementById("preview");
const status = document.getElementById("status");

mediaFile.addEventListener("change", function () {
  const file = mediaFile.files[0];

  preview.innerHTML = "";

  if (!file) {
    status.textContent = "কোনো ফাইল নির্বাচন করা হয়নি।";
    return;
  }

  if (file.size > 20 * 1024 * 1024) {
    status.textContent = "ফাইলের আকার ২০ MB-এর বেশি হতে পারবে না।";
    mediaFile.value = "";
    return;
  }

  const url = URL.createObjectURL(file);

  if (file.type.startsWith("image/")) {
    const img = document.createElement("img");
    img.src = url;
    img.alt = "Image Preview";
    preview.appendChild(img);

  } else if (file.type.startsWith("video/")) {
    const video = document.createElement("video");
    video.src = url;
    video.controls = true;
    preview.appendChild(video);

  } else if (file.type.startsWith("audio/")) {
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    preview.appendChild(audio);

  } else {
    preview.textContent = "নির্বাচিত ফাইল: " + file.name;
  }

  status.textContent =
    "ফাইলের প্রিভিউ প্রস্তুত। এখনো সার্ভারে আপলোড হয়নি।";
});

