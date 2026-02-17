import requests
from app.core.config import settings

class SlackService:
    def __init__(self):
        self.webhook_url = settings.SLACK_WEBHOOK_URL

    def send_notification(self, message: str) -> bool:
        if not self.webhook_url:
            print("Slack Webhook URL not configured.")
            return False

        payload = {"text": message}

        try:
            response = requests.post(self.webhook_url, json=payload)
            response.raise_for_status()
            return True
        except Exception as e:
            print(f"Failed to send Slack notification: {str(e)}")
            return False

slack_service = SlackService()
