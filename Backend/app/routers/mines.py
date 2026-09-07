from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.db.postgres import get_db
from app.models.mine import Mine
from app.models.user import User
from app.schemas.mine import MineCreate, MineUpdate, MineResponse, Coordinates
from app.middleware.auth import require_authenticated_user, require_admin, verify_mine_access
from app.services.audit_service import record_audit_log
from app.utils.helpers import generate_id, standard_response

router = APIRouter(prefix="/mines", tags=["Mine Management"])

def serialize_mine(mine: Mine) -> dict:
    coords = None
    if mine.latitude is not None and mine.longitude is not None:
        coords = {"lat": mine.latitude, "lng": mine.longitude}

    return {
        "id": mine.id,
        "name": mine.name,
        "operator": mine.operator,
        "mineType": mine.mine_type,
        "district": mine.district,
        "state": mine.state,
        "complianceScore": round(float(mine.compliance_score), 1),
        "riskLevel": mine.risk_level,
        "status": mine.status,
        "lastInspection": mine.last_inspection or "12 Aug 2026",
        "nextInspection": mine.next_inspection or "08 Sep 2026",
        "address": mine.address,
        "contactOfficer": mine.contact_officer,
        "contactEmail": mine.contact_email,
        "coordinates": coords,
        "activeViolationsCount": mine.active_violations_count
    }

@router.get("")
async def get_all_mines(
    state: Optional[str] = None,
    risk: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = None,
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """Retrieve all mines with optional filtering, search, and object-level permissions."""
    query = db.query(Mine)

    # Object-level restriction: Mine Authority can only view their own mine
    if current_user.role.upper() in ["MINE_AUTHORITY", "MINE"] and current_user.mine_id:
        query = query.filter(Mine.id == current_user.mine_id)
    else:
        if state and state != "All":
            query = query.filter(Mine.state.ilike(f"%{state}%"))
        if risk and risk != "All":
            query = query.filter(Mine.risk_level.ilike(risk))
        if status_filter and status_filter != "All":
            query = query.filter(Mine.status.ilike(status_filter))
        if search:
            s = f"%{search}%"
            query = query.filter(or_(Mine.name.ilike(s), Mine.id.ilike(s), Mine.operator.ilike(s), Mine.district.ilike(s)))

    mines = query.all()
    results = [serialize_mine(m) for m in mines]
    return standard_response(success=True, data=results)

@router.get("/{mine_id}")
async def get_mine_by_id(
    mine_id: str,
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """Get mine profile by ID."""
    verify_mine_access(current_user, mine_id)

    mine = db.query(Mine).filter(Mine.id.ilike(mine_id)).first()
    if not mine:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Mine {mine_id} not found")

    return standard_response(success=True, data=serialize_mine(mine))

@router.post("")
async def create_mine(
    req: MineCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Admin registers a new coal mine entity."""
    mine_id = req.id or generate_id("KD", 3)
    existing = db.query(Mine).filter(Mine.id == mine_id).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Mine ID {mine_id} already exists.")

    new_mine = Mine(
        id=mine_id,
        name=req.name,
        operator=req.operator,
        mine_type=req.mineType,
        district=req.district,
        state=req.state,
        compliance_score=req.complianceScore,
        risk_level=req.riskLevel,
        status=req.status,
        last_inspection=req.lastInspection,
        next_inspection=req.nextInspection,
        address=req.address,
        contact_officer=req.contactOfficer,
        contact_email=req.contactEmail,
        latitude=req.coordinates.lat if req.coordinates else None,
        longitude=req.coordinates.lng if req.coordinates else None,
        active_violations_count=0
    )
    db.add(new_mine)

    record_audit_log(
        db=db,
        action="MINE_CREATED",
        entity_type="MINE",
        entity_id=mine_id,
        user=current_user,
        details={"name": new_mine.name, "operator": new_mine.operator, "state": new_mine.state}
    )
    db.commit()

    return standard_response(
        success=True,
        message="Mine registered successfully",
        data=serialize_mine(new_mine)
    )

@router.put("/{mine_id}")
@router.patch("/{mine_id}")
async def update_mine(
    mine_id: str,
    req: MineUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Admin updates mine profile details."""
    mine = db.query(Mine).filter(Mine.id.ilike(mine_id)).first()
    if not mine:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Mine {mine_id} not found")

    if req.name is not None: mine.name = req.name
    if req.operator is not None: mine.operator = req.operator
    if req.mineType is not None: mine.mine_type = req.mineType
    if req.district is not None: mine.district = req.district
    if req.state is not None: mine.state = req.state
    if req.complianceScore is not None: mine.compliance_score = req.complianceScore
    if req.riskLevel is not None: mine.risk_level = req.riskLevel
    if req.status is not None: mine.status = req.status
    if req.lastInspection is not None: mine.last_inspection = req.lastInspection
    if req.nextInspection is not None: mine.next_inspection = req.nextInspection
    if req.address is not None: mine.address = req.address
    if req.contactOfficer is not None: mine.contact_officer = req.contactOfficer
    if req.contactEmail is not None: mine.contact_email = req.contactEmail
    if req.coordinates is not None:
        mine.latitude = req.coordinates.lat
        mine.longitude = req.coordinates.lng

    record_audit_log(
        db=db,
        action="MINE_UPDATED",
        entity_type="MINE",
        entity_id=mine.id,
        user=current_user
    )
    db.commit()

    return standard_response(
        success=True,
        message="Mine details updated",
        data=serialize_mine(mine)
    )

@router.patch("/{mine_id}/status")
async def update_mine_status(
    mine_id: str,
    status_val: str = Query(..., alias="status"),
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Update mine compliance status (Compliant, Under Review, Non-Compliant)."""
    mine = db.query(Mine).filter(Mine.id.ilike(mine_id)).first()
    if not mine:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Mine {mine_id} not found")

    mine.status = status_val
    record_audit_log(
        db=db,
        action="MINE_STATUS_CHANGED",
        entity_type="MINE",
        entity_id=mine.id,
        user=current_user,
        details={"new_status": status_val}
    )
    db.commit()
    return standard_response(success=True, message=f"Mine status set to {status_val}", data=serialize_mine(mine))

@router.delete("/{mine_id}")
async def delete_mine(
    mine_id: str,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Admin deactivates mine record."""
    mine = db.query(Mine).filter(Mine.id.ilike(mine_id)).first()
    if not mine:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Mine {mine_id} not found")

    mine_name = mine.name
    db.delete(mine)
    record_audit_log(
        db=db,
        action="MINE_DELETED",
        entity_type="MINE",
        entity_id=mine_id,
        user=current_user,
        details={"name": mine_name}
    )
    db.commit()
    return standard_response(success=True, message=f"Mine {mine_id} removed successfully")
