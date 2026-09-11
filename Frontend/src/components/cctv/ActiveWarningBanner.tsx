import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Volume2,
  VolumeX,
  Clock,
  Radio,
  XCircle,
  Play,
  ShieldAlert,
  Flame,
  HardHat,
  Ban
} from 'lucide-react';
import { cctvService, buzzerAudio } from '../../services/cctvService';
import { BuzzerStatus, SafetyWarning } from '../../types/cctv';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface ActiveWarningBannerProps {
  onRefresh?: () => void;
}

export const ActiveWarningBanner: React.FC<ActiveWarningBannerProps> = ({ onRefresh }) => {
  const { role, user } = useAuth();
  const { showToast } = useToast();
  const [buzzerStatus, setBuzzerStatus] = useState<BuzzerStatus>(cctvService.getBuzzerStatus());
  const [activeWarning, setActiveWarning] = useState<SafetyWarning | null>(cctvService.getActiveWarning());
  const [isMuted, setIsMuted] = useState<boolean>(buzzerAudio.isMuted);
  const [showSimulateMenu, setShowSimulateMenu] = useState(false);

  // Authoritative 1-second synchronization with backend state
  useEffect(() => {
    const checkStatus = () => {
      const bStatus = cctvService.getBuzzerStatus();
      const warning = cctvService.getActiveWarning();
      setBuzzerStatus(bStatus);
      setActiveWarning(warning);
    };

    checkStatus();
    const timer = setInterval(checkStatus, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleMute = () => {
    const muted = buzzerAudio.toggleMute();
    setIsMuted(muted);
    showToast(muted ? 'Buzzer siren audio muted' : 'Buzzer siren audio unmuted', 'info');
  };

  const handleCancelWarning = () => {
    cctvService.cancelActiveWarning('Cancelled by authorized officer');
    setBuzzerStatus(cctvService.getBuzzerStatus());
    setActiveWarning(null);
    showToast('Safety warning deactivated and buzzer silenced.', 'warning');
    onRefresh?.();
  };

  const handleTriggerSimulatedEvent = (type: 'helmet' | 'fire' | 'zone') => {
    setShowSimulateMenu(false);
    let ruleId = 'RULE-PPE-01';
    if (type === 'fire') ruleId = 'RULE-FIRE-01';
    if (type === 'zone') ruleId = 'RULE-ZONE-01';

    const cameras = cctvService.getCameras();
    const targetCam = cameras.find((c) => c.cameraStatus === 'ONLINE') || cameras[0];

    const result = cctvService.evaluateDetectionAndTrigger(targetCam.id, ruleId);
    setBuzzerStatus(cctvService.getBuzzerStatus());
    setActiveWarning(result.warning);
    showToast(
      `🚨 YOLO Detection Confirmed: ${result.event.detectionType}. 120-Second Safety Warning Siren Activated!`,
      'error'
    );
    onRefresh?.();
  };

  const isBuzzerActive = buzzerStatus.status === 'BUZZER ACTIVE';
  const remaining = buzzerStatus.remainingSeconds;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="space-y-3 mb-6">
      {/* 120-Second Active Warning Bar */}
      {isBuzzerActive && activeWarning ? (
        <div
          id="cctv-active-warning-card"
          className="relative overflow-hidden rounded-xl border-2 border-red-500 bg-gradient-to-r from-red-950/90 via-red-900/80 to-slate-900 text-white p-4 shadow-xl animate-pulse"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-lg bg-red-600/30 border border-red-400 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-7 h-7 text-red-300 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-red-600 text-white">
                    {buzzerStatus.status}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    STATUTORY 120-SECOND SAFETY WARNING
                  </span>
                  <span className="text-xs text-red-200 font-medium">
                    Mine: <strong>{activeWarning.mineName}</strong> · Zone: <strong>{activeWarning.zone}</strong>
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mt-1">
                  Hazard Detected: {activeWarning.detectionType} on {activeWarning.cameraName}
                </h4>
                <p className="text-xs text-red-200/90">
                  DGMS Rule Engine confirmed actionable safety violation. Industrial siren active at pit zone.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              {/* Authoritative Timer */}
              <div className="text-center px-4 py-2 bg-black/40 border border-red-500/40 rounded-lg shrink-0">
                <div className="text-[10px] uppercase font-semibold text-red-300 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" /> Authoritative Timer
                </div>
                <div className="text-2xl font-mono font-black text-amber-300 tracking-wider">
                  {timeFormatted}
                </div>
                <div className="text-[9px] text-slate-300">of 120s Duration</div>
              </div>

              {/* Siren Audio Mute */}
              <button
                id="btn-toggle-buzzer-mute"
                onClick={handleToggleMute}
                className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
                title={isMuted ? 'Unmute Warning Siren' : 'Mute Warning Siren'}
              >
                {isMuted ? <VolumeX className="w-5 h-5 text-amber-300" /> : <Volume2 className="w-5 h-5 text-red-300" />}
              </button>

              {/* Officer Deactivate */}
              {(role === 'admin' || role === 'inspector') && (
                <button
                  id="btn-cancel-warning"
                  onClick={handleCancelWarning}
                  className="px-3 py-2 rounded-lg bg-red-800/80 hover:bg-red-700 text-xs font-semibold text-white border border-red-600 transition-colors flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Deactivate Siren</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Standby System Status Bar */
        <div className="bg-white border border-[#d6e2eb] rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#0d2a44]">CCTV SAFETY SURVEILLANCE STATUS:</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  ALL SITES NORMAL · BUZZER INACTIVE
                </span>
              </div>
              <p className="text-[11px] text-[#5c7283]">
                YOLOv8x AI model active across opencast pits and coal processing corridors · 120s warning armed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio State Toggle */}
            <button
              onClick={handleToggleMute}
              className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
                isMuted ? 'bg-slate-100 border-slate-300 text-slate-600' : 'bg-emerald-50 border-emerald-300 text-emerald-700'
              }`}
              title="Test or toggle warning siren audio"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="text-[11px]">{isMuted ? 'Audio Muted' : 'Siren Armed'}</span>
            </button>

            {/* Test YOLO Event Simulation */}
            <div className="relative">
              <button
                id="btn-simulate-yolo"
                onClick={() => setShowSimulateMenu((prev) => !prev)}
                className="px-3 py-1.5 bg-[#0f2e4a] hover:bg-[#1a446c] text-white text-xs font-medium rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Play className="w-3.5 h-3.5 text-amber-300" />
                <span>Simulate YOLO Event</span>
              </button>

              {showSimulateMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-[#d6e2eb] z-50 p-2 text-xs">
                  <div className="font-semibold text-slate-700 px-2 py-1 border-b border-slate-100 mb-1">
                    Trigger Rule Engine Test:
                  </div>
                  <button
                    onClick={() => handleTriggerSimulatedEvent('helmet')}
                    className="w-full text-left px-2.5 py-2 hover:bg-slate-50 rounded flex items-center gap-2 text-slate-800"
                  >
                    <HardHat className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="font-medium">Worker without Helmet</div>
                      <div className="text-[10px] text-slate-500">PPE Rule #01 · 120s Siren</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleTriggerSimulatedEvent('fire')}
                    className="w-full text-left px-2.5 py-2 hover:bg-slate-50 rounded flex items-center gap-2 text-slate-800"
                  >
                    <Flame className="w-4 h-4 text-red-600" />
                    <div>
                      <div className="font-medium">Open Fire / Flame Outbreak</div>
                      <div className="text-[10px] text-slate-500">Critical Hazard · 120s Siren</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleTriggerSimulatedEvent('zone')}
                    className="w-full text-left px-2.5 py-2 hover:bg-slate-50 rounded flex items-center gap-2 text-slate-800"
                  >
                    <Ban className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="font-medium">Restricted Highwall Breach</div>
                      <div className="text-[10px] text-slate-500">Zone Rule · Critical Alert</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
