import React, { useState } from 'react';
import { mineService } from '../../services/mineService';
import { violationService } from '../../services/violationService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Layers
} from 'lucide-react';

export const AdminCompliance: React.FC = () => {
  const { showToast } = useToast();
  const [mines, setMines] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('All');

  React.useEffect(() => {
    mineService.getAllMines().then((data) => setMines(data || [])).catch(() => {});
  }, []);

  const complianceCategories = [
    { title: 'Mine Safety & Geotechnical Stability', compliance: 91, target: 95, color: '#18a873', icon: ShieldCheck, status: 'On Target' },
    { title: 'Environmental Quality (Dust, PM10, Water)', compliance: 78, target: 90, color: '#e7a92b', icon: AlertTriangle, status: 'Needs Improvement' },
    { title: 'HEMM Heavy Machinery & Mechanical Standards', compliance: 84, target: 88, color: '#126fba', icon: Layers, status: 'Stable' },
    { title: 'Statutory Documentation & DGMS Returns', compliance: 95, target: 98, color: '#18a873', icon: FileCheck, status: 'Optimal' },
    { title: 'Labour Welfare, Medical & PPE Protocols', compliance: 73, target: 92, color: '#df4d52', icon: Clock, status: 'Deficient' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#152737] tracking-tight">
            National Compliance Monitoring & Risk Assessment
          </h1>
          <p className="text-xs text-[#728594]">
            Statutory metrics, environmental thresholds, and compliance risk index across coal blocks.
          </p>
        </div>
        <button
          onClick={() => showToast('Compliance intelligence bulletin exported', 'success')}
          className="px-4 py-2 rounded-xl bg-white border border-[#e2e9ee] hover:bg-slate-50 text-xs font-semibold text-[#526a79] flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Download className="w-4 h-4 text-[#126fba]" />
          Download Compliance Bulletin
        </button>
      </div>

      {/* Category Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {complianceCategories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div key={idx} className="bg-white border border-[#e2e9ee] rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: cat.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#152737] leading-snug">{cat.title}</h3>
                    <span className="text-[10px] text-[#728594]">National Target: {cat.target}%</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-1.5">
                  <strong className="text-2xl font-black text-[#152737]">{cat.compliance}%</strong>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      cat.compliance >= 90
                        ? 'bg-emerald-50 text-emerald-700'
                        : cat.compliance >= 80
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {cat.status}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.compliance}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* High-Risk Mines Watchlist */}
      <div className="bg-white border border-[#e2e9ee] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#e2e9ee] pb-3">
          <div>
            <h3 className="text-xs font-bold text-[#152737] uppercase tracking-wider">
              Priority Statutory Compliance Watchlist
            </h3>
            <p className="text-[11px] text-[#728594]">Mines scoring below 75% or flagged with High Risk</p>
          </div>
          <span className="text-[11px] font-bold text-[#df4d52] bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            Immediate Intervention Required
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] text-[#647988] border-b border-[#e2e9ee]">
                <th className="py-2.5 px-3 font-semibold">Mine ID</th>
                <th className="py-2.5 px-3 font-semibold">Mine Name</th>
                <th className="py-2.5 px-3 font-semibold">State / Basin</th>
                <th className="py-2.5 px-3 font-semibold">Score</th>
                <th className="py-2.5 px-3 font-semibold">Risk Level</th>
                <th className="py-2.5 px-3 font-semibold">Primary Flagged Hazard</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e9ee]">
              {mines
                .filter((m) => m.complianceScore < 75 || m.riskLevel === 'High')
                .map((m) => (
                  <tr key={m.id} className="hover:bg-[#f9fbfc] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#126fba]">{m.id}</td>
                    <td className="py-3 px-3 font-semibold text-[#152737]">{m.name}</td>
                    <td className="py-3 px-3 text-[#526a79]">{m.district}, {m.state}</td>
                    <td className="py-3 px-3 font-bold text-[#df4d52]">{m.complianceScore}%</td>
                    <td className="py-3 px-3"><StatusBadge status={m.riskLevel} size="sm" /></td>
                    <td className="py-3 px-3 text-[#526a79]">Overburden slope destabilization & dust threshold</td>
                    <td className="py-3 px-3"><StatusBadge status={m.status} size="sm" /></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
