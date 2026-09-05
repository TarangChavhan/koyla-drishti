import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { inspectionService } from '../../services/inspectionService';
import { alertService } from '../../services/alertService';
import { useToast } from '../../context/ToastContext';
import { Mine, InspectionType } from '../../types';

interface AssignInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mines: Mine[];
  alertId?: string;
  onAssigned?: () => void;
}

export const AssignInspectorModal: React.FC<AssignInspectorModalProps> = ({
  isOpen,
  onClose,
  mines,
  alertId,
  onAssigned
}) => {
  const { showToast } = useToast();
  const [selectedMineId, setSelectedMineId] = useState(mines[0]?.id || 'KD-104');
  const [inspectorName, setInspectorName] = useState('Rajesh Sharma, DGMS');
  const [inspectionType, setInspectionType] = useState<InspectionType>('Safety');
  const [scheduledDate, setScheduledDate] = useState('2026-09-12');
  const [priority, setPriority] = useState<'Routine' | 'Priority' | 'Urgent'>('Priority');
  const [purpose, setPurpose] = useState('Statutory field verification and compliance audit.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mine = mines.find((m) => m.id === selectedMineId) || mines[0];

    // Create scheduled inspection
    const newInsp = inspectionService.createInspection({
      mineId: mine.id,
      mineName: mine.name,
      inspectorName,
      inspectorId: inspectorName.includes('Rajesh') ? 'USR-002' : 'USR-004',
      inspectionType,
      date: scheduledDate,
      time: '10:30 AM',
      status: 'Scheduled',
      priority,
      purpose,
      checklistItems: [
        { id: 'chk-1', label: 'Verify primary haul road slope and berm standard', completed: false },
        { id: 'chk-2', label: 'Check worker personal protective equipment registry', completed: false },
        { id: 'chk-3', label: 'Examine DGMS statutory observation compliance log', completed: false },
        { id: 'chk-4', label: 'Inspect continuous ambient dust monitors & water sprinklers', completed: false }
      ]
    });

    if (alertId) {
      alertService.assignInspector(alertId, inspectorName);
    }

    showToast(`Inspection ${newInsp.id} assigned to ${inspectorName} for ${mine.name}`, 'success');
    if (onAssigned) onAssigned();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Inspector & Schedule Inspection" subtitle="Directorate General of Mines Safety" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#516777] mb-1">Target Coal Mine *</label>
          <select
            value={selectedMineId}
            onChange={(e) => setSelectedMineId(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg text-xs text-[#152737] outline-none focus:border-[#126fba]"
          >
            {mines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.id} - {m.name} ({m.state})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#516777] mb-1">Government Inspector / Expert *</label>
          <select
            value={inspectorName}
            onChange={(e) => setInspectorName(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg text-xs text-[#152737] outline-none focus:border-[#126fba]"
          >
            <option value="Rajesh Sharma, DGMS">Rajesh Sharma, DGMS (Mine Safety Specialist)</option>
            <option value="Sunil Verma">Sunil Verma (Environmental Audit Specialist)</option>
            <option value="Anil Kumar">Anil Kumar (HEMM & Mechanical Specialist)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#516777] mb-1">Inspection Type</label>
            <select
              value={inspectionType}
              onChange={(e) => setInspectionType(e.target.value as InspectionType)}
              className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg text-xs text-[#152737] outline-none focus:border-[#126fba]"
            >
              <option value="Safety">Safety Audit</option>
              <option value="Environment">Environmental Review</option>
              <option value="Full Audit">Comprehensive Full Audit</option>
              <option value="Follow-up">Follow-up Verification</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#516777] mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg text-xs text-[#152737] outline-none focus:border-[#126fba]"
            >
              <option value="Routine">Routine</option>
              <option value="Priority">Priority</option>
              <option value="Urgent">Urgent / Emergency</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#516777] mb-1">Scheduled Inspection Date</label>
          <input
            type="date"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg text-xs text-[#152737] outline-none focus:border-[#126fba]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#516777] mb-1">Inspection Mandate & Directives</label>
          <textarea
            rows={3}
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg text-xs text-[#152737] outline-none focus:border-[#126fba]"
          />
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
            className="px-5 py-2 text-xs font-bold text-white bg-[#126fba] hover:bg-[#0f60a1] rounded-lg shadow transition-colors"
          >
            Issue Official Assignment
          </button>
        </div>
      </form>
    </Modal>
  );
};
