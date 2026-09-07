import React, { useState } from 'react';
import { reportService } from '../../services/reportService';
import { GenerateReportModal } from '../../components/admin/GenerateReportModal';
import { useToast } from '../../context/ToastContext';
import { FileText, Download, Plus, Search } from 'lucide-react';

export const InspectorReports: React.FC = () => {
  const { showToast } = useToast();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);

  const loadReports = async () => {
    try {
      const data = await reportService.getAllReports();
      setReports(data || []);
    } catch (err) {
      console.error('Failed to load inspector reports', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#152737] tracking-tight">
            DGMS Statutory Field Audit & Inspection Reports
          </h1>
          <p className="text-xs text-[#728594]">
            Compiled safety audits, environmental assessments, and compliance verification certificates.
          </p>
        </div>
        <button
          onClick={() => setIsGenerateOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#159e89] hover:bg-[#128674] text-xs font-bold text-white flex items-center gap-1.5 shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          Compile New Field Report
        </button>
      </div>

      <div className="bg-white border border-[#e2e9ee] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="p-4 rounded-xl border border-[#e2e9ee] bg-white hover:border-[#159e89]/40 transition-all shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#ebf8f5] text-[#159e89] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono font-bold text-[11px] text-[#159e89]">{rep.id}</span>
                    <h3 className="text-xs font-bold text-[#152737] leading-snug">{rep.title}</h3>
                    <span className="text-[10px] text-[#728594]">{rep.period} · {rep.generatedDate}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-[#526a79]">
                  {rep.format}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#e2e9ee] text-[11px] text-[#728594]">
                <span>Officer: <strong>{rep.generatedBy}</strong></span>
                <button
                  onClick={() => showToast(`Downloading ${rep.title}`, 'success')}
                  className="px-3 py-1 rounded-lg bg-[#ebf8f5] hover:bg-[#d8f2ec] text-[#159e89] font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <GenerateReportModal
        isOpen={isGenerateOpen}
        onClose={() => setIsGenerateOpen(false)}
        onReportGenerated={loadReports}
      />
    </div>
  );
};
