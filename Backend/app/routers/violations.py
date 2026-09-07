from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.postgres import get_db
from app.models.violation import Violation
from app.models.mine import Mine
from app.models.user import User
from app.models.corrective_action import CorrectiveAction
from app.schemas.violation import ViolationCreate, ViolationUpdate, ViolationResponse
from app.middleware.auth import require_authenticated_user, require_inspector, verify_mine_access
from app.services.notification_service import create_notification
from app.services.audit_service import record_audit_log
from app.utils.helpers import generate_id, format_current_timestamp, standard_response

router = APIRouter(prefix="/violations", tags=["Violation Management"])

def serialize_violation(v: Violation) -> dict:
    evidence = v.submitted_evidence or []
    if not isinstance(evidence, list):
        evidence = []

    return {
        "id": v.id,
        "mineId": v.mine_id,
        "mineName": v.mine_name,
        "category": v.category,
        "severity": v.severity,
        "description": v.description,
        "issuedDate": v.issued_date,
        "deadline": v.deadline,
        "assignedInspector": v.assigned_inspector,
        "status": v.status,
        "correctiveActionText": v.corrective_action_text,
        "submittedEvidence": evidence,
        "mineResponse": v.mine_response
    }

@router.get("")
async def get_all_violations(
    mine_id: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """List statutory violations filtered by mine or lifecycle status."""
    query = db.query(Violation)

    if current_user.role.upper() in ["MINE_AUTHORITY", "MINE"] and current_user.mine_id:
        query = query.filter(Violation.mine_id == current_user.mine_id)
    elif mine_id:
        query = query.filter(Violation.mine_id == mine_id)

    if status_filter and status_filter != "All":
        query = query.filter(Violation.status.ilike(status_filter))

    violations = query.order_by(Violation.created_at.desc()).all()
    results = [serialize_violation(v) for v in violations]
    return standard_response(success=True, data=results)

@router.get("/{violation_id}")
async def get_violation_by_id(
    violation_id: str,
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """Retrieve violation case dossier."""
    v = db.query(Violation).filter(Violation.id == violation_id).first()
    if not v:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Violation {violation_id} not found")
    verify_mine_access(current_user, v.mine_id)
    return standard_response(success=True, data=serialize_violation(v))

@router.post("")
async def create_violation(
    req: ViolationCreate,
    current_user: User = Depends(require_inspector),
    db: Session = Depends(get_db)
):
    """Inspector manually issues formal violation case and linked corrective action."""
    vio_id = req.id or generate_id("VIO", 4)
    mine = db.query(Mine).filter(Mine.id == req.mineId).first()
    mine_name = mine.name if mine else req.mineName

    new_v = Violation(
        id=vio_id,
        mine_id=req.mineId,
        mine_name=mine_name,
        category=req.category,
        severity=req.severity,
        description=req.description,
        issued_date=req.issuedDate,
        deadline=req.deadline,
        assigned_inspector=req.assignedInspector,
        assigned_inspector_id=current_user.id,
        status="Open",
        corrective_action_text=req.correctiveActionText,
        submitted_evidence=req.submittedEvidence or [],
        mine_response=req.mineResponse
    )
    db.add(new_v)

    # Automatically create linked corrective action
    act_id = generate_id("ACT", 3)
    action = CorrectiveAction(
        id=act_id,
        violation_id=vio_id,
        mine_id=req.mineId,
        mine_name=mine_name,
        title=f"Remedial Action: {req.category}",
        instructions=req.correctiveActionText or "Rectify violation and upload documentary proof.",
        severity=req.severity,
        due_date=req.deadline,
        status="Pending Response",
        submitted_evidence_files=[]
    )
    db.add(action)

    if mine:
        mine.active_violations_count += 1

    create_notification(
        db=db,
        title=f"Statutory Violation Notice: {vio_id}",
        description=f"Issued to {mine_name} for {req.category}. Remedial response required by {req.deadline}.",
        category="Violation Deadlines",
        role_target="mine",
        link_to_module="/mine/violations",
        priority="high" if req.severity in ["High", "Critical"] else "normal"
    )

    record_audit_log(
        db=db,
        action="VIOLATION_ISSUED",
        entity_type="VIOLATION",
        entity_id=vio_id,
        user=current_user,
        details={"mine_id": req.mineId, "severity": req.severity, "category": req.category}
    )
    db.commit()

    return standard_response(
        success=True,
        message="Statutory violation order issued successfully",
        data=serialize_violation(new_v)
    )

@router.patch("/{violation_id}")
async def update_violation(
    violation_id: str,
    req: ViolationUpdate,
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """Update violation status or responses."""
    v = db.query(Violation).filter(Violation.id == violation_id).first()
    if not v:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Violation {violation_id} not found")

    if req.status: v.status = req.status
    if req.correctiveActionText: v.corrective_action_text = req.correctiveActionText
    if req.mineResponse: v.mine_response = req.mineResponse
    if req.submittedEvidence is not None: v.submitted_evidence = req.submittedEvidence

    record_audit_log(
        db=db,
        action="VIOLATION_UPDATED",
        entity_type="VIOLATION",
        entity_id=v.id,
        user=current_user
    )
    db.commit()
    return standard_response(success=True, message="Violation record updated", data=serialize_violation(v))
