from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.postgres import get_db
from app.models.corrective_action import CorrectiveAction
from app.models.violation import Violation
from app.models.mine import Mine
from app.models.user import User
from app.schemas.corrective_action import (
    CorrectiveActionCreate,
    MineActionResponse,
    InspectorAdjudicateRequest,
    CorrectiveActionResponse
)
from app.middleware.auth import require_authenticated_user, require_inspector, require_mine_authority, verify_mine_access
from app.services.notification_service import create_notification
from app.services.audit_service import record_audit_log
from app.utils.helpers import generate_id, format_current_timestamp, standard_response

router = APIRouter(prefix="/corrective-actions", tags=["Corrective Actions"])

def serialize_action(a: CorrectiveAction) -> dict:
    files = a.submitted_evidence_files or []
    if not isinstance(files, list):
        files = []

    return {
        "id": a.id,
        "violationId": a.violation_id,
        "mineId": a.mine_id,
        "mineName": a.mine_name,
        "title": a.title,
        "instructions": a.instructions,
        "severity": a.severity,
        "dueDate": a.due_date,
        "status": a.status,
        "responseNote": a.response_note,
        "submittedEvidenceFiles": files,
        "inspectorRemarks": a.inspector_remarks
    }

@router.get("")
async def get_all_corrective_actions(
    mine_id: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """List corrective actions with filtering."""
    query = db.query(CorrectiveAction)

    if current_user.role.upper() in ["MINE_AUTHORITY", "MINE"] and current_user.mine_id:
        query = query.filter(CorrectiveAction.mine_id == current_user.mine_id)
    elif mine_id:
        query = query.filter(CorrectiveAction.mine_id == mine_id)

    if status_filter and status_filter != "All":
        query = query.filter(CorrectiveAction.status.ilike(status_filter))

    actions = query.order_by(CorrectiveAction.created_at.desc()).all()
    results = [serialize_action(a) for a in actions]
    return standard_response(success=True, data=results)

@router.get("/{action_id}")
async def get_action_by_id(
    action_id: str,
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """Retrieve corrective action by ID."""
    action = db.query(CorrectiveAction).filter(CorrectiveAction.id == action_id).first()
    if not action:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Action {action_id} not found")
    verify_mine_access(current_user, action.mine_id)
    return standard_response(success=True, data=serialize_action(action))

@router.post("/{action_id}/submit")
@router.post("/{action_id}/respond")
async def submit_mine_response(
    action_id: str,
    req: MineActionResponse,
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """
    DATAFLOW: Mine Authority uploads remedy explanation and attaches compliance evidence.
    Transitions status to 'Evidence Attached' / 'Under Review'.
    Notifies Inspector for adjudication.
    """
    action = db.query(CorrectiveAction).filter(CorrectiveAction.id == action_id).first()
    if not action:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Action {action_id} not found")

    verify_mine_access(current_user, action.mine_id)

    action.response_note = req.response_note
    action.status = "Evidence Attached"
    if req.evidence_file_name:
        existing_files = list(action.submitted_evidence_files or [])
        if req.evidence_file_name not in existing_files:
            existing_files.append(req.evidence_file_name)
        action.submitted_evidence_files = existing_files

    # Also update linked violation status
    if action.violation_id:
        v = db.query(Violation).filter(Violation.id == action.violation_id).first()
        if v:
            v.status = "Evidence Submitted"
            v.mine_response = req.response_note
            if req.evidence_file_name:
                ev_list = list(v.submitted_evidence or [])
                if req.evidence_file_name not in ev_list:
                    ev_list.append(req.evidence_file_name)
                v.submitted_evidence = ev_list

    # Notify Inspector
    create_notification(
        db=db,
        title=f"Corrective Evidence Submitted: {action.id}",
        description=f"Mine Authority submitted remedial evidence for {action.title}. Inspector adjudication required.",
        category="Corrective Action Requests",
        role_target="inspector",
        link_to_module="/inspector/violations"
    )

    record_audit_log(
        db=db,
        action="EVIDENCE_SUBMITTED",
        entity_type="CORRECTIVE_ACTION",
        entity_id=action.id,
        user=current_user,
        details={"evidence": req.evidence_file_name}
    )
    db.commit()

    return standard_response(
        success=True,
        message="Remedial response and evidence uploaded successfully",
        data=serialize_action(action)
    )

@router.post("/{action_id}/verify")
@router.post("/{action_id}/adjudicate")
async def adjudicate_corrective_action(
    action_id: str,
    req: InspectorAdjudicateRequest,
    current_user: User = Depends(require_inspector),
    db: Session = Depends(get_db)
):
    """
    DATAFLOW: DGMS Inspector reviews submitted evidence and approves or rejects.
    If APPROVED:
      - Action status -> Closed / Approved
      - Linked Violation status -> Resolved
      - Mine active_violations_count decremented
      - Mine compliance score positively updated
      - Mine Authority notified
      - Audit trail logged
    If REJECTED:
      - Action status -> Pending Response
      - Linked Violation status -> Open
      - Mine Authority notified with rejection remarks
    """
    action = db.query(CorrectiveAction).filter(CorrectiveAction.id == action_id).first()
    if not action:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Action {action_id} not found")

    action.inspector_remarks = req.remarks
    is_approved = req.decision.strip().lower() == "approved"

    v = db.query(Violation).filter(Violation.id == action.violation_id).first() if action.violation_id else None
    mine = db.query(Mine).filter(Mine.id == action.mine_id).first() if action.mine_id else None

    if is_approved:
        action.status = "Closed"
        if v:
            v.status = "Resolved"
        if mine and mine.active_violations_count > 0:
            mine.active_violations_count -= 1
            # Recalculate mine score
            mine.compliance_score = min(100.0, round(float(mine.compliance_score) + 4.0, 1))
            if mine.compliance_score >= 80.0 and mine.active_violations_count == 0:
                mine.status = "Compliant"
                mine.risk_level = "Low"

        create_notification(
            db=db,
            title=f"Corrective Action Approved: {action.id}",
            description=f"DGMS Inspector {current_user.name} approved remedial evidence. Violation {action.violation_id} is formally RESOLVED.",
            category="Corrective Action Requests",
            role_target="mine",
            link_to_module="/mine/actions"
        )
        record_audit_log(
            db=db,
            action="CORRECTIVE_ACTION_APPROVED",
            entity_type="CORRECTIVE_ACTION",
            entity_id=action.id,
            user=current_user,
            details={"decision": "Approved", "remarks": req.remarks, "violation_id": action.violation_id}
        )
    else:
        action.status = "Pending Response"
        if v:
            v.status = "Corrective Action Required"

        create_notification(
            db=db,
            title=f"Evidence Rejected / More Required: {action.id}",
            description=f"Inspector remarks: {req.remarks}. Please re-submit adequate documentary evidence.",
            category="Corrective Action Requests",
            role_target="mine",
            link_to_module="/mine/actions",
            priority="high"
        )
        record_audit_log(
            db=db,
            action="CORRECTIVE_ACTION_REJECTED",
            entity_type="CORRECTIVE_ACTION",
            entity_id=action.id,
            user=current_user,
            details={"decision": "Rejected", "remarks": req.remarks}
        )

    db.commit()

    return standard_response(
        success=True,
        message=f"Action adjudication completed: {req.decision}",
        data=serialize_action(action)
    )
