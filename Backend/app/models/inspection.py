from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Inspection(Base):
    __tablename__ = "inspections"

    id = Column(String(50), primary_key=True, index=True) # e.g. INS-2401
    mine_id = Column(String(50), ForeignKey("mines.id", ondelete="CASCADE"), nullable=False, index=True)
    mine_name = Column(String(255), nullable=False)
    inspector_id = Column(String(50), ForeignKey("users.id", ondelete="RESTRICT"), nullable=False, index=True)
    inspector_name = Column(String(255), nullable=False)
    inspection_type = Column(String(50), nullable=False)
    date = Column(String(50), nullable=False)
    time = Column(String(50), nullable=True)
    status = Column(String(50), default="Scheduled", nullable=False, index=True)
    priority = Column(String(50), default="Routine", nullable=False)
    purpose = Column(Text, nullable=False)
    checklist_items = Column(JSON, default=list)
    observations = Column(Text, nullable=True)
    recommendations = Column(Text, nullable=True)
    evidence_files_count = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    mine = relationship("Mine", back_populates="inspections")
    inspector = relationship("User", back_populates="inspections", foreign_keys=[inspector_id])
    violations = relationship("Violation", back_populates="inspection")
