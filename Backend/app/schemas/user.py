from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    name: str
    email: str
    role: str # 'admin' | 'inspector' | 'mine' or 'ADMIN' | 'INSPECTOR' | 'MINE_AUTHORITY'
    designation: str
    organization: Optional[str] = None
    department: Optional[str] = None
    avatarText: Optional[str] = Field(None, alias="avatar_text")
    mineId: Optional[str] = Field(None, alias="mine_id")
    phone: Optional[str] = None
    status: str = "active"

    class Config:
        populate_by_name = True
        from_attributes = True

class UserCreate(UserBase):
    id: Optional[str] = None
    password: Optional[str] = "GovAdmin@2026"

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    designation: Optional[str] = None
    organization: Optional[str] = None
    department: Optional[str] = None
    avatarText: Optional[str] = Field(None, alias="avatar_text")
    mineId: Optional[str] = Field(None, alias="mine_id")
    phone: Optional[str] = None
    status: Optional[str] = None
    password: Optional[str] = None

    class Config:
        populate_by_name = True
        from_attributes = True

class UserResponse(UserBase):
    id: str
    mineName: Optional[str] = Field(None, alias="mine_name")
    lastActive: Optional[str] = Field("Today", alias="last_active")

    class Config:
        populate_by_name = True
        from_attributes = True
