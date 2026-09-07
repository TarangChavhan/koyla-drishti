from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.postgres import get_db
from app.models.audit_log import AuditLog
from app.models.user import User
from app.middleware.auth import require_admin
from app.utils.helpers import standard_response

router = APIRouter(prefix="/audit-logs", tags=["Audit Trails"])

@router.get("")
async def get_audit_logs(
    action: Optional[str] = None,
    entity_type: Optional[str] = None,
    limit: int = Query(100, ge=1, le=500),
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Admin retrieves immutable governance audit trail logs."""
    query = db.query(AuditLog)
    if action:
        query = query.filter(AuditLog.action.ilike(f"%{action}%"))
    if entity_type:
        query = query.filter(AuditLog.entity_type.ilike(entity_type))

    logs = query.order_by(AuditLog.created_at.desc()).limit(limit).all()
    results = [
        {
            "id": str(l.id),
            "userId": l.user_id,
            "userEmail": l.user_email,
            "userRole": (l.details or {}).get("role", "ADMIN") if isinstance(l.details, dict) else "ADMIN",
            "action": l.action,
            "entityType": l.entity_type,
            "entityId": l.entity_id,
            "details": l.details,
            "ipAddress": l.ip_address,
            "timestamp": l.created_at.isoformat() if l.created_at else None
        }
        for l in logs
    ]
    return standard_response(success=True, data=results)
