from typing import Optional
from pydantic import BaseModel, Field

class ReportBase(BaseModel):
    title: str
    type: str # 'Compliance' | 'Inspection' | 'Violation' | 'Risk' | 'Mine Summary'
    period: str
    fileFormat: str = Field("PDF", alias="file_format")

    class Config:
        populate_by_name = True
        from_attributes = True

class ReportGenerateRequest(BaseModel):
    title: str
    type: str
    period: str
    format: Optional[str] = "PDF"

class ReportResponse(ReportBase):
    id: str
    generatedDate: str = Field(..., alias="generated_date")
    generatedBy: str = Field(..., alias="generated_by")
    status: str = "Available"
    downloadUrl: Optional[str] = Field(None, alias="download_url")

    class Config:
        populate_by_name = True
        from_attributes = True
