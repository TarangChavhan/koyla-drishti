from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Violation(Base):
    __tablename__ = "violations"

    id = Column(String(50), primary_key=True, index=True) # e.g. VIO-1024
    mine_id = Column(String(50), ForeignKey("mines.id", ondelete="CASCADE"), nullable=False, index=True)
    mine_name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    severity = Column(String(20), default="Medium", nullable=False, index=True)
    description = Column(Text, nullable=False)
    issued_date = Column(String(50), nullable=False)
    deadline = Column(String(50), nullable=False)
    assigned_inspector = Column(String(255), nullable=False)
    assigned_inspector_id = Column(String(50), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    status = Column(String(50), default="Open", nullable=False, index=True)
    corrective_action_text = Column(Text, nullable=True)
    submitted_evidence = Column(JSON, default=list)
    mine_response = Column(Text, nullable=True)
    alert_id = Column(String(100), nullable=True) # MongoDB AI alert id
    inspection_id = Column(String(50), ForeignKey("inspections.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    mine = relationship("Mine", back_populates="violations")
    inspection = relationship("Inspection", back_populates="violations")
    corrective_actions = relationship("CorrectiveAction", back_populates="violation", cascade="all, delete-orphan")
