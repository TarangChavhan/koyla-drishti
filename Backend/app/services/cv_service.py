import os
import logging
from typing import Optional
from sqlalchemy.orm import Session
from app.db.mongo import mongo_db
from app.models.mine import Mine
from app.models.user import User
from app.schemas.ai import PPEResponse, HazardResponse
from app.services.risk_service import evaluate_ppe_risk
from app.services.notification_service import create_notification
from app.services.audit_service import record_audit_log
from app.utils.helpers import generate_id, format_current_timestamp
from ml.inference.ppe_detector import ppe_detector
from ml.inference.hazard_detector import hazard_detector

logger = logging.getLogger("koyla_drishti.services.cv")

async def process_ppe_image(
    mine_id: str,
    image_bytes: bytes,
    filename: str,
    db: Session,
    user: Optional[User] = None
) -> PPEResponse:
    """Complete PPE Computer Vision Pipeline."""
    mine = db.query(Mine).filter(Mine.id == mine_id).first()
    mine_name = mine.name if mine else f"Mine {mine_id}"

    # 1. Run detection model
    det_result = ppe_detector.detect(image_bytes)

    # 2. Risk Calculation
    risk_level, compliance_pct = evaluate_ppe_risk(
        workers=det_result["workers_detected"],
        helmet_viol=det_result["helmet_violation"],
        vest_viol=det_result["vest_violation"]
    )

    # 3. Store full prediction in MongoDB
    detection_doc = {
        "id": generate_id("CV-PPE", 5),
        "mine_id": mine_id,
        "mine_name": mine_name,
        "filename": filename,
        "workers_detected": det_result["workers_detected"],
        "helmet_compliant": det_result["helmet_compliant"],
        "helmet_violation": det_result["helmet_violation"],
        "vest_compliant": det_result["vest_compliant"],
        "vest_violation": det_result["vest_violation"],
        "compliance_percentage": compliance_pct,
        "risk_level": risk_level,
        "confidence": det_result["confidence"],
        "bounding_boxes": det_result["boxes"]
    }
    mongo_db.insert_document("ppe_detections", detection_doc)

    alert_created = False
    alert_id = None

    # 4. Generate AI Alert in MongoDB if threshold exceeded (violations detected)
    if det_result["helmet_violation"] > 0 or det_result["vest_violation"] > 0:
        alert_id = generate_id("ALT", 4)
        issue_text = (
            f"PPE Non-Compliance: {det_result['helmet_violation']} worker(s) without helmet, "
            f"{det_result['vest_violation']} worker(s) without safety vest."
        )
        alert_doc = {
            "id": alert_id,
            "title": "CCTV AI Alert: PPE Protocol Violation",
            "mine_id": mine_id,
            "mine_name": mine_name,
            "location": "Active Pit Haulage Area / Face",
            "category": "Safety",
            "confidence_score": det_result["confidence"],
            "severity": risk_level,
            "detected_at": format_current_timestamp(),
            "status": "New",
            "assigned_inspector": "Rajesh Sharma, DGMS",
            "inspector_id": "USR-002",
            "detected_issue": issue_text,
            "supporting_evidence": f"Optical detection on CCTV capture '{filename}'",
            "recommended_action": "Issue formal safety directive and conduct spot helmet inspection under Mines Rules 1955.",
            "satellite_coordinates": f"{mine.latitude if mine else 23.79}, {mine.longitude if mine else 86.43}"
        }
        mongo_db.insert_document("ai_alerts", alert_doc)
        alert_created = True

        # Dispatch Notification to DGMS Inspectors
        create_notification(
            db=db,
            title=f"AI Safety Alert: {mine_name}",
            description=issue_text,
            category="AI Alerts",
            role_target="inspector",
            link_to_module="/inspector/alerts",
            priority="high" if risk_level in ["High", "Critical"] else "normal"
        )

    # 5. Record Audit Trail
    record_audit_log(
        db=db,
        action="AI_PPE_ANALYSIS",
        entity_type="MINE",
        entity_id=mine_id,
        user=user,
        details={
            "filename": filename,
            "workers": det_result["workers_detected"],
            "helmet_violation": det_result["helmet_violation"],
            "vest_violation": det_result["vest_violation"],
            "alert_created": alert_created
        }
    )
    db.commit()

    return PPEResponse(
        mine_id=mine_id,
        workers_detected=det_result["workers_detected"],
        helmet_compliant=det_result["helmet_compliant"],
        helmet_violation=det_result["helmet_violation"],
        vest_compliant=det_result["vest_compliant"],
        vest_violation=det_result["vest_violation"],
        risk_level=risk_level,
        confidence=det_result["confidence"],
        detections=det_result["boxes"],
        alert_created=alert_created,
        alert_id=alert_id
    )

async def process_hazard_image(
    mine_id: str,
    image_bytes: bytes,
    filename: str,
    db: Session,
    user: Optional[User] = None
) -> HazardResponse:
    """Hazard Detection Pipeline for fire, smoke, and environmental risks."""
    mine = db.query(Mine).filter(Mine.id == mine_id).first()
    mine_name = mine.name if mine else f"Mine {mine_id}"

    # 1. Run detection
    h_result = hazard_detector.detect(image_bytes)

    # 2. Store prediction in MongoDB
    mongo_db.insert_document("hazard_detections", {
        "id": generate_id("CV-HAZ", 5),
        "mine_id": mine_id,
        "filename": filename,
        **h_result
    })

    alert_created = False
    alert_id = None

    # 3. Create AI Alert if hazard detected
    if h_result["hazard_detected"]:
        alert_id = generate_id("ALT", 4)
        alert_doc = {
            "id": alert_id,
            "title": f"Hazard Alert: Uncontrolled {h_result['hazard_type'].capitalize()}",
            "mine_id": mine_id,
            "mine_name": mine_name,
            "location": "Pit Sector / Stockpile Area",
            "category": "Environment" if h_result["hazard_type"] == "smoke" else "Safety",
            "confidence_score": h_result["confidence"],
            "severity": h_result["severity"],
            "detected_at": format_current_timestamp(),
            "status": "New",
            "assigned_inspector": "Sunil Verma",
            "inspector_id": "USR-004",
            "detected_issue": h_result["description"],
            "supporting_evidence": f"Optical thermal detection on frame '{filename}'",
            "recommended_action": "Verify pit perimeter status and alert mine safety supervisor immediately.",
            "satellite_coordinates": f"{mine.latitude if mine else 23.79}, {mine.longitude if mine else 86.43}"
        }
        mongo_db.insert_document("ai_alerts", alert_doc)
        alert_created = True

        create_notification(
            db=db,
            title=f"Environmental Hazard Detected: {mine_name}",
            description=h_result["description"],
            category="AI Alerts",
            role_target="inspector",
            link_to_module="/inspector/alerts",
            priority="high"
        )

    record_audit_log(
        db=db,
        action="AI_HAZARD_ANALYSIS",
        entity_type="MINE",
        entity_id=mine_id,
        user=user,
        details={"filename": filename, "hazard_detected": h_result["hazard_detected"]}
    )
    db.commit()

    return HazardResponse(
        mine_id=mine_id,
        hazard_detected=h_result["hazard_detected"],
        hazard_type=h_result["hazard_type"],
        confidence=h_result["confidence"],
        risk_level=h_result["severity"],
        description=h_result["description"],
        alert_created=alert_created,
        alert_id=alert_id
    )
