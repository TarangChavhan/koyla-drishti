from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.db.postgres import get_db
from app.models.user import User
from app.models.mine import Mine
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.middleware.auth import require_admin, require_authenticated_user
from app.services.audit_service import record_audit_log
from app.utils.helpers import generate_id, standard_response
from app.routers.auth import serialize_user

router = APIRouter(prefix="/users", tags=["User Management"])

@router.get("")
async def get_all_users(
    role: Optional[str] = None,
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """List all registered officers, inspectors, and mine authorities."""
    query = db.query(User)
    if role:
        role_upper = role.upper()
        if role_upper == "MINE":
            role_upper = "MINE_AUTHORITY"
        query = query.filter(User.role == role_upper)

    users = query.all()
    results = [serialize_user(u, db) for u in users]
    return standard_response(success=True, data=results)

@router.post("")
async def create_user(
    req: UserCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Admin creates a new Inspector or Mine Authority."""
    existing = db.query(User).filter(User.email.ilike(req.email)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"An account with email {req.email} already exists."
        )

    # Normalize role
    role_norm = req.role.upper()
    if role_norm == "MINE":
        role_norm = "MINE_AUTHORITY"

    user_id = req.id or generate_id("USR", 3)
    new_user = User(
        id=user_id,
        name=req.name,
        email=req.email,
        password_hash=get_password_hash(req.password or "GovAdmin@2026"),
        role=role_norm,
        designation=req.designation,
        organization=req.organization,
        department=req.department,
        avatar_text=req.avatarText or req.name[:2].upper(),
        phone=req.phone,
        status=req.status or "active",
        mine_id=req.mineId
    )
    db.add(new_user)

    record_audit_log(
        db=db,
        action="USER_CREATED",
        entity_type="USER",
        entity_id=user_id,
        user=current_user,
        details={"name": new_user.name, "email": new_user.email, "role": new_user.role}
    )
    db.commit()

    return standard_response(
        success=True,
        message="User account provisioned successfully",
        data=serialize_user(new_user, db)
    )

@router.get("/{user_id}")
async def get_user_by_id(
    user_id: str,
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """Fetch user account details by ID."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return standard_response(success=True, data=serialize_user(user, db))

@router.put("/{user_id}")
@router.patch("/{user_id}")
async def update_user(
    user_id: str,
    req: UserUpdate,
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """Update officer profile or permissions."""
    # Only Admin or user themselves can update
    if current_user.role.upper() != "ADMIN" and current_user.id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized to edit this user account")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if req.name is not None: user.name = req.name
    if req.designation is not None: user.designation = req.designation
    if req.organization is not None: user.organization = req.organization
    if req.department is not None: user.department = req.department
    if req.phone is not None: user.phone = req.phone
    if req.status is not None and current_user.role.upper() == "ADMIN": user.status = req.status
    if req.mineId is not None and current_user.role.upper() == "ADMIN": user.mine_id = req.mineId
    if req.password is not None and len(req.password) > 0: user.password_hash = get_password_hash(req.password)

    record_audit_log(
        db=db,
        action="USER_UPDATED",
        entity_type="USER",
        entity_id=user.id,
        user=current_user
    )
    db.commit()

    return standard_response(
        success=True,
        message="User profile updated successfully",
        data=serialize_user(user, db)
    )

@router.delete("/{user_id}")
async def delete_user(
    user_id: str,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Admin deactivates or removes user account."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.status = "inactive"
    record_audit_log(
        db=db,
        action="USER_DEACTIVATED",
        entity_type="USER",
        entity_id=user.id,
        user=current_user
    )
    db.commit()
    return standard_response(success=True, message=f"User {user_id} deactivated successfully")
