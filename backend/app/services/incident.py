from app.services.linear import linear_service
from app.services.slack import slack_service

class IncidentService:
    def report_incident(self, title: str, description: str, priority: int = 1) -> dict:
        # 1. Create Linear Issue
        issue_url = linear_service.create_issue(title, description, priority)
        
        # 2. format message
        slack_message = f"🚨 *New Incident Reported*\n*Title*: {title}\n*Priority*: {priority}\n*Linear Issue*: {issue_url}"
        
        # 3. Send Slack Notification
        slack_sent = slack_service.send_notification(slack_message)
        
        print(f"Incident Reported: Title='{title}', Linear='{issue_url}', Slack={slack_sent}")
        
        return {
            "linear_issue": issue_url,
            "slack_notification_sent": slack_sent
        }

incident_service = IncidentService()
