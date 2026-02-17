import requests
from app.core.config import settings

class LinearService:
    def __init__(self):
        self.api_url = "https://api.linear.app/graphql"
        self.api_key = settings.LINEAR_API_KEY
        self.team_id = settings.LINEAR_TEAM_ID

    def create_issue(self, title: str, description: str, priority: int = 0) -> str:
        if not self.api_key or not self.team_id:
            return "Linear configuration missing."

        headers = {
            "Content-Type": "application/json",
            "Authorization": self.api_key
        }

        query = """
        mutation IssueCreate($input: IssueCreateInput!) {
            issueCreate(input: $input) {
                success
                issue {
                    id
                    title
                    url
                }
            }
        }
        """

        variables = {
            "input": {
                "teamId": self.team_id,
                "title": title,
                "description": description,
                "priority": priority
            }
        }

        try:
            response = requests.post(
                self.api_url, 
                json={"query": query, "variables": variables}, 
                headers=headers
            )
            response.raise_for_status()
            data = response.json()
            
            if "errors" in data:
                return f"Linear API Error: {data['errors'][0]['message']}"
                
            issue = data["data"]["issueCreate"]["issue"]
            return issue["url"]
        
        except Exception as e:
            print(f"Linear API Exception: {str(e)}")
            return f"Failed to create Linear issue: {str(e)}"

linear_service = LinearService()
