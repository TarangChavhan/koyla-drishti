import React from 'react';
import { Camera, Radio, Volume2, ShieldCheck } from 'lucide-react';
import { CCTVMonitoringView } from '../../components/cctv/CCTVMonitoringView';
import { useAuth } from '../../context/AuthContext';

export const MineCCTV: React.FC = () => {
  const { user } = useAuth();
  const mineId = user?.mineId || 'KD-101';

  return (
    <div className="space-y-6">
      {/* Mine Site Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#d6e2eb]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#104066] text-white">
              MINE OPERATING LEASE SURVEILLANCE
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Concession #{mineId} · On-Site Safety Control Room
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0d2a44] tracking-tight">
            Site CCTV & Active Warning Monitoring
          </h1>
          <p className="text-xs text-[#5c7283]">
            Real-time feed of pit excavation, haul corridors, and workshops with synchronized 120s hazard warning sirens.
          </p>
        </div>
      </div>

      <CCTVMonitoringView initialTab="live" defaultMineId={mineId} />
    </div>
  );
};
