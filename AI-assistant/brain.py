import os
import base64
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

TEXT_MODEL = "llama-3.1-8b-instant"
VISION_MODEL = "llama-3.2-11b-vision-preview"

# ---------------- MEMORY STORAGE ----------------
conversation_history = []


# ---------------- IMAGE ENCODING ----------------
def encode_image(image_path):
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


# ---------------- CHAT (TEXT + MEMORY) ----------------
def chat_with_ai(query):
    # add user message to memory
    conversation_history.append({
        "role": "user",
        "content": query
    })

    response = client.chat.completions.create(
        model=TEXT_MODEL,
        messages=conversation_history
    )

    reply = response.choices[0].message.content

    # store assistant response
    conversation_history.append({
        "role": "assistant",
        "content": reply
    })

    return reply


# ---------------- CHAT WITH IMAGE (NO MEMORY YET FOR IMAGE) ----------------
def chat_with_image(query, image_path):
    encoded = encode_image(image_path)

    messages = [{
        "role": "user",
        "content": [
            {"type": "text", "text": query},
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{encoded}"
                }
            }
        ]
    }]

    response = client.chat.completions.create(
        model=VISION_MODEL,
        messages=messages
    )

    return response.choices[0].message.content


# ---------------- OPTIONAL: RESET CHAT MEMORY ----------------
def reset_memory():
    conversation_history.clear()
    return "Memory cleared"