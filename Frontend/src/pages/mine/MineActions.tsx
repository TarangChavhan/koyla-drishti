import React, { useState } from 'react';
import { violationService } from '../../services/violationService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SubmitEvidenceModal } from '../../components/mine/SubmitEvidenceModal';
import { useToast } from '../../context/ToastContext';
import { CorrectiveAction } from '../../types';
import { FileCheck, UploadCloud, CheckCircle2, Clock, Eye } from 'lucide-react';

export const MineActions: React.FC = () => {
  const { showToast } = useToast();
  const currentMineId = 'KD-101';
  const [actions, setActions] = useState(violationService.getActionsByMine(currentMineId));
  const [selectedAction, setSelectedAction] = useState<CorrectiveAction | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  const openSubmit = (act: CorrectiveAction) => {
    setSelectedAction(act);
    setIsSubmitOpen(true);
  };

  const refreshData = () => {
    setActions(violationService.getActionsByMine(currentMineId));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#152737] tracking-tight">
          Corrective Action Response & Evidence Tracker
        </h1>
        <p className="text-xs text-[#728594]">
          Submit verified photographic proofs, laboratory air monitor certificates, and engineer remediation notes.
        </p>
      </div>

      <div className="bg-white border border-[#e2e9ee] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="space-y-4">
          {actions.map((act) => (
            <div
              key={act.id}
              className="p-4 rounded-xl border border-[#e2e9ee] bg-[#fbfdfd] hover:border-[#126fba]/40 transition-all space-y-3 text-xs"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#126fba]">{act.id}</span>
                  <span className="text-[#728594]">Case Ref: {act.violationId}</span>
                  <StatusBadge status={act.status} size="sm" />
                </div>
                <span className="text-[11px] font-bold text-[#df4d52]">Due Date: {act.dueDate}</span>
              </div>

              <h3 className="text-sm font-bold text-[#152737]">{act.title}</h3>
              <p className="text-[#526a79] leading-relaxed">{act.instructions}</p>

              {act.responseNotes && (
                <div className="p-3 bg-[#f0faf5] rounded-xl border border-[#bfe8d2] text-[#14704f] space-y-1">
                  <strong className="block text-[11px]">Submitted Response to DGMS:</strong>
                  <p>{act.responseNotes}</p>
                  {act.evidenceFiles && act.evidenceFiles.length > 0 && (
                    <span className="text-[10px] text-[#0f543b] font-semibold block mt-1">
                      Evidence: {act.evidenceFiles.join(', ')}
                    </span>
                  )}
                </div>
              )}

              {act.inspectorRemarks && (
                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-[#152737] space-y-0.5">
                  <strong className="block text-[11px] text-[#526a79]">Inspector Adjudication Remarks:</strong>
                  <p>{act.inspectorRemarks}</p>
                </div>
              )}

              <div className="flex justify-end pt-2 border-t border-[#e2e9ee]">
                <button
                  onClick={() => openSubmit(act)}
                  className="px-4 py-2 rounded-lg bg-[#159e89] hover:bg-[#128674] text-white font-bold text-xs shadow flex items-center gap-1.5 transition-colors"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  {act.status === 'Submitted' ? 'Update Evidence Dossier' : 'Submit Evidence for Adjudication'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SubmitEvidenceModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        action={selectedAction}
        onSubmitted={refreshData}
      />
    </div>
  );
};
