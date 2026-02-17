from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
import contextvars

TENANT_ID: contextvars.ContextVar[str] = contextvars.ContextVar("tenant_id", default="public")

class TenantMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        tenant_id = request.headers.get("X-Tenant-ID", "public")
        token = TENANT_ID.set(tenant_id)
        try:
            response = await call_next(request)
            return response
        finally:
            TENANT_ID.reset(token)

def get_tenant_id():
    return TENANT_ID.get()
