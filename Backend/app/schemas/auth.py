from typing import Optional, Any, Dict
from pydantic import BaseModel, EmailStr, Field

class LoginRequest(BaseModel):
    email: str = Field(..., description="Government email or User ID")
    password: str = Field(..., min_length=1, description="Password")
    preferred_role: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=6)

class TokenPayload(BaseModel):
    sub: str
    role: str
    email: Optional[str] = None
    mine_id: Optional[str] = None
    exp: Optional[int] = None
