from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class CorrectiveAction(Base):
    __tablename__ = "corrective_actions"

    id = Column(String(50), primary_key=True, index=True) # e.g. ACT-501
    violation_id = Column(String(50), ForeignKey("violations.id", ondelete="CASCADE"), nullable=False, index=True)
    mine_id = Column(String(50), ForeignKey("mines.id", ondelete="CASCADE"), nullable=False, index=True)
    mine_name = Column(String(255), nullable=False)
    title = Column(String(255), nullable=False)
    instructions = Column(Text, nullable=False)
    severity = Column(String(20), default="Medium", nullable=False)
    due_date = Column(String(50), nullable=False)
    status = Column(String(50), default="Pending Response", nullable=False, index=True)
    response_note = Column(Text, nullable=True)
    submitted_evidence_files = Column(JSON, default=list)
    inspector_remarks = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    violation = relationship("Violation", back_populates="corrective_actions")
    mine = relationship("Mine", back_populates="corrective_actions")
