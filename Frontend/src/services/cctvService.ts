import {
  CCTVCamera,
  CCTVEvent,
  CCTVAlert,
  SafetyRule,
  SafetyWarning,
  BuzzerStatus,
  CCTVAuditLog,
  YOLODetection,
  CameraStatus,
  AIMonitoringStatus,
  BuzzerState,
  CCTVAlertStatus
} from '../types/cctv';
import { violationService } from './violationService';
import { notificationService } from './notificationService';

// Storage keys
const CAMERAS_STORAGE_KEY = 'koyla_drishti_cctv_cameras';
const EVENTS_STORAGE_KEY = 'koyla_drishti_cctv_events';
const WARNINGS_STORAGE_KEY = 'koyla_drishti_cctv_warnings';
const ALERTS_STORAGE_KEY = 'koyla_drishti_cctv_alerts';
const RULES_STORAGE_KEY = 'koyla_drishti_cctv_rules';
const AUDIT_STORAGE_KEY = 'koyla_drishti_cctv_audit';

// Initial Registered CCTV Cameras
export const INITIAL_CAMERAS: CCTVCamera[] = [
  {
    id: 'CAM-SECL-GEV-01',
    name: 'Pit-4 Highwall & Shovel Active Face',
    mineId: 'KD-101',
    mineName: 'Gevra OC Mine (SECL)',
    company: 'SECL',
    zone: 'Excavation Pit / Face',
    cameraStatus: 'ONLINE',
    aiMonitoringStatus: 'ACTIVE',
    resolution: '1920x1080 @ 30 FPS',
    streamUrl: 'rtsp://10.24.112.4:554/live/stream_ch01',
    rtspIp: '10.24.112.4',
    lastHeartbeat: new Date().toISOString(),
    installedDate: '2024-03-15',
    assignedInspectorId: 'USR-002',
    assignedInspectorName: 'Er. R. K. Sharma (DGMS)',
    ptzSupported: true,
    latitude: 22.3482,
    longitude: 82.5931
  },
  {
    id: 'CAM-SECL-GEV-02',
    name: 'Conveyor Transfer Tower Point 3B',
    mineId: 'KD-101',
    mineName: 'Gevra OC Mine (SECL)',
    company: 'SECL',
    zone: 'Conveyor Corridor',
    cameraStatus: 'ONLINE',
    aiMonitoringStatus: 'ACTIVE',
    resolution: '1920x1080 @ 30 FPS',
    streamUrl: 'rtsp://10.24.112.5:554/live/stream_ch02',
    rtspIp: '10.24.112.5',
    lastHeartbeat: new Date().toISOString(),
    installedDate: '2024-04-10',
    assignedInspectorId: 'USR-002',
    assignedInspectorName: 'Er. R. K. Sharma (DGMS)',
    ptzSupported: false,
    latitude: 22.3491,
    longitude: 82.5942
  },
  {
    id: 'CAM-BCCL-JHR-01',
    name: 'Block-II Heavy Repair Bay & HEMM Workshop',
    mineId: 'KD-104',
    mineName: 'Jharia Coalfield Concession (BCCL)',
    company: 'BCCL',
    zone: 'Workshop Heavy Repair Bay',
    cameraStatus: 'ONLINE',
    aiMonitoringStatus: 'ACTIVE',
    resolution: '1920x1080 @ 30 FPS',
    streamUrl: 'rtsp://10.38.45.12:554/live/stream_ch01',
    rtspIp: '10.38.45.12',
    lastHeartbeat: new Date().toISOString(),
    installedDate: '2023-11-20',
    assignedInspectorId: 'USR-002',
    assignedInspectorName: 'Er. R. K. Sharma (DGMS)',
    ptzSupported: true,
    latitude: 23.7512,
    longitude: 86.4189
  },
  {
    id: 'CAM-BCCL-JHR-02',
    name: 'Seam-X Spontaneous Combustion Perimeter',
    mineId: 'KD-104',
    mineName: 'Jharia Coalfield Concession (BCCL)',
    company: 'BCCL',
    zone: 'Fire Danger Zone',
    cameraStatus: 'DEGRADED',
    aiMonitoringStatus: 'ACTIVE',
    resolution: '1280x720 @ 15 FPS',
    streamUrl: 'rtsp://10.38.45.13:554/live/stream_ch02',
    rtspIp: '10.38.45.13',
    lastHeartbeat: new Date(Date.now() - 120000).toISOString(),
    installedDate: '2024-01-05',
    assignedInspectorId: 'USR-002',
    assignedInspectorName: 'Er. R. K. Sharma (DGMS)',
    ptzSupported: true,
    latitude: 23.754,
    longitude: 86.421
  },
  {
    id: 'CAM-CCL-PIP-01',
    name: 'Ashok OCP Haul Road Junction Alpha',
    mineId: 'KD-102',
    mineName: 'Piparwar OCP (CCL)',
    company: 'CCL',
    zone: 'Haul Road Crossing',
    cameraStatus: 'ONLINE',
    aiMonitoringStatus: 'ACTIVE',
    resolution: '1920x1080 @ 30 FPS',
    streamUrl: 'rtsp://10.19.88.2:554/live/stream_ch01',
    rtspIp: '10.19.88.2',
    lastHeartbeat: new Date().toISOString(),
    installedDate: '2023-08-14',
    assignedInspectorId: 'USR-002',
    assignedInspectorName: 'Er. R. K. Sharma (DGMS)',
    ptzSupported: true,
    latitude: 23.7145,
    longitude: 85.0423
  },
  {
    id: 'CAM-NCL-JAY-01',
    name: 'Jayant OC Dragline Bench & Loading Zone',
    mineId: 'KD-105',
    mineName: 'Jayant OC Mine (NCL)',
    company: 'NCL',
    zone: 'Excavation Pit / Face',
    cameraStatus: 'ONLINE',
    aiMonitoringStatus: 'ACTIVE',
    resolution: '1920x1080 @ 30 FPS',
    streamUrl: 'rtsp://10.51.22.8:554/live/stream_ch01',
    rtspIp: '10.51.22.8',
    lastHeartbeat: new Date().toISOString(),
    installedDate: '2024-02-18',
    assignedInspectorId: 'USR-002',
    assignedInspectorName: 'Er. R. K. Sharma (DGMS)',
    ptzSupported: true,
    latitude: 24.1124,
    longitude: 82.6841
  },
  {
    id: 'CAM-ECL-RAJ-01',
    name: 'Rajmahal OCP Coal Handling Plant (CHP)',
    mineId: 'KD-103',
    mineName: 'Rajmahal OCP (ECL)',
    company: 'ECL',
    zone: 'Processing Plant',
    cameraStatus: 'OFFLINE',
    aiMonitoringStatus: 'FAILED',
    resolution: '1920x1080 @ 0 FPS',
    streamUrl: 'rtsp://10.64.12.9:554/live/stream_ch01',
    rtspIp: '10.64.12.9',
    lastHeartbeat: new Date(Date.now() - 3600000).toISOString(),
    installedDate: '2023-05-19',
    assignedInspectorId: 'USR-002',
    assignedInspectorName: 'Er. R. K. Sharma (DGMS)',
    ptzSupported: false,
    latitude: 25.0412,
    longitude: 87.3812
  }
];

// Initial Safety Rules
export const INITIAL_RULES: SafetyRule[] = [
  {
    id: 'RULE-PPE-01',
    name: 'Mandatory Hard Hat / Helmet Compliance',
    description: 'Worker present in excavation face, pit, or plant without statutory hard hat.',
    detectionClasses: ['worker', 'no_helmet'],
    minConfidence: 0.75,
    persistenceFrames: 3,
    cooldownSeconds: 120,
    severity: 'High',
    triggersBuzzer: true,
    enabled: true
  },
  {
    id: 'RULE-PPE-02',
    name: 'Mandatory High-Visibility Safety Vest',
    description: 'Worker in pit or vehicle traffic corridor without fluorescent reflective vest.',
    detectionClasses: ['worker', 'no_safety_vest'],
    minConfidence: 0.75,
    persistenceFrames: 3,
    cooldownSeconds: 120,
    severity: 'High',
    triggersBuzzer: true,
    enabled: true
  },
  {
    id: 'RULE-FIRE-01',
    name: 'Open Flame & Combustion Outbreak',
    description: 'Open fire flame plume detected near coal stockyard, conveyor, or repair bay.',
    detectionClasses: ['fire'],
    minConfidence: 0.8,
    persistenceFrames: 2,
    cooldownSeconds: 120,
    severity: 'Critical',
    triggersBuzzer: true,
    enabled: true
  },
  {
    id: 'RULE-SMOKE-01',
    name: 'Heavy Toxic Smoke Plume',
    description: 'Dense smoke density suggesting spontaneous bench combustion or equipment overheating.',
    detectionClasses: ['smoke'],
    minConfidence: 0.75,
    persistenceFrames: 3,
    cooldownSeconds: 120,
    severity: 'High',
    triggersBuzzer: true,
    enabled: true
  },
  {
    id: 'RULE-ZONE-01',
    name: 'Restricted Blasting / Unstable Slope Entry',
    description: 'Personnel detected entering marked danger perimeter or unstable bench boundary.',
    detectionClasses: ['worker', 'restricted_entry'],
    minConfidence: 0.8,
    persistenceFrames: 2,
    cooldownSeconds: 120,
    severity: 'Critical',
    triggersBuzzer: true,
    enabled: true
  },
  {
    id: 'RULE-VEHICLE-01',
    name: 'Worker-Heavy Vehicle Proximity Hazard',
    description: 'Personnel on foot within 15-meter blind spot turning radius of active dumper/excavator.',
    detectionClasses: ['worker', 'vehicle'],
    minConfidence: 0.75,
    persistenceFrames: 3,
    cooldownSeconds: 120,
    severity: 'Critical',
    triggersBuzzer: true,
    enabled: true
  }
];

// Initial CCTV Events
export const INITIAL_EVENTS: CCTVEvent[] = [
  {
    id: 'EVT-CCTV-2026-001',
    mineId: 'KD-104',
    mineName: 'Jharia Coalfield Concession (BCCL)',
    cameraId: 'CAM-BCCL-JHR-01',
    cameraName: 'Block-II Heavy Repair Bay & HEMM Workshop',
    zone: 'Workshop Heavy Repair Bay',
    detectionType: 'Worker without Mandatory Helmet',
    confidence: 0.942,
    severity: 'High',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    ruleId: 'RULE-PPE-01',
    ruleName: 'Mandatory Hard Hat / Helmet Compliance',
    detections: [
      {
        id: 'det-1',
        class: 'worker',
        label: 'Worker (ID #14)',
        confidence: 0.96,
        bbox: [320, 180, 480, 540],
        color: '#3b82f6'
      },
      {
        id: 'det-2',
        class: 'no_helmet',
        label: 'VIOLATION: No Helmet',
        confidence: 0.94,
        bbox: [370, 185, 430, 250],
        color: '#ef4444'
      },
      {
        id: 'det-3',
        class: 'safety_vest',
        label: 'Hi-Vis Vest Detected',
        confidence: 0.89,
        bbox: [350, 255, 460, 420],
        color: '#10b981'
      }
    ],
    evidenceFrameUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
    status: 'WARNING_TRIGGERED'
  },
  {
    id: 'EVT-CCTV-2026-002',
    mineId: 'KD-101',
    mineName: 'Gevra OC Mine (SECL)',
    cameraId: 'CAM-SECL-GEV-01',
    cameraName: 'Pit-4 Highwall & Shovel Active Face',
    zone: 'Excavation Pit / Face',
    detectionType: 'Restricted Highwall Danger Zone Entry',
    confidence: 0.915,
    severity: 'Critical',
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    ruleId: 'RULE-ZONE-01',
    ruleName: 'Restricted Blasting / Unstable Slope Entry',
    detections: [
      {
        id: 'det-4',
        class: 'worker',
        label: 'Worker (ID #09)',
        confidence: 0.93,
        bbox: [620, 240, 740, 560],
        color: '#3b82f6'
      },
      {
        id: 'det-5',
        class: 'restricted_entry',
        label: 'CRITICAL: Highwall Danger Perimeter',
        confidence: 0.92,
        bbox: [580, 210, 800, 600],
        color: '#9333ea'
      }
    ],
    evidenceFrameUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
    status: 'PROCESSED'
  }
];

// Initial CCTV AI Alerts
export const INITIAL_ALERTS: CCTVAlert[] = [
  {
    id: 'ALT-CCTV-901',
    eventId: 'EVT-CCTV-2026-001',
    mineId: 'KD-104',
    mineName: 'Jharia Coalfield Concession (BCCL)',
    cameraId: 'CAM-BCCL-JHR-01',
    cameraName: 'Block-II Heavy Repair Bay & HEMM Workshop',
    zone: 'Workshop Heavy Repair Bay',
    detection: 'Worker operating in repair bay without mandatory safety helmet (DGMS Reg 191)',
    confidence: 0.942,
    riskLevel: 'High',
    dateTime: new Date(Date.now() - 15 * 60000).toISOString(),
    evidence: {
      frameUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
      annotatedUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
      videoClipReference: 'VOD-BCCL-CAM01-20260911_131000.mp4',
      detections: INITIAL_EVENTS[0].detections
    },
    buzzerStatus: 'BUZZER INACTIVE',
    alertStatus: 'DETECTED',
    investigationNotes: [
      'Automatic YOLOv8x inference completed at 30 FPS.',
      'Persistence requirement (3 consecutive frames) fulfilled with >94% confidence.',
      '120-second site buzzer cycle completed. Awaiting statutory Inspector verification.'
    ]
  },
  {
    id: 'ALT-CCTV-902',
    eventId: 'EVT-CCTV-2026-002',
    mineId: 'KD-101',
    mineName: 'Gevra OC Mine (SECL)',
    cameraId: 'CAM-SECL-GEV-01',
    cameraName: 'Pit-4 Highwall & Shovel Active Face',
    zone: 'Excavation Pit / Face',
    detection: 'Unattended personnel breach into marked highwall blast clearance perimeter',
    confidence: 0.915,
    riskLevel: 'Critical',
    dateTime: new Date(Date.now() - 45 * 60000).toISOString(),
    evidence: {
      frameUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
      videoClipReference: 'VOD-SECL-CAM01-20260911_124000.mp4',
      detections: INITIAL_EVENTS[1].detections
    },
    buzzerStatus: 'BUZZER INACTIVE',
    alertStatus: 'UNDER_REVIEW',
    investigationNotes: [
      'Inspector Er. R. K. Sharma flagged for priority verification.',
      'Mine manager contacted via VHF dispatch.'
    ]
  }
];

// Initial Audit Logs
export const INITIAL_AUDIT_LOGS: CCTVAuditLog[] = [
  {
    id: 'AUD-001',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    user: 'SYSTEM_AI_ENGINE',
    role: 'AI Kernel',
    action: 'CCTV_EVENT_CREATED',
    eventOrAlertId: 'EVT-CCTV-2026-001',
    result: 'SUCCESS',
    details: { camera: 'CAM-BCCL-JHR-01', rule: 'RULE-PPE-01', confidence: 0.942 }
  },
  {
    id: 'AUD-002',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    user: 'SYSTEM_WARNING_ENGINE',
    role: 'Safety Warning System',
    action: 'WARNING_ACTIVATED',
    eventOrAlertId: 'WRN-CCTV-8821',
    result: '120_SECONDS_STARTED',
    details: { duration: 120, buzzer: 'BUZZER ACTIVE' }
  },
  {
    id: 'AUD-003',
    timestamp: new Date(Date.now() - 13 * 60000).toISOString(),
    user: 'SYSTEM_WARNING_ENGINE',
    role: 'Safety Warning System',
    action: 'WARNING_COMPLETED',
    eventOrAlertId: 'WRN-CCTV-8821',
    result: '120_SECONDS_EXPIRED',
    details: { buzzer: 'BUZZER INACTIVE' }
  },
  {
    id: 'AUD-004',
    timestamp: new Date(Date.now() - 13 * 60000).toISOString(),
    user: 'SYSTEM_AI_ENGINE',
    role: 'AI Kernel',
    action: 'AI_ALERT_CREATED',
    eventOrAlertId: 'ALT-CCTV-901',
    result: 'AWAITING_INSPECTOR_VERIFICATION',
    details: { inspectorRequired: true }
  }
];

// Web Audio API Dual-Tone Buzzer Synthesizer
class BuzzerSoundController {
  private audioCtx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  public isMuted = false;

  public startBuzzer() {
    if (this.isPlaying || this.isMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      this.audioCtx = new AudioContextClass();
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0.08, this.audioCtx.currentTime); // Soft, non-piercing

      this.osc1 = this.audioCtx.createOscillator();
      this.osc2 = this.audioCtx.createOscillator();

      this.osc1.type = 'sawtooth';
      this.osc1.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      this.osc2.type = 'sine';
      this.osc2.frequency.setValueAtTime(960, this.audioCtx.currentTime);

      this.osc1.connect(this.gainNode);
      this.osc2.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      this.osc1.start();
      this.osc2.start();
      this.isPlaying = true;
    } catch {
      // Audio autoplay policy handled gracefully
    }
  }

  public stopBuzzer() {
    if (!this.isPlaying) return;
    try {
      if (this.osc1) {
        this.osc1.stop();
        this.osc1.disconnect();
      }
      if (this.osc2) {
        this.osc2.stop();
        this.osc2.disconnect();
      }
      if (this.audioCtx && this.audioCtx.state !== 'closed') {
        this.audioCtx.close();
      }
    } catch {
      // ignore cleanup
    } finally {
      this.isPlaying = false;
      this.audioCtx = null;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBuzzer();
    }
    return this.isMuted;
  }
}

export const buzzerAudio = new BuzzerSoundController();

// Service Implementation
export const cctvService = {
  // ----------------------------------------------------
  // Storage Helpers
  // ----------------------------------------------------
  getCameras(): CCTVCamera[] {
    const raw = localStorage.getItem(CAMERAS_STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    localStorage.setItem(CAMERAS_STORAGE_KEY, JSON.stringify(INITIAL_CAMERAS));
    return INITIAL_CAMERAS;
  },

  saveCameras(cameras: CCTVCamera[]) {
    localStorage.setItem(CAMERAS_STORAGE_KEY, JSON.stringify(cameras));
  },

  getRules(): SafetyRule[] {
    const raw = localStorage.getItem(RULES_STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(INITIAL_RULES));
    return INITIAL_RULES;
  },

  getEvents(): CCTVEvent[] {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
    return INITIAL_EVENTS;
  },

  getAlerts(): CCTVAlert[] {
    const raw = localStorage.getItem(ALERTS_STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(INITIAL_ALERTS));
    return INITIAL_ALERTS;
  },

  saveAlerts(alerts: CCTVAlert[]) {
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
  },

  getWarnings(): SafetyWarning[] {
    const raw = localStorage.getItem(WARNINGS_STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    return [];
  },

  saveWarnings(warnings: SafetyWarning[]) {
    localStorage.setItem(WARNINGS_STORAGE_KEY, JSON.stringify(warnings));
  },

  getAuditLogs(): CCTVAuditLog[] {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (raw) {
      try {
        const parsed: CCTVAuditLog[] = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const seenIds = new Set<string>();
          let hasDuplicates = false;
          const sanitized = parsed.map((item, idx) => {
            if (!item.id || seenIds.has(item.id)) {
              hasDuplicates = true;
              const uniqueId = `AUD-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`;
              seenIds.add(uniqueId);
              return { ...item, id: uniqueId };
            }
            seenIds.add(item.id);
            return item;
          });
          if (hasDuplicates) {
            localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(sanitized));
          }
          return sanitized;
        }
      } catch {
        // fallback
      }
    }
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(INITIAL_AUDIT_LOGS));
    return INITIAL_AUDIT_LOGS;
  },

  addAuditLog(entry: Omit<CCTVAuditLog, 'id' | 'timestamp'>) {
    const logs = this.getAuditLogs();
    const uniqueSuffix = Math.random().toString(36).substring(2, 8);
    const newLog: CCTVAuditLog = {
      ...entry,
      id: `AUD-${Date.now()}-${uniqueSuffix}`,
      timestamp: new Date().toISOString()
    };
    const updated = [newLog, ...logs];
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
    return newLog;
  },

  // ----------------------------------------------------
  // Camera Management
  // ----------------------------------------------------
  updateCameraStatus(cameraId: string, cameraStatus: CameraStatus, aiStatus?: AIMonitoringStatus): CCTVCamera {
    const cameras = this.getCameras();
    const idx = cameras.findIndex((c) => c.id === cameraId);
    if (idx === -1) throw new Error('Camera not found');

    cameras[idx].cameraStatus = cameraStatus;
    if (aiStatus) {
      cameras[idx].aiMonitoringStatus = aiStatus;
    }
    cameras[idx].lastHeartbeat = new Date().toISOString();
    this.saveCameras(cameras);

    this.addAuditLog({
      user: 'AUTHORIZED_OPERATOR',
      role: 'Administrator',
      action: 'CAMERA_STATUS_CHANGED',
      eventOrAlertId: cameraId,
      result: `Camera: ${cameraStatus}, AI: ${cameras[idx].aiMonitoringStatus}`,
      details: { cameraStatus, aiStatus }
    });

    return cameras[idx];
  },

  registerCamera(cameraData: Omit<CCTVCamera, 'lastHeartbeat'>): CCTVCamera {
    const cameras = this.getCameras();
    const newCam: CCTVCamera = {
      ...cameraData,
      lastHeartbeat: new Date().toISOString()
    };
    const updated = [newCam, ...cameras];
    this.saveCameras(updated);

    this.addAuditLog({
      user: 'GOVERNMENT_ADMIN',
      role: 'Admin',
      action: 'CAMERA_STATUS_CHANGED',
      eventOrAlertId: newCam.id,
      result: 'CAMERA_REGISTERED',
      details: { name: newCam.name, mine: newCam.mineName }
    });

    return newCam;
  },

  // ----------------------------------------------------
  // Authoritative 120-Second Buzzer & Warning Engine
  // ----------------------------------------------------
  getActiveWarning(): SafetyWarning | null {
    const warnings = this.getWarnings();
    const now = Date.now();

    const active = warnings.find((w) => {
      if (w.status !== 'ACTIVE') return false;
      const end = new Date(w.endTime).getTime();
      return end > now;
    });

    if (!active) {
      // Check if there are any expired ones that need updating
      let changed = false;
      const updated = warnings.map((w) => {
        if (w.status === 'ACTIVE' && new Date(w.endTime).getTime() <= now) {
          changed = true;
          return { ...w, status: 'COMPLETED' as const, buzzerActive: false };
        }
        return w;
      });
      if (changed) {
        this.saveWarnings(updated);
        buzzerAudio.stopBuzzer();
      }
      return null;
    }

    return active;
  },

  getBuzzerStatus(): BuzzerStatus {
    const activeWarning = this.getActiveWarning();

    if (!activeWarning) {
      buzzerAudio.stopBuzzer();
      return {
        status: 'BUZZER INACTIVE',
        remainingSeconds: 0
      };
    }

    const now = Date.now();
    const end = new Date(activeWarning.endTime).getTime();
    const remainingSeconds = Math.max(0, Math.min(120, Math.round((end - now) / 1000)));

    if (remainingSeconds > 0) {
      buzzerAudio.startBuzzer();
      return {
        status: 'BUZZER ACTIVE',
        activeWarningId: activeWarning.warningId,
        activeMineId: activeWarning.mineId,
        activeMineName: activeWarning.mineName,
        activeCameraId: activeWarning.cameraId,
        activeCameraName: activeWarning.cameraName,
        startedAt: activeWarning.startTime,
        expiresAt: activeWarning.endTime,
        remainingSeconds
      };
    } else {
      buzzerAudio.stopBuzzer();
      return {
        status: 'BUZZER INACTIVE',
        remainingSeconds: 0
      };
    }
  },

  triggerSafetyWarning(
    eventId: string,
    mineId: string,
    mineName: string,
    cameraId: string,
    cameraName: string,
    zone: string,
    detectionType: string,
    severity: 'High' | 'Critical' = 'High'
  ): SafetyWarning {
    const now = new Date();
    const startTime = now.toISOString();
    const endTime = new Date(now.getTime() + 120 * 1000).toISOString(); // Exactly 120 Seconds
    const warningId = `WRN-CCTV-${Date.now().toString().slice(-6)}`;

    const warning: SafetyWarning = {
      warningId,
      eventId,
      mineId,
      mineName,
      cameraId,
      cameraName,
      zone,
      detectionType,
      severity,
      timestamp: startTime,
      startTime,
      endTime,
      duration: 120,
      status: 'ACTIVE',
      buzzerActive: true
    };

    const warnings = this.getWarnings();
    // Cancel prior active warnings if any to maintain single authoritative alert
    const updated = warnings.map((w) => (w.status === 'ACTIVE' ? { ...w, status: 'CANCELLED' as const, buzzerActive: false } : w));
    updated.unshift(warning);
    this.saveWarnings(updated);

    buzzerAudio.startBuzzer();

    this.addAuditLog({
      user: 'SYSTEM_WARNING_ENGINE',
      role: 'Safety Warning System',
      action: 'WARNING_ACTIVATED',
      eventOrAlertId: warningId,
      result: '120_SECONDS_STARTED',
      details: { duration: 120, buzzer: 'BUZZER ACTIVE', camera: cameraName, detection: detectionType }
    });

    this.addAuditLog({
      user: 'SYSTEM_WARNING_ENGINE',
      role: 'Mine Warning Siren',
      action: 'BUZZER_ACTIVATED',
      eventOrAlertId: warningId,
      result: 'BUZZER_AUDIBLE_120S',
      details: { mine: mineName, zone }
    });

    return warning;
  },

  cancelActiveWarning(reason = 'MANUAL_DEACTIVATION') {
    const warnings = this.getWarnings();
    let cancelledId = '';
    const updated = warnings.map((w) => {
      if (w.status === 'ACTIVE') {
        cancelledId = w.warningId;
        return { ...w, status: 'CANCELLED' as const, buzzerActive: false };
      }
      return w;
    });

    this.saveWarnings(updated);
    buzzerAudio.stopBuzzer();

    if (cancelledId) {
      this.addAuditLog({
        user: 'INSPECTOR_COMMAND',
        role: 'Inspector',
        action: 'WARNING_CANCELLED',
        eventOrAlertId: cancelledId,
        result: reason,
        details: { buzzer: 'BUZZER INACTIVE' }
      });
    }
  },

  // ----------------------------------------------------
  // Safety Rule Engine Evaluation
  // ----------------------------------------------------
  evaluateDetectionAndTrigger(
    cameraId: string,
    ruleId: string,
    customDetections?: YOLODetection[]
  ): { event: CCTVEvent; warning: SafetyWarning; alert: CCTVAlert } {
    const cameras = this.getCameras();
    const camera = cameras.find((c) => c.id === cameraId) || cameras[0];
    const rules = this.getRules();
    const rule = rules.find((r) => r.id === ruleId) || rules[0];

    const detections: YOLODetection[] = customDetections || [
      {
        id: `det-${Date.now()}-1`,
        class: 'worker',
        label: 'Worker (ID #07)',
        confidence: 0.94,
        bbox: [320, 200, 480, 540],
        color: '#3b82f6'
      },
      {
        id: `det-${Date.now()}-2`,
        class: 'no_helmet',
        label: 'VIOLATION: No Helmet (DGMS Reg 191)',
        confidence: 0.92,
        bbox: [370, 205, 430, 270],
        color: '#ef4444'
      }
    ];

    const eventId = `EVT-CCTV-${Date.now().toString().slice(-6)}`;
    const event: CCTVEvent = {
      id: eventId,
      mineId: camera.mineId,
      mineName: camera.mineName,
      cameraId: camera.id,
      cameraName: camera.name,
      zone: camera.zone,
      detectionType: rule.name,
      confidence: 0.935,
      severity: rule.severity,
      timestamp: new Date().toISOString(),
      ruleId: rule.id,
      ruleName: rule.name,
      detections,
      evidenceFrameUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
      status: 'WARNING_TRIGGERED'
    };

    // Save Event
    const events = this.getEvents();
    events.unshift(event);
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));

    this.addAuditLog({
      user: 'SYSTEM_YOLO_OPENCV',
      role: 'AI Kernel',
      action: 'CCTV_EVENT_CREATED',
      eventOrAlertId: eventId,
      result: 'SAFETY_CONDITION_CONFIRMED',
      details: { rule: rule.name, confidence: 0.935, camera: camera.name }
    });

    // Trigger authoritative 120s safety warning & buzzer
    const warning = this.triggerSafetyWarning(
      eventId,
      camera.mineId,
      camera.mineName,
      camera.id,
      camera.name,
      camera.zone,
      rule.name,
      rule.severity === 'Critical' ? 'Critical' : 'High'
    );

    // Create CCTV AI Alert with state DETECTED
    const alertId = `ALT-CCTV-${Date.now().toString().slice(-6)}`;
    const alert: CCTVAlert = {
      id: alertId,
      eventId,
      mineId: camera.mineId,
      mineName: camera.mineName,
      cameraId: camera.id,
      cameraName: camera.name,
      zone: camera.zone,
      detection: `${rule.name} detected by YOLOv8x in ${camera.zone} with 93.5% confidence.`,
      confidence: 0.935,
      riskLevel: rule.severity === 'Critical' ? 'Critical' : 'High',
      dateTime: new Date().toISOString(),
      evidence: {
        frameUrl: event.evidenceFrameUrl,
        detections
      },
      buzzerStatus: 'BUZZER ACTIVE',
      alertStatus: 'DETECTED',
      investigationNotes: [
        'AI-GENERATED SAFETY ALERT · INSPECTOR VERIFICATION REQUIRED',
        `Evaluated under rule [${rule.id}]: ${rule.name}.`,
        '120-second safety warning siren activated in mine sector.'
      ]
    };

    const alerts = this.getAlerts();
    alerts.unshift(alert);
    this.saveAlerts(alerts);

    this.addAuditLog({
      user: 'SYSTEM_AI_ENGINE',
      role: 'AI Alert Service',
      action: 'AI_ALERT_CREATED',
      eventOrAlertId: alertId,
      result: 'INSPECTOR_VERIFICATION_REQUIRED',
      details: { riskLevel: alert.riskLevel, mine: camera.mineName }
    });

    // Notify Inspector and Government Admin
    notificationService.getNotifications(); // Ensure storage exists
    const notifs = JSON.parse(localStorage.getItem('koyla_drishti_notifications') || '[]');
    const newNotif = {
      id: `NOTIF-CCTV-${Date.now()}`,
      title: `🚨 CCTV AI Safety Hazard: ${rule.name}`,
      description: `Camera ${camera.name} at ${camera.mineName} detected an actionable safety condition. 120s warning siren active. Inspector verification required.`,
      category: 'AI Alerts',
      timestamp: new Date().toISOString(),
      read: false,
      roleTarget: 'all',
      linkToModule: '/inspector/cctv',
      priority: 'high'
    };
    localStorage.setItem('koyla_drishti_notifications', JSON.stringify([newNotif, ...notifs]));

    return { event, warning, alert };
  },

  // ----------------------------------------------------
  // Inspector Verification Workflow
  // ----------------------------------------------------
  verifyAlert(
    alertId: string,
    inspectorName: string,
    inspectorRemarks = 'Verified by DGMS Coal Mine Safety Inspector following CCTV visual audit.',
    deadlineDays = 7
  ): { alert: CCTVAlert; violationId: string } {
    const alerts = this.getAlerts();
    const idx = alerts.findIndex((a) => a.id === alertId);
    if (idx === -1) throw new Error('Alert not found');

    const alert = alerts[idx];
    const now = new Date();
    const deadlineDate = new Date(now.getTime() + deadlineDays * 24 * 3600 * 1000).toISOString().split('T')[0];

    // 1. Create official violation via violationService
    const violation = violationService.createViolation({
      mineId: alert.mineId,
      mineName: alert.mineName,
      category: 'Safety & PPE Compliance',
      severity: alert.riskLevel === 'Critical' ? 'Critical' : 'High',
      description: `[CCTV Confirmed Violation] ${alert.detection}. Sourced from CCTV Camera ${alert.cameraName} (${alert.cameraId}) at Zone: ${alert.zone}. Verified by ${inspectorName}.`,
      issuedDate: now.toISOString().split('T')[0],
      deadline: deadlineDate,
      assignedInspector: inspectorName,
      status: 'Open',
      correctiveActionText: `Immediate rectification required under DGMS Coal Mines Regulations. ${inspectorRemarks}`,
      submittedEvidence: [alert.evidence.frameUrl]
    });

    // 2. Update Alert status
    alert.alertStatus = 'VERIFIED';
    alert.verifiedBy = inspectorName;
    alert.verifiedAt = now.toISOString();
    alert.violationId = violation.id;
    alert.correctiveActionId = `CA-${violation.id.replace('VIO-', '')}`;
    alert.investigationNotes = [
      ...(alert.investigationNotes || []),
      `VERIFIED by Inspector ${inspectorName} on ${now.toLocaleString()}. Official Violation #${violation.id} issued with ${deadlineDays}-day compliance deadline.`
    ];

    alerts[idx] = alert;
    this.saveAlerts(alerts);

    // 3. Log Audit
    this.addAuditLog({
      user: inspectorName,
      role: 'Inspector',
      action: 'INSPECTOR_VERIFICATION',
      eventOrAlertId: alertId,
      result: 'VERIFIED_OFFICIAL_VIOLATION_CREATED',
      details: { violationId: violation.id, deadline: deadlineDate }
    });

    this.addAuditLog({
      user: inspectorName,
      role: 'Inspector',
      action: 'OFFICIAL_VIOLATION_CREATED',
      eventOrAlertId: violation.id,
      result: 'SUCCESS',
      details: { alertId, mine: alert.mineName }
    });

    return { alert, violationId: violation.id };
  },

  rejectAlert(alertId: string, inspectorName: string, reason: string): CCTVAlert {
    const alerts = this.getAlerts();
    const idx = alerts.findIndex((a) => a.id === alertId);
    if (idx === -1) throw new Error('Alert not found');

    const alert = alerts[idx];
    const now = new Date();

    alert.alertStatus = 'REJECTED';
    alert.verifiedBy = inspectorName;
    alert.verifiedAt = now.toISOString();
    alert.rejectionReason = reason;
    alert.investigationNotes = [
      ...(alert.investigationNotes || []),
      `REJECTED by Inspector ${inspectorName} on ${now.toLocaleString()}. Reason: ${reason}`
    ];

    alerts[idx] = alert;
    this.saveAlerts(alerts);

    this.addAuditLog({
      user: inspectorName,
      role: 'Inspector',
      action: 'INSPECTOR_REJECTION',
      eventOrAlertId: alertId,
      result: 'REJECTED_FALSE_POSITIVE',
      details: { reason }
    });

    return alert;
  }
};
