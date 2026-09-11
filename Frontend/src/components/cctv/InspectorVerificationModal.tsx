import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Camera,
  Layers,
  FileCheck,
  AlertTriangle,
  Info,
  Calendar,
  UserCheck,
  Building,
  Volume2
} from 'lucide-react';
import { CCTVAlert } from '../../types/cctv';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { cctvService } from '../../services/cctvService';

interface InspectorVerificationModalProps {
  alert: CCTVAlert | null;
  isOpen: boolean;
  onClose: () => void;
  onVerified?: (alertId: string, violationId: string) => void;
  onRejected?: (alertId: string) => void;
}

export const InspectorVerificationModal: React.FC<InspectorVerificationModalProps> = ({
  alert,
  isOpen,
  onClose,
  onVerified,
  onRejected
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [remarks, setRemarks] = useState('Confirmed violation following CCTV visual review and bounding box telemetry inspection.');
  const [deadlineDays, setDeadlineDays] = useState(7);
  const [rejectReason, setRejectReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'verify' | 'reject'>('verify');

  if (!isOpen || !alert) return null;

  const inspectorName = user?.name || 'Er. R. K. Sharma (DGMS)';

  const handleVerify = () => {
    setIsSubmitting(true);
    try {
      const result = cctvService.verifyAlert(alert.id, inspectorName, remarks, deadlineDays);
      showToast(`AI Alert Verified. Official Statutory Violation #${result.violationId} issued.`, 'success');
      onVerified?.(alert.id, result.violationId);
      onClose();
    } catch {
      showToast('Error during alert verification', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      showToast('Please provide a statutory reason for rejecting this AI alert.', 'warning');
      return;
    }
    setIsSubmitting(true);
    try {
      cctvService.rejectAlert(alert.id, inspectorName, rejectReason);
      showToast(`AI Alert marked as REJECTED. Reason recorded in audit log.`, 'info');
      onRejected?.(alert.id);
      onClose();
    } catch {
      showToast('Error during alert rejection', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#061523]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#c5d6e2] max-w-3xl w-full overflow-hidden my-6">
        {/* Prominent Statutory Verification Header */}
        <div className="bg-[#0b2438] text-white p-5 border-b border-[#1b3d5b]">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 mb-1">
                  AI-GENERATED SAFETY ALERT · INSPECTOR VERIFICATION REQUIRED
                </div>
                <h3 className="text-base font-bold text-white">
                  Statutory Review: {alert.id} · {alert.mineName}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Metadata & Risk Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#f3f7fa] p-3 rounded-lg border border-[#e1ebf2]">
              <span className="text-[#627a8c] block font-medium">Mine / Concession</span>
              <strong className="text-[#0d2a44] truncate block mt-0.5">{alert.mineName}</strong>
            </div>
            <div className="bg-[#f3f7fa] p-3 rounded-lg border border-[#e1ebf2]">
              <span className="text-[#627a8c] block font-medium">CCTV Camera</span>
              <strong className="text-[#0d2a44] truncate block mt-0.5">{alert.cameraName}</strong>
            </div>
            <div className="bg-[#f3f7fa] p-3 rounded-lg border border-[#e1ebf2]">
              <span className="text-[#627a8c] block font-medium">YOLO Confidence</span>
              <strong className="text-emerald-700 block mt-0.5">{(alert.confidence * 100).toFixed(1)}% (Passes Rule)</strong>
            </div>
            <div className="bg-[#f3f7fa] p-3 rounded-lg border border-[#e1ebf2]">
              <span className="text-[#627a8c] block font-medium">Buzzer Warning</span>
              <strong className={`block mt-0.5 ${alert.buzzerStatus === 'BUZZER ACTIVE' ? 'text-red-600' : 'text-slate-600'}`}>
                {alert.buzzerStatus}
              </strong>
            </div>
          </div>

          {/* Evidence Frame Preview */}
          <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-700 p-3">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
              <span className="font-semibold flex items-center gap-1.5 text-amber-300">
                <Camera className="w-3.5 h-3.5" /> CCTV Snapshot Evidence Frame
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {new Date(alert.dateTime).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="relative rounded-lg overflow-hidden max-h-64 flex items-center justify-center bg-black">
              <img
                src={alert.evidence.frameUrl}
                alt="Evidence snapshot"
                className="w-full h-auto object-cover max-h-64"
              />
              <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                {alert.riskLevel} RISK HAZARD
              </div>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
              <span>{alert.detection}</span>
              <span className="font-mono text-slate-500">Ref: {alert.evidence.videoClipReference || 'CH01_RECORDING'}</span>
            </div>
          </div>

          {/* Tabs for Verification vs Rejection */}
          <div>
            <div className="flex border-b border-[#e1ebf2] mb-4">
              <button
                onClick={() => setActiveTab('verify')}
                className={`pb-2 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
                  activeTab === 'verify'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Create Official Violation</span>
              </button>
              <button
                onClick={() => setActiveTab('reject')}
                className={`pb-2 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors ${
                  activeTab === 'reject'
                    ? 'border-red-600 text-red-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <XCircle className="w-4 h-4" />
                <span>Reject as False Positive / Authorized</span>
              </button>
            </div>

            {activeTab === 'verify' ? (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
                  <p className="font-semibold mb-1">
                    Statutory DGMS Compliance Action:
                  </p>
                  <p className="text-[11px] text-emerald-800">
                    Verifying this alert will create an enforceable statutory violation under DGMS Mines Act 1952, attach this CCTV snapshot as evidence, generate a paired corrective action order, and alert the Mine Manager.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-[#0d2a44] mb-1">
                    Inspector Verification Remarks:
                  </label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={3}
                    className="w-full p-2.5 border border-[#c5d6e2] rounded-lg text-xs text-[#0d2a44] focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="Enter statutory inspection notes and directives..."
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#0d2a44] mb-1">
                    Corrective Action Statutory Deadline:
                  </label>
                  <select
                    value={deadlineDays}
                    onChange={(e) => setDeadlineDays(Number(e.target.value))}
                    className="p-2 border border-[#c5d6e2] rounded-lg text-xs bg-white text-[#0d2a44]"
                  >
                    <option value={3}>3 Days (Urgent / Immediate Risk)</option>
                    <option value={7}>7 Days (Standard Statutory Notice)</option>
                    <option value={14}>14 Days (Equipment / Structural Repair)</option>
                    <option value={30}>30 Days (Engineering Redesign)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-confirm-verify-violation"
                    onClick={handleVerify}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Issue Official Violation</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900">
                  <p className="font-semibold mb-1">
                    Rejection Audit Trail Mandate:
                  </p>
                  <p className="text-[11px] text-red-800">
                    A statutory justification is mandatory to dismiss an AI-detected safety event. This entry will be permanently logged in the DGMS audit trail.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-[#0d2a44] mb-1">
                    Statutory Reason for Rejection:
                  </label>
                  <select
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full p-2 border border-[#c5d6e2] rounded-lg text-xs bg-white text-[#0d2a44] mb-2"
                  >
                    <option value="">Select Pre-approved Statutory Reason...</option>
                    <option value="False Positive: Optical dust / glare artifact mistaken for smoke plume">
                      False Positive: Optical dust / glare artifact mistaken for smoke plume
                    </option>
                    <option value="Authorized Maintenance Operation with Approved DGMS Exemption Waiver">
                      Authorized Maintenance Operation with Approved DGMS Exemption Waiver
                    </option>
                    <option value="Worker positioned outside designated active machine travel boundary">
                      Worker positioned outside designated active machine travel boundary
                    </option>
                    <option value="Routine controlled cold blast with all blast gates barricaded">
                      Routine controlled cold blast with all blast gates barricaded
                    </option>
                    <option value="Other statutory justification (detailed below)">
                      Other statutory justification (detailed below)
                    </option>
                  </select>

                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={2}
                    className="w-full p-2.5 border border-[#c5d6e2] rounded-lg text-xs text-[#0d2a44] focus:ring-2 focus:ring-red-500 focus:outline-none"
                    placeholder="Enter additional inspector remarks..."
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-confirm-reject-alert"
                    onClick={handleReject}
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg flex items-center gap-1.5 shadow-xs"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject AI Alert</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
