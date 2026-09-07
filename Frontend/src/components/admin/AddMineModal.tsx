import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { mineService } from '../../services/mineService';
import { useToast } from '../../context/ToastContext';
import { Mine, RiskLevel, ComplianceStatus } from '../../types';

interface AddMineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMineAdded: (mine: Mine) => void;
}

export const AddMineModal: React.FC<AddMineModalProps> = ({ isOpen, onClose, onMineAdded }) => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [operator, setOperator] = useState('Bharat Coking Coal Limited (BCCL)');
  const [mineType, setMineType] = useState('Opencast & Underground Mixed');
  const [state, setState] = useState('Jharkhand');
  const [district, setDistrict] = useState('Dhanbad');
  const [address, setAddress] = useState('');
  const [contactOfficer, setContactOfficer] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [complianceScore, setComplianceScore] = useState(85);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('Low');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const newMine = await mineService.createMine({
        name,
        operator,
        mineType,
        state,
        district,
        address: address || `${district}, ${state}`,
        contactOfficer: contactOfficer || 'Authorized Safety In-charge',
        contactEmail: contactEmail || 'compliance@mine.gov.in',
        complianceScore: Number(complianceScore),
        riskLevel,
        status: (complianceScore >= 75 ? 'Compliant' : complianceScore >= 60 ? 'Under Review' : 'Non-Compliant') as ComplianceStatus,
        lastInspection: 'Just registered',
        nextInspection: 'Scheduled Q4 2026'
      });

      showToast(`Mine ${newMine.name} successfully registered with ID ${newMine.id}`, 'success');
      onMineAdded(newMine);
      onClose();

      // Reset fields
      setName('');
      setAddress('');
      setContactOfficer('');
      setContactEmail('');
    } catch (err: any) {
      showToast(err.message || 'Failed to register new mine', 'warn');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register New Coal Mine" subtitle="Ministry of Coal Statutory Registry" maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#516777] mb-1">Mine Official Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Moonidih Underground Project"
              className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg text-xs text-[#152737] outline-none focus:border-[#126fba]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#516777] mb-1">Operator / PSU *</label>
            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg text-xs text-[#152737] outline-none focus:border-[#126fba]"
            >
              <option value="Bharat Coking Coal Limited (BCCL)">Bharat Coking Coal Limited (BCCL)</option>
              <option value="Central Coalfields Limited (CCL)">Central Coalfields Limited (CCL)</option>
              <option value="Eastern Coalfields Limited (ECL)">Eastern Coalfields Limited (ECL)</option>
              <option value="Mahanadi Coalfields Limited (MCL)">Mahanadi Coalfields Limited (MCL)</option>
              <option value="South Eastern Coalfields Limited (SECL)">South Eastern Coalfields Limited (SECL)</option>
              <option value="Western Coalfields Limited (WCL)">Western Coalfields Limited (WCL)</option>
              <option value="Singareni Collieries Company Limited (SCCL)">Singareni Collieries (SCCL)</option>
              <option value="Private Captive Operator">Private Captive Operator</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#516777] mb-1">State *</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg text-xs text-[#152737] outline-none focus:border-[#126fba]"
            >
              <option value="Jharkhand">Jharkhand</option>
              <option value="Odisha">Odisha</option>
              <option value="Chhattisgarh">Chhattisgarh</option>
              <option value="Telangana">Telangana</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Maharashtra">Maharashtra</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#516777] mb-1">District *</label>
            <input
              type="text"
              required
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="e.g. Dhanbad"
              className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg text-xs text-[#152737] outline-none focus:border-[#126fba]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#516777] mb-1">Mining Category</label>
            <select
              value={mineType}
              onChange={(e) => setMineType(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg text-xs text-[#152737] outline-none focus:border-[#126fba]"
            >
              <option value="Opencast & Underground Mixed">Opencast & Underground Mixed</option>
              <option value="Opencast High Capacity">Opencast High Capacity</option>
              <option value="Prime Coking Coal UG">Prime Coking Coal UG</option>
              <option value="Thermal Coal Washery">Thermal Coal Washery</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#516777] mb-1">Initial Baseline Risk Level</label>
            <select
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
              className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg text-xs text-[#152737] outline-none focus:border-[#126fba]"
            >
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#516777] mb-1">Mine Postal Address & Lease Boundary Coordinates</label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter official geographical address or demarcated GPS coordinates..."
              className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg text-xs text-[#152737] outline-none focus:border-[#126fba]"
            />
          </div>
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
            Complete Registration
          </button>
        </div>
      </form>
    </Modal>
  );
};
