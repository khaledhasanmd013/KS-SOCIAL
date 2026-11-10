console.log("Supabase library:", window.supabase);
console.log("Supabase client:", window.ksSupabase);

const mediaFile = document.getElementById("mediaFile");
const preview = document.getElementById("preview");
const status = document.getElementById("status");

const MB = 1024 * 1024;

mediaFile.addEventListener("change", async function () {
  const file = mediaFile.files[0];

  preview.innerHTML = "";

  if (!file) return;

  // ফাইলের ধরন অনুযায়ী সীমা
  let maxSize = 50 * MB;
  let fileType = "ডকুমেন্ট";

  if (file.type.startsWith("image/")) {
    maxSize = 20 * MB;
    fileType = "ছবি";
  } else if (file.type.startsWith("video/")) {
    maxSize = 50 * MB;
    fileType = "ভিডিও";
  } else if (file.type.startsWith("audio/")) {
    maxSize = 50 * MB;
    fileType = "অডিও";
  }

  // ফাইল সাইজ পরীক্ষা
  if (file.size > maxSize) {
    status.textContent =
      fileType + " ফাইলের সর্বোচ্চ সীমা অতিক্রম করেছে।";

    mediaFile.value = "";
    return;
  }

  // ফাইল প্রিভিউ
  const url = URL.createObjectURL(file);

  if (file.type.startsWith("image/")) {
    const img = document.createElement("img");
    img.src = url;
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
    preview.textContent =
      "নির্বাচিত ফাইল: " + file.name;
  }

  status.textContent = "আপলোডের প্রস্তুতি নিচ্ছে...";

  // Supabase সংযোগ
  const supabase = window.ksSupabase;

  if (!supabase) {
    status.textContent =
      "Supabase সংযোগ পাওয়া যায়নি।";
    return;
  }

  try {
    // Login পরীক্ষা
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      status.textContent =
        "ফাইল আপলোড করতে আগে Login করুন।";
      return;
    }

    // ফাইলের নিরাপদ নাম
    const safeName = file.name.replace(
      /[^a-zA-Z0-9._-]/g,
      "_"
    );

    const filePath =
      `${user.id}/${Date.now()}_${safeName}`;

    status.textContent = "ফাইল আপলোড হচ্ছে...";

    // Supabase Storage Upload
    const { error } = await supabase.storage
      .from("ks-social-media")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false
      });

    if (error) {
      status.textContent =
        "আপলোড ব্যর্থ: " + error.message;
      return;
    }

    status.textContent =
      "ফাইল সফলভাবে আপলোড হয়েছে!";

  } catch (error) {
    status.textContent =
      "সমস্যা হয়েছে: " + error.message;
  }
});
