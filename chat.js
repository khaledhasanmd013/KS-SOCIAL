document.addEventListener("DOMContentLoaded", function () {
  const messageInput = document.getElementById("messageInput");
  const sendButton = document.getElementById("sendMessage");
  const chatMessages = document.getElementById("chatMessages");
  const audioInput = document.getElementById("audioInput");
  const status = document.getElementById("chatStatus");

  if (!messageInput || !sendButton || !chatMessages) {
    console.log("K.S SOCIAL chat interface is not connected yet.");
    return;
  }

  function sendMessage() {
    const message = messageInput.value.trim();

    if (!message) {
      status && (status.textContent = "একটি মেসেজ লিখুন।");
      return;
    }

    const item = document.createElement("p");
    item.textContent = message;
    chatMessages.appendChild(item);

    messageInput.value = "";

    if (status) {
      status.textContent =
        "মেসেজটি শুধু এই পেজে দেখানো হয়েছে; এখনো সার্ভারে পাঠানো হয়নি।";
    }
  }

  sendButton.addEventListener("click", sendMessage);

  messageInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  });

  if (audioInput) {
    audioInput.addEventListener("change", function () {
      const file = audioInput.files[0];

      if (!file) return;

      if (!file.type.startsWith("audio/")) {
        status && (status.textContent = "শুধু অডিও ফাইল নির্বাচন করুন।");
        audioInput.value = "";
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        status && (status.textContent = "অডিও ফাইল ২০ MB-এর মধ্যে রাখুন।");
        audioInput.value = "";
        return;
      }

      const item = document.createElement("p");
      item.textContent = "নির্বাচিত অডিও: " + file.name;
      chatMessages.appendChild(item);

      status && (status.textContent =
        "অডিও নির্বাচন হয়েছে; এখনো পাঠানো হয়নি।");
    });
  }
});

