import React, { useState, useMemo } from 'react';
import {
  Camera,
  Layers,
  AlertTriangle,
  ShieldCheck,
  Radio,
  Sliders,
  Filter,
  Search,
  Plus,
  Grid,
  Maximize,
  RefreshCw,
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  FileText,
  Building,
  MapPin,
  Cpu,
  Wifi,
  WifiOff,
  History,
  AlertCircle
} from 'lucide-react';
import {
  CCTVCamera,
  CCTVAlert,
  CCTVEvent,
  CCTVAuditLog,
  CameraStatus,
  AIMonitoringStatus
} from '../../types/cctv';
import { cctvService } from '../../services/cctvService';
import { ActiveWarningBanner } from './ActiveWarningBanner';
import { CCTVStreamPlayer } from './CCTVStreamPlayer';
import { InspectorVerificationModal } from './InspectorVerificationModal';
import { CCTVEvidenceModal } from './CCTVEvidenceModal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface CCTVMonitoringViewProps {
  initialTab?: 'live' | 'cameras' | 'events' | 'alerts' | 'audit';
  defaultMineId?: string;
  inspectorMode?: boolean;
}

export const CCTVMonitoringView: React.FC<CCTVMonitoringViewProps> = ({
  initialTab = 'live',
  defaultMineId,
  inspectorMode = false
}) => {
  const { role, user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'live' | 'cameras' | 'events' | 'alerts' | 'audit'>(initialTab);
  const [cameras, setCameras] = useState<CCTVCamera[]>(() => cctvService.getCameras());
  const [alerts, setAlerts] = useState<CCTVAlert[]>(() => cctvService.getAlerts());
  const [events, setEvents] = useState<CCTVEvent[]>(() => cctvService.getEvents());
  const [auditLogs, setAuditLogs] = useState<CCTVAuditLog[]>(() => cctvService.getAuditLogs());

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMine, setSelectedMine] = useState<string>(defaultMineId || 'ALL');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [gridLayout, setGridLayout] = useState<'2x2' | '1x1' | '3x3'>('2x2');

  // Focal selected camera for live focal view
  const [selectedCameraId, setSelectedCameraId] = useState<string>(cameras[0]?.id || '');

  // Modals
  const [verificationAlert, setVerificationAlert] = useState<CCTVAlert | null>(null);
  const [evidenceItem, setEvidenceItem] = useState<CCTVAlert | CCTVEvent | null>(null);
  const [showAddCameraModal, setShowAddCameraModal] = useState(false);

  // New camera form state
  const [newCamData, setNewCamData] = useState({
    id: `CAM-NEW-${Math.floor(100 + Math.random() * 900)}`,
    name: '',
    mineId: defaultMineId || 'KD-101',
    mineName: 'Gevra OC Mine (SECL)',
    company: 'SECL',
    zone: 'Excavation Pit / Face',
    cameraStatus: 'ONLINE' as CameraStatus,
    aiMonitoringStatus: 'ACTIVE' as AIMonitoringStatus,
    resolution: '1920x1080 @ 30 FPS',
    streamUrl: 'rtsp://10.24.112.10:554/live/stream_ch01',
    rtspIp: '10.24.112.10',
    installedDate: new Date().toISOString().split('T')[0],
    ptzSupported: true
  });

  const refreshAll = () => {
    setCameras(cctvService.getCameras());
    setAlerts(cctvService.getAlerts());
    setEvents(cctvService.getEvents());
    setAuditLogs(cctvService.getAuditLogs());
  };

  // Filtered cameras
  const filteredCameras = useMemo(() => {
    return cameras.filter((c) => {
      if (selectedMine !== 'ALL' && c.mineId !== selectedMine) return false;
      if (selectedZone !== 'ALL' && c.zone !== selectedZone) return false;
      if (selectedStatus !== 'ALL' && c.cameraStatus !== selectedStatus) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.mineName.toLowerCase().includes(q) ||
          c.zone.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [cameras, selectedMine, selectedZone, selectedStatus, searchQuery]);

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (selectedMine !== 'ALL' && a.mineId !== selectedMine) return false;
      if (selectedRisk !== 'ALL' && a.riskLevel !== selectedRisk) return false;
      if (selectedStatus !== 'ALL' && a.alertStatus !== selectedStatus) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          a.detection.toLowerCase().includes(q) ||
          a.mineName.toLowerCase().includes(q) ||
          a.cameraName.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [alerts, selectedMine, selectedRisk, selectedStatus, searchQuery]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (selectedMine !== 'ALL' && e.mineId !== selectedMine) return false;
      if (selectedZone !== 'ALL' && e.zone !== selectedZone) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          e.detectionType.toLowerCase().includes(q) ||
          e.mineName.toLowerCase().includes(q) ||
          e.cameraName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [events, selectedMine, selectedZone, searchQuery]);

  // Quick camera status toggle
  const handleToggleCameraStatus = (camId: string, currentStatus: CameraStatus) => {
    const nextStatus: CameraStatus =
      currentStatus === 'ONLINE' ? 'DEGRADED' : currentStatus === 'DEGRADED' ? 'OFFLINE' : 'ONLINE';
    const updated = cctvService.updateCameraStatus(camId, nextStatus);
    showToast(`Camera ${updated.id} status changed to ${nextStatus}`, 'info');
    refreshAll();
  };

  // Quick AI status toggle
  const handleToggleAIStatus = (camId: string, currentAI: AIMonitoringStatus) => {
    const nextAI: AIMonitoringStatus =
      currentAI === 'ACTIVE' ? 'INACTIVE' : currentAI === 'INACTIVE' ? 'FAILED' : 'ACTIVE';
    const cam = cameras.find((c) => c.id === camId);
    if (!cam) return;
    const updated = cctvService.updateCameraStatus(camId, cam.cameraStatus, nextAI);
    showToast(`Camera ${updated.id} YOLO AI monitoring is now ${nextAI}`, 'info');
    refreshAll();
  };

  // Add camera submit
  const handleAddCameraSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCamData.name) {
      showToast('Please enter a camera name', 'warning');
      return;
    }
    cctvService.registerCamera(newCamData);
    showToast(`CCTV Camera ${newCamData.id} successfully registered in DGMS grid.`, 'success');
    setShowAddCameraModal(false);
    refreshAll();
  };

  // Statistics counters
  const totalCameras = cameras.length;
  const onlineCameras = cameras.filter((c) => c.cameraStatus === 'ONLINE').length;
  const offlineCameras = cameras.filter((c) => c.cameraStatus === 'OFFLINE').length;
  const aiMonitored = cameras.filter((c) => c.aiMonitoringStatus === 'ACTIVE').length;
  const highRiskAlerts = alerts.filter((a) => a.riskLevel === 'High' || a.riskLevel === 'Critical').length;
  const pendingReviewAlerts = alerts.filter((a) => a.alertStatus === 'DETECTED' || a.alertStatus === 'UNDER_REVIEW').length;

  return (
    <div className="space-y-6">
      {/* 1. Authoritative 120-Second Safety Warning & Buzzer Banner */}
      <ActiveWarningBanner onRefresh={refreshAll} />

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-[#d6e2eb] shadow-xs">
          <span className="text-[11px] text-[#5c7283] font-semibold uppercase">Total Cameras</span>
          <div className="text-xl font-bold text-[#0d2a44] mt-0.5">{totalCameras}</div>
          <span className="text-[10px] text-slate-500">Registered DGMS Nodes</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#d6e2eb] shadow-xs">
          <span className="text-[11px] text-emerald-700 font-semibold uppercase">Online Feeds</span>
          <div className="text-xl font-bold text-emerald-700 mt-0.5">{onlineCameras}</div>
          <span className="text-[10px] text-emerald-600 font-medium">30 FPS Active RTSP</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#d6e2eb] shadow-xs">
          <span className="text-[11px] text-slate-500 font-semibold uppercase">Offline Feeds</span>
          <div className="text-xl font-bold text-slate-700 mt-0.5">{offlineCameras}</div>
          <span className="text-[10px] text-slate-500">Requires Maintenance</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#d6e2eb] shadow-xs">
          <span className="text-[11px] text-blue-700 font-semibold uppercase">YOLO Monitored</span>
          <div className="text-xl font-bold text-blue-700 mt-0.5">{aiMonitored}</div>
          <span className="text-[10px] text-blue-600 font-medium">PPE & Hazard Pipeline</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#d6e2eb] shadow-xs">
          <span className="text-[11px] text-amber-700 font-semibold uppercase">Pending Reviews</span>
          <div className="text-xl font-bold text-amber-700 mt-0.5">{pendingReviewAlerts}</div>
          <span className="text-[10px] text-amber-600 font-medium">Inspector Action Required</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#d6e2eb] shadow-xs">
          <span className="text-[11px] text-red-700 font-semibold uppercase">Critical Alerts</span>
          <div className="text-xl font-bold text-red-700 mt-0.5">{highRiskAlerts}</div>
          <span className="text-[10px] text-red-600 font-medium">Statutory Priority</span>
        </div>
      </div>

      {/* 3. Navigation Tabs & Quick Actions */}
      <div className="bg-white rounded-xl border border-[#d6e2eb] p-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          <button
            id="tab-cctv-live"
            onClick={() => setActiveTab('live')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'live'
                ? 'bg-[#0f2e4a] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live CCTV Surveillance</span>
          </button>
          <button
            id="tab-cctv-cameras"
            onClick={() => setActiveTab('cameras')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'cameras'
                ? 'bg-[#0f2e4a] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Camera Management ({cameras.length})</span>
          </button>
          <button
            id="tab-cctv-alerts"
            onClick={() => setActiveTab('alerts')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'alerts'
                ? 'bg-[#0f2e4a] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Safety Alerts ({alerts.length})</span>
          </button>
          <button
            id="tab-cctv-events"
            onClick={() => setActiveTab('events')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'events'
                ? 'bg-[#0f2e4a] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>CCTV Events ({events.length})</span>
          </button>
          <button
            id="tab-cctv-audit"
            onClick={() => setActiveTab('audit')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 ${
              activeTab === 'audit'
                ? 'bg-[#0f2e4a] text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Statutory Audit Trail</span>
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {(role === 'admin' || role === 'inspector') && (
            <button
              id="btn-register-new-camera"
              onClick={() => setShowAddCameraModal(true)}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register Camera</span>
            </button>
          )}
          <button
            onClick={refreshAll}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh All CCTV Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. Filters Bar */}
      <div className="bg-white rounded-xl border border-[#d6e2eb] p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2.5 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search camera name, ID, zone, or mine..."
              className="w-full pl-9 pr-3 py-2 border border-[#d6e2eb] rounded-lg text-xs text-[#0d2a44] focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Mine Filter */}
          <select
            value={selectedMine}
            onChange={(e) => setSelectedMine(e.target.value)}
            className="py-2 px-2.5 border border-[#d6e2eb] rounded-lg text-xs bg-white text-[#0d2a44]"
          >
            <option value="ALL">All Coal Mines</option>
            <option value="KD-101">Gevra OC Mine (SECL)</option>
            <option value="KD-104">Jharia Coalfield (BCCL)</option>
            <option value="KD-102">Piparwar OCP (CCL)</option>
            <option value="KD-105">Jayant OC Mine (NCL)</option>
            <option value="KD-103">Rajmahal OCP (ECL)</option>
          </select>

          {/* Zone Filter */}
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="py-2 px-2.5 border border-[#d6e2eb] rounded-lg text-xs bg-white text-[#0d2a44]"
          >
            <option value="ALL">All Monitored Zones</option>
            <option value="Excavation Pit / Face">Excavation Pit / Face</option>
            <option value="Conveyor Corridor">Conveyor Corridor</option>
            <option value="Workshop Heavy Repair Bay">Workshop Repair Bay</option>
            <option value="Haul Road Crossing">Haul Road Crossing</option>
            <option value="Fire Danger Zone">Fire Danger Zone</option>
            <option value="Processing Plant">Processing Plant</option>
          </select>

          {/* Grid Layout Switcher (Live Tab only) */}
          {activeTab === 'live' && (
            <div className="flex items-center border border-[#d6e2eb] rounded-lg overflow-hidden">
              <button
                onClick={() => setGridLayout('1x1')}
                className={`px-2.5 py-2 text-xs font-semibold ${
                  gridLayout === '1x1' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
                title="Single Focal View"
              >
                1x1 Focus
              </button>
              <button
                onClick={() => setGridLayout('2x2')}
                className={`px-2.5 py-2 text-xs font-semibold ${
                  gridLayout === '2x2' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
                title="2x2 Grid View"
              >
                2x2 Grid
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5. TAB 1: LIVE SURVEILLANCE GRID */}
      {activeTab === 'live' && (
        <div className="space-y-4">
          {gridLayout === '1x1' ? (
            /* Single Focal View */
            <div className="space-y-3">
              {(() => {
                const focalCam = filteredCameras.find((c) => c.id === selectedCameraId) || filteredCameras[0];
                if (!focalCam) {
                  return (
                    <div className="bg-white rounded-xl p-8 text-center text-slate-500 border border-[#d6e2eb]">
                      No camera matching filter criteria.
                    </div>
                  );
                }
                return (
                  <div>
                    <CCTVStreamPlayer
                      camera={focalCam}
                      onCaptureSnapshot={(dataUrl, detections) => {
                        setEvidenceItem({
                          id: `SNAP-${focalCam.id}-${Date.now()}`,
                          mineId: focalCam.mineId,
                          mineName: focalCam.mineName,
                          cameraId: focalCam.id,
                          cameraName: focalCam.name,
                          zone: focalCam.zone,
                          detectionType: 'Manual Visual Frame Snapshot',
                          confidence: 0.95,
                          severity: 'High',
                          timestamp: new Date().toISOString(),
                          ruleId: 'MANUAL',
                          ruleName: 'Inspector Manual Capture',
                          detections,
                          evidenceFrameUrl: dataUrl,
                          status: 'PROCESSED'
                        });
                      }}
                    />
                    {/* Focal Camera Selector Strip */}
                    <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-2">
                      {filteredCameras.map((cam) => (
                        <button
                          key={cam.id}
                          onClick={() => setSelectedCameraId(cam.id)}
                          className={`px-3 py-2 rounded-lg border text-left shrink-0 transition-colors ${
                            cam.id === focalCam.id
                              ? 'bg-blue-50 border-blue-400 text-blue-900 font-bold'
                              : 'bg-white border-[#d6e2eb] text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="text-xs">{cam.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {cam.zone} · {cam.cameraStatus}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            /* 2x2 Grid View */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredCameras.map((camera) => (
                <div key={camera.id} className="space-y-1">
                  <CCTVStreamPlayer
                    camera={camera}
                    onCaptureSnapshot={(dataUrl, detections) => {
                      setEvidenceItem({
                        id: `SNAP-${camera.id}-${Date.now()}`,
                        mineId: camera.mineId,
                        mineName: camera.mineName,
                        cameraId: camera.id,
                        cameraName: camera.name,
                        zone: camera.zone,
                        detectionType: 'Manual CCTV Snapshot',
                        confidence: 0.95,
                        severity: 'High',
                        timestamp: new Date().toISOString(),
                        ruleId: 'MANUAL',
                        ruleName: 'Inspector Manual Capture',
                        detections,
                        evidenceFrameUrl: dataUrl,
                        status: 'PROCESSED'
                      });
                    }}
                  />
                  <div className="px-2 flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      {camera.mineName} · {camera.zone}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedCameraId(camera.id);
                        setGridLayout('1x1');
                      }}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Enlarge Feed ↗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. TAB 2: CAMERA MANAGEMENT */}
      {activeTab === 'cameras' && (
        <div className="bg-white rounded-xl border border-[#d6e2eb] overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#e1ebf2] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0d2a44]">
                Registered Statutory CCTV Surveillance Nodes
              </h3>
              <p className="text-xs text-[#5c7283]">
                Manage IP cameras, RTSP streams, YOLO inspection pipelines, and operational statuses
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Showing {filteredCameras.length} of {cameras.length} cameras
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f5f8fa] text-[#5c7283] border-b border-[#e1ebf2] uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Camera ID & Name</th>
                  <th className="py-3 px-4">Mine / Concession</th>
                  <th className="py-3 px-4">Monitoring Zone</th>
                  <th className="py-3 px-4">Hardware Status</th>
                  <th className="py-3 px-4">AI Processing</th>
                  <th className="py-3 px-4">Stream RTSP IP</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef3f7] text-[#1c3347]">
                {filteredCameras.map((cam) => (
                  <tr key={cam.id} className="hover:bg-[#fbfdfe] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#0d2a44]">{cam.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{cam.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{cam.mineName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{cam.mineId} · {cam.company}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {cam.zone}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleCameraStatus(cam.id, cam.cameraStatus)}
                        className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-colors ${
                          cam.cameraStatus === 'ONLINE'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : cam.cameraStatus === 'DEGRADED'
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                        title="Click to toggle status (ONLINE / DEGRADED / OFFLINE)"
                      >
                        {cam.cameraStatus === 'ONLINE' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                        <span>{cam.cameraStatus}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleAIStatus(cam.id, cam.aiMonitoringStatus)}
                        className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-colors ${
                          cam.aiMonitoringStatus === 'ACTIVE'
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            : cam.aiMonitoringStatus === 'FAILED'
                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title="Click to toggle YOLO AI Status"
                      >
                        <Cpu className="w-3 h-3" />
                        <span>{cam.aiMonitoringStatus}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                      {cam.rtspIp}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedCameraId(cam.id);
                          setActiveTab('live');
                          setGridLayout('1x1');
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-[#0f2e4a] text-white hover:bg-[#1a446c] rounded transition-colors"
                      >
                        View Live
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. TAB 3: CCTV AI ALERTS */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong>Statutory Protocol Notice:</strong> All AI alerts are preliminary potential violations. Official violation creation occurs strictly upon authorized Inspector verification.
              </div>
            </div>
            <span className="font-bold text-[11px] text-amber-800">
              {filteredAlerts.length} AI Alerts Logged
            </span>
          </div>

          <div className="bg-white rounded-xl border border-[#d6e2eb] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#f5f8fa] text-[#5c7283] border-b border-[#e1ebf2] uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Alert ID & Date</th>
                    <th className="py-3 px-4">Mine & Camera</th>
                    <th className="py-3 px-4">Detected Condition</th>
                    <th className="py-3 px-4">YOLO Confidence</th>
                    <th className="py-3 px-4">Risk Level</th>
                    <th className="py-3 px-4">Buzzer Warning</th>
                    <th className="py-3 px-4">Alert State</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eef3f7] text-[#1c3347]">
                  {filteredAlerts.map((alt, idx) => (
                    <tr key={`${alt.id}-${idx}`} className="hover:bg-[#fbfdfe] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#0d2a44]">{alt.id}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {new Date(alt.dateTime).toLocaleString('en-IN')}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{alt.mineName}</div>
                        <div className="text-[10px] text-slate-500">{alt.cameraName} ({alt.zone})</div>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <span className="font-medium text-slate-800 block truncate" title={alt.detection}>
                          {alt.detection}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                        {(alt.confidence * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            alt.riskLevel === 'Critical'
                              ? 'bg-red-100 text-red-800'
                              : alt.riskLevel === 'High'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {alt.riskLevel}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-xs">
                        <span
                          className={alt.buzzerStatus === 'BUZZER ACTIVE' ? 'text-red-600 animate-pulse' : 'text-slate-500'}
                        >
                          {alt.buzzerStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            alt.alertStatus === 'VERIFIED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : alt.alertStatus === 'REJECTED'
                              ? 'bg-slate-200 text-slate-700 line-through'
                              : alt.alertStatus === 'UNDER_REVIEW'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {alt.alertStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEvidenceItem(alt)}
                            className="px-2 py-1 text-[11px] font-medium border border-slate-300 hover:bg-slate-50 rounded"
                            title="View Snapshot & Detections"
                          >
                            Evidence
                          </button>
                          {alt.alertStatus !== 'VERIFIED' && alt.alertStatus !== 'REJECTED' ? (
                            <button
                              onClick={() => setVerificationAlert(alt)}
                              className="px-2.5 py-1 text-[11px] font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded shadow-xs flex items-center gap-1"
                            >
                              <ShieldCheck className="w-3 h-3" />
                              <span>Review</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono">Completed</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 8. TAB 4: CCTV EVENTS TIMELINE */}
      {activeTab === 'events' && (
        <div className="bg-white rounded-xl border border-[#d6e2eb] overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#e1ebf2]">
            <h3 className="text-sm font-bold text-[#0d2a44]">
              Chronological CCTV Safety Events Pipeline
            </h3>
            <p className="text-xs text-[#5c7283]">
              Processed OpenCV frames evaluated against DGMS persistence and cooldown rules
            </p>
          </div>

          <div className="divide-y divide-[#eef3f7] text-xs">
            {filteredEvents.map((evt, idx) => (
              <div key={`${evt.id}-${idx}`} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0d2a44]">{evt.detectionType}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600">
                        {evt.id}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        evt.severity === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {evt.severity}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Camera: <strong>{evt.cameraName}</strong> · Mine: <strong>{evt.mineName}</strong> · Zone: <strong>{evt.zone}</strong>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Rule Evaluated: {evt.ruleName} · Confidence: {(evt.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-[11px] text-slate-500 font-mono">
                    {new Date(evt.timestamp).toLocaleString('en-IN')}
                  </span>
                  <button
                    onClick={() => setEvidenceItem(evt)}
                    className="px-2.5 py-1 text-[11px] font-semibold border border-slate-300 hover:bg-white rounded"
                  >
                    View Snapshot
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. TAB 5: STATUTORY AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-[#d6e2eb] overflow-hidden shadow-xs">
          <div className="p-4 border-b border-[#e1ebf2]">
            <h3 className="text-sm font-bold text-[#0d2a44]">
              DGMS Statutory Surveillance Audit Trail
            </h3>
            <p className="text-xs text-[#5c7283]">
              Tamper-evident record of all AI events, 120s warnings, buzzer toggles, and inspector determinations
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f5f8fa] text-[#5c7283] border-b border-[#e1ebf2] uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User / Actor</th>
                  <th className="py-3 px-4">Statutory Action</th>
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Result / Determination</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef3f7] font-mono text-[11px] text-[#1c3347]">
                {auditLogs.map((log, idx) => (
                  <tr key={`${log.id}-${idx}`} className="hover:bg-[#fbfdfe]">
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(log.timestamp).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <strong>{log.user}</strong>
                      <span className="text-slate-400 block text-[10px]">[{log.role}]</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-blue-600 font-bold">{log.eventOrAlertId}</td>
                    <td className="py-3 px-4 text-slate-700 font-sans">{log.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspector Verification Modal */}
      <InspectorVerificationModal
        alert={verificationAlert}
        isOpen={!!verificationAlert}
        onClose={() => setVerificationAlert(null)}
        onVerified={() => refreshAll()}
        onRejected={() => refreshAll()}
      />

      {/* CCTV Evidence Modal */}
      <CCTVEvidenceModal
        item={evidenceItem}
        isOpen={!!evidenceItem}
        onClose={() => setEvidenceItem(null)}
      />

      {/* Register New Camera Modal */}
      {showAddCameraModal && (
        <div className="fixed inset-0 z-50 bg-[#061523]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#c5d6e2] max-w-lg w-full p-6 text-xs text-[#0d2a44]">
            <h3 className="text-base font-bold text-[#0d2a44] mb-1">
              Register New CCTV Camera Node
            </h3>
            <p className="text-slate-500 mb-4">
              Associate an RTSP stream with a registered coal mine and safety monitoring zone
            </p>

            <form onSubmit={handleAddCameraSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Camera ID:</label>
                <input
                  type="text"
                  value={newCamData.id}
                  onChange={(e) => setNewCamData({ ...newCamData, id: e.target.value })}
                  className="w-full p-2 border border-[#c5d6e2] rounded-lg font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Camera Name / Description:</label>
                <input
                  type="text"
                  value={newCamData.name}
                  onChange={(e) => setNewCamData({ ...newCamData, name: e.target.value })}
                  placeholder="e.g. Pit-5 South Blast & Shovel Area"
                  className="w-full p-2 border border-[#c5d6e2] rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Coal Mine:</label>
                  <select
                    value={newCamData.mineId}
                    onChange={(e) => {
                      const mId = e.target.value;
                      const mName =
                        mId === 'KD-101'
                          ? 'Gevra OC Mine (SECL)'
                          : mId === 'KD-104'
                          ? 'Jharia Coalfield Concession (BCCL)'
                          : mId === 'KD-102'
                          ? 'Piparwar OCP (CCL)'
                          : 'Jayant OC Mine (NCL)';
                      setNewCamData({ ...newCamData, mineId: mId, mineName: mName });
                    }}
                    className="w-full p-2 border border-[#c5d6e2] rounded-lg bg-white"
                  >
                    <option value="KD-101">Gevra OC Mine (SECL)</option>
                    <option value="KD-104">Jharia Coalfield (BCCL)</option>
                    <option value="KD-102">Piparwar OCP (CCL)</option>
                    <option value="KD-105">Jayant OC Mine (NCL)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Monitoring Zone:</label>
                  <select
                    value={newCamData.zone}
                    onChange={(e) => setNewCamData({ ...newCamData, zone: e.target.value })}
                    className="w-full p-2 border border-[#c5d6e2] rounded-lg bg-white"
                  >
                    <option value="Excavation Pit / Face">Excavation Pit / Face</option>
                    <option value="Conveyor Corridor">Conveyor Corridor</option>
                    <option value="Workshop Heavy Repair Bay">Workshop Repair Bay</option>
                    <option value="Haul Road Crossing">Haul Road Crossing</option>
                    <option value="Fire Danger Zone">Fire Danger Zone</option>
                    <option value="Processing Plant">Processing Plant</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">RTSP Stream IP / Host:</label>
                  <input
                    type="text"
                    value={newCamData.rtspIp}
                    onChange={(e) => setNewCamData({ ...newCamData, rtspIp: e.target.value })}
                    className="w-full p-2 border border-[#c5d6e2] rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Stream Resolution:</label>
                  <input
                    type="text"
                    value={newCamData.resolution}
                    onChange={(e) => setNewCamData({ ...newCamData, resolution: e.target.value })}
                    className="w-full p-2 border border-[#c5d6e2] rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddCameraModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow-xs"
                >
                  Register Camera Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
