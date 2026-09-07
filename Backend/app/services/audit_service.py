import logging
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog
from app.models.user import User
from app.utils.helpers import generate_id

logger = logging.getLogger("koyla_drishti.audit")

def record_audit_log(
    db: Session,
    action: str,
    entity_type: str,
    entity_id: Optional[str] = None,
    user: Optional[User] = None,
    details: Optional[Dict[str, Any]] = None,
    ip_address: Optional[str] = None
) -> AuditLog:
    """Record an authoritative, immutable audit trail event."""
    log_id = generate_id("AUD", 6)
    audit_details = dict(details or {})
    if user and "role" not in audit_details:
        audit_details["role"] = user.role

    log_entry = AuditLog(
        user_id=user.id if user else None,
        user_email=user.email if user else "system",
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        details=audit_details,
        ip_address=ip_address
    )
    db.add(log_entry)
    # Note: caller will commit within transaction
    logger.info(f"AUDIT: [{action}] by {log_entry.user_email} on {entity_type}:{entity_id}")
    return log_entry
