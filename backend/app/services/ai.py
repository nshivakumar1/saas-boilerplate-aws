import google.generativeai as genai
from app.core.config import settings

class GeminiService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            print("Configuring Gemini with model: gemini-flash-latest")
            self.model = genai.GenerativeModel('gemini-flash-latest')
        else:
            self.model = None

    async def generate_text(self, prompt: str) -> str:
        if not self.model:
            return "Gemini API Key not configured."
        try:
            response = await self.model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            return f"Error generating text: {str(e)}"

    async def summarize(self, text: str) -> str:
        prompt = f"Summarize the following text:\n\n{text}"
        return await self.generate_text(prompt)

ai_service = GeminiService()
