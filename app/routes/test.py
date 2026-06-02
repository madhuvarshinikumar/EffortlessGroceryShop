import os
import google.generativeai as genai
from dotenv import load_dotenv

print("Starting...")

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print("API Key Found:", bool(api_key))

genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-2.5-flash")

response = model.generate_content(
    "Give me a recipe using rice and milk"
)

print("Response received")
print(response.text)