import google.generativeai as genai
import os

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    # Try to load from config if env var not set directly in shell
    try:
        from app.core.config import settings
        api_key = settings.GEMINI_API_KEY
    except:
        print("Could not load API key")
        exit(1)

genai.configure(api_key=api_key)

print("Listing available models...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
except Exception as e:
    print(f"Error: {e}")
