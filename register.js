
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
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const invite = document.getElementById("invite").value.trim().toUpperCase();
    const password = document.getElementById("password").value;

    if (!name || !phone || !email || !invite || !password) {
      message.textContent = "সব তথ্য পূরণ করো।";
      return;
    }

    if (!/^KS-[A-F0-9]{16}$/.test(invite)) {
      message.textContent = "Invitation Code সঠিক নয়।";
      return;
    }

    if (password.length < 8) {
      message.textContent = "Password কমপক্ষে ৮ অক্ষরের হতে হবে।";
      return;
    }

    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    message.textContent = "Invitation যাচাই হচ্ছে...";

    try {
      const response = await fetch(
        "https://ks-social-api.onrender.com/api/invitations/validate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            code: invite
          })
        }
      );

      const result = await response.json();

      if (!response.ok || !result.valid) {
        throw new Error(
          result.message || result.error || "Invitation Code গ্রহণযোগ্য নয়।"
        );
      }

      message.textContent = "Invitation সঠিক। Signup প্রস্তুত হচ্ছে...";

      const { error } =
        await window.ksSupabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              full_name: name,
              phone: phone,
              invitation_code: invite
            }
          }
        });

      if (error) throw error;

      message.textContent =
        "Signup অনুরোধ পাঠানো হয়েছে। Email verification সম্পন্ন করো।";

    } catch (error) {
      message.textContent = "সমস্যা: " + error.message;
    } finally {
      button.disabled = false;
    }
  });
});

