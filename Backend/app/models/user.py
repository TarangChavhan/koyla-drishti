from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column("hashed_password", String(255), nullable=False)
    role = Column(String(50), nullable=False, index=True) # 'ADMIN', 'INSPECTOR', 'MINE_AUTHORITY'
    designation = Column(String(255), nullable=False)
    organization = Column(String(255), nullable=True)
    department = Column(String(255), nullable=True)
    avatar_text = Column(String(10), nullable=True)
    phone = Column(String(50), nullable=True)
    status = Column(String(20), default="active", nullable=False)
    mine_id = Column(String(50), ForeignKey("mines.id", ondelete="SET NULL"), nullable=True, index=True)
    last_active = Column(String(100), default="Just now")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    mine = relationship("Mine", back_populates="authorities", foreign_keys=[mine_id])
    inspections = relationship("Inspection", back_populates="inspector", foreign_keys="Inspection.inspector_id")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
