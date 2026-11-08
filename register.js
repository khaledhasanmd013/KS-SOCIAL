
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registerForm");
  const message = document.getElementById("registerMessage");

  if (!form || !window.ksSupabase) {
    console.error("Registration setup not found.");
    return;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const username = document.getElementById("username").value.trim();

    message.textContent = "অ্যাকাউন্ট তৈরি হচ্ছে...";

    try {
      const { data, error } =
        await window.ksSupabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              username: username
            }
          }
        });

      if (error) throw error;

      message.textContent =
        "Registration সফল! Email খুলে verification সম্পন্ন করো।";

    } catch (error) {
      message.textContent = "সমস্যা: " + error.message;
    }
  });
});
