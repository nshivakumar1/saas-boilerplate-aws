from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SaaS Starter"
    API_V1_STR: str = "/api/v1"
    
    # AWS Cognito
    COGNITO_USER_POOL_ID: str = ""
    COGNITO_CLIENT_ID: str = ""
    AWS_REGION: str = "us-east-1"
    
    # Gemini AI
    GEMINI_API_KEY: str = ""
    
    # Incident Management
    LINEAR_API_KEY: str = ""
    LINEAR_TEAM_ID: str = ""
    SLACK_WEBHOOK_URL: str = ""

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
