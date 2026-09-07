from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class Mine(Base):
    __tablename__ = "mines"

    id = Column(String(50), primary_key=True, index=True) # e.g. KD-104
    name = Column(String(255), nullable=False)
    operator = Column(String(255), nullable=False)
    mine_type = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    compliance_score = Column(Float, default=100.0, nullable=False)
    risk_level = Column(String(20), default="Low", nullable=False, index=True)
    status = Column(String(50), default="Compliant", nullable=False, index=True)
    last_inspection = Column(String(50), nullable=True)
    next_inspection = Column(String(50), nullable=True)
    address = Column(Text, nullable=True)
    contact_officer = Column(String(255), nullable=True)
    contact_email = Column(String(255), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    active_violations_count = Column(Integer, default=0, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    authorities = relationship("User", back_populates="mine", foreign_keys="User.mine_id")
    compliance_records = relationship("ComplianceRecord", back_populates="mine", cascade="all, delete-orphan")
    inspections = relationship("Inspection", back_populates="mine", cascade="all, delete-orphan")
    violations = relationship("Violation", back_populates="mine", cascade="all, delete-orphan")
    corrective_actions = relationship("CorrectiveAction", back_populates="mine", cascade="all, delete-orphan")
    documents = relationship("MineDocument", back_populates="mine", cascade="all, delete-orphan")
