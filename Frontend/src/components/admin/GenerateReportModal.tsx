import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { reportService } from '../../services/reportService';
import { useToast } from '../../context/ToastContext';
import { ReportItem } from '../../types';

interface GenerateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportGenerated?: (report: ReportItem) => void;
}

export const GenerateReportModal: React.FC<GenerateReportModalProps> = ({
  isOpen,
  onClose,
  onReportGenerated
}) => {
  const { showToast } = useToast();
  const [reportType, setReportType] = useState<ReportItem['type']>('Compliance');
  const [period, setPeriod] = useState('August 2026');
  const [format, setFormat] = useState<'PDF' | 'XLSX'>('PDF');
  const [scope, setScope] = useState('All Registered Mines (Pan-India)');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const title = `${reportType} Governance Audit Dossier - ${period} (${scope})`;
      const rep = reportService.generateReport(title, reportType, period, format);
      setIsProcessing(false);
      showToast(`Report ${rep.id} generated and ready for download`, 'success');
      if (onReportGenerated) onReportGenerated(rep);
      onClose();
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate Governance & Compliance Report" subtitle="Ministry of Coal Analytics Bureau" maxWidth="md">
      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#516777] mb-1">Report Category *</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as ReportItem['type'])}
            className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg text-xs text-[#152737] outline-none focus:border-[#126fba]"
          >
            <option value="Compliance">Comprehensive Compliance Dossier</option>
            <option value="Inspection">DGMS Inspection & Field Performance</option>
            <option value="Violation">Violation Penalties & Resolution Tracking</option>
            <option value="Risk">High-Risk Coalfields Threat Matrix</option>
            <option value="Mine Summary">Regional Production & ESG Overview</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#516777] mb-1">Reporting Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg text-xs text-[#152737] outline-none focus:border-[#126fba]"
            >
              <option value="September 2026">September 2026 (Month to Date)</option>
              <option value="August 2026">August 2026 (Complete Month)</option>
              <option value="July 2026">July 2026</option>
              <option value="Q2 2026 (Apr - Jun)">Q2 2026 (Apr - Jun)</option>
              <option value="FY 2025-26 Annual">FY 2025-26 Annual</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#516777] mb-1">Export Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'PDF' | 'XLSX')}
              className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg text-xs text-[#152737] outline-none focus:border-[#126fba]"
            >
              <option value="PDF">Government Signed PDF (.pdf)</option>
              <option value="XLSX">Analytical Excel Dataset (.xlsx)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#516777] mb-1">Geographic Scope / Region</label>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg text-xs text-[#152737] outline-none focus:border-[#126fba]"
          >
            <option value="All Registered Mines (Pan-India)">All Registered Mines (Pan-India · 412 Mines)</option>
            <option value="Jharkhand & Eastern Region">Eastern Region (Jharkhand, West Bengal)</option>
            <option value="Odisha Region">Odisha Region (MCL & Private)</option>
            <option value="Chhattisgarh Central Region">Central Region (Korba, Bilaspur SECL)</option>
            <option value="Southern Region">Southern Region (Singareni SCCL)</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#e2e9ee]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#516777] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isProcessing}
            className="px-5 py-2 text-xs font-bold text-white bg-[#126fba] hover:bg-[#0f60a1] rounded-lg shadow transition-colors flex items-center gap-2"
          >
            {isProcessing ? 'Compiling Dossier...' : 'Generate & Export'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
