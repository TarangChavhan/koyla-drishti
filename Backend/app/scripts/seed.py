import logging
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.security import get_password_hash
from app.db.postgres import SessionLocal, init_postgres_db
from app.db.mongo import mongo_db
from app.models.user import User
from app.models.mine import Mine
from app.models.compliance import ComplianceRecord
from app.models.inspection import Inspection
from app.models.violation import Violation
from app.models.corrective_action import CorrectiveAction
from app.models.document import MineDocument
from app.models.notification import Notification
from app.models.report import Report
from app.models.audit_log import AuditLog
from app.utils.helpers import format_current_timestamp

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("koyla_drishti.seed")

def seed_database():
    """Seed relational database (PostgreSQL) and document database (MongoDB) with initial authoritative data."""
    logger.info("Initializing relational schema...")
    init_postgres_db()
    mongo_db.connect()

    db: Session = SessionLocal()
    try:
        # 1. SEED MINES
        logger.info("Seeding mines...")
        mines_data = [
            {
                "id": "KD-104",
                "name": "Bharat Coking Coal Mine (Dhanbad)",
                "operator": "Bharat Coking Coal Limited (BCCL)",
                "mine_type": "Coking Coal (Opencast & UG)",
                "district": "Dhanbad",
                "state": "Jharkhand",
                "compliance_score": 88.0,
                "risk_level": "Medium",
                "status": "Compliant",
                "last_inspection": "12 Aug 2026",
                "next_inspection": "08 Sep 2026",
                "address": "Koyla Bhawan, Koyla Nagar, Dhanbad, Jharkhand - 826005",
                "contact_officer": "Er. P. K. Mishra (Agent / GM)",
                "contact_email": "gm.compliance@bccl.gov.in",
                "latitude": 23.7957,
                "longitude": 86.4304,
                "active_violations_count": 3,
                "is_active": True
            },
            {
                "id": "KD-118",
                "name": "Talcher Colliery Complex",
                "operator": "Mahanadi Coalfields Limited (MCL)",
                "mine_type": "Non-Coking Thermal Coal",
                "district": "Angul",
                "state": "Odisha",
                "compliance_score": 74.0,
                "risk_level": "High",
                "status": "Under Review",
                "last_inspection": "24 Jul 2026",
                "next_inspection": "09 Sep 2026",
                "address": "Talcher Coalfields Area, Jagannath PO, Angul, Odisha - 759148",
                "contact_officer": "Dr. Debasis Mohapatra (Safety Officer)",
                "contact_email": "safety.talcher@mcl.gov.in",
                "latitude": 20.9500,
                "longitude": 85.2167,
                "active_violations_count": 4,
                "is_active": True
            },
            {
                "id": "KD-143",
                "name": "Korba West Mega Opencast Project",
                "operator": "South Eastern Coalfields Limited (SECL)",
                "mine_type": "Non-Coking Coal (Opencast)",
                "district": "Korba",
                "state": "Chhattisgarh",
                "compliance_score": 61.0,
                "risk_level": "High",
                "status": "Non-Compliant",
                "last_inspection": "07 Sep 2026",
                "next_inspection": "10 Sep 2026",
                "address": "SECL Korba Area, Kusmunda P.O., Korba, CG - 495677",
                "contact_officer": "S. N. Chandrakar (GM Operations)",
                "contact_email": "kusmunda.env@secl.gov.in",
                "latitude": 22.3595,
                "longitude": 82.7501,
                "active_violations_count": 5,
                "is_active": True
            },
            {
                "id": "KD-169",
                "name": "Singareni No. 2 Incline & OCP",
                "operator": "Singareni Collieries Company Limited (SCCL)",
                "mine_type": "High Grade Non-Coking",
                "district": "Bhadradri Kothagudem",
                "state": "Telangana",
                "compliance_score": 92.0,
                "risk_level": "Low",
                "status": "Compliant",
                "last_inspection": "18 Aug 2026",
                "next_inspection": "14 Sep 2026",
                "address": "Kothagudem Collieries, Bhadradri District, Telangana - 507101",
                "contact_officer": "V. Venkateshwarlu (Dir Mine Safety)",
                "contact_email": "compliance@scclmines.com",
                "latitude": 17.5500,
                "longitude": 80.6167,
                "active_violations_count": 1,
                "is_active": True
            },
            {
                "id": "KD-202",
                "name": "Jharia Opencast Fire Control Project",
                "operator": "BCCL - Jharia Coalfield Division",
                "mine_type": "Deep Coking Coal (Thermal Stowing)",
                "district": "Dhanbad",
                "state": "Jharkhand",
                "compliance_score": 58.0,
                "risk_level": "Critical",
                "status": "Non-Compliant",
                "last_inspection": "02 Sep 2026",
                "next_inspection": "07 Sep 2026",
                "address": "Jharia Fire Rehabilitation Area, Lodna, Dhanbad - 828131",
                "contact_officer": "K. B. Bannerjee (Safety Control Officer)",
                "contact_email": "safety.jharia@bccl.gov.in",
                "latitude": 23.7431,
                "longitude": 86.4172,
                "active_violations_count": 6,
                "is_active": True
            }
        ]

        for m in mines_data:
            if not db.query(Mine).filter(Mine.id == m["id"]).first():
                db.add(Mine(**m))
        db.flush()

        # 2. SEED USERS (Admin, Inspectors, Mine Authorities)
        logger.info("Seeding and synchronizing users...")
        admin_pass_hash = get_password_hash(settings.ADMIN_PASSWORD)

        # Synchronize passwords on existing users if present
        existing_users_passwords = {
            "admin@koyladristi.gov.in": get_password_hash("GovAdmin@2026"),
            "authority@bccl.gov.in": get_password_hash("MineBCCL@2026"),
            "manager@ccl.gov.in": get_password_hash("MineCCL@2026"),
            "rajesh.sharma@dgms.gov.in": get_password_hash("Inspector@2026"),
            "priya.verma@dgms.gov.in": get_password_hash("Inspector@2026"),
        }
        for email, p_hash in existing_users_passwords.items():
            u_db = db.query(User).filter(User.email == email).first()
            if u_db:
                u_db.password_hash = p_hash

        # Canonical application user accounts (matching frontend quick login buttons)
        canonical_users = [
            {
                "id": "USR-ADMIN",
                "name": settings.ADMIN_NAME,
                "email": settings.ADMIN_EMAIL, # admin@coal.gov.in
                "password_hash": admin_pass_hash,
                "role": "ADMIN",
                "designation": "Joint Secretary (Governance)",
                "organization": "Ministry of Coal, New Delhi",
                "department": "Mines Safety & Regulatory Governance",
                "avatar_text": "AS",
                "phone": "+91 11 2338 4501",
                "status": "active"
            },
            {
                "id": "USR-INSP",
                "name": "Rajesh Sharma, DGMS",
                "email": "inspector@dgms.gov.in",
                "password_hash": get_password_hash("Inspector@2026"),
                "role": "INSPECTOR",
                "designation": "Director of Mines Safety (East Zone)",
                "organization": "Directorate General of Mines Safety",
                "department": "DGMS Dhanbad Inspection Wing",
                "avatar_text": "RS",
                "phone": "+91 98451 22910",
                "status": "active"
            },
            {
                "id": "USR-MINE",
                "name": "Bharat Coking Coal Ltd. Authority",
                "email": "mine@bccl.gov.in",
                "password_hash": get_password_hash("MineBCCL@2026"),
                "role": "MINE_AUTHORITY",
                "designation": "General Manager (Safety & Compliance)",
                "organization": "Bharat Coking Coal Limited (BCCL)",
                "department": "Safety & Statutory Returns Cell",
                "avatar_text": "BM",
                "phone": "+91 94311 02847",
                "status": "active",
                "mine_id": "KD-104"
            }
        ]

        for u in canonical_users:
            existing = db.query(User).filter((User.id == u["id"]) | (User.email == u["email"])).first()
            if not existing:
                db.add(User(**u))
            else:
                existing.password_hash = u["password_hash"]
                existing.role = u["role"]
        db.flush()

        # 3. SEED INSPECTIONS
        logger.info("Seeding statutory inspections...")
        inspections_data = [
            {
                "id": "INS-2401",
                "mine_id": "KD-104",
                "mine_name": "Bharat Coking Coal Mine (Dhanbad)",
                "inspector_id": "USR-002",
                "inspector_name": "Rajesh Sharma, DGMS",
                "inspection_type": "Safety",
                "date": "08 Sep 2026",
                "time": "10:30 AM",
                "status": "Scheduled",
                "priority": "Urgent",
                "purpose": "Comprehensive pit safety, bench stability & PPE compliance verification under Mines Rules 1955.",
                "checklist_items": [
                    {"id": "CHK-01", "label": "PPE Compliance (Helmets, boots, vests)", "completed": True, "findings": "Satisfactory in Section A"},
                    {"id": "CHK-02", "label": "Geotechnical slope stability audit", "completed": False},
                    {"id": "CHK-03", "label": "HEMM heavy machinery warning systems", "completed": False}
                ],
                "observations": "Initial review scheduled following automated CCTV PPE anomaly alert.",
                "recommendations": "Ensure all shift supervisors are available for safety interview.",
                "evidence_files_count": 2
            },
            {
                "id": "INS-2402",
                "mine_id": "KD-118",
                "mine_name": "Talcher Colliery Complex",
                "inspector_id": "USR-004",
                "inspector_name": "Sunil Verma",
                "inspection_type": "Environment",
                "date": "09 Sep 2026",
                "time": "11:00 AM",
                "status": "Scheduled",
                "priority": "Priority",
                "purpose": "Dust suppression, PM10 sensor calibration, and mine water discharge effluent verification.",
                "checklist_items": [
                    {"id": "CHK-01", "label": "Continuous Ambient Air Quality Station", "completed": False},
                    {"id": "CHK-02", "label": "Water Treatment Plant Effluent pH", "completed": False}
                ],
                "evidence_files_count": 0
            }
        ]

        for i in inspections_data:
            if not db.query(Inspection).filter(Inspection.id == i["id"]).first():
                db.add(Inspection(**i))
        db.flush()

        # 4. SEED VIOLATIONS & CORRECTIVE ACTIONS
        logger.info("Seeding violations and corrective actions...")
        violations_data = [
            {
                "id": "VIO-1024",
                "mine_id": "KD-104",
                "mine_name": "Bharat Coking Coal Mine (Dhanbad)",
                "category": "Labour Welfare & PPE",
                "severity": "High",
                "description": "Optical CCTV surveillance detected 4 workers operating near dump pocket without high-visibility vests and safety helmets.",
                "issued_date": "14 Aug 2026",
                "deadline": "28 Aug 2026",
                "assigned_inspector": "Rajesh Sharma, DGMS",
                "assigned_inspector_id": "USR-002",
                "status": "Corrective Action Required",
                "corrective_action_text": "Conduct mandatory safety induction and replace non-compliant equipment with certified DGMS ISI standard PPE.",
                "submitted_evidence": ["ppe_purchase_invoice.pdf"],
                "mine_response": "120 new safety vests and helmets procured from authorized supplier; distribution underway."
            },
            {
                "id": "VIO-1025",
                "mine_id": "KD-104",
                "mine_name": "Bharat Coking Coal Mine (Dhanbad)",
                "category": "Environmental Compliance",
                "severity": "Medium",
                "description": "Continuous ambient air quality monitor recorded PM10 exceedance (142 µg/m3 vs permissible 100 µg/m3) along haul road 3.",
                "issued_date": "20 Aug 2026",
                "deadline": "05 Sep 2026",
                "assigned_inspector": "Sunil Verma",
                "assigned_inspector_id": "USR-004",
                "status": "Evidence Submitted",
                "corrective_action_text": "Deploy 3 additional mobile water mist sprayers and reduce dumper speed limit to 20 km/h.",
                "submitted_evidence": ["water_sprinkler_log.pdf"],
                "mine_response": "Additional water mist trucks commissioned on Haul Road 3. PM10 normalized to 68 µg/m3."
            }
        ]

        for v in violations_data:
            if not db.query(Violation).filter(Violation.id == v["id"]).first():
                db.add(Violation(**v))
        db.flush()

        actions_data = [
            {
                "id": "ACT-501",
                "violation_id": "VIO-1024",
                "mine_id": "KD-104",
                "mine_name": "Bharat Coking Coal Mine (Dhanbad)",
                "title": "Mandatory PPE Retooling & Shift Warden Deployment",
                "instructions": "Replace deficient safety gear and conduct mandatory PPE muster parade before each shift.",
                "severity": "High",
                "due_date": "28 Aug 2026",
                "status": "Under Review",
                "response_note": "Procurement completed. Muster parade verified by Safety Officer Er. P. K. Mishra.",
                "submitted_evidence_files": ["ppe_muster_roll_aug26.pdf", "supplier_receipt.pdf"],
                "inspector_remarks": "Pending on-site verification during scheduled inspection on 08 Sep 2026."
            },
            {
                "id": "ACT-502",
                "violation_id": "VIO-1025",
                "mine_id": "KD-104",
                "mine_name": "Bharat Coking Coal Mine (Dhanbad)",
                "title": "Continuous Haul Road Dust Suppression",
                "instructions": "Increase water mist sprinkling frequency to twice hourly during operational dry hours.",
                "severity": "Medium",
                "due_date": "05 Sep 2026",
                "status": "Evidence Attached",
                "response_note": "Sprinkling cycle enhanced. Water tank telemetry attached.",
                "submitted_evidence_files": ["water_sprinkler_log.pdf"]
            }
        ]

        for a in actions_data:
            if not db.query(CorrectiveAction).filter(CorrectiveAction.id == a["id"]).first():
                db.add(CorrectiveAction(**a))
        db.flush()

        # 5. SEED COMPLIANCE RECORDS
        logger.info("Seeding statutory compliance telemetry records...")
        compliance_records = [
            {
                "id": "CMP-901",
                "mine_id": "KD-104",
                "reporting_period": "Daily Shift 1 Return (07 Sep 2026)",
                "category": "Daily Telemetry & Environmental",
                "production_tonnage": "14,250",
                "pm10_level": 68.0,
                "ambient_noise_db": 72.0,
                "methane_concentration": 0.18,
                "blast_vibration_mms": 3.4,
                "water_discharge_ph": 7.2,
                "safety_incident_reported": False,
                "calculated_score": 88.0,
                "risk_level": "Medium",
                "status": "Compliant",
                "ai_analysis_summary": "All shift air and vibration parameters within statutory DGMS bounds.",
                "submitted_by": "USR-003"
            }
        ]

        for c in compliance_records:
            if not db.query(ComplianceRecord).filter(ComplianceRecord.id == c["id"]).first():
                db.add(ComplianceRecord(**c))
        db.flush()

        # 6. SEED DOCUMENTS
        logger.info("Seeding statutory documents...")
        docs_data = [
            {
                "id": "DOC-101",
                "mine_id": "KD-104",
                "mine_name": "Bharat Coking Coal Mine (Dhanbad)",
                "title": "DGMS Statutory Environmental Clearance 2026-27",
                "category": "Compliance",
                "file_name": "DGMS_EC_Clearance_2026_KD104.pdf",
                "file_path": "uploads/DGMS_EC_Clearance_2026_KD104.pdf",
                "file_size": "2.4 MB",
                "file_type": "pdf",
                "upload_date": "15 Aug 2026",
                "expiry_date": "31 Dec 2027",
                "status": "Verified",
                "uploaded_by": "USR-003"
            },
            {
                "id": "DOC-102",
                "mine_id": "KD-104",
                "mine_name": "Bharat Coking Coal Mine (Dhanbad)",
                "title": "Quarterly HEMM Heavy Machinery Brake & Sensor Audit",
                "category": "Equipment",
                "file_name": "HEMM_Quarterly_Audit_Q2.pdf",
                "file_path": "uploads/HEMM_Quarterly_Audit_Q2.pdf",
                "file_size": "4.1 MB",
                "file_type": "pdf",
                "upload_date": "01 Aug 2026",
                "expiry_date": "01 Nov 2026",
                "status": "Verified",
                "uploaded_by": "USR-003"
            }
        ]

        for d in docs_data:
            if not db.query(MineDocument).filter(MineDocument.id == d["id"]).first():
                db.add(MineDocument(**d))
        db.flush()

        # 7. SEED NOTIFICATIONS
        logger.info("Seeding notifications...")
        notifications_data = [
            {
                "id": "NTF-101",
                "title": "AI Safety Signal: PPE Variance Detected",
                "description": "Optical pit surveillance flagged 2 workers without safety helmets at Bharat Coking Coal Mine.",
                "category": "AI Alerts",
                "timestamp": "Today, 14:15",
                "is_read": False,
                "role_target": "inspector",
                "link_to_module": "/inspector/alerts",
                "priority": "high"
            },
            {
                "id": "NTF-102",
                "title": "Statutory Inspection Scheduled for Tomorrow",
                "description": "DGMS Joint Director Rajesh Sharma confirmed on-site audit for Mine KD-104 at 10:30 AM.",
                "category": "Inspection Updates",
                "timestamp": "Today, 11:30",
                "is_read": False,
                "role_target": "mine",
                "link_to_module": "/mine/inspections",
                "priority": "normal"
            },
            {
                "id": "NTF-103",
                "title": "Monthly DGMS Statutory Return Deadline",
                "description": "All mine authorities must submit finalized monthly production and environmental returns by 10th Sep.",
                "category": "Government Announcements",
                "timestamp": "Yesterday",
                "is_read": True,
                "role_target": "all",
                "priority": "normal"
            }
        ]

        for n in notifications_data:
            if not db.query(Notification).filter(Notification.id == n["id"]).first():
                db.add(Notification(**n))
        db.flush()

        # 8. SEED REPORTS
        logger.info("Seeding reports...")
        reports_data = [
            {
                "id": "RPT-2026-101",
                "title": "Annual National Coal Mine Safety & DGMS Compliance Digest",
                "type": "Compliance",
                "generated_date": "01 Sep 2026",
                "generated_by": "Ministry of Coal Governance Cell",
                "period": "FY 2025-26",
                "status": "Available",
                "file_format": "PDF"
            }
        ]
        for r in reports_data:
            if not db.query(Report).filter(Report.id == r["id"]).first():
                db.add(Report(**r))

        db.commit()
        logger.info("PostgreSQL authoritative seed data successfully committed.")

        # 9. SEED MONGODB AI ALERTS
        logger.info("Seeding MongoDB AI Alerts collection...")
        sample_alerts = [
            {
                "id": "ALT-9021",
                "title": "CCTV Anomaly: Worker Personnel Without Helmet",
                "mine_id": "KD-104",
                "mine_name": "Bharat Coking Coal Mine (Dhanbad)",
                "location": "Active Pit Haulage Incline / Face",
                "category": "Safety",
                "confidence_score": 0.94,
                "severity": "High",
                "detected_at": "Today, 14:15",
                "status": "New",
                "assigned_inspector": "Rajesh Sharma, DGMS",
                "inspector_id": "USR-002",
                "detected_issue": "Optical CCTV surveillance detected 2 personnel walking near heavy dumpers without safety helmets.",
                "supporting_evidence": "Optical frame cctv_incline_sec3_1415.jpg analyzed with YOLOv8-Safety model.",
                "recommended_action": "Conduct immediate helmet verification and issue safety warning under Mines Rules 1955.",
                "satellite_coordinates": "23.7957, 86.4304"
            },
            {
                "id": "ALT-9022",
                "title": "Thermal Anomaly: Pit Sector Smoke Emission",
                "mine_id": "KD-202",
                "mine_name": "Jharia Opencast Fire Control Project",
                "location": "Sector 4 Coal Seam Outcrop",
                "category": "Environment",
                "confidence_score": 0.91,
                "severity": "Critical",
                "detected_at": "Today, 11:20",
                "status": "Under Review",
                "assigned_inspector": "Rajesh Sharma, DGMS",
                "inspector_id": "USR-002",
                "detected_issue": "Sub-surface coal fire thermal venting identified with smoke plume emission.",
                "supporting_evidence": "Thermal IR imaging sensor unit 04.",
                "recommended_action": "Deploy nitrogen flushing and surface inert clay blanket capping.",
                "satellite_coordinates": "23.7431, 86.4172"
            }
        ]

        for alt in sample_alerts:
            existing = mongo_db.find_one_document("ai_alerts", {"id": alt["id"]})
            if not existing:
                mongo_db.insert_document("ai_alerts", alt)

        logger.info("MongoDB AI Alerts seeded successfully.")
        logger.info("Seed completed successfully! Admin login: admin@coal.gov.in / GovAdmin@2026")

    except Exception as e:
        db.rollback()
        logger.exception(f"Database seed failed: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
