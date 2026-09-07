from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False) # 'AI Alerts', 'Inspection Updates', etc.
    timestamp = Column(String(100), nullable=False)
    is_read = Column("read", Boolean, default=False, nullable=False, index=True)
    role_target = Column(String(50), default="all", nullable=False, index=True) # 'admin', 'inspector', 'mine', 'all'
    user_id = Column(String(50), ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    link_to_module = Column(String(255), nullable=True)
    priority = Column(String(20), default="normal", nullable=False) # 'normal', 'high'
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="notifications")
