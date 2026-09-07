from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.postgres import get_db
from app.db.mongo import mongo_db
from app.models.compliance import ComplianceRecord
from app.models.mine import Mine
from app.models.user import User
from app.schemas.compliance import (
    TelemetrySubmissionData,
    TelemetrySubmissionResponse,
    MineComplianceBreakdown
)
from app.middleware.auth import require_authenticated_user, require_mine_authority, verify_mine_access
from app.services.compliance_service import handle_telemetry_submission, get_mine_compliance_breakdown
from app.utils.helpers import standard_response

router = APIRouter(tags=["Compliance & Telemetry"])

@router.post("/compliance")
@router.post("/compliance/submit")
async def submit_compliance(
    data: TelemetrySubmissionData,
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """
    Mine Authority submits daily statutory shift return and telemetry.
    Saves authoritative record to PostgreSQL, IoT time-series to MongoDB, runs AI risk analysis.
    """
    target_mine = data.mine_id or current_user.mine_id or "KD-104"
    verify_mine_access(current_user, target_mine)

    result = await handle_telemetry_submission(data, db, current_user)
    return standard_response(
        success=True,
        message="Statutory shift return evaluated and recorded successfully",
        data=result.model_dump()
    )

@router.get("/compliance/{mine_id}")
@router.get("/compliance/mine/{mine_id}")
async def get_mine_compliance(
    mine_id: str,
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """Get statutory compliance breakdown and score components for a specific mine."""
    verify_mine_access(current_user, mine_id)
    breakdown = get_mine_compliance_breakdown(mine_id, db)
    return standard_response(success=True, data=breakdown.model_dump())

@router.get("/compliance/{mine_id}/history")
async def get_compliance_history(
    mine_id: str,
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """Fetch historical compliance records from authoritative PostgreSQL storage."""
    verify_mine_access(current_user, mine_id)
    records = db.query(ComplianceRecord).filter(
        ComplianceRecord.mine_id == mine_id
    ).order_by(ComplianceRecord.created_at.desc()).limit(limit).all()

    data = [
        {
            "id": r.id,
            "reportingPeriod": r.reporting_period,
            "calculatedScore": r.calculated_score,
            "riskLevel": r.risk_level,
            "status": r.status,
            "pm10": r.pm10_level,
            "methane": r.methane_concentration,
            "noiseDb": r.ambient_noise_db,
            "vibration": r.blast_vibration_mms,
            "submittedAt": r.created_at.isoformat() if r.created_at else "Recent"
        }
        for r in records
    ]
    return standard_response(success=True, data=data)

@router.get("/telemetry/mine/{mine_id}/history")
async def get_telemetry_history(
    mine_id: str,
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(require_authenticated_user)
):
    """Fetch high-frequency IoT pit telemetry time-series from MongoDB."""
    verify_mine_access(current_user, mine_id)
    docs = mongo_db.find_documents("telemetry_history", filter_dict={"mine_id": mine_id}, limit=limit)
    return standard_response(success=True, data=docs)

@router.get("/telemetry/ai-inferences")
async def get_ai_inferences(
    mine_id: Optional[str] = None,
    current_user: User = Depends(require_authenticated_user)
):
    """Fetch raw computer vision and telemetry AI model outputs from MongoDB."""
    filter_dict = {"mine_id": mine_id} if mine_id else {}
    docs = mongo_db.find_documents("telemetry_history", filter_dict=filter_dict, limit=50)
    inferences = [d.get("ai_reasoning") for d in docs if d.get("ai_reasoning")]
    return standard_response(success=True, data=inferences)
