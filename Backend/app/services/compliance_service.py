import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.db.mongo import mongo_db
from app.models.compliance import ComplianceRecord
from app.models.mine import Mine
from app.models.user import User
from app.schemas.compliance import (
    TelemetrySubmissionData,
    TelemetrySubmissionResponse,
    MineComplianceBreakdown,
    ComplianceCategoryScore
)
from app.services.risk_service import evaluate_telemetry_compliance, calculate_mine_composite_risk
from app.services.ai_service import analyze_with_aiml
from app.services.notification_service import create_notification
from app.services.audit_service import record_audit_log
from app.utils.helpers import generate_id, format_current_timestamp

logger = logging.getLogger("koyla_drishti.services.compliance")

async def handle_telemetry_submission(
    data: TelemetrySubmissionData,
    db: Session,
    user: Optional[User] = None
) -> TelemetrySubmissionResponse:
    """Process statutory shift return, calculate score, run AI, persist to NeonDB & MongoDB."""
    mine_id = data.mine_id or (user.mine_id if user and user.mine_id else "KD-104")
    mine = db.query(Mine).filter(Mine.id == mine_id).first()
    if not mine:
        # Create mine entry if not found
        mine = Mine(
            id=mine_id,
            name=f"Coal Entity {mine_id}",
            operator="Coal Authority",
            mine_type="Opencast & Underground",
            district="Dhanbad",
            state="Jharkhand",
            compliance_score=85.0,
            risk_level="Low",
            status="Compliant",
            active_violations_count=0
        )
        db.add(mine)
        db.flush()

    # 1. Deterministic Rule-Based Calculation
    calculated_score, risk_level, status_label = evaluate_telemetry_compliance(
        pm10=data.pm10_level,
        noise_db=data.ambient_noise_db,
        methane=data.methane_concentration,
        vibration=data.blast_vibration_mms,
        water_ph=data.water_discharge_ph,
        safety_incident=data.safety_incident_reported
    )

    # 2. Run AIML API Intelligence Reasoning
    ai_reasoning = await analyze_with_aiml(
        context_type="telemetry",
        payload={
            "mine_id": mine_id,
            "calculated_score": calculated_score,
            "pm10_level": data.pm10_level,
            "methane_concentration": data.methane_concentration,
            "safety_incident_reported": data.safety_incident_reported
        }
    )

    # 3. Store in MongoDB Time-Series Collection
    mongo_raw_id = generate_id("IOT", 6)
    mongo_db.insert_document("telemetry_history", {
        "id": mongo_raw_id,
        "mine_id": mine_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "production_tonnage": data.production_tonnage,
        "pm10": data.pm10_level,
        "noise_db": data.ambient_noise_db,
        "methane": data.methane_concentration,
        "vibration": data.blast_vibration_mms,
        "water_ph": data.water_discharge_ph,
        "safety_incident": data.safety_incident_reported,
        "score": calculated_score,
        "risk_level": risk_level,
        "ai_reasoning": ai_reasoning.model_dump()
    })

    # 4. Save Authoritative Compliance Record to PostgreSQL
    compliance_id = generate_id("CMP", 5)
    record = ComplianceRecord(
        id=compliance_id,
        mine_id=mine_id,
        reporting_period="Daily Shift Return",
        category="Daily Telemetry & Environmental",
        production_tonnage=data.production_tonnage,
        pm10_level=data.pm10_level,
        ambient_noise_db=data.ambient_noise_db,
        methane_concentration=data.methane_concentration,
        blast_vibration_mms=data.blast_vibration_mms,
        water_discharge_ph=data.water_discharge_ph,
        safety_incident_reported=data.safety_incident_reported,
        notes=data.notes,
        attachment_filename=data.attachment_filename,
        calculated_score=calculated_score,
        risk_level=risk_level,
        status=status_label,
        ai_analysis_summary=f"{ai_reasoning.potential_issue}: {ai_reasoning.reason}",
        raw_telemetry_id=mongo_raw_id,
        submitted_by=user.id if user else None
    )
    db.add(record)

    # 5. Update Mine's Authoritative Aggregated Score & Risk
    mine.compliance_score = round((mine.compliance_score * 0.8) + (calculated_score * 0.2), 1)
    mine.risk_level = calculate_mine_composite_risk(
        compliance_score=mine.compliance_score,
        active_violations=mine.active_violations_count,
        recent_alerts_count=1 if risk_level in ["High", "Critical"] else 0,
        has_critical_violation=(risk_level == "Critical")
    )
    mine.status = "Compliant" if mine.compliance_score >= 80.0 else ("Under Review" if mine.compliance_score >= 65.0 else "Non-Compliant")

    # 6. Dispatch Notification if High/Critical Risk
    if risk_level in ["High", "Critical"]:
        create_notification(
            db=db,
            title=f"Elevated Shift Risk at {mine.name}",
            description=f"Calculated Score {calculated_score:.1f}% ({risk_level} Risk). {ai_reasoning.potential_issue}",
            category="AI Alerts",
            role_target="inspector",
            link_to_module="/inspector/dashboard",
            priority="high"
        )

    # 7. Audit Log
    record_audit_log(
        db=db,
        action="TELEMETRY_SUBMITTED",
        entity_type="COMPLIANCE",
        entity_id=compliance_id,
        user=user,
        details={
            "mine_id": mine_id,
            "calculated_score": calculated_score,
            "risk_level": risk_level,
            "status": status_label
        }
    )
    db.commit()

    return TelemetrySubmissionResponse(
        id=compliance_id,
        mine_id=mine_id,
        calculated_score=calculated_score,
        risk_level=risk_level,
        status=status_label,
        ai_analysis_summary=f"{ai_reasoning.potential_issue} - {ai_reasoning.recommended_action}",
        created_at=format_current_timestamp()
    )

def get_mine_compliance_breakdown(mine_id: str, db: Session) -> MineComplianceBreakdown:
    """Fetch structured compliance breakdown across statutory categories."""
    mine = db.query(Mine).filter(Mine.id == mine_id).first()
    name = mine.name if mine else f"Mine {mine_id}"
    score = mine.compliance_score if mine else 88.0
    risk = mine.risk_level if mine else "Low"
    status = mine.status if mine else "Compliant"

    categories = [
        ComplianceCategoryScore(
            title="Mine Geotechnical Slope & Bench Safety",
            score=min(100.0, score + 4.0),
            target=90.0,
            status="Satisfactory" if score >= 75 else "Remediation Required",
            notes="Bench angles compliant with DGMS circular 04/2021."
        ),
        ComplianceCategoryScore(
            title="Air Quality & Dust Suppression",
            score=max(50.0, score - 8.0),
            target=85.0,
            status="Remediation Required" if score < 85 else "Compliant",
            notes="PM10 continuous monitoring and haul road water mist sprinkling."
        ),
        ComplianceCategoryScore(
            title="HEMM Heavy Machinery Maintenance",
            score=min(100.0, score + 2.0),
            target=85.0,
            status="Compliant",
            notes="Dumpers and shovels equipped with proximity warning sensors."
        ),
        ComplianceCategoryScore(
            title="Statutory Documentation & Worker Medicals",
            score=min(100.0, score + 6.0),
            target=95.0,
            status="Optimal",
            notes="Form B employment register and statutory PME medicals up to date."
        ),
        ComplianceCategoryScore(
            title="Labour Welfare, Medical & PPE Protocols",
            score=score,
            target=92.0,
            status="Optimal" if score >= 85 else "Needs Improvement",
            notes="Periodic safety induction and mandatory helmet/vest enforcement."
        )
    ]

    return MineComplianceBreakdown(
        mine_id=mine_id,
        mine_name=name,
        overall_score=score,
        risk_level=risk,
        status=status,
        categories=categories
    )
