import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Maximize2,
  Minimize2,
  RefreshCw,
  Video,
  Layers,
  Crosshair,
  Sliders,
  AlertCircle,
  Eye,
  EyeOff,
  Radio,
  Wifi,
  WifiOff,
  Cpu,
  Download,
  ShieldCheck,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { CCTVCamera, YOLODetection } from '../../types/cctv';
import { useToast } from '../../context/ToastContext';

interface CCTVStreamPlayerProps {
  camera: CCTVCamera;
  activeDetections?: YOLODetection[];
  onCaptureSnapshot?: (dataUrl: string, detections: YOLODetection[]) => void;
  onSelectCamera?: (camera: CCTVCamera) => void;
  isCompact?: boolean;
}

export const CCTVStreamPlayer: React.FC<CCTVStreamPlayerProps> = ({
  camera,
  activeDetections,
  onCaptureSnapshot,
  onSelectCamera,
  isCompact = false
}) => {
  const { showToast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [showOverlays, setShowOverlays] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showPTZ, setShowPTZ] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-IN', { hour12: false }));
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-IN', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Background visual themes based on zone
  const getZoneVisual = (zone: string) => {
    if (zone.includes('Face') || zone.includes('Pit')) {
      return 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80';
    }
    if (zone.includes('Conveyor')) {
      return 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80';
    }
    if (zone.includes('Workshop')) {
      return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80';
    }
    if (zone.includes('Fire') || zone.includes('Hazard')) {
      return 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=1200&q=80';
    }
    return 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80';
  };

  // Mock detections if not provided
  const detections: YOLODetection[] = activeDetections || [
    {
      id: 'd1',
      class: 'worker',
      label: 'Worker (ID #04)',
      confidence: 0.95,
      bbox: [180, 110, 290, 360],
      color: '#3b82f6'
    },
    {
      id: 'd2',
      class: camera.zone.includes('Workshop') || camera.zone.includes('Fire') ? 'no_helmet' : 'helmet',
      label: camera.zone.includes('Workshop') || camera.zone.includes('Fire') ? 'VIOLATION: No Helmet' : 'Safety Helmet OK',
      confidence: 0.93,
      bbox: [215, 115, 260, 165],
      color: camera.zone.includes('Workshop') || camera.zone.includes('Fire') ? '#ef4444' : '#22c55e'
    },
    {
      id: 'd3',
      class: 'safety_vest',
      label: 'Hi-Vis Vest OK',
      confidence: 0.91,
      bbox: [200, 170, 275, 280],
      color: '#10b981'
    },
    {
      id: 'd4',
      class: 'vehicle',
      label: 'Dump Truck CAT 777E',
      confidence: 0.96,
      bbox: [380, 140, 580, 370],
      color: '#6366f1'
    }
  ];

  // Draw OpenCV & YOLO bounding box overlays on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!showOverlays || camera.cameraStatus === 'OFFLINE') return;

    // Render Bounding Boxes
    detections.forEach((det) => {
      const [x1, y1, x2, y2] = det.bbox;
      const w = x2 - x1;
      const h = y2 - y1;

      // Box outline
      ctx.lineWidth = 2;
      ctx.strokeStyle = det.color;
      ctx.strokeRect(x1, y1, w, h);

      // Corner target brackets
      const bracketLen = 8;
      ctx.lineWidth = 3;
      // top-left
      ctx.beginPath();
      ctx.moveTo(x1, y1 + bracketLen);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x1 + bracketLen, y1);
      ctx.stroke();

      // top-right
      ctx.beginPath();
      ctx.moveTo(x2 - bracketLen, y1);
      ctx.lineTo(x2, y1);
      ctx.lineTo(x2, y1 + bracketLen);
      ctx.stroke();

      // Label background
      ctx.fillStyle = det.color;
      const labelText = `${det.label} ${(det.confidence * 100).toFixed(1)}%`;
      ctx.font = '11px monospace';
      const textWidth = ctx.measureText(labelText).width;
      ctx.fillRect(x1, y1 > 18 ? y1 - 18 : y1, textWidth + 8, 18);

      // Label text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(labelText, x1 + 4, y1 > 18 ? y1 - 5 : y1 + 13);
    });

    // Optical Flow / Heatmap simulation if active
    if (showHeatmap) {
      const grad = ctx.createRadialGradient(240, 220, 20, 240, 220, 140);
      grad.addColorStop(0, 'rgba(239, 68, 68, 0.45)');
      grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.25)');
      grad.addColorStop(1, 'rgba(59, 130, 246, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [detections, showOverlays, showHeatmap, camera.cameraStatus]);

  const handleCapture = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    onCaptureSnapshot?.(dataUrl, detections);
    showToast(`Snapshot captured from ${camera.name}. Linked to evidence record.`, 'success');
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handlePan = (dx: number, dy: number) => {
    setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(3, Math.max(1, prev + delta)));
  };

  const isOffline = camera.cameraStatus === 'OFFLINE';

  return (
    <div
      ref={containerRef}
      id={`cctv-player-${camera.id}`}
      className={`relative bg-black rounded-xl overflow-hidden border border-[#2b4153] shadow-md flex flex-col ${
        isCompact ? 'h-64' : 'h-[440px]'
      }`}
    >
      {/* Top Telemetry Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 via-black/40 to-transparent p-3 flex items-center justify-between text-white text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Badge */}
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
              camera.cameraStatus === 'ONLINE'
                ? 'bg-emerald-600 text-white'
                : camera.cameraStatus === 'DEGRADED'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-700 text-slate-300'
            }`}
          >
            {camera.cameraStatus === 'ONLINE' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {camera.cameraStatus}
          </span>

          {/* AI Monitoring Badge */}
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
              camera.aiMonitoringStatus === 'ACTIVE'
                ? 'bg-blue-600 text-white'
                : camera.aiMonitoringStatus === 'FAILED'
                ? 'bg-red-600 text-white'
                : 'bg-slate-600 text-slate-200'
            }`}
          >
            <Cpu className="w-3 h-3" />
            YOLO {camera.aiMonitoringStatus}
          </span>

          <span className="font-semibold text-slate-200 drop-shadow-sm truncate max-w-[200px]">
            {camera.name}
          </span>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">[{camera.id}]</span>
        </div>

        {/* Real-time Telemetry Stats */}
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-300">
          <span className="text-emerald-400 font-bold hidden md:inline">● LIVE 30 FPS</span>
          <span className="text-slate-400 hidden md:inline">4.2 Mbps</span>
          <span className="text-amber-300 font-bold">{currentTime} IST</span>
          <button
            onClick={toggleFullscreen}
            className="p-1 rounded hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Stream Area */}
      <div className="relative flex-1 bg-[#0b151f] overflow-hidden flex items-center justify-center">
        {isOffline ? (
          <div className="text-center space-y-2 p-6">
            <WifiOff className="w-12 h-12 text-slate-600 mx-auto" />
            <div className="text-sm font-bold text-slate-400 uppercase">FEED UNAVAILABLE · OFFLINE</div>
            <p className="text-xs text-slate-500 max-w-xs">
              RTSP connection to {camera.streamUrl} timed out. Heartbeat lost. AI processing suspended.
            </p>
          </div>
        ) : (
          <div
            className="relative w-full h-full transition-transform duration-100 ease-out flex items-center justify-center"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`
            }}
          >
            {/* Camera Video / Realistic Backdrop */}
            <img
              src={getZoneVisual(camera.zone)}
              alt={camera.name}
              className="w-full h-full object-cover select-none pointer-events-none filter brightness-95 contrast-105"
            />

            {/* OpenCV & YOLO Overlay Canvas */}
            <canvas
              ref={canvasRef}
              width={640}
              height={360}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* Crosshair Watermark */}
            <div className="absolute inset-0 pointer-events-none opacity-25 flex items-center justify-center">
              <Crosshair className="w-24 h-24 text-white" />
            </div>

            {/* DGMS Legal Watermark */}
            <div className="absolute bottom-10 left-3 pointer-events-none text-[10px] text-white/70 font-mono bg-black/60 px-2 py-1 rounded">
              KOYLA DRISHTI · DGMS STATUTORY SURVEILLANCE · {camera.mineId} · {camera.zone.toUpperCase()}
            </div>
          </div>
        )}
      </div>

      {/* PTZ Interactive Overlay Drawer */}
      {showPTZ && !isOffline && (
        <div className="absolute bottom-12 right-3 z-30 bg-black/80 backdrop-blur-md border border-slate-700 rounded-xl p-3 text-white shadow-2xl">
          <div className="text-[11px] font-bold text-amber-300 uppercase mb-2 flex items-center justify-between">
            <span>PTZ Controls</span>
            <span className="text-[9px] text-slate-400 font-mono">{zoomLevel}x ZOOM</span>
          </div>
          <div className="grid grid-cols-3 gap-1 w-28 mx-auto mb-2">
            <div />
            <button
              onClick={() => handlePan(0, 15)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-center"
            >
              <ChevronUp className="w-4 h-4 mx-auto" />
            </button>
            <div />
            <button
              onClick={() => handlePan(15, 0)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-center"
            >
              <ChevronLeft className="w-4 h-4 mx-auto" />
            </button>
            <button
              onClick={() => {
                setPanOffset({ x: 0, y: 0 });
                setZoomLevel(1);
              }}
              className="p-1.5 bg-slate-900 hover:bg-slate-800 rounded text-[9px] font-bold text-slate-400"
            >
              RESET
            </button>
            <button
              onClick={() => handlePan(-15, 0)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-center"
            >
              <ChevronRight className="w-4 h-4 mx-auto" />
            </button>
            <div />
            <button
              onClick={() => handlePan(0, -15)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-center"
            >
              <ChevronDown className="w-4 h-4 mx-auto" />
            </button>
            <div />
          </div>
          <div className="flex items-center justify-center gap-2 pt-1 border-t border-slate-700">
            <button
              onClick={() => handleZoom(-0.25)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs flex items-center gap-1"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom(0.25)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs flex items-center gap-1"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Control Bar */}
      <div className="bg-[#07131e] border-t border-[#1d2f3e] px-3 py-2 flex items-center justify-between text-xs text-slate-300 z-20">
        <div className="flex items-center gap-2">
          {/* Overlay Toggle */}
          <button
            onClick={() => setShowOverlays((prev) => !prev)}
            className={`px-2 py-1 rounded flex items-center gap-1.5 text-[11px] font-medium transition-colors ${
              showOverlays ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40' : 'bg-slate-800 text-slate-400'
            }`}
            title="Toggle YOLO Bounding Boxes"
          >
            {showOverlays ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>YOLO Bounding Boxes</span>
          </button>

          {/* Heatmap Toggle */}
          <button
            onClick={() => setShowHeatmap((prev) => !prev)}
            className={`px-2 py-1 rounded flex items-center gap-1.5 text-[11px] font-medium transition-colors ${
              showHeatmap ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
            }`}
            title="Toggle Motion Heatmap"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Thermal / Motion</span>
          </button>

          {/* PTZ Toggle */}
          {camera.ptzSupported && (
            <button
              onClick={() => setShowPTZ((prev) => !prev)}
              className={`px-2 py-1 rounded flex items-center gap-1.5 text-[11px] font-medium transition-colors ${
                showPTZ ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>PTZ</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Capture Snapshot */}
          <button
            onClick={handleCapture}
            disabled={isOffline}
            className="px-2.5 py-1 bg-emerald-700/80 hover:bg-emerald-600 disabled:opacity-40 text-white rounded font-medium text-[11px] flex items-center gap-1 transition-colors"
            title="Capture frame and save as legal evidence"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Capture Evidence</span>
          </button>
        </div>
      </div>
    </div>
  );
};
