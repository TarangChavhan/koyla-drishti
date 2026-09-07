import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.config import settings
from app.db.session import init_databases
from app.middleware.errors import (
    http_exception_handler,
    validation_exception_handler,
    global_exception_handler
)
from app.routers import (
    auth_router,
    users_router,
    mines_router,
    dashboard_router,
    compliance_router,
    ai_router,
    ml_inference_router,
    inspections_router,
    violations_router,
    corrective_actions_router,
    documents_router,
    notifications_router,
    reports_router,
    audit_logs_router
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("koyla_drishti.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager for startup and shutdown hooks."""
    logger.info("Starting up KOYLA DRISHTI Backend Services...")
    init_databases()
    yield
    logger.info("Shutting down KOYLA DRISHTI Backend Services...")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Statutory Compliance & AI Intelligence Platform for Ministry of Coal & DGMS",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Configuration
logger.info(f"Permitted CORS Origins: {settings.cors_origins_list}")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# Mount Static Uploads Folder
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Health Check Endpoints
@app.get("/")
@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "online",
        "platform": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "docs": "/docs"
    }

# Register Routers under /api/v1
api_prefix = settings.API_V1_STR
app.include_router(auth_router, prefix=api_prefix)
app.include_router(users_router, prefix=api_prefix)
app.include_router(mines_router, prefix=api_prefix)
app.include_router(dashboard_router, prefix=api_prefix)
app.include_router(compliance_router, prefix=api_prefix)
app.include_router(ai_router, prefix=api_prefix)
app.include_router(ml_inference_router, prefix=api_prefix)
app.include_router(inspections_router, prefix=api_prefix)
app.include_router(violations_router, prefix=api_prefix)
app.include_router(corrective_actions_router, prefix=api_prefix)
app.include_router(documents_router, prefix=api_prefix)
app.include_router(notifications_router, prefix=api_prefix)
app.include_router(reports_router, prefix=api_prefix)
app.include_router(audit_logs_router, prefix=api_prefix)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
