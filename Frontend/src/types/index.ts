export type UserRole = 'admin' | 'inspector' | 'mine';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  organization?: string;
  department?: string;
  avatarText?: string;
  mineId?: string;
  mineName?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'Active' | 'Inactive';
  lastActive?: string;
}

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type ComplianceStatus = 'Compliant' | 'Under Review' | 'Non-Compliant';

export interface Mine {
  id: string; // e.g. KD-104
  name: string;
  operator: string;
  mineType: string;
  district: string;
  state: string;
  complianceScore: number;
  riskLevel: RiskLevel;
  status: ComplianceStatus;
  lastInspection: string;
  nextInspection: string;
  address?: string;
  contactOfficer?: string;
  contactEmail?: string;
  coordinates?: { lat: number; lng: number };
  activeViolationsCount: number;
}

export type AlertSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type AlertStatus = 'New' | 'Under Review' | 'Assigned' | 'Verified' | 'Rejected' | 'False Positive';

export interface AIAlert {
  id: string;
  title: string;
  mineId: string;
  mineName: string;
  location: string;
  category: 'Safety' | 'Environment' | 'Equipment' | 'Documentation' | 'Expansion';
  confidenceScore: number;
  severity: AlertSeverity;
  detectedAt: string;
  status: AlertStatus;
  assignedInspector?: string;
  inspectorId?: string;
  detectedIssue: string;
  supportingEvidence: string;
  recommendedAction: string;
  satelliteCoordinates?: string;
}

export type InspectionStatus = 'Scheduled' | 'In Progress' | 'Submitted' | 'Under Review' | 'Completed' | 'Cancelled';
export type InspectionType = 'Safety' | 'Environment' | 'Full Audit' | 'Follow-up' | 'Equipment';

export interface Inspection {
  id: string;
  mineId: string;
  mineName: string;
  inspectorName: string;
  inspectorId: string;
  inspectionType: InspectionType;
  date: string;
  time?: string;
  status: InspectionStatus;
  priority: 'Routine' | 'Priority' | 'Urgent';
  purpose: string;
  checklistItems: {
    id: string;
    label: string;
    completed: boolean;
    findings?: string;
  }[];
  observations?: string;
  recommendations?: string;
  evidenceFilesCount: number;
}

export type ViolationSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type ViolationStatus = 
  | 'Open' 
  | 'Under Review' 
  | 'Corrective Action Required' 
  | 'Evidence Submitted' 
  | 'Verified' 
  | 'Resolved' 
  | 'Rejected';

export interface Violation {
  id: string;
  mineId: string;
  mineName: string;
  category: string;
  severity: ViolationSeverity;
  description: string;
  issuedDate: string;
  deadline: string;
  assignedInspector: string;
  status: ViolationStatus;
  correctiveActionText?: string;
  submittedEvidence?: string[];
  mineResponse?: string;
}

export interface CorrectiveAction {
  id: string;
  violationId: string;
  mineId: string;
  mineName: string;
  title: string;
  instructions: string;
  severity: ViolationSeverity;
  dueDate: string;
  status: 'Pending Response' | 'Evidence Attached' | 'Under Review' | 'Approved' | 'Rejected' | 'Closed';
  responseNote?: string;
  submittedEvidenceFiles?: string[];
  inspectorRemarks?: string;
}

export interface MineDocument {
  id: string;
  mineId: string;
  mineName?: string;
  title: string;
  category: 'Safety' | 'Environment' | 'Equipment' | 'Compliance' | 'Operations';
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'jpg' | 'png' | 'xlsx' | 'csv';
  uploadDate: string;
  expiryDate?: string;
  status: 'Verified' | 'Review' | 'Rejected' | 'Pending';
  url?: string;
}

export interface ReportItem {
  id: string;
  title: string;
  type: 'Compliance' | 'Inspection' | 'Violation' | 'Risk' | 'Mine Summary';
  generatedDate: string;
  generatedBy: string;
  period: string;
  status: 'Available' | 'Processing' | 'Approved';
  fileFormat: 'PDF' | 'XLSX';
  format?: 'PDF' | 'XLSX' | string;
  downloadUrl?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: 'AI Alerts' | 'Inspection Updates' | 'Violation Deadlines' | 'Corrective Action Requests' | 'Document Verification' | 'Government Announcements';
  timestamp: string;
  read: boolean;
  roleTarget: UserRole | 'all';
  linkToModule?: string;
  priority?: 'normal' | 'high';
}

export * from './cctv';
