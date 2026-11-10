conconsole.log("Supabase library:", window.supabase);
console.log("Supabase client:", window.ksSupabase);
const mediaFile = document.getElementById("mediaFile");
const preview = document.getElementById("preview");
const status = document.getElementById("status");

mediaFile.addEventListener("change", async function () {
  const file = mediaFile.files[0];
  preview.innerHTML = "";

  if (!file) return;

  if (file.size > 20 * 1024 * 1024) {
    status.textContent = "ফাইল ২০ MB-এর বেশি হতে পারবে না।";
    mediaFile.value = "";
    return;
  }

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
    preview.textContent = "নির্বাচিত ফাইল: " + file.name;
  }

  status.textContent = "আপলোডের প্রস্তুতি নিচ্ছে...";

  const supabase = window.ksSupabase;

  if (!supabase) {
    status.textContent = "Supabase সংযোগ পাওয়া যায়নি।";
    return;
  }

  const { data: { user }, error: authError } =
    await supabase.auth.getUser();

  if (authError || !user) {
    status.textContent = "ফাইল আপলোড করতে আগে Login করুন।";
    return;
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `${user.id}/${Date.now()}_${safeName}`;

  status.textContent = "ফাইল আপলোড হচ্ছে...";

  const { data, error } = await supabase.storage
    .from("ks-social-media")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false
    });

  if (error) {
    status.textContent = "আপলোড ব্যর্থ: " + error.message;
    return;
  }

  status.textContent = "ফাইল সফলভাবে আপলোড হয়েছে!";
});

