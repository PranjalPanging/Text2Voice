document.addEventListener("DOMContentLoaded", () => {
  const synth = window.speechSynthesis;
  const voiceSelect = document.getElementById("voice");
  const speakBtn = document.getElementById("speakBtn");
  const previewBtn = document.getElementById("previewBtn");
  const stopBtn = document.getElementById("stopBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const textInput = document.getElementById("text");
  const rateInput = document.getElementById("rate");
  const pitchInput = document.getElementById("pitch");
  const rateVal = document.getElementById("rateVal");
  const pitchVal = document.getElementById("pitchVal");
  const status = document.getElementById("status");
  const audioPlayer = document.getElementById("audio");
  const filenameInput = document.getElementById("filename");

  const presets = {
    normal: { rate: 1.0, pitch: 1.0 },
    male: { rate: 0.9, pitch: 0.8 },
    female: { rate: 1.2, pitch: 1.4 },
    robot: { rate: 1.4, pitch: 1.6 },
    calm: { rate: 0.8, pitch: 0.9 },
  };

  function updateLabels() {
    rateVal.textContent = parseFloat(rateInput.value).toFixed(1);
    pitchVal.textContent = parseFloat(pitchInput.value).toFixed(1);
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

  function speakText(text, rate, pitch, presetName) {
    if (!text) return alert("Please enter some text!");
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();

    utter.voice =
      voices.find(
        (v) => v.lang.startsWith("en") && v.name.includes("Female")
      ) ||
      voices.find((v) => v.lang.startsWith("en")) ||
      voices[0];

    utter.rate = rate;
    utter.pitch = pitch;

    status.textContent = `Speaking (${presetName})...`;

    utter.onend = () => (status.textContent = "✅ Done speaking!");
    utter.onerror = () => (status.textContent = "❌ Error during speech.");

    synth.speak(utter);
  }

  speakBtn.addEventListener("click", () => {
    const text = textInput.value.trim();
    const presetName = voiceSelect.value;
    const rate = parseFloat(rateInput.value);
    const pitch = parseFloat(pitchInput.value);
    speakText(text, rate, pitch, presetName);
  });

  previewBtn.addEventListener("click", () => {
    const presetName = voiceSelect.value;
    const preset = presets[presetName];
    speakText(
      `This is a preview of the ${presetName} voice.`,
      preset.rate,
      preset.pitch,
      presetName
    );
  });

  stopBtn.addEventListener("click", () => {
    synth.cancel();
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    status.textContent = "⏹️ Stopped.";
  });

  downloadBtn.addEventListener("click", async () => {
    const text = textInput.value.trim();
    if (!text) return alert("Enter some text to download!");
    const preset = voiceSelect.value;
    const fileName = filenameInput.value.trim() || "speech";

    status.textContent = "💾 Generating audio...";

    try {
      const res = await fetch("https://text2voice-ndt7.onrender.com/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          lang: "en",
          voice: preset,
          filename: fileName,
        }),
      });
      if (!res.ok) throw new Error("Server error");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      status.textContent = `✅ Audio downloaded as ${fileName}.mp3`;
    } catch (err) {
      console.error(err);
      status.textContent = "❌ Error generating audio.";
    }
  });

  updateLabels();
});
