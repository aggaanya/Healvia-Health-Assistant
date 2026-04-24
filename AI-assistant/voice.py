import os
import logging
import speech_recognition as sr
from pydub import AudioSegment
from io import BytesIO
from groq import Groq

logging.basicConfig(level=logging.INFO)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def record_audio(file_path):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(base_dir, file_path)

    r = sr.Recognizer()

    with sr.Microphone() as source:
        r.adjust_for_ambient_noise(source, duration=1)
        audio_data = r.listen(source)

    wav_data = audio_data.get_wav_data()
    audio_segment = AudioSegment.from_file(BytesIO(wav_data), format="wav")
    audio_segment.export(file_path, format="mp3")

    return file_path


def transcribe_audio(audio_filepath):
    with open(audio_filepath, "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            model="whisper-large-v3-turbo",
            file=audio_file,
            language="en"
        )

    return transcription.text