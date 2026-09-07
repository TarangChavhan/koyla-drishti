from typing import Optional, List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.db.postgres import get_db
from app.models.notification import Notification
from app.models.user import User
from app.schemas.notification import NotificationResponse, UnreadCountResponse
from app.middleware.auth import require_authenticated_user
from app.utils.helpers import standard_response

router = APIRouter(prefix="/notifications", tags=["Notifications"])

def serialize_notification(n: Notification) -> dict:
    return {
        "id": n.id,
        "title": n.title,
        "description": n.description,
        "category": n.category,
        "timestamp": n.timestamp,
        "read": n.is_read,
        "roleTarget": n.role_target,
        "linkToModule": n.link_to_module,
        "priority": n.priority
    }

@router.get("")
async def get_notifications(
    role: Optional[str] = None,
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """Retrieve notifications filtered for current user role or ID."""
    user_role = (role or current_user.role).lower()
    if user_role == "mine_authority":
        user_role = "mine"

    query = db.query(Notification).filter(
        (Notification.role_target == "all") | 
        (Notification.role_target == user_role) |
        (Notification.user_id == current_user.id)
    )

    notifications = query.order_by(Notification.created_at.desc()).limit(50).all()
    results = [serialize_notification(n) for n in notifications]
    return standard_response(success=True, data=results)

@router.patch("/{notif_id}/read")
@router.post("/{notif_id}/read")
async def mark_as_read(
    notif_id: str,
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """Mark individual notification as read."""
    n = db.query(Notification).filter(Notification.id == notif_id).first()
    if n:
        n.is_read = True
        db.commit()
    return standard_response(success=True, message="Notification marked as read")

@router.patch("/read-all")
@router.post("/read-all")
async def mark_all_as_read(
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """Mark all eligible notifications as read for current user."""
    user_role = current_user.role.lower()
    if user_role == "mine_authority":
        user_role = "mine"

    db.query(Notification).filter(
        (Notification.role_target == "all") |
        (Notification.role_target == user_role) |
        (Notification.user_id == current_user.id)
    ).update({"is_read": True}, synchronize_session=False)

    db.commit()
    return standard_response(success=True, message="All notifications marked as read")

@router.get("/unread-count")
async def get_unread_count(
    role: Optional[str] = None,
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """Return count of unread notifications."""
    user_role = (role or current_user.role).lower()
    if user_role == "mine_authority":
        user_role = "mine"

    count = db.query(Notification).filter(
        ((Notification.role_target == "all") |
         (Notification.role_target == user_role) |
         (Notification.user_id == current_user.id)) &
        (Notification.is_read == False)
    ).count()

    return standard_response(success=True, data={"unread_count": count})
