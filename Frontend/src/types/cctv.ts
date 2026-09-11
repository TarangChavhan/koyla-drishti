export type CameraStatus = 'ONLINE' | 'OFFLINE' | 'DEGRADED';
export type AIMonitoringStatus = 'ACTIVE' | 'INACTIVE' | 'FAILED';
export type DetectionClass =
  | 'worker'
  | 'helmet'
  | 'no_helmet'
  | 'safety_vest'
  | 'no_safety_vest'
  | 'fire'
  | 'smoke'
  | 'vehicle'
  | 'restricted_entry';

export interface CCTVCamera {
  id: string; // e.g. CAM-SECL-GEV-01
  name: string;
  mineId: string;
  mineName: string;
  company: string; // e.g. SECL, BCCL, CCL, NCL, etc.
  zone: string; // e.g. "Pit-4 Excavation Face", "Conveyor Transfer Point B", "Workshop Heavy Repair Bay", "Explosive Magazine"
  cameraStatus: CameraStatus;
  aiMonitoringStatus: AIMonitoringStatus;
  resolution: string; // "1920x1080 @ 30 FPS"
  streamUrl: string; // Masked RTSP/HLS stream URI
  rtspIp: string; // e.g. "10.24.112.4"
  lastHeartbeat: string;
  installedDate: string;
  assignedInspectorId?: string;
  assignedInspectorName?: string;
  ptzSupported: boolean;
  latitude?: number;
  longitude?: number;
}

export interface YOLODetection {
  id: string;
  class: DetectionClass;
  label: string;
  confidence: number; // 0.0 to 1.0
  bbox: [number, number, number, number]; // [x1, y1, x2, y2] in normalized or pixel coordinates
  trackId?: number;
  color: string;
}

export interface SafetyRule {
  id: string;
  name: string;
  description: string;
  detectionClasses: DetectionClass[];
  requiredZone?: string;
  minConfidence: number; // e.g. 0.80
  persistenceFrames: number; // e.g. 3 consecutive frames before event
  cooldownSeconds: number; // e.g. 120s cooldown
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  triggersBuzzer: boolean;
  enabled: boolean;
}

export interface CCTVEvent {
  id: string; // e.g. EVT-CCTV-2026-001
  mineId: string;
  mineName: string;
  cameraId: string;
  cameraName: string;
  zone: string;
  detectionType: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  timestamp: string;
  ruleId: string;
  ruleName: string;
  detections: YOLODetection[];
  evidenceFrameUrl: string;
  status: 'PROCESSED' | 'WARNING_TRIGGERED' | 'SUPPRESSED_DUPLICATE' | 'IGNORED_COOLDOWN';
}

export type WarningStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'FAILED';

export interface SafetyWarning {
  warningId: string; // e.g. WRN-CCTV-8821
  eventId: string;
  mineId: string;
  mineName: string;
  cameraId: string;
  cameraName: string;
  zone: string;
  detectionType: string;
  severity: 'High' | 'Critical';
  timestamp: string;
  startTime: string; // ISO string (authoritative from backend)
  endTime: string; // ISO string (startTime + 120s)
  duration: number; // 120 seconds
  status: WarningStatus;
  buzzerActive: boolean;
}

export type BuzzerState = 'BUZZER ACTIVE' | 'BUZZER INACTIVE';

export interface BuzzerStatus {
  status: BuzzerState;
  activeWarningId?: string;
  activeMineId?: string;
  activeMineName?: string;
  activeCameraId?: string;
  activeCameraName?: string;
  startedAt?: string;
  expiresAt?: string;
  remainingSeconds: number;
}

export type CCTVAlertStatus = 'DETECTED' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED';

export interface CCTVAlert {
  id: string; // e.g. ALT-CCTV-901
  eventId: string;
  mineId: string;
  mineName: string;
  cameraId: string;
  cameraName: string;
  zone: string;
  detection: string;
  confidence: number;
  riskLevel: 'High' | 'Critical' | 'Medium' | 'Low';
  dateTime: string;
  evidence: {
    frameUrl: string;
    annotatedUrl?: string;
    videoClipReference?: string;
    detections: YOLODetection[];
  };
  buzzerStatus: BuzzerState;
  alertStatus: CCTVAlertStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  violationId?: string; // Linked official violation when verified
  correctiveActionId?: string;
  investigationNotes?: string[];
}

export interface CCTVAuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action:
    | 'CCTV_EVENT_CREATED'
    | 'AI_ALERT_CREATED'
    | 'WARNING_ACTIVATED'
    | 'WARNING_COMPLETED'
    | 'WARNING_CANCELLED'
    | 'BUZZER_ACTIVATED'
    | 'BUZZER_DEACTIVATED'
    | 'INSPECTOR_VERIFICATION'
    | 'INSPECTOR_REJECTION'
    | 'OFFICIAL_VIOLATION_CREATED'
    | 'CORRECTIVE_ACTION_CREATED'
    | 'CAMERA_STATUS_CHANGED'
    | 'SAFETY_RULE_UPDATED';
  eventOrAlertId: string;
  result: string;
  details?: Record<string, unknown>;
}
