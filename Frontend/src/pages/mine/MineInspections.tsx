import React, { useState } from 'react';
import { inspectionService } from '../../services/inspectionService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { InspectionExecutionModal } from '../../components/inspector/InspectionExecutionModal';
import { useToast } from '../../context/ToastContext';
import { Inspection } from '../../types';
import { Calendar, CheckCircle2, Clock, Eye, FileText } from 'lucide-react';

export const MineInspections: React.FC = () => {
  const currentMineId = 'KD-101';
  const [inspections] = useState(inspectionService.getInspectionsByMine(currentMineId));
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openInspection = (ins: Inspection) => {
    setSelectedInspection(ins);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#152737] tracking-tight">
          Field Inspection History & Inspector Observations
        </h1>
        <p className="text-xs text-[#728594]">
          Past and upcoming audits conducted by DGMS safety and environmental inspectors.
        </p>
      </div>

      <div className="bg-white border border-[#e2e9ee] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] text-[#647988] border-b border-[#e2e9ee]">
                <th className="py-3 px-3 font-semibold">Audit ID</th>
                <th className="py-3 px-3 font-semibold">Category</th>
                <th className="py-3 px-3 font-semibold">Inspector</th>
                <th className="py-3 px-3 font-semibold">Scheduled Date</th>
                <th className="py-3 px-3 font-semibold">Audit Mandate</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e9ee]">
              {inspections.map((ins) => (
                <tr key={ins.id} className="hover:bg-[#f9fbfc] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-[#126fba]">{ins.id}</td>
                  <td className="py-3 px-3 font-semibold text-[#152737]">{ins.inspectionType}</td>
                  <td className="py-3 px-3 text-[#526a79]">{ins.inspectorName}</td>
                  <td className="py-3 px-3 text-[#526a79]">{ins.date}</td>
                  <td className="py-3 px-3 text-[#526a79] truncate max-w-xs">{ins.purpose}</td>
                  <td className="py-3 px-3"><StatusBadge status={ins.status} size="sm" /></td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => openInspection(ins)}
                      className="px-3 py-1 rounded-lg bg-[#edf5fb] hover:bg-[#dcebf7] text-[#126fba] font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" /> View Checklist
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <InspectionExecutionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        inspection={selectedInspection}
      />
    </div>
  );
};
