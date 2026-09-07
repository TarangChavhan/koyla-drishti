import React, { useState } from 'react';
import { reportService } from '../../services/reportService';
import { GenerateReportModal } from '../../components/admin/GenerateReportModal';
import { useToast } from '../../context/ToastContext';
import { ReportItem } from '../../types';
import {
  FileText,
  Download,
  Plus,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Share2,
  HardDrive
} from 'lucide-react';

export const AdminReports: React.FC = () => {
  const { showToast } = useToast();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);

  const loadReports = async () => {
    try {
      const data = await reportService.getAllReports();
      setReports(data || []);
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadReports();
  }, []);

  const filteredReports = reports.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All' || r.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleDownload = (r: ReportItem) => {
    showToast(`Downloading ${r.title} (${r.format})`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#152737] tracking-tight">
            Government Compliance & Audit Dossier Repository
          </h1>
          <p className="text-xs text-[#728594]">
            Generate, archive, and download officially sanctioned coal governance, risk, and inspection reports.
          </p>
        </div>
        <button
          onClick={() => setIsGenerateOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#126fba] hover:bg-[#0f60a1] text-xs font-bold text-white flex items-center gap-1.5 shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          Generate New Report
        </button>
      </div>

      {/* Reports Filter & List */}
      <div className="bg-white border border-[#e2e9ee] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8195a2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reports by title or ID..."
              className="w-full h-9 pl-9 pr-3 bg-[#f8fafb] border border-[#e2e9ee] rounded-xl text-xs text-[#152737] outline-none focus:border-[#126fba]"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-[#e2e9ee] rounded-xl text-xs text-[#152737] outline-none focus:border-[#126fba]"
            >
              <option value="All">All Report Classifications</option>
              <option value="Compliance">Compliance Dossier</option>
              <option value="Inspection">Inspection Summary</option>
              <option value="Violation">Violation Trackers</option>
              <option value="Risk">Risk Intelligence Matrix</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
          {filteredReports.map((rep) => (
            <div
              key={rep.id}
              className="p-4 rounded-xl border border-[#e2e9ee] bg-white hover:border-[#126fba]/40 transition-all shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#edf5fb] text-[#126fba] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono font-bold text-[11px] text-[#126fba]">{rep.id}</span>
                    <h3 className="text-xs font-bold text-[#152737] leading-snug">{rep.title}</h3>
                    <span className="text-[10px] text-[#728594]">{rep.period} · {rep.generatedDate}</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-[#526a79]">
                  {rep.format}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#e2e9ee] text-[11px] text-[#728594]">
                <span>Generated by: <strong>{rep.generatedBy}</strong></span>
                <button
                  onClick={() => handleDownload(rep)}
                  className="px-3 py-1 rounded-lg bg-[#edf5fb] hover:bg-[#dcebf7] text-[#126fba] font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
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
