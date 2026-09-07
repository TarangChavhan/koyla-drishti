from typing import Optional, List
from pydantic import BaseModel, Field

class CorrectiveActionBase(BaseModel):
    violationId: str = Field(..., alias="violation_id")
    mineId: str = Field(..., alias="mine_id")
    mineName: str = Field(..., alias="mine_name")
    title: str
    instructions: str
    severity: str = "Medium"
    dueDate: str = Field(..., alias="due_date")
    status: str = "Pending Response"
    responseNote: Optional[str] = Field(None, alias="response_note")
    submittedEvidenceFiles: Optional[List[str]] = Field(default_factory=list, alias="submitted_evidence_files")
    inspectorRemarks: Optional[str] = Field(None, alias="inspector_remarks")

    class Config:
        populate_by_name = True
        from_attributes = True

class CorrectiveActionCreate(CorrectiveActionBase):
    id: Optional[str] = None

class MineActionResponse(BaseModel):
    response_note: str
    evidence_file_name: Optional[str] = None

class InspectorAdjudicateRequest(BaseModel):
    decision: str # 'Approved' | 'Rejected' | 'More Evidence Required'
    remarks: str

class CorrectiveActionResponse(CorrectiveActionBase):
    id: str

    class Config:
        populate_by_name = True
        from_attributes = True
