from typing import Optional, List
from pydantic import BaseModel, Field

class ViolationBase(BaseModel):
    mineId: str = Field(..., alias="mine_id")
    mineName: str = Field(..., alias="mine_name")
    category: str = "Safety Compliance"
    severity: str = "Medium"
    description: str
    issuedDate: str = Field(..., alias="issued_date")
    deadline: str
    assignedInspector: str = Field(..., alias="assigned_inspector")
    status: str = "Open"
    correctiveActionText: Optional[str] = Field(None, alias="corrective_action_text")
    submittedEvidence: Optional[List[str]] = Field(default_factory=list, alias="submitted_evidence")
    mineResponse: Optional[str] = Field(None, alias="mine_response")

    class Config:
        populate_by_name = True
        from_attributes = True

class ViolationCreate(ViolationBase):
    id: Optional[str] = None
    alert_id: Optional[str] = None
    inspection_id: Optional[str] = None

class ViolationUpdate(BaseModel):
    status: Optional[str] = None
    correctiveActionText: Optional[str] = Field(None, alias="corrective_action_text")
    mineResponse: Optional[str] = Field(None, alias="mine_response")
    submittedEvidence: Optional[List[str]] = Field(None, alias="submitted_evidence")

    class Config:
        populate_by_name = True
        from_attributes = True

class ViolationResponse(ViolationBase):
    id: str

    class Config:
        populate_by_name = True
        from_attributes = True
