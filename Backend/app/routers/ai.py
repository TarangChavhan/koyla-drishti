from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.postgres import get_db
from app.db.mongo import mongo_db
from app.models.mine import Mine
from app.models.user import User
from app.models.violation import Violation
from app.models.corrective_action import CorrectiveAction
from app.schemas.ai import (
    AIAlertResponse,
    AlertVerifyRequest,
    AlertRejectRequest,
    AlertAssignRequest
)
from app.middleware.auth import require_authenticated_user, require_inspector
from app.services.notification_service import create_notification
from app.services.audit_service import record_audit_log
from app.utils.helpers import generate_id, format_current_timestamp, standard_response

router = APIRouter(tags=["AI Alerts & Analysis"])

def serialize_alert(doc: Dict[str, Any]) -> dict:
    return {
        "id": doc.get("id", str(doc.get("_id"))),
        "title": doc.get("title", "AI Pit Safety Alert"),
        "mineId": doc.get("mine_id"),
        "mineName": doc.get("mine_name"),
        "location": doc.get("location", "Main Working Face"),
        "category": doc.get("category", "Safety"),
        "confidenceScore": doc.get("confidence_score", 0.92),
        "severity": doc.get("severity", "High"),
        "detectedAt": doc.get("detected_at", "Today"),
        "status": doc.get("status", "New"),
        "assignedInspector": doc.get("assigned_inspector", "Rajesh Sharma, DGMS"),
        "inspectorId": doc.get("inspector_id", "USR-002"),
        "detectedIssue": doc.get("detected_issue", "Statutory compliance variance"),
        "supportingEvidence": doc.get("supporting_evidence", "Computer vision model inference"),
        "recommendedAction": doc.get("recommended_action", "Conduct on-site inspector verification."),
        "satelliteCoordinates": doc.get("satellite_coordinates")
    }

@router.get("/ai/alerts")
@router.get("/alerts")
async def get_all_alerts(
    status_filter: Optional[str] = None,
    mine_id: Optional[str] = None,
    current_user: User = Depends(require_authenticated_user)
):
    """List AI alerts from MongoDB."""
    filter_dict = {}
    if status_filter and status_filter != "All":
        filter_dict["status"] = status_filter
    if mine_id:
        filter_dict["mine_id"] = mine_id

    # If Mine Authority, only show alerts for their mine
    if current_user.role.upper() in ["MINE_AUTHORITY", "MINE"] and current_user.mine_id:
        filter_dict["mine_id"] = current_user.mine_id

    alerts = mongo_db.find_documents("ai_alerts", filter_dict=filter_dict, limit=100)
    results = [serialize_alert(a) for a in alerts]
    return standard_response(success=True, data=results)

@router.get("/ai/alerts/{alert_id}")
@router.get("/alerts/{alert_id}")
async def get_alert_by_id(
    alert_id: str,
    current_user: User = Depends(require_authenticated_user)
):
    """Retrieve detailed AI alert by ID."""
    alert = mongo_db.find_one_document("ai_alerts", {"id": alert_id})
    if not alert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"AI Alert {alert_id} not found")
    return standard_response(success=True, data=serialize_alert(alert))

@router.post("/alerts/{alert_id}/assign")
async def assign_alert_inspector(
    alert_id: str,
    req: AlertAssignRequest,
    current_user: User = Depends(require_authenticated_user)
):
    """Assign DGMS Inspector to an unassigned AI alert."""
    updated = mongo_db.update_document(
        "ai_alerts",
        {"id": alert_id},
        {
            "assigned_inspector": req.inspector_name,
            "inspector_id": req.inspector_id,
            "status": "Assigned"
        }
    )
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Alert {alert_id} not found")
    
    alert = mongo_db.find_one_document("ai_alerts", {"id": alert_id})
    return standard_response(success=True, message="Inspector assigned to alert", data=serialize_alert(alert))

@router.patch("/ai/alerts/{alert_id}/verify")
@router.post("/ai/alerts/{alert_id}/verify")
@router.post("/alerts/{alert_id}/verify")
async def verify_alert(
    alert_id: str,
    req: AlertVerifyRequest,
    current_user: User = Depends(require_inspector),
    db: Session = Depends(get_db)
):
    """
    GOVERNMENT WORKFLOW: Inspector reviews AI alert and verifies it.
    Transactions:
    1. Updates alert status to 'Verified' in MongoDB.
    2. Atomically creates official Violation in PostgreSQL.
    3. Atomically creates linked Corrective Action in PostgreSQL.
    4. Increments mine active_violations_count.
    5. Dispatches notification to Mine Authority.
    6. Writes immutable audit log.
    """
    alert = mongo_db.find_one_document("ai_alerts", {"id": alert_id})
    if not alert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"AI Alert {alert_id} not found")

    mine_id = alert.get("mine_id", "KD-104")
    mine = db.query(Mine).filter(Mine.id == mine_id).first()
    mine_name = mine.name if mine else alert.get("mine_name", f"Mine {mine_id}")

    try:
        # 1. Update Alert in MongoDB
        mongo_db.update_document(
            "ai_alerts",
            {"id": alert_id},
            {
                "status": "Verified",
                "officer_note": req.officer_note,
                "verified_by": current_user.name,
                "verified_at": format_current_timestamp()
            }
        )

        # 2. Compute deadline
        deadline_days = req.deadline_days or 7
        deadline_dt = datetime.now() + timedelta(days=deadline_days)
        deadline_str = deadline_dt.strftime("%d %b %Y")
        today_str = format_current_timestamp().split(",")[0]

        # 3. Create Official Violation in PostgreSQL
        violation_id = generate_id("VIO", 4)
        violation = Violation(
            id=violation_id,
            mine_id=mine_id,
            mine_name=mine_name,
            category=req.violation_category or alert.get("category", "Safety Compliance"),
            severity=alert.get("severity", "Medium"),
            description=f"{alert.get('detected_issue')} [Verified by {current_user.name}: {req.officer_note or 'Confirmed'}]",
            issued_date=today_str,
            deadline=deadline_str,
            assigned_inspector=current_user.name,
            assigned_inspector_id=current_user.id,
            status="Open",
            corrective_action_text=req.corrective_directives or alert.get("recommended_action", "Implement corrective compliance."),
            submitted_evidence=[],
            alert_id=alert_id
        )
        db.add(violation)

        # 4. Create Linked Corrective Action
        action_id = generate_id("ACT", 3)
        corrective_action = CorrectiveAction(
            id=action_id,
            violation_id=violation_id,
            mine_id=mine_id,
            mine_name=mine_name,
            title=f"Statutory Remedy: {violation.category}",
            instructions=req.corrective_directives or alert.get("recommended_action", "Address root cause and submit verified evidence dossier."),
            severity=violation.severity,
            due_date=deadline_str,
            status="Pending Response",
            submitted_evidence_files=[]
        )
        db.add(corrective_action)

        # 5. Update Mine Violation Backlog
        if mine:
            mine.active_violations_count += 1

        # 6. Notify Mine Authority
        create_notification(
            db=db,
            title=f"Official Violation Issued: {violation_id}",
            description=f"DGMS Inspector {current_user.name} issued statutory violation order for {violation.category}. Remedy required by {deadline_str}.",
            category="Violation Deadlines",
            role_target="mine",
            link_to_module="/mine/violations",
            priority="high" if violation.severity in ["High", "Critical"] else "normal"
        )

        # 7. Immutable Audit Trail
        record_audit_log(
            db=db,
            action="ALERT_VERIFIED_TO_VIOLATION",
            entity_type="VIOLATION",
            entity_id=violation_id,
            user=current_user,
            details={
                "alert_id": alert_id,
                "action_id": action_id,
                "mine_id": mine_id,
                "category": violation.category
            }
        )

        # Commit PostgreSQL Transaction
        db.commit()

        updated_alert = mongo_db.find_one_document("ai_alerts", {"id": alert_id})
        return standard_response(
            success=True,
            message="Alert verified successfully. Official violation order and corrective action issued.",
            data={
                "alert": serialize_alert(updated_alert),
                "violation_id": violation_id,
                "action_id": action_id
            }
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Transactional verification failure: {e}"
        )

@router.patch("/ai/alerts/{alert_id}/reject")
@router.post("/ai/alerts/{alert_id}/reject")
@router.post("/alerts/{alert_id}/reject")
async def reject_alert(
    alert_id: str,
    req: AlertRejectRequest,
    current_user: User = Depends(require_inspector),
    db: Session = Depends(get_db)
):
    """
    Inspector dismisses AI alert as false positive or acceptable variance.
    Will NOT create any violation.
    """
    alert = mongo_db.find_one_document("ai_alerts", {"id": alert_id})
    if not alert:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"AI Alert {alert_id} not found")

    mongo_db.update_document(
        "ai_alerts",
        {"id": alert_id},
        {
            "status": "False Positive",
            "officer_note": req.officer_note,
            "rejected_by": current_user.name,
            "rejected_at": format_current_timestamp()
        }
    )

    record_audit_log(
        db=db,
        action="ALERT_REJECTED_FALSE_POSITIVE",
        entity_type="AI_ALERT",
        entity_id=alert_id,
        user=current_user,
        details={"officer_note": req.officer_note}
    )
    db.commit()

    updated_alert = mongo_db.find_one_document("ai_alerts", {"id": alert_id})
    return standard_response(
        success=True,
        message="AI Alert marked as False Positive and archived without penalty.",
        data=serialize_alert(updated_alert)
    )
