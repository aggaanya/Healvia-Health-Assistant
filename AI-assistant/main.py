import os
from flask import Flask, request, jsonify
from voice import record_audio, transcribe_audio

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "AI assistant running"})

@app.route("/voice", methods=["GET"])
def voice_to_text():
    try:
        path = record_audio("temp_audio.mp3")

        if not path:
            return jsonify({"error": "Recording failed"}), 500

        text = transcribe_audio(path)

        return jsonify({
            "transcription": text
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/transcribe", methods=["POST"])
def transcribe_upload():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files["file"]

        os.makedirs("uploads", exist_ok=True)
        file_path = os.path.join("uploads", file.filename)
        file.save(file_path)

        text = transcribe_audio(file_path)

        return jsonify({
            "transcription": text
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
