import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { CCTVMonitoringView } from '../../components/cctv/CCTVMonitoringView';
import { Link } from 'react-router-dom';

export const InspectorCCTV: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Inspector Console Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#d6e2eb]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-800 text-white">
              STATUTORY INSPECTION CONSOLE
            </span>
            <span className="text-xs text-slate-500 font-medium">
              DGMS Mining Regulatory Enforcement
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0d2a44] tracking-tight">
            Inspector CCTV Verification & Alert Review
          </h1>
          <p className="text-xs text-[#5c7283]">
            Verify AI-detected safety events, confirm statutory non-compliance, and issue enforceable statutory violations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/inspector/violations"
            className="px-3 py-2 bg-white border border-[#d6e2eb] hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>View Issued Violations</span>
          </Link>
        </div>
      </div>

      <CCTVMonitoringView initialTab="alerts" inspectorMode={true} />
    </div>
  );
};
