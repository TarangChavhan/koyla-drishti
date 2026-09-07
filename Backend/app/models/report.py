from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Text, JSON
from app.core.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(String(50), primary_key=True, index=True) # e.g. RPT-2026-102
    title = Column(String(255), nullable=False)
    type = Column(String(100), nullable=False) # 'Compliance', 'Inspection', 'Violation', 'Risk', 'Mine Summary'
    generated_date = Column(String(100), nullable=False)
    generated_by = Column(String(255), nullable=False)
    generated_by_id = Column(String(50), nullable=True)
    period = Column(String(100), nullable=False)
    status = Column(String(50), default="Available", nullable=False) # 'Available', 'Processing', 'Approved'
    file_format = Column(String(20), default="PDF", nullable=False) # 'PDF', 'XLSX'
    download_url = Column(Text, nullable=True)
    report_metadata = Column("payload_data", JSON, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
