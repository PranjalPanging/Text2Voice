document.addEventListener("DOMContentLoaded", () => {
  const synth = window.speechSynthesis;

  // --- Selectors ---
  const voiceSelect = document.getElementById("voice");
  const speakBtn = document.getElementById("speakBtn");
  const stopBtn = document.getElementById("stopBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const textInput = document.getElementById("text");
  const rateInput = document.getElementById("rate");
  const pitchInput = document.getElementById("pitch");
  const rateVal = document.getElementById("rateVal");
  const pitchVal = document.getElementById("pitchVal");
  const status = document.getElementById("status");
  const filenameInput = document.getElementById("filename");
  const visualizer = document.getElementById("visualizer");

  const isLocal =
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost";
  const API_URL = isLocal
    ? "/speak"
    : "https://text2voice-ndt7.onrender.com/speak";

  const presets = {
    normal: { rate: 1.0, pitch: 1.0 },
    male: { rate: 0.8, pitch: 0.7 },
    female: { rate: 1.1, pitch: 1.2 },
    robot: { rate: 1.3, pitch: 0.4 },
    calm: { rate: 0.7, pitch: 0.9 },
  };

  function updateLabels() {
    rateVal.textContent = `${parseFloat(rateInput.value).toFixed(1)}x`;
    pitchVal.textContent = `${parseFloat(pitchInput.value).toFixed(1)}x`;
  }

  function toggleVisualizer(show) {
    if (show) {
      visualizer.classList.replace("opacity-0", "opacity-100");
    } else {
      visualizer.classList.replace("opacity-100", "opacity-0");
    }
  }

  voiceSelect.addEventListener("change", () => {
    const selected = presets[voiceSelect.value];
    if (selected) {
      rateInput.value = selected.rate;
      pitchInput.value = selected.pitch;
      updateLabels();
    }
  });

  rateInput.addEventListener("input", updateLabels);
  pitchInput.addEventListener("input", updateLabels);

  speakBtn.addEventListener("click", () => {
    const text = textInput.value.trim();
    if (!text) {
      status.textContent = "⚠️ Please enter text!";
      return;
    }

    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();

    if (voiceSelect.value === "female") {
      utter.voice =
        voices.find(
          (v) => v.name.includes("Female") || v.name.includes("Zira")
        ) || voices[0];
    } else {
      utter.voice =
        voices.find(
          (v) => v.name.includes("Male") || v.name.includes("David")
        ) || voices[0];
    }

    utter.rate = parseFloat(rateInput.value);
    utter.pitch = parseFloat(pitchInput.value);

    utter.onstart = () => {
      status.textContent = "🎙️ Previewing...";
      toggleVisualizer(true);
    };
    utter.onend = () => {
      status.textContent = "✅ Preview done";
      toggleVisualizer(false);
    };

    synth.speak(utter);
  });

  stopBtn.addEventListener("click", () => {
    synth.cancel();
    status.textContent = "⏹️ Stopped";
    toggleVisualizer(false);
  });

  downloadBtn.addEventListener("click", async () => {
    const text = textInput.value.trim();
    if (!text) {
      status.textContent = "⚠️ Nothing to export!";
      return;
    }

    const fileName = filenameInput.value.trim() || "audio";
    status.textContent = "⏳ Processing export...";
    toggleVisualizer(true);

    console.log(`Sending request to: ${API_URL}`);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text,
          lang: "en",
          voice: voiceSelect.value,
          filename: fileName,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Server error");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${fileName}.mp3`;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      status.textContent = `✅ Saved: ${fileName}.mp3`;
    } catch (err) {
      console.error("Export Error:", err);
      status.textContent = `❌ Error: ${err.message}`;
    } finally {
      toggleVisualizer(false);
    }
  });

  updateLabels();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = synth.getVoices;
  }
});
