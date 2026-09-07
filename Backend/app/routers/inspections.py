from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.postgres import get_db
from app.db.mongo import mongo_db
from app.models.inspection import Inspection
from app.models.mine import Mine
from app.models.user import User
from app.schemas.inspection import (
    InspectionCreate,
    InspectionUpdate,
    InspectionSubmitRequest,
    InspectionResponse,
    ChecklistItem
)
from app.middleware.auth import require_authenticated_user, require_inspector, verify_mine_access, verify_inspection_access
from app.services.notification_service import create_notification
from app.services.audit_service import record_audit_log
from app.utils.helpers import generate_id, format_current_timestamp, standard_response

router = APIRouter(prefix="/inspections", tags=["Inspection Management"])

def serialize_inspection(insp: Inspection) -> dict:
    checklist = insp.checklist_items or []
    if isinstance(checklist, list):
        items = checklist
    else:
        items = []

    return {
        "id": insp.id,
        "mineId": insp.mine_id,
        "mineName": insp.mine_name,
        "inspectorName": insp.inspector_name,
        "inspectorId": insp.inspector_id,
        "inspectionType": insp.inspection_type,
        "date": insp.date,
        "time": insp.time or "10:00 AM",
        "status": insp.status,
        "priority": insp.priority,
        "purpose": insp.purpose,
        "checklistItems": items,
        "observations": insp.observations,
        "recommendations": insp.recommendations,
        "evidenceFilesCount": insp.evidence_files_count
    }

@router.get("")
async def get_all_inspections(
    mine_id: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """List scheduled, in-progress, and submitted inspections."""
    query = db.query(Inspection)

    # If Mine Authority, restrict to their mine
    if current_user.role.upper() in ["MINE_AUTHORITY", "MINE"] and current_user.mine_id:
        query = query.filter(Inspection.mine_id == current_user.mine_id)
    elif mine_id:
        query = query.filter(Inspection.mine_id == mine_id)

    if status_filter and status_filter != "All":
        query = query.filter(Inspection.status.ilike(status_filter))

    inspections = query.order_by(Inspection.created_at.desc()).all()
    results = [serialize_inspection(i) for i in inspections]
    return standard_response(success=True, data=results)

@router.get("/{inspection_id}")
async def get_inspection_by_id(
    inspection_id: str,
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """Retrieve detailed inspection record."""
    insp = db.query(Inspection).filter(Inspection.id == inspection_id).first()
    if not insp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Inspection {inspection_id} not found")
    verify_mine_access(current_user, insp.mine_id)
    return standard_response(success=True, data=serialize_inspection(insp))

@router.post("")
async def schedule_inspection(
    req: InspectionCreate,
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """Admin or Inspector schedules a formal statutory on-site audit."""
    insp_id = req.id or generate_id("INS", 4)
    mine = db.query(Mine).filter(Mine.id == req.mineId).first()
    mine_name = mine.name if mine else req.mineName

    # Default statutory checklist items if none provided
    default_checklist = [
        {"id": "CHK-01", "label": "Mandatory PPE & Safety Gear Protocol Enforcement", "completed": False},
        {"id": "CHK-02", "label": "Geotechnical Slope Stability & Pit Bench Angle Verification", "completed": False},
        {"id": "CHK-03", "label": "HEMM Heavy Machinery Proximity & Audio-Visual Warning Tests", "completed": False},
        {"id": "CHK-04", "label": "Haul Road Water Mist Dust Suppression & Ambient Air Sampling", "completed": False},
        {"id": "CHK-05", "label": "Statutory DGMS Returns & Form B Employment Register Review", "completed": False}
    ]

    items_data = [item.dict() for item in req.checklistItems] if req.checklistItems else default_checklist

    new_insp = Inspection(
        id=insp_id,
        mine_id=req.mineId,
        mine_name=mine_name,
        inspector_id=req.inspectorId,
        inspector_name=req.inspectorName,
        inspection_type=req.inspectionType,
        date=req.date,
        time=req.time or "10:00 AM",
        status=req.status or "Scheduled",
        priority=req.priority or "Routine",
        purpose=req.purpose,
        checklist_items=items_data,
        observations=req.observations,
        recommendations=req.recommendations,
        evidence_files_count=0
    )
    db.add(new_insp)

    # Notify Inspector & Mine Authority
    create_notification(
        db=db,
        title=f"Statutory Inspection Scheduled: {insp_id}",
        description=f"Scheduled for {mine_name} on {req.date} at {req.time or '10:00 AM'}.",
        category="Inspection Updates",
        role_target="all",
        link_to_module="/inspector/inspections"
    )

    record_audit_log(
        db=db,
        action="INSPECTION_SCHEDULED",
        entity_type="INSPECTION",
        entity_id=insp_id,
        user=current_user,
        details={"mine_id": req.mineId, "date": req.date, "inspector": req.inspectorName}
    )
    db.commit()

    return standard_response(
        success=True,
        message="Statutory inspection scheduled successfully",
        data=serialize_inspection(new_insp)
    )

@router.put("/{inspection_id}")
@router.patch("/{inspection_id}")
async def update_inspection(
    inspection_id: str,
    req: InspectionUpdate,
    current_user: User = Depends(require_inspector),
    db: Session = Depends(get_db)
):
    """Inspector updates checklist items or schedule."""
    insp = db.query(Inspection).filter(Inspection.id == inspection_id).first()
    if not insp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Inspection {inspection_id} not found")

    if req.status: insp.status = req.status
    if req.date: insp.date = req.date
    if req.time: insp.time = req.time
    if req.observations: insp.observations = req.observations
    if req.recommendations: insp.recommendations = req.recommendations
    if req.checklistItems is not None:
        insp.checklist_items = [item.dict() for item in req.checklistItems]

    record_audit_log(
        db=db,
        action="INSPECTION_UPDATED",
        entity_type="INSPECTION",
        entity_id=insp.id,
        user=current_user
    )
    db.commit()
    return standard_response(success=True, message="Inspection updated", data=serialize_inspection(insp))

@router.post("/{inspection_id}/start")
async def start_inspection(
    inspection_id: str,
    current_user: User = Depends(require_inspector),
    db: Session = Depends(get_db)
):
    """Inspector commences execution of on-site inspection."""
    insp = db.query(Inspection).filter(Inspection.id == inspection_id).first()
    if not insp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Inspection {inspection_id} not found")

    insp.status = "In Progress"
    db.commit()
    return standard_response(success=True, message="Inspection status changed to In Progress", data=serialize_inspection(insp))

@router.post("/{inspection_id}/submit")
async def submit_inspection_report(
    inspection_id: str,
    req: InspectionSubmitRequest,
    current_user: User = Depends(require_inspector),
    db: Session = Depends(get_db)
):
    """
    Inspector submits final inspection findings, statutory observations, and directives.
    Updates inspection record in PostgreSQL, saves detailed findings in MongoDB.
    """
    insp = db.query(Inspection).filter(Inspection.id == inspection_id).first()
    if not insp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Inspection {inspection_id} not found")

    insp.observations = req.observations
    insp.recommendations = req.recommendations
    insp.status = req.status or "Submitted"

    # Store detailed dossier in MongoDB
    mongo_ref = generate_id("RPT-INSP", 5)
    mongo_db.insert_document("model_logs", {
        "id": mongo_ref,
        "inspection_id": inspection_id,
        "mine_id": insp.mine_id,
        "observations": req.observations,
        "recommendations": req.recommendations,
        "checklist": insp.checklist_items,
        "submitted_at": format_current_timestamp()
    })
    insp.mongo_report_ref = mongo_ref

    create_notification(
        db=db,
        title=f"Inspection Report Submitted: {insp.id}",
        description=f"Inspector {current_user.name} submitted official findings for {insp.mine_name}.",
        category="Inspection Updates",
        role_target="all",
        link_to_module="/inspector/inspections"
    )

    record_audit_log(
        db=db,
        action="INSPECTION_SUBMITTED",
        entity_type="INSPECTION",
        entity_id=insp.id,
        user=current_user,
        details={"status": insp.status, "observations_length": len(req.observations)}
    )
    db.commit()

    return standard_response(
        success=True,
        message="Statutory inspection report filed successfully",
        data=serialize_inspection(insp)
    )

@router.post("/{inspection_id}/complete")
async def complete_inspection(
    inspection_id: str,
    current_user: User = Depends(require_inspector),
    db: Session = Depends(get_db)
):
    """Mark statutory inspection as Completed."""
    insp = db.query(Inspection).filter(Inspection.id == inspection_id).first()
    if not insp:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Inspection {inspection_id} not found")

    insp.status = "Completed"
    db.commit()
    return standard_response(success=True, message="Inspection concluded and archived", data=serialize_inspection(insp))
