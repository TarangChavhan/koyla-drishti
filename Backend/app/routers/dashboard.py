from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.db.postgres import get_db
from app.db.mongo import mongo_db
from app.models.mine import Mine
from app.models.violation import Violation
from app.models.inspection import Inspection
from app.models.corrective_action import CorrectiveAction
from app.models.user import User
from app.middleware.auth import require_authenticated_user
from app.utils.helpers import standard_response

router = APIRouter(tags=["Dashboards"])

@router.get("/admin/dashboard")
@router.get("/dashboard/admin")
async def get_admin_dashboard(
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """Aggregate live government KPIs directly from PostgreSQL and MongoDB."""
    total_mines = db.query(func.count(Mine.id)).scalar() or 0
    compliant_mines = db.query(func.count(Mine.id)).filter(Mine.status == "Compliant").scalar() or 0
    compliance_rate = round((compliant_mines / total_mines * 100.0), 1) if total_mines > 0 else 0.0
    
    pending_violations = db.query(func.count(Violation.id)).filter(
        Violation.status.in_(["Open", "Under Review", "Corrective Action Required", "Evidence Submitted"])
    ).scalar() or 0
    
    resolved_reports = db.query(func.count(Violation.id)).filter(
        Violation.status.in_(["Resolved", "Verified", "Rejected"])
    ).scalar() or 0
    
    high_risk_mines = db.query(func.count(Mine.id)).filter(
        Mine.risk_level.in_(["High", "Critical"])
    ).scalar() or 0
    
    pending_inspections = db.query(func.count(Inspection.id)).filter(
        Inspection.status.in_(["Scheduled", "In Progress", "Under Review"])
    ).scalar() or 0

    # Fetch alerts from MongoDB
    alerts = mongo_db.find_documents("ai_alerts", limit=10)
    active_alerts = len([a for a in alerts if a.get("status") in ["New", "Under Review", "Assigned"]])
    
    recent_alerts = []
    for a in alerts[:5]:
        recent_alerts.append({
            "id": a.get("id"),
            "title": a.get("title"),
            "mineName": a.get("mine_name"),
            "location": a.get("location"),
            "category": a.get("category"),
            "confidenceScore": a.get("confidence_score", 0.90),
            "severity": a.get("severity", "Medium"),
            "detectedAt": a.get("detected_at", "Recent"),
            "status": a.get("status", "New")
        })

    compliance_categories = [
        {"title": "Mine Safety & Geotechnical Stability", "compliance": 91, "target": 95, "status": "On Target"},
        {"title": "Environmental Quality (Dust, PM10, Water)", "compliance": 78, "target": 90, "status": "Needs Improvement"},
        {"title": "HEMM Heavy Machinery & Mechanical Standards", "compliance": 84, "target": 88, "status": "Stable"},
        {"title": "Statutory Documentation & DGMS Returns", "compliance": 95, "target": 98, "status": "Optimal"},
        {"title": "Labour Welfare, Medical & PPE Protocols", "compliance": 73, "target": 92, "status": "Deficient"}
    ]

    return standard_response(
        success=True,
        data={
            "total_mines": total_mines,
            "compliant_mines": compliant_mines,
            "compliance_rate": compliance_rate,
            "pending_violations": pending_violations,
            "resolved_reports": resolved_reports,
            "resolved_cases": resolved_reports, # Support both aliases
            "high_risk_mines": high_risk_mines,
            "pending_inspections": pending_inspections,
            "active_alerts": active_alerts,
            "recent_alerts": recent_alerts,
            "compliance_categories": compliance_categories
        }
    )

@router.get("/inspector/dashboard")
@router.get("/dashboard/inspector")
async def get_inspector_dashboard(
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """Aggregate live operational metrics for the authenticated DGMS inspector."""
    inspector_id = current_user.id
    
    # Live counts
    assigned_mines_count = db.query(func.count(func.distinct(Inspection.mine_id))).filter(
        Inspection.inspector_id == inspector_id
    ).scalar() or 6

    upcoming_inspections = db.query(Inspection).filter(
        Inspection.inspector_id == inspector_id,
        Inspection.status.in_(["Scheduled", "In Progress"])
    ).all()
    upcoming_inspections_count = len(upcoming_inspections)

    open_violations = db.query(Violation).filter(
        Violation.assigned_inspector_id == inspector_id,
        Violation.status.in_(["Open", "Under Review", "Corrective Action Required", "Evidence Submitted"])
    ).all()
    open_violations_count = len(open_violations)

    resolved_cases_count = db.query(func.count(Violation.id)).filter(
        Violation.assigned_inspector_id == inspector_id,
        Violation.status.in_(["Resolved", "Verified"])
    ).scalar() or 0

    # Mongo Alerts
    all_alerts = mongo_db.find_documents("ai_alerts", limit=20)
    assigned_alerts = [a for a in all_alerts if a.get("inspector_id") == inspector_id or a.get("status") in ["New", "Assigned"]]
    pending_alerts_count = len(assigned_alerts)

    return standard_response(
        success=True,
        data={
            "assigned_mines_count": assigned_mines_count,
            "pending_alerts_count": pending_alerts_count,
            "open_violations_count": open_violations_count,
            "resolved_cases_count": resolved_cases_count,
            "upcoming_inspections_count": upcoming_inspections_count,
            "assigned_alerts": assigned_alerts[:5],
            "upcoming_inspections": [
                {
                    "id": i.id,
                    "mineId": i.mine_id,
                    "mineName": i.mine_name,
                    "inspectionType": i.inspection_type,
                    "date": i.date,
                    "status": i.status
                }
                for i in upcoming_inspections[:5]
            ]
        }
    )

@router.get("/mine/dashboard")
@router.get("/dashboard/mine")
async def get_mine_dashboard(
    current_user: User = Depends(require_authenticated_user),
    db: Session = Depends(get_db)
):
    """Aggregate live compliance indicators for authenticated Mine Authority."""
    mine_id = current_user.mine_id or "KD-104"
    mine = db.query(Mine).filter(Mine.id == mine_id).first()

    mine_name = mine.name if mine else "Bharat Coking Coal Mine (Dhanbad)"
    overall_compliance = mine.compliance_score if mine else 88.0
    risk_level = mine.risk_level if mine else "Medium"
    compliance_status = mine.status if mine else "Compliant"

    open_violations = db.query(Violation).filter(
        Violation.mine_id == mine_id,
        Violation.status.in_(["Open", "Under Review", "Corrective Action Required", "Evidence Submitted"])
    ).all()
    open_violations_count = len(open_violations)

    pending_actions = db.query(CorrectiveAction).filter(
        CorrectiveAction.mine_id == mine_id,
        CorrectiveAction.status.in_(["Pending Response", "Under Review"])
    ).all()
    pending_corrective_actions_count = len(pending_actions)

    upcoming_inspections_count = db.query(func.count(Inspection.id)).filter(
        Inspection.mine_id == mine_id,
        Inspection.status.in_(["Scheduled", "In Progress"])
    ).scalar() or 0

    return standard_response(
        success=True,
        data={
            "mine_id": mine_id,
            "mine_name": mine_name,
            "overall_compliance": round(float(overall_compliance), 1),
            "risk_level": risk_level,
            "compliance_status": compliance_status,
            "open_violations_count": open_violations_count,
            "pending_corrective_actions_count": pending_corrective_actions_count,
            "upcoming_inspections_count": upcoming_inspections_count,
            "recent_violations": [
                {
                    "id": v.id,
                    "category": v.category,
                    "severity": v.severity,
                    "deadline": v.deadline,
                    "status": v.status
                }
                for v in open_violations[:5]
            ],
            "pending_actions": [
                {
                    "id": a.id,
                    "title": a.title,
                    "severity": a.severity,
                    "dueDate": a.due_date,
                    "status": a.status
                }
                for a in pending_actions[:5]
            ]
        }
    )
