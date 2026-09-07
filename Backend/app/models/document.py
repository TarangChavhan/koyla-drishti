from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class MineDocument(Base):
    __tablename__ = "documents"

    id = Column(String(50), primary_key=True, index=True) # e.g. DOC-101
    mine_id = Column(String(50), ForeignKey("mines.id", ondelete="CASCADE"), nullable=False, index=True)
    mine_name = Column(String(255), nullable=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False) # 'Safety', 'Environment', 'Equipment', 'Compliance', 'Operations'
    file_name = Column(String(255), nullable=False)
    violation_id = Column(String(50), nullable=True)
    inspection_id = Column(String(50), nullable=True)
    uploaded_by = Column("uploaded_by_id", String(50), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    file_path = Column("storage_path", Text, nullable=False)
    file_size = Column(String(50), nullable=False)
    file_type = Column(String(20), nullable=False) # 'pdf', 'jpg', 'jpeg', 'png', 'xlsx', 'csv'
    upload_date = Column(String(50), nullable=False)
    expiry_date = Column(String(50), nullable=True)
    status = Column(String(50), default="Verified", nullable=False) # 'Verified', 'Review', 'Rejected', 'Pending'
    url = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    mine = relationship("Mine", back_populates="documents")
    uploader = relationship("User", foreign_keys=[uploaded_by])
