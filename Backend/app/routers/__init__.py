from app.routers.auth import router as auth_router
from app.routers.users import router as users_router
from app.routers.mines import router as mines_router
from app.routers.dashboard import router as dashboard_router
from app.routers.compliance import router as compliance_router
from app.routers.ai import router as ai_router
from app.routers.ml_inference import router as ml_inference_router
from app.routers.inspections import router as inspections_router
from app.routers.violations import router as violations_router
from app.routers.corrective_actions import router as corrective_actions_router
from app.routers.documents import router as documents_router
from app.routers.notifications import router as notifications_router
from app.routers.reports import router as reports_router
from app.routers.audit_logs import router as audit_logs_router

__all__ = [
    "auth_router",
    "users_router",
    "mines_router",
    "dashboard_router",
    "compliance_router",
    "ai_router",
    "ml_inference_router",
    "inspections_router",
    "violations_router",
    "corrective_actions_router",
    "documents_router",
    "notifications_router",
    "reports_router",
    "audit_logs_router"
]
