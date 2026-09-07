from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_password_reset_token,
    verify_password_reset_token
)
from app.db.postgres import get_db
from app.models.user import User
from app.models.mine import Mine
from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
    ForgotPasswordRequest,
    ResetPasswordRequest
)
from app.schemas.user import UserResponse
from app.middleware.auth import get_current_user
from app.services.audit_service import record_audit_log
from app.utils.helpers import standard_response

router = APIRouter(prefix="/auth", tags=["Authentication"])

def serialize_user(user: User, db: Session) -> dict:
    mine_name = None
    if user.mine_id:
        m = db.query(Mine).filter(Mine.id == user.mine_id).first()
        if m:
            mine_name = m.name

    # Determine frontend role identifier ('admin', 'inspector', 'mine')
    frontend_role = user.role.lower()
    if frontend_role == "mine_authority":
        frontend_role = "mine"

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": frontend_role,
        "designation": user.designation,
        "organization": user.organization,
        "department": user.department,
        "avatarText": user.avatar_text or (user.name[:2].upper() if user.name else "KD"),
        "mineId": user.mine_id,
        "mineName": mine_name,
        "phone": user.phone,
        "status": user.status,
        "lastActive": user.last_active or "Today"
    }

@router.post("/login")
async def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user with email/ID and password, returning JWT access token."""
    login_id = req.email.strip()
    user = db.query(User).filter(
        (User.email.ilike(login_id)) | (User.id.ilike(login_id))
    ).first()

    if not user:
        # Check if preferred role demo user exists
        if req.preferred_role:
            pref = req.preferred_role.lower()
            if "mine" in pref:
                user = db.query(User).filter(User.role.ilike("%mine%")).first()
            elif "inspector" in pref:
                user = db.query(User).filter(User.role.ilike("%inspector%")).first()
            else:
                user = db.query(User).filter(User.role.ilike("%admin%")).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please verify your government email or user ID."
        )

    if not verify_password(req.password, user.password_hash):
        # Check fallback demo master password for development
        if settings.ENVIRONMENT == "development" and req.password in ["GovAdmin@2026", "Inspector@2026", "MineBCCL@2026"]:
            pass # Permit demo fallback in dev mode
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid password. Please check your credentials."
            )

    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive or suspended. Please contact the administrator."
        )

    # Generate JWT token
    token_payload = {
        "sub": user.id,
        "role": user.role,
        "email": user.email,
        "mine_id": user.mine_id
    }
    access_token = create_access_token(
        data=token_payload,
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    user_dict = serialize_user(user, db)
    record_audit_log(
        db=db,
        action="LOGIN_SUCCESS",
        entity_type="USER",
        entity_id=user.id,
        user=user,
        details={"email": user.email, "role": user.role}
    )
    db.commit()

    return standard_response(
        success=True,
        message="Authentication successful",
        data={
            "access_token": access_token,
            "token_type": "bearer",
            "user": user_dict
        }
    )

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Log out authenticated user session."""
    record_audit_log(
        db=db,
        action="LOGOUT",
        entity_type="USER",
        entity_id=current_user.id,
        user=current_user
    )
    db.commit()
    return standard_response(success=True, message="Session terminated successfully")

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Return currently authenticated officer's profile."""
    return standard_response(
        success=True,
        data=serialize_user(current_user, db)
    )

@router.post("/refresh")
async def refresh_token(current_user: User = Depends(get_current_user)):
    """Generate fresh access token for authenticated session."""
    token_payload = {
        "sub": current_user.id,
        "role": current_user.role,
        "email": current_user.email,
        "mine_id": current_user.mine_id
    }
    new_token = create_access_token(token_payload)
    return standard_response(
        success=True,
        data={"access_token": new_token, "token_type": "bearer"}
    )

@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Initiate secure password reset token."""
    user = db.query(User).filter(User.email.ilike(req.email)).first()
    if not user:
        # Don't leak user existence
        return standard_response(success=True, message="If an account exists, a reset link has been dispatched.")
    
    token = create_password_reset_token(user.email)
    record_audit_log(
        db=db,
        action="PASSWORD_RESET_REQUESTED",
        entity_type="USER",
        entity_id=user.id,
        user=user
    )
    db.commit()
    return standard_response(
        success=True,
        message="Password reset instructions dispatched.",
        data={"reset_token": token} if settings.DEBUG else None
    )

@router.post("/reset-password")
async def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Complete password reset using valid token."""
    email = verify_password_reset_token(req.token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token is invalid or has expired."
        )

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User account not found.")

    user.password_hash = get_password_hash(req.new_password)
    record_audit_log(
        db=db,
        action="PASSWORD_RESET_COMPLETED",
        entity_type="USER",
        entity_id=user.id,
        user=user
    )
    db.commit()
    return standard_response(success=True, message="Password updated successfully. Please log in.")
