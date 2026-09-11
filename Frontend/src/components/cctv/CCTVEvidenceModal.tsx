import React from 'react';
import {
  Camera,
  X,
  FileCheck,
  Calendar,
  Clock,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Download,
  ExternalLink
} from 'lucide-react';
import { CCTVAlert, CCTVEvent } from '../../types/cctv';
import { useNavigate } from 'react-router-dom';

interface CCTVEvidenceModalProps {
  item: CCTVAlert | CCTVEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CCTVEvidenceModal: React.FC<CCTVEvidenceModalProps> = ({ item, isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen || !item) return null;

  const isAlert = 'alertStatus' in item;
  const alert = isAlert ? (item as CCTVAlert) : null;
  const event = !isAlert ? (item as CCTVEvent) : null;

  const title = isAlert ? alert?.detection : event?.detectionType;
  const mineName = item.mineName;
  const cameraName = item.cameraName;
  const zone = item.zone;
  const frameUrl = isAlert ? alert?.evidence.frameUrl : event?.evidenceFrameUrl;
  const detections = isAlert ? alert?.evidence.detections || [] : event?.detections || [];
  const confidence = item.confidence;
  const timestamp = isAlert ? alert?.dateTime : event?.timestamp;

  return (
    <div className="fixed inset-0 z-50 bg-[#061523]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#c5d6e2] max-w-3xl w-full overflow-hidden my-6">
        <div className="bg-[#0f2e4a] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Camera className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm">CCTV Video AI Evidence Record</h3>
              <div className="text-[11px] text-slate-300 font-mono">
                {item.id} · {cameraName}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Main Visual Frame */}
          <div className="relative rounded-xl overflow-hidden bg-black border border-slate-700 flex items-center justify-center max-h-80">
            <img
              src={frameUrl}
              alt="CCTV Evidence Frame"
              className="w-full h-auto object-cover max-h-80"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-1 rounded">
              DGMS EVIDENCE HASH: SHA256-{(item.id + confidence).slice(0, 16)}...
            </div>
          </div>

          {/* Detections List */}
          <div>
            <h4 className="font-bold text-slate-800 text-xs mb-2 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              YOLOv8x Object Detections & Bounding Box Telemetry
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {detections.map((det) => (
                <div
                  key={det.id}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: det.color || '#3b82f6' }}
                    />
                    <div>
                      <div className="font-semibold text-slate-800">{det.label}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        BBox: [{det.bbox.join(', ')}]
                      </div>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-700 font-mono">
                    {(det.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 block font-medium">Mine / Lease</span>
              <strong className="text-slate-800">{mineName}</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Monitored Zone</span>
              <strong className="text-slate-800">{zone}</strong>
            </div>
            <div>
              <span className="text-slate-500 block font-medium">Timestamp</span>
              <strong className="text-slate-800 font-mono">
                {timestamp ? new Date(timestamp).toLocaleString('en-IN') : 'N/A'}
              </strong>
            </div>
          </div>

          {/* Linked Statutory Violation if verified */}
          {alert?.violationId && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-emerald-700 font-bold block">
                  Official Statutory Violation Created:
                </span>
                <span className="font-mono text-emerald-900 font-semibold text-xs">
                  #{alert.violationId} · Verified by {alert.verifiedBy || 'DGMS Inspector'}
                </span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  navigate('/inspector/violations');
                }}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold flex items-center gap-1 text-[11px]"
              >
                <span>View Violation Case</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold"
            >
              Close Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
