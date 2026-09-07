from typing import Optional, List
from pydantic import BaseModel, Field

class TelemetrySubmissionData(BaseModel):
    mine_id: Optional[str] = None
    production_tonnage: Optional[str] = "14,250"
    pm10_level: float = Field(default=68.0, description="Particulate Matter PM10 (µg/m3)")
    ambient_noise_db: float = Field(default=72.0, description="Ambient Noise Level (dB)")
    methane_concentration: float = Field(default=0.18, description="CH4 Methane Concentration (%)")
    blast_vibration_mms: float = Field(default=3.4, description="Peak Particle Velocity PPV (mm/s)")
    water_discharge_ph: float = Field(default=7.2, description="Pit Water Effluent pH")
    safety_incident_reported: bool = False
    notes: Optional[str] = None
    attachment_filename: Optional[str] = None

class TelemetrySubmissionResponse(BaseModel):
    id: str
    mine_id: str
    calculated_score: float
    risk_level: str
    status: str
    ai_analysis_summary: Optional[str] = None
    created_at: str

class ComplianceCategoryScore(BaseModel):
    title: str
    score: float
    target: float
    status: str
    notes: str

class MineComplianceBreakdown(BaseModel):
    mine_id: str
    mine_name: str
    overall_score: float
    risk_level: str
    status: str
    categories: List[ComplianceCategoryScore]
