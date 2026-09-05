import React from 'react';
import { mineService } from '../../services/mineService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { ShieldCheck, AlertTriangle, CheckCircle2, Clock, Layers, FileCheck, Download } from 'lucide-react';

export const MineCompliance: React.FC = () => {
  const { showToast } = useToast();
  const mine = mineService.getMineById('KD-101') || mineService.getAllMines()[0];

  const categories = [
    { title: 'Mine Geotechnical Slope & Bench Safety', score: 82, target: 90, status: 'Satisfactory', notes: 'Bench angles compliant with DGMS circular 04/2021.' },
    { title: 'Air Quality & Dust Suppression', score: 68, target: 85, status: 'Remediation Required', notes: 'PM10 elevated on haul road. Additional water mist sprayers ordered.' },
    { title: 'HEMM Heavy Machinery Maintenance', score: 88, target: 85, status: 'Compliant', notes: 'All 24 dumpers equipped with proximity sensors.' },
    { title: 'Statutory Documentation & Worker Medicals', score: 94, target: 95, status: 'Optimal', notes: 'Form B employment register updated and signed.' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#152737] tracking-tight">
            Mine Compliance Scorecard & Remediation Matrix
          </h1>
          <p className="text-xs text-[#728594]">
            {mine.name} · DGMS Statutory Compliance Breakdown
          </p>
        </div>
        <button
          onClick={() => showToast('Compliance scorecard PDF generated', 'success')}
          className="px-4 py-2 rounded-xl bg-white border border-[#e2e9ee] hover:bg-slate-50 text-xs font-semibold text-[#526a79] flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Download className="w-4 h-4 text-[#126fba]" />
          Download Compliance Audit PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat, idx) => (
          <div key={idx} className="bg-white border border-[#e2e9ee] rounded-2xl p-5 shadow-sm space-y-3 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#152737]">{cat.title}</h3>
                <span className="text-[11px] text-[#728594]">Statutory Target: {cat.target}%</span>
              </div>
              <strong className="text-xl font-black text-[#152737]">{cat.score}%</strong>
            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  cat.score >= 85 ? 'bg-[#18a873]' : cat.score >= 70 ? 'bg-[#e7a92b]' : 'bg-[#df4d52]'
                }`}
                style={{ width: `${cat.score}%` }}
              />
            </div>

            <p className="text-[#526a79] leading-relaxed pt-1 bg-slate-50 p-2.5 rounded-lg border border-[#e2e9ee]">
              {cat.notes}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
