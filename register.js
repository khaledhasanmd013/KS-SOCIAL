
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registerForm");
  const message = document.createElement("p");

  if (!form || !window.ksSupabase) {
    console.error("Registration setup not found.");
    return;
  }

  form.appendChild(message);

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    message.textContent = "অ্যাকাউন্ট তৈরি হচ্ছে...";

    try {
      const { data, error } =
        await window.ksSupabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              full_name: name
            }
          }
        });

      if (error) throw error;

      message.textContent =
        "অ্যাকাউন্ট তৈরির অনুরোধ সফল হয়েছে। Email খুলে verification সম্পন্ন করো।";

    } catch (error) {
      message.textContent = "সমস্যা: " + error.message;
    }
  });
});
