from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class ComplianceRecord(Base):
    __tablename__ = "compliance_records"

    id = Column(String(50), primary_key=True, index=True)
    mine_id = Column(String(50), ForeignKey("mines.id", ondelete="CASCADE"), nullable=False, index=True)
    reporting_period = Column(String(100), nullable=False)
    category = Column(String(100), default="Daily Telemetry & Environmental", nullable=False)
    production_tonnage = Column(String(100), nullable=True)
    pm10_level = Column(Float, default=0.0)
    ambient_noise_db = Column(Float, default=0.0)
    methane_concentration = Column(Float, default=0.0)
    blast_vibration_mms = Column(Float, default=0.0)
    water_discharge_ph = Column(Float, default=7.0)
    safety_incident_reported = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    attachment_filename = Column(String(255), nullable=True)
    calculated_score = Column(Float, default=100.0, nullable=False)
    risk_level = Column(String(20), default="Low", nullable=False)
    status = Column(String(50), default="Compliant", nullable=False)
    ai_analysis_summary = Column(Text, nullable=True)
    raw_telemetry_id = Column(String(100), nullable=True) # Reference to MongoDB IoT document
    submitted_by = Column(String(50), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    mine = relationship("Mine", back_populates="compliance_records")
    submitter = relationship("User", foreign_keys=[submitted_by])
