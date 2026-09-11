import React from 'react';
import { Shield, Camera, FileCheck, RefreshCw } from 'lucide-react';
import { CCTVMonitoringView } from '../../components/cctv/CCTVMonitoringView';

export const AdminCCTV: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Government DGMS Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#d6e2eb]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#0f2e4a] text-white">
              DGMS STATUTORY SURVEILLANCE
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Ministry of Coal · Govt. of India
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0d2a44] tracking-tight">
            CCTV Monitoring & AI Safety Analysis Grid
          </h1>
          <p className="text-xs text-[#5c7283]">
            Continuous YOLOv8x computer vision surveillance across all registered opencast coal mines and processing zones.
          </p>
        </div>
      </div>

      <CCTVMonitoringView initialTab="live" />
    </div>
  );
};
