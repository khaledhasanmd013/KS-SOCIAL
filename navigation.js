
document.addEventListener("DOMContentLoaded", function () {
  const nav = document.querySelector("nav");

  if (!nav) return;

  nav.innerHTML = `
    <a href="index.html">Home</a>
    <a href="dashboard.html">Dashboard</a>
    <a href="profile.html">Profile</a>
    <a href="friends.html">Friends</a>
    <a href="messages.html">Messages</a>
    <a href="members.html">Members</a>
    <a href="groups.html">Groups</a>
    <a href="events.html">Events</a>
    <a href="search.html">Search</a>
    <a href="notifications.html">Notifications</a>
    <a href="settings.html">Settings</a>
    <a href="security.html">Security</a>
    <a href="privacy.html">Privacy</a>
    <a href="meeting.html">Meetings</a>
    <a href="updates.html">Updates</a>
    <a href="support.html">Support</a>
    <a href="contact.html">Contact</a>
  `;

  nav.style.cssText = `
    background: white;
    padding: 15px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 14px;
    box-shadow: 0 2px 8px #0001;
  `;

  nav.querySelectorAll("a").forEach(function (link) {
    link.style.cssText = `
      color: #1769e0;
      text-decoration: none;
      font-weight: bold;
    `;
  });
});
