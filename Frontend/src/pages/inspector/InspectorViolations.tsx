import React, { useState } from 'react';
import { violationService } from '../../services/violationService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { Violation, CorrectiveAction } from '../../types';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  FileCheck,
  Building2,
  FileText
} from 'lucide-react';

export const InspectorViolations: React.FC = () => {
  const { showToast } = useToast();
  const [violations, setViolations] = useState<Violation[]>([]);
  const [correctiveActions, setCorrectiveActions] = useState<CorrectiveAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'violations' | 'actions'>('violations');

  // Adjudication Modal state
  const [selectedAction, setSelectedAction] = useState<CorrectiveAction | null>(null);
  const [isAdjudicateOpen, setIsAdjudicateOpen] = useState(false);
  const [officerDecisionNote, setOfficerDecisionNote] = useState('');

  const loadData = async () => {
    try {
      const [vList, aList] = await Promise.all([
        violationService.getAllViolations(),
        violationService.getAllCorrectiveActions()
      ]);
      setViolations(vList || []);
      setCorrectiveActions(aList || []);
    } catch (err) {
      console.error('Failed to load violations/actions', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const filteredViolations = violations.filter(
    (v) =>
      v.mineName.toLowerCase().includes(search.toLowerCase()) ||
      v.id.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredActions = correctiveActions.filter(
    (a) =>
      a.mineName.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.title.toLowerCase().includes(search.toLowerCase())
  );

  const openAdjudicate = (action: CorrectiveAction) => {
    setSelectedAction(action);
    setOfficerDecisionNote('');
    setIsAdjudicateOpen(true);
  };

  const handleApproveAction = async () => {
    if (!selectedAction) return;
    try {
      await violationService.inspectorReviewAction(
        selectedAction.id,
        'Approved',
        officerDecisionNote || 'Statutory rectification verified through attached laboratory calibration & site photographic evidence.'
      );
      showToast(`Corrective Action ${selectedAction.id} Approved & Case Closed`, 'success');
      await loadData();
      setIsAdjudicateOpen(false);
    } catch (err) {
      showToast('Failed to approve corrective action', 'warn');
    }
  };

  const handleRejectAction = async () => {
    if (!selectedAction) return;
    try {
      await violationService.inspectorReviewAction(
        selectedAction.id,
        'Rejected',
        officerDecisionNote || 'Evidence insufficient. Further technical modification required.'
      );
      showToast(`Corrective Action ${selectedAction.id} Rejected. Mine must resubmit.`, 'warn');
      await loadData();
      setIsAdjudicateOpen(false);
    } catch (err) {
      showToast('Failed to reject corrective action', 'warn');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#152737] tracking-tight">
            Statutory Violations & Mine Remediation Adjudication
          </h1>
          <p className="text-xs text-[#728594]">
            Review issued violation cases, evaluate mine technical response submissions, and approve or reject remediation.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#e2e9ee] rounded-2xl p-5 shadow-sm space-y-4">
        {/* Tab Toggle */}
        <div className="flex items-center justify-between border-b border-[#e2e9ee] pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('violations')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'violations' ? 'bg-[#126fba] text-white' : 'text-[#728594] hover:bg-slate-100'
              }`}
            >
              Statutory Violations Registry ({violations.length})
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'actions' ? 'bg-[#126fba] text-white' : 'text-[#728594] hover:bg-slate-100'
              }`}
            >
              Corrective Action Evidence Submitted ({correctiveActions.length})
            </button>
          </div>

          <div className="relative max-w-xs">
            <Search className="w-4 h-4 text-[#8195a2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search mine, case ID..."
              className="w-full h-8 pl-8 pr-3 bg-[#f8fafb] border border-[#e2e9ee] rounded-lg text-xs text-[#152737] outline-none"
            />
          </div>
        </div>

        {activeTab === 'violations' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] text-[#647988] border-b border-[#e2e9ee]">
                  <th className="py-3 px-3 font-semibold">Violation ID</th>
                  <th className="py-3 px-3 font-semibold">Target Mine</th>
                  <th className="py-3 px-3 font-semibold">Category</th>
                  <th className="py-3 px-3 font-semibold">Severity</th>
                  <th className="py-3 px-3 font-semibold">Issued Date</th>
                  <th className="py-3 px-3 font-semibold">Statutory Deadline</th>
                  <th className="py-3 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e9ee]">
                {filteredViolations.map((v) => (
                  <tr key={v.id} className="hover:bg-[#f9fbfc] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#126fba]">{v.id}</td>
                    <td className="py-3 px-3 font-semibold text-[#152737]">{v.mineName}</td>
                    <td className="py-3 px-3 text-[#526a79]">{v.category}</td>
                    <td className="py-3 px-3"><StatusBadge status={v.severity} size="sm" /></td>
                    <td className="py-3 px-3 text-[#526a79]">{v.issuedDate}</td>
                    <td className="py-3 px-3 font-semibold text-[#df4d52]">{v.deadline}</td>
                    <td className="py-3 px-3"><StatusBadge status={v.status} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActions.map((act) => (
              <div
                key={act.id}
                className="p-4 rounded-xl border border-[#e2e9ee] bg-white hover:border-[#126fba]/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#126fba]">{act.id}</span>
                    <span className="text-[#728594]">Ref: {act.violationId}</span>
                    <StatusBadge status={act.status} size="sm" />
                  </div>
                  <h4 className="font-bold text-[#152737] text-sm">{act.title}</h4>
                  <p className="text-[#526a79] leading-relaxed">{act.instructions}</p>

                  {act.responseNotes && (
                    <div className="mt-2 p-2.5 bg-[#f0faf5] rounded-lg border border-[#bfe8d2] text-[#14704f]">
                      <strong className="block text-[11px]">Mine Authority Technical Response:</strong>
                      <p className="mt-0.5">{act.responseNotes}</p>
                      {act.evidenceFiles && act.evidenceFiles.length > 0 && (
                        <span className="text-[10px] text-[#0f543b] mt-1 block">
                          Attached Evidence: {act.evidenceFiles.join(', ')}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="shrink-0 w-full md:w-auto flex justify-end">
                  <button
                    onClick={() => openAdjudicate(act)}
                    className="px-4 py-2 rounded-lg bg-[#159e89] hover:bg-[#128674] text-white font-bold text-xs shadow flex items-center gap-1.5 transition-colors"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    Review Evidence & Adjudicate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Adjudicate Modal */}
      {selectedAction && (
        <Modal
          isOpen={isAdjudicateOpen}
          onClose={() => setIsAdjudicateOpen(false)}
          title={`Adjudicate Mine Remediation: ${selectedAction.id}`}
          subtitle={`${selectedAction.mineName} · Ref Case ${selectedAction.violationId}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 border border-[#e2e9ee] rounded-xl space-y-1">
              <strong className="block text-[#152737]">{selectedAction.title}</strong>
              <p className="text-[#526a79]">{selectedAction.instructions}</p>
            </div>

            {selectedAction.responseNotes ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-emerald-900">
                <span className="font-bold block text-[11px]">Submitted Mine Evidence Note:</span>
                <p>{selectedAction.responseNotes}</p>
                {selectedAction.evidenceFiles && (
                  <span className="text-[10px] font-semibold text-emerald-700 block mt-1">
                    Uploaded File: {selectedAction.evidenceFiles.join(', ')}
                  </span>
                )}
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800">
                Mine operator has not yet uploaded conclusive evidence.
              </div>
            )}

            <div>
              <label className="block font-bold text-[#516777] mb-1">
                Inspector Adjudication Remarks & Verification Order *
              </label>
              <textarea
                rows={3}
                value={officerDecisionNote}
                onChange={(e) => setOfficerDecisionNote(e.target.value)}
                placeholder="State statutory approval or reasons for rejecting remediation..."
                className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none focus:border-[#126fba]"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#e2e9ee]">
              <button
                type="button"
                onClick={handleRejectAction}
                className="px-4 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-[#df4d52] font-bold border border-rose-200 flex items-center gap-1.5 transition-colors"
              >
                <XCircle className="w-4 h-4" /> Reject Evidence
              </button>
              <button
                type="button"
                onClick={handleApproveAction}
                className="px-4 py-2 rounded-lg bg-[#159e89] hover:bg-[#128674] text-white font-bold shadow flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve & Close Case
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
