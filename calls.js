
const KSCall = {
  localStream: null,
  peerConnection: null,

  async startAudio() {
    try {
      this.localStream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false
        });

      console.log("Audio permission granted.");
      return true;
    } catch (error) {
      console.error("Audio access error:", error);
      alert("মাইক্রোফোন ব্যবহারের অনুমতি পাওয়া যায়নি।");
      return false;
    }
  },

  async startVideo() {
    try {
      this.localStream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true
        });

      console.log("Camera and microphone permission granted.");
      return true;
    } catch (error) {
      console.error("Video access error:", error);
      alert("ক্যামেরা বা মাইক্রোফোন ব্যবহারের অনুমতি পাওয়া যায়নি।");
      return false;
    }
  },

  stopCall() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    console.log("Call stopped.");
  }
};

window.KSCall = KSCall;
