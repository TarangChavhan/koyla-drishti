from typing import Optional
from pydantic import BaseModel, Field

class NotificationBase(BaseModel):
    title: str
    description: str
    category: str
    timestamp: str
    read: bool = Field(False, alias="is_read")
    roleTarget: str = Field("all", alias="role_target")
    linkToModule: Optional[str] = Field(None, alias="link_to_module")
    priority: Optional[str] = "normal"

    class Config:
        populate_by_name = True
        from_attributes = True

class NotificationCreate(NotificationBase):
    id: Optional[str] = None
    user_id: Optional[str] = None

class NotificationResponse(NotificationBase):
    id: str

    class Config:
        populate_by_name = True
        from_attributes = True

class UnreadCountResponse(BaseModel):
    unread_count: int
