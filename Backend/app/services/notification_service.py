import logging
from typing import Optional
from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.utils.helpers import generate_id, format_current_timestamp

logger = logging.getLogger("koyla_drishti.notifications")

def create_notification(
    db: Session,
    title: str,
    description: str,
    category: str,
    role_target: str = "all", # 'admin', 'inspector', 'mine', 'all'
    user_id: Optional[str] = None,
    link_to_module: Optional[str] = None,
    priority: str = "normal"
) -> Notification:
    """Create and persist an authoritative government notification."""
    notif_id = generate_id("NTF", 5)
    notif = Notification(
        id=notif_id,
        title=title,
        description=description,
        category=category,
        timestamp=format_current_timestamp(),
        is_read=False,
        role_target=role_target.lower(),
        user_id=user_id,
        link_to_module=link_to_module,
        priority=priority
    )
    db.add(notif)
    logger.info(f"NOTIFICATION: [{category}] '{title}' -> target: {role_target}")
    return notif
