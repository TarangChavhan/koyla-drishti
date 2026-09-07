from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class AIAlertBase(BaseModel):
    title: str
    mineId: str = Field(..., alias="mine_id")
    mineName: str = Field(..., alias="mine_name")
    location: str
    category: str = "Safety"
    confidenceScore: float = Field(0.92, alias="confidence_score")
    severity: str = "High" # 'Low' | 'Medium' | 'High' | 'Critical'
    detectedAt: str = Field(..., alias="detected_at")
    status: str = "New" # 'New' | 'Under Review' | 'Assigned' | 'Verified' | 'Rejected' | 'False Positive'
    assignedInspector: Optional[str] = Field(None, alias="assigned_inspector")
    inspectorId: Optional[str] = Field(None, alias="inspector_id")
    detectedIssue: str = Field(..., alias="detected_issue")
    supportingEvidence: str = Field(..., alias="supporting_evidence")
    recommendedAction: str = Field(..., alias="recommended_action")
    satelliteCoordinates: Optional[str] = Field(None, alias="satellite_coordinates")

    class Config:
        populate_by_name = True
        from_attributes = True

class AIAlertCreate(AIAlertBase):
    id: Optional[str] = None

class AIAlertResponse(AIAlertBase):
    id: str

    class Config:
        populate_by_name = True
        from_attributes = True

class AlertVerifyRequest(BaseModel):
    officer_note: Optional[str] = None
    violation_category: Optional[str] = "Safety Compliance"
    deadline_days: Optional[int] = 7
    corrective_directives: Optional[str] = None

class AlertRejectRequest(BaseModel):
    officer_note: Optional[str] = "Marked as false detection or acceptable variance"

class AlertAssignRequest(BaseModel):
    inspector_name: str
    inspector_id: str

class PPEResponse(BaseModel):
    mine_id: str
    workers_detected: int
    helmet_compliant: int
    helmet_violation: int
    vest_compliant: int
    vest_violation: int
    risk_level: str
    confidence: float
    detections: List[Dict[str, Any]]
    alert_created: bool = False
    alert_id: Optional[str] = None

class HazardResponse(BaseModel):
    mine_id: str
    hazard_detected: bool
    hazard_type: Optional[str] = None
    confidence: float
    risk_level: str
    description: str
    alert_created: bool = False
    alert_id: Optional[str] = None

class DocumentAnalysisResponse(BaseModel):
    mine_name: Optional[str] = None
    certificate_number: Optional[str] = None
    inspection_date: Optional[str] = None
    expiry_date: Optional[str] = None
    officer_name: Optional[str] = None
    document_type: Optional[str] = None
    ocr_confidence: float
    review_required: bool
    extracted_fields: Dict[str, Any]

class AIMLReasoningResult(BaseModel):
    risk_level: str
    confidence: float
    potential_issue: str
    reason: str
    recommended_action: str
