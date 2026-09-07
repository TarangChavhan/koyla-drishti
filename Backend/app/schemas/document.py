from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

class DocumentBase(BaseModel):
    mineId: str = Field(..., alias="mine_id")
    mineName: Optional[str] = Field(None, alias="mine_name")
    title: str
    category: str = "Safety"
    fileName: str = Field(..., alias="file_name")
    fileSize: str = Field(..., alias="file_size")
    fileType: str = Field(..., alias="file_type")
    uploadDate: str = Field(..., alias="upload_date")
    expiryDate: Optional[str] = Field(None, alias="expiry_date")
    status: str = "Verified"
    url: Optional[str] = None

    class Config:
        populate_by_name = True
        from_attributes = True

class DocumentCreate(DocumentBase):
    id: Optional[str] = None

class DocumentResponse(DocumentBase):
    id: str
    ocr_extracted_data: Optional[Dict[str, Any]] = None

    class Config:
        populate_by_name = True
        from_attributes = True
