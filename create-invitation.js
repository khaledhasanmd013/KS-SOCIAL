async function createInvitation() {
  const message = document.getElementById("invitationMessage");

  if (!window.ksSupabase) {
    message.textContent = "Supabase connection not found.";
    return;
  }

  const { data: userData, error: userError } =
    await window.ksSupabase.auth.getUser();

  if (userError || !userData.user) {
    message.textContent = "Please login first.";
    return;
  }

  const role = userData.user.app_metadata?.role;

  if (role !== "admin") {
    message.textContent = "Only Admin can create invitations.";
    return;
  }

  const code =
    "KS-" + crypto.randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase();

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const { error } = await window.ksSupabase
    .from("invitations")
    .insert({
      code: code,
      expires_at: expiresAt.toISOString()
    });

  if (error) {
    message.textContent = "Error: " + error.message;
    return;
  }

  message.textContent = "Invitation created: " + code;
}

