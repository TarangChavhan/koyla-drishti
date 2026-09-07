from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.postgres import get_db
from app.models.user import User

# Support standard Bearer token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Dependency that authenticates JWT token and fetches user record from database."""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is missing. Please log in.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired or token is invalid.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload["sub"]
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        # Check by email in payload
        if "email" in payload:
            user = db.query(User).filter(User.email == payload["email"]).first()
        
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account associated with this token not found.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account has been deactivated. Contact Ministry Admin.",
        )
    
    return user

async def require_authenticated_user(current_user: User = Depends(get_current_user)) -> User:
    """Require any active authenticated user."""
    return current_user

async def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Require ADMIN role."""
    role = current_user.role.upper()
    if role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Government Admin privileges required."
        )
    return current_user

async def require_inspector(current_user: User = Depends(get_current_user)) -> User:
    """Require INSPECTOR or ADMIN role."""
    role = current_user.role.upper()
    if role not in ["INSPECTOR", "ADMIN"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: DGMS Inspector or Admin privileges required."
        )
    return current_user

async def require_mine_authority(current_user: User = Depends(get_current_user)) -> User:
    """Require MINE_AUTHORITY or ADMIN role."""
    role = current_user.role.upper()
    if role not in ["MINE_AUTHORITY", "MINE", "ADMIN"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Mine Authority or Admin credentials required."
        )
    return current_user

def verify_mine_access(user: User, mine_id: str):
    """Enforce object-level authorization: Mine Authority can only access their assigned mine."""
    role = user.role.upper()
    if role == "ADMIN":
        return True
    if role in ["MINE_AUTHORITY", "MINE"]:
        if user.mine_id and user.mine_id.lower() != mine_id.lower():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: You do not have authority to manage or view Mine {mine_id}."
            )
    return True

def verify_inspection_access(user: User, inspector_id: str):
    """Enforce object-level authorization: Inspectors can only manage their assigned inspections."""
    role = user.role.upper()
    if role == "ADMIN":
        return True
    if role == "INSPECTOR":
        if user.id != inspector_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access forbidden: You are not assigned to this statutory inspection."
            )
    return True
