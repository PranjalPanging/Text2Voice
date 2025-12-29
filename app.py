from flask import Flask, request, send_file, render_template, jsonify
from gtts import gTTS
from pydub import AudioSegment
from flask_cors import CORS
import os
import tempfile
import uuid

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FFMPEG_PATH = os.path.join(BASE_DIR, "ffmpeg", "bin", "ffmpeg.exe")
FFPROBE_PATH = os.path.join(BASE_DIR, "ffmpeg", "bin", "ffprobe.exe")

if os.path.exists(FFMPEG_PATH):
    AudioSegment.converter = FFMPEG_PATH
    AudioSegment.ffprobe = FFPROBE_PATH
    print(f"✅ FFmpeg Linked: {FFMPEG_PATH}")
else:
    print("❌ ERROR: ffmpeg.exe not found in /ffmpeg/bin/")

VOICE_PRESETS = {
    "normal": {"speed": 1.0, "pitch": 0},
    "male": {"speed": 0.9, "pitch": -3},
    "female": {"speed": 1.1, "pitch": 3},
    "robot": {"speed": 1.3, "pitch": 6},
    "calm": {"speed": 0.8, "pitch": -1},
}

def change_pitch_and_speed(sound, semitones=0, speed=1.0):
    new_sample_rate = int(sound.frame_rate * (2.0 ** (semitones / 12.0)))
    pitched_sound = sound._spawn(sound.raw_data, overrides={"frame_rate": new_sample_rate})
    pitched_sound = pitched_sound.set_frame_rate(44100)
    if speed != 1.0:
        pitched_sound = pitched_sound.speedup(playback_speed=speed, chunk_size=150, crossfade=25)
    return pitched_sound

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/docs')
def docs():
    return render_template('docs.html')

@app.route('/speak', methods=['POST'])
def speak():
    print("\n--- NEW REQUEST RECEIVED ---")
    
    unique_id = str(uuid.uuid4())
    temp_in = os.path.join(BASE_DIR, f"input_{unique_id}.mp3")
    temp_out = os.path.join(BASE_DIR, f"output_{unique_id}.mp3")

    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        preset = data.get('voice', 'normal')
        filename = data.get('filename', 'audio').strip() or 'audio'

        if not text:
            return jsonify({'error': 'No text provided'}), 400

        print(f"1. Saving gTTS to {temp_in}")
        tts = gTTS(text=text, lang='en')
        tts.save(temp_in)

        print("2. Loading into Pydub...")
        sound = AudioSegment.from_file(temp_in, format="mp3")

        print("3. Applying voice effects...")
        style = VOICE_PRESETS.get(preset, VOICE_PRESETS['normal'])
        sound = change_pitch_and_speed(sound, semitones=style["pitch"], speed=style["speed"])

        print(f"4. Exporting to {temp_out}")
        sound.export(temp_out, format="mp3")

        return send_file(temp_out, as_attachment=True, download_name=f"{filename}.mp3")

    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)