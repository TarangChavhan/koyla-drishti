import enum

class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    INSPECTOR = "INSPECTOR"
    MINE_AUTHORITY = "MINE_AUTHORITY"

class RiskLevel(str, enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"

class ComplianceStatus(str, enum.Enum):
    COMPLIANT = "Compliant"
    UNDER_REVIEW = "Under Review"
    NON_COMPLIANT = "Non-Compliant"

class InspectionStatus(str, enum.Enum):
    SCHEDULED = "Scheduled"
    IN_PROGRESS = "In Progress"
    SUBMITTED = "Submitted"
    UNDER_REVIEW = "Under Review"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"

class ViolationSeverity(str, enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"

class ViolationStatus(str, enum.Enum):
    OPEN = "Open"
    UNDER_REVIEW = "Under Review"
    CORRECTIVE_ACTION_REQUIRED = "Corrective Action Required"
    EVIDENCE_SUBMITTED = "Evidence Submitted"
    VERIFIED = "Verified"
    RESOLVED = "Resolved"
    REJECTED = "Rejected"

class ActionStatus(str, enum.Enum):
    PENDING_RESPONSE = "Pending Response"
    EVIDENCE_ATTACHED = "Evidence Attached"
    UNDER_REVIEW = "Under Review"
    APPROVED = "Approved"
    REJECTED = "Rejected"
    CLOSED = "Closed"
