from flask import Flask, request, send_file, render_template, jsonify
from gtts import gTTS
from pydub import AudioSegment
import os
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

if os.path.exists("ffmpeg/bin/ffmpeg.exe"):
    AudioSegment.converter = os.path.abspath("ffmpeg/bin/ffmpeg.exe")
    AudioSegment.ffmpeg = os.path.abspath("ffmpeg/bin/ffmpeg.exe")
    AudioSegment.ffprobe = os.path.abspath("ffmpeg/bin/ffprobe.exe")

VOICE_PRESETS = {
    "normal": {"speed": 1.0, "pitch": 0},
    "male": {"speed": 0.9, "pitch": -2},
    "female": {"speed": 1.2, "pitch": 3},
    "robot": {"speed": 1.4, "pitch": 5},
    "calm": {"speed": 0.8, "pitch": -1},
}

def change_pitch_and_speed(sound, semitones=0, speed=1.0):
    """Adjust pitch (in semitones) and playback speed."""
    new_sample_rate = int(sound.frame_rate * (2.0 ** (semitones / 12.0)))
    pitched_sound = sound._spawn(sound.raw_data, overrides={"frame_rate": new_sample_rate})

    if speed != 1.0:
        pitched_sound = pitched_sound.speedup(playback_speed=speed, chunk_size=150, crossfade=25)

    return pitched_sound.set_frame_rate(44100)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/speak', methods=['POST'])
def speak():
    """Generate speech audio, apply selected voice preset, and allow download with user-defined filename."""
    data = request.json
    text = data.get('text', '').strip()
    lang = data.get('lang', 'en')
    preset = data.get('voice', 'normal')
    filename = data.get('filename', 'audio').strip() or 'audio'  # default name

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    if preset not in VOICE_PRESETS:
        preset = 'normal'

    try:
        tts = gTTS(text=text, lang=lang)
        tts_fp = io.BytesIO()
        tts.save(tts_fp)
        tts_fp.seek(0)
        sound = AudioSegment.from_file(tts_fp, format="mp3")

        style = VOICE_PRESETS[preset]
        sound = change_pitch_and_speed(sound, semitones=style["pitch"], speed=style["speed"])

        mp3_fp = io.BytesIO()
        sound.export(mp3_fp, format="mp3")
        mp3_fp.seek(0)

        return send_file(
        mp3_fp,
        mimetype="audio/mpeg",
        as_attachment=True,
        download_name=f"{filename}.mp3"
)


    except Exception as e:
        return jsonify({'error': str(e)}), 500

    if __name__ == '__main__':
        port = int(os.environ.get("PORT", 10000))
        app.run(host="0.0.0.0", port=port, debug=True)
