from typing import Optional, List
from pydantic import BaseModel, Field

class ChecklistItem(BaseModel):
    id: str
    label: str
    completed: bool = False
    findings: Optional[str] = None

class InspectionBase(BaseModel):
    mineId: str = Field(..., alias="mine_id")
    mineName: str = Field(..., alias="mine_name")
    inspectorName: str = Field(..., alias="inspector_name")
    inspectorId: str = Field(..., alias="inspector_id")
    inspectionType: str = Field("Safety", alias="inspection_type")
    date: str
    time: Optional[str] = "10:00 AM"
    status: str = "Scheduled"
    priority: str = "Routine"
    purpose: str
    checklistItems: List[ChecklistItem] = Field(default_factory=list, alias="checklist_items")
    observations: Optional[str] = None
    recommendations: Optional[str] = None

    class Config:
        populate_by_name = True
        from_attributes = True

class InspectionCreate(InspectionBase):
    id: Optional[str] = None

class InspectionUpdate(BaseModel):
    status: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    observations: Optional[str] = None
    recommendations: Optional[str] = None
    checklistItems: Optional[List[ChecklistItem]] = Field(None, alias="checklist_items")

    class Config:
        populate_by_name = True
        from_attributes = True

class InspectionSubmitRequest(BaseModel):
    observations: str
    recommendations: str
    status: Optional[str] = "Submitted"

class InspectionResponse(InspectionBase):
    id: str
    evidenceFilesCount: int = Field(0, alias="evidence_files_count")

    class Config:
        populate_by_name = True
        from_attributes = True
