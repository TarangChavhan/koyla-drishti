import React, { useState } from 'react';
import { violationService } from '../../services/violationService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { SubmitEvidenceModal } from '../../components/mine/SubmitEvidenceModal';
import { useToast } from '../../context/ToastContext';
import { Violation, CorrectiveAction } from '../../types';
import { ShieldAlert, AlertTriangle, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

export const MineViolations: React.FC = () => {
  const { showToast } = useToast();
  const currentMineId = 'KD-101';
  const [violations, setViolations] = useState(violationService.getViolationsByMine(currentMineId));
  const [actions, setActions] = useState(violationService.getActionsByMine(currentMineId));

  const [selectedAction, setSelectedAction] = useState<CorrectiveAction | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  const openEvidenceModal = (violationId: string) => {
    const act = actions.find((a) => a.violationId === violationId) || actions[0];
    setSelectedAction(act);
    setIsSubmitOpen(true);
  };

  const refreshData = () => {
    setViolations(violationService.getViolationsByMine(currentMineId));
    setActions(violationService.getActionsByMine(currentMineId));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#152737] tracking-tight">
          Statutory Violation Notices & Mandatory Remediation
        </h1>
        <p className="text-xs text-[#728594]">
          Cases officially served by DGMS inspection authorities requiring technological rectification and evidence submission.
        </p>
      </div>

      <div className="bg-white border border-[#e2e9ee] rounded-2xl p-5 shadow-sm space-y-4">
        {violations.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#728594]">
            No outstanding statutory violations registered against this mine.
          </div>
        ) : (
          <div className="space-y-4">
            {violations.map((v) => (
              <div
                key={v.id}
                className="p-4 rounded-xl border border-[#e2e9ee] bg-[#fdfefe] hover:border-[#126fba]/40 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#126fba]">{v.id}</span>
                    <strong className="text-[#152737]">{v.category}</strong>
                    <StatusBadge status={v.severity} size="sm" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[#df4d52] font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Deadline: {v.deadline}
                    </span>
                    <StatusBadge status={v.status} size="sm" />
                  </div>
                </div>

                <p className="text-xs text-[#526a79] leading-relaxed">{v.description}</p>

                {v.correctiveActionText && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-[#124d77] space-y-0.5">
                    <strong className="block text-[#0e3c5e]">Inspector Statutory Directive:</strong>
                    <p>{v.correctiveActionText}</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-[#e2e9ee] text-[11px] text-[#728594]">
                  <span>Serving Officer: <strong>{v.assignedInspector}</strong> · Issued: {v.issuedDate}</span>
                  <button
                    onClick={() => openEvidenceModal(v.id)}
                    className="px-4 py-1.5 rounded-lg bg-[#159e89] hover:bg-[#128674] text-white font-bold text-xs shadow flex items-center gap-1.5 transition-colors"
                  >
                    Submit Corrective Evidence Dossier <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
