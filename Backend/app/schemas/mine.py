from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

class Coordinates(BaseModel):
    lat: float
    lng: float

class MineBase(BaseModel):
    name: str
    operator: str
    mineType: str = Field(..., alias="mine_type")
    district: str
    state: str
    complianceScore: float = Field(100.0, alias="compliance_score")
    riskLevel: str = Field("Low", alias="risk_level")
    status: str = "Compliant"
    lastInspection: Optional[str] = Field("12 Aug 2026", alias="last_inspection")
    nextInspection: Optional[str] = Field("08 Sep 2026", alias="next_inspection")
    address: Optional[str] = None
    contactOfficer: Optional[str] = Field(None, alias="contact_officer")
    contactEmail: Optional[str] = Field(None, alias="contact_email")
    coordinates: Optional[Coordinates] = None

    class Config:
        populate_by_name = True
        from_attributes = True

class MineCreate(MineBase):
    id: Optional[str] = None # e.g. KD-104

class MineUpdate(BaseModel):
    name: Optional[str] = None
    operator: Optional[str] = None
    mineType: Optional[str] = Field(None, alias="mine_type")
    district: Optional[str] = None
    state: Optional[str] = None
    complianceScore: Optional[float] = Field(None, alias="compliance_score")
    riskLevel: Optional[str] = Field(None, alias="risk_level")
    status: Optional[str] = None
    lastInspection: Optional[str] = Field(None, alias="last_inspection")
    nextInspection: Optional[str] = Field(None, alias="next_inspection")
    address: Optional[str] = None
    contactOfficer: Optional[str] = Field(None, alias="contact_officer")
    contactEmail: Optional[str] = Field(None, alias="contact_email")
    coordinates: Optional[Coordinates] = None

    class Config:
        populate_by_name = True
        from_attributes = True

class MineResponse(MineBase):
    id: str
    activeViolationsCount: int = Field(0, alias="active_violations_count")

    class Config:
        populate_by_name = True
        from_attributes = True
