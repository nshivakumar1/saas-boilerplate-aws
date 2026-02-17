from fastapi import FastAPI, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.core.config import settings
from app.core.logging_config import setup_logging
from app.core.auth import get_current_user
from app.middleware.tenant import TenantMiddleware, get_tenant_id
from app.services.ai import ai_service
from app.services.incident import incident_service

# Setup logging
setup_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://d1v8dyw3he4vv.cloudfront.net"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(TenantMiddleware)

# Models
class PromptRequest(BaseModel):
    prompt: str

class IncidentRequest(BaseModel):
    title: str
    description: str
    priority: int = 1

# Standard Endpoints
@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/")
def root():
    return {"message": "Welcome to Multi-Tenant SaaS Starter"}

@app.get("/api/v1/protected")
def protected_route(user: dict = Depends(get_current_user), tenant_id: str = Depends(get_tenant_id)):
    return {"message": "You are authenticated", "user": user, "tenant_id": tenant_id}

# AI Endpoints
@app.post("/api/v1/ai/generate")
async def generate_text(request: PromptRequest, user: dict = Depends(get_current_user)):
    response = await ai_service.generate_text(request.prompt)
    return {"response": response}

@app.post("/api/v1/ai/summarize")
async def summarize_text(request: PromptRequest, user: dict = Depends(get_current_user)):
    response = await ai_service.summarize(request.prompt)
    return {"summary": response}

# Incident Management Endpoints
@app.post("/api/v1/incidents")
async def report_incident(request: IncidentRequest, user: dict = Depends(get_current_user)):
    result = incident_service.report_incident(request.title, request.description, request.priority)
    return {"status": "Incident Reported", "details": result}
