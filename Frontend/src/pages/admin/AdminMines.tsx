import React, { useState, useMemo } from 'react';
import { mineService } from '../../services/mineService';
import { violationService } from '../../services/violationService';
import { inspectionService } from '../../services/inspectionService';
import { reportService } from '../../services/reportService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AddMineModal } from '../../components/admin/AddMineModal';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import { Mine, RiskLevel, ComplianceStatus } from '../../types';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Eye,
  Edit2,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Building2,
  MapPin,
  Calendar,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const AdminMines: React.FC = () => {
  const { showToast } = useToast();
  const [mines, setMines] = useState<Mine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState<'name' | 'complianceScore' | 'id'>('complianceScore');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const [isAddMineOpen, setIsAddMineOpen] = useState(false);
  const [selectedMine, setSelectedMine] = useState<Mine | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editScore, setEditScore] = useState(85);
  const [editRisk, setEditRisk] = useState<RiskLevel>('Medium');
  const [editStatus, setEditStatus] = useState<ComplianceStatus>('Compliant');

  const [mineViolations, setMineViolations] = useState<any[]>([]);
  const [mineInspections, setMineInspections] = useState<any[]>([]);
  const [mineDocuments, setMineDocuments] = useState<any[]>([]);

  const fetchMines = async () => {
    setIsLoading(true);
    try {
      const data = await mineService.getAllMines();
      setMines(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMines();
  }, []);

  const openDetails = async (mine: Mine) => {
    setSelectedMine(mine);
    setIsDetailsOpen(true);
    try {
      const [vios, insps, docs] = await Promise.all([
        violationService.getViolationsByMine(mine.id),
        inspectionService.getInspectionsByMine(mine.id),
        reportService.getAllDocuments(mine.id)
      ]);
      setMineViolations(vios);
      setMineInspections(insps);
      setMineDocuments(docs);
    } catch (e) {
      console.error(e);
    }
  };

  const openEdit = (mine: Mine) => {
    setSelectedMine(mine);
    setEditName(mine.name);
    setEditScore(mine.complianceScore);
    setEditRisk(mine.riskLevel);
    setEditStatus(mine.status);
    setIsEditOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMine) return;
    try {
      const updated = await mineService.updateMine(selectedMine.id, {
        name: editName,
        complianceScore: Number(editScore),
        riskLevel: editRisk,
        status: editStatus
      });
      await fetchMines();
      showToast(`Updated record for ${updated.name}`, 'success');
      setIsEditOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to update mine', 'warn');
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#152737] tracking-tight">
            Mines Registry & Operational Overview
          </h1>
          <p className="text-xs text-[#728594]">
            Statutory tracking of registered coal mines, operators, regional risk and compliance status.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => showToast('Exporting National Coal Mine Registry (.xlsx)', 'info')}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#e2e9ee] hover:bg-slate-50 text-xs font-semibold text-[#526a79] flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#18a873]" />
            Export Excel
          </button>
          <button
            onClick={() => setIsAddMineOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#126fba] hover:bg-[#0f60a1] text-xs font-bold text-white flex items-center gap-1.5 shadow transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Mine
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white border border-[#e2e9ee] rounded-xl shadow-sm">
          <span className="text-[11px] text-[#728594] font-medium uppercase">Total Registered</span>
          <strong className="block text-xl font-black text-[#152737] mt-0.5">{mines.length}</strong>
        </div>
        <div className="p-3.5 bg-white border border-[#e2e9ee] rounded-xl shadow-sm">
          <span className="text-[11px] text-[#728594] font-medium uppercase">Compliant Mines</span>
          <strong className="block text-xl font-black text-[#18a873] mt-0.5">
            {mines.filter((m) => m.status === 'Compliant').length}
          </strong>
        </div>
        <div className="p-3.5 bg-white border border-[#e2e9ee] rounded-xl shadow-sm">
          <span className="text-[11px] text-[#728594] font-medium uppercase">Under Review</span>
          <strong className="block text-xl font-black text-[#e7a92b] mt-0.5">
            {mines.filter((m) => m.status === 'Under Review').length}
          </strong>
        </div>
        <div className="p-3.5 bg-white border border-[#e2e9ee] rounded-xl shadow-sm">
          <span className="text-[11px] text-[#728594] font-medium uppercase">High Risk</span>
          <strong className="block text-xl font-black text-[#df4d52] mt-0.5">
            {mines.filter((m) => m.riskLevel === 'High').length}
          </strong>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-[#e2e9ee] rounded-2xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-[#8195a2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search mine, operator, district or ID..."
              className="w-full h-9 pl-9 pr-3 bg-[#f8fafb] border border-[#e2e9ee] rounded-xl text-xs text-[#152737] outline-none focus:border-[#126fba]"
            />
          </div>

          <div>
            <select
              value={stateFilter}
              onChange={(e) => {
                setStateFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-9 px-3 bg-white border border-[#e2e9ee] rounded-xl text-xs text-[#152737] outline-none focus:border-[#126fba]"
            >
              <option value="All">All States (12)</option>
              <option value="Jharkhand">Jharkhand</option>
              <option value="Odisha">Odisha</option>
              <option value="Chhattisgarh">Chhattisgarh</option>
              <option value="Telangana">Telangana</option>
            </select>
          </div>

          <div>
            <select
              value={riskFilter}
              onChange={(e) => {
                setRiskFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-9 px-3 bg-white border border-[#e2e9ee] rounded-xl text-xs text-[#152737] outline-none focus:border-[#126fba]"
            >
              <option value="All">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full h-9 px-3 bg-white border border-[#e2e9ee] rounded-xl text-xs text-[#152737] outline-none focus:border-[#126fba]"
            >
              <option value="All">All Compliance Status</option>
              <option value="Compliant">Compliant</option>
              <option value="Under Review">Under Review</option>
              <option value="Non-Compliant">Non-Compliant</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] text-[#647988] border-b border-[#e2e9ee]">
                <th
                  onClick={() => {
                    setSortField('id');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-[#126fba]"
                >
                  <div className="flex items-center gap-1">Mine ID <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th
                  onClick={() => {
                    setSortField('name');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-[#126fba]"
                >
                  <div className="flex items-center gap-1">Mine Name <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-3 font-semibold">State & District</th>
                <th className="py-3 px-3 font-semibold">Operator / PSU</th>
                <th
                  onClick={() => {
                    setSortField('complianceScore');
                    setSortAsc(!sortAsc);
                  }}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-[#126fba]"
                >
                  <div className="flex items-center gap-1">Score <ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th className="py-3 px-3 font-semibold">Risk Level</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold">Next Inspection</th>
                <th className="py-3 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e9ee]">
              {paginatedMines.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-xs text-[#728594]">
                    No mines matching the current search & filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedMines.map((m) => (
                  <tr key={m.id} className="hover:bg-[#f9fbfc] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#126fba]">{m.id}</td>
                    <td className="py-3 px-3 font-semibold text-[#152737]">
                      <div>{m.name}</div>
                      <small className="text-[10px] text-[#728594] font-normal">{m.mineType}</small>
                    </td>
                    <td className="py-3 px-3 text-[#526a79]">
                      <div>{m.state}</div>
                      <small className="text-[10px] text-[#728594]">{m.district}</small>
                    </td>
                    <td className="py-3 px-3 text-[#526a79] truncate max-w-[150px]">{m.operator}</td>
                    <td className="py-3 px-3 font-bold text-[#152737]">
                      <div className="flex items-center gap-2">
                        <span>{m.complianceScore}%</span>
                        <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className={`h-full rounded-full ${
                              m.complianceScore >= 80 ? 'bg-[#18a873]' : m.complianceScore >= 65 ? 'bg-[#e7a92b]' : 'bg-[#df4d52]'
                            }`}
                            style={{ width: `${m.complianceScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={m.riskLevel} size="sm" />
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={m.status} size="sm" />
                    </td>
                    <td className="py-3 px-3 text-[#526a79]">{m.nextInspection}</td>
                    <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openDetails(m)}
                        className="px-2 py-1 rounded-md bg-[#edf5fb] hover:bg-[#dcebf7] text-[#126fba] font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> Details
                      </button>
                      <button
                        onClick={() => openEdit(m)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors inline-flex items-center"
                        title="Edit Mine Status"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-[#e2e9ee] text-xs text-[#728594]">
          <div>
            Showing <strong>{(page - 1) * itemsPerPage + 1}</strong> to{' '}
            <strong>{Math.min(page * itemsPerPage, filteredMines.length)}</strong> of{' '}
            <strong>{filteredMines.length}</strong> mines
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="p-1.5 rounded-lg border border-[#e2e9ee] hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-semibold text-[#152737]">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="p-1.5 rounded-lg border border-[#e2e9ee] hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mine Details Full Modal */}
      {selectedMine && (
        <Modal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          title={`Mine Dossier: ${selectedMine.id} - ${selectedMine.name}`}
          subtitle={`${selectedMine.operator} · ${selectedMine.district}, ${selectedMine.state}`}
          maxWidth="2xl"
        >
          <div className="space-y-5">
            {/* Quick stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#edf5fb] rounded-xl border border-[#cde2f2] text-xs">
                <span className="text-[#126fba] block font-semibold text-[11px]">Compliance Score</span>
                <strong className="text-xl text-[#0d4f7b] font-black">{selectedMine.complianceScore}%</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-[#e2e9ee] text-xs">
                <span className="text-[#728594] block font-semibold text-[11px]">Risk Classification</span>
                <div className="mt-0.5"><StatusBadge status={selectedMine.riskLevel} /></div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-[#e2e9ee] text-xs">
                <span className="text-[#728594] block font-semibold text-[11px]">Last Statutory Inspection</span>
                <strong className="text-xs text-[#152737]">{selectedMine.lastInspection}</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-[#e2e9ee] text-xs">
                <span className="text-[#728594] block font-semibold text-[11px]">Next Scheduled Audit</span>
                <strong className="text-xs text-[#152737]">{selectedMine.nextInspection}</strong>
              </div>
            </div>

            {/* Profile Information */}
            <div className="p-4 bg-white border border-[#e2e9ee] rounded-xl space-y-2 text-xs">
              <h4 className="font-bold text-[#152737] uppercase tracking-wider text-[11px]">
                Mine Profile & Contact Officers
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[#728594] block text-[11px]">Official Address</span>
                  <span className="text-[#152737] font-medium">{selectedMine.address}</span>
                </div>
                <div>
                  <span className="text-[#728594] block text-[11px]">Contact Officer</span>
                  <span className="text-[#152737] font-medium">{selectedMine.contactOfficer}</span>
                </div>
                <div>
                  <span className="text-[#728594] block text-[11px]">Designated Email</span>
                  <span className="text-[#126fba] font-medium">{selectedMine.contactEmail}</span>
                </div>
                <div>
                  <span className="text-[#728594] block text-[11px]">Mining Category</span>
                  <span className="text-[#152737] font-medium">{selectedMine.mineType}</span>
                </div>
              </div>
            </div>

            {/* Active Violations and Inspections Tabs */}
            <div className="space-y-3">
              <h4 className="font-bold text-[#152737] uppercase tracking-wider text-[11px]">
                Active Violations & Corrective Actions ({mineViolations.length})
              </h4>
              {mineViolations.length === 0 ? (
                <p className="text-xs text-[#728594] bg-slate-50 p-3 rounded-lg border border-[#e2e9ee]">
                  No active violations currently issued against this mine.
                </p>
              ) : (
                <div className="space-y-2">
                  {mineViolations.map((v) => (
                    <div key={v.id} className="p-3 bg-white border border-[#e2e9ee] rounded-xl flex items-start justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#126fba]">{v.id}</span>
                          <strong className="text-[#152737]">{v.category}</strong>
                          <StatusBadge status={v.severity} size="sm" />
                        </div>
                        <p className="text-[#526a79] mt-1">{v.description}</p>
                        <span className="text-[11px] text-[#728594] mt-0.5 block">Deadline: {v.deadline} · Inspector: {v.assignedInspector}</span>
                      </div>
                      <StatusBadge status={v.status} size="sm" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Uploaded Documents */}
            <div className="space-y-2">
              <h4 className="font-bold text-[#152737] uppercase tracking-wider text-[11px]">
                Statutory Verified Documents ({mineDocuments.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {mineDocuments.slice(0, 4).map((d) => (
                  <div key={d.id} className="p-2.5 bg-slate-50 rounded-lg border border-[#e2e9ee] text-xs flex items-center justify-between">
                    <span className="font-semibold text-[#152737] truncate max-w-[200px]">{d.fileName}</span>
                    <StatusBadge status={d.status} size="sm" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#e2e9ee]">
              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
                className="px-5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-[#526a79] transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Mine Modal */}
      {selectedMine && (
        <Modal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          title={`Edit Status & Parameters: ${selectedMine.id}`}
          subtitle={selectedMine.name}
          maxWidth="md"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#516777] mb-1">Mine Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none focus:border-[#126fba]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#516777] mb-1">Compliance Score (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={editScore}
                  onChange={(e) => setEditScore(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none focus:border-[#126fba]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#516777] mb-1">Risk Level</label>
                <select
                  value={editRisk}
                  onChange={(e) => setEditRisk(e.target.value as RiskLevel)}
                  className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none focus:border-[#126fba]"
                >
                  <option value="Low">Low Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="High">High Risk</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#516777] mb-1">Compliance Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as ComplianceStatus)}
                className="w-full px-3 py-2 bg-white border border-[#e2e9ee] rounded-lg outline-none focus:border-[#126fba]"
              >
                <option value="Compliant">Compliant</option>
                <option value="Under Review">Under Review</option>
                <option value="Non-Compliant">Non-Compliant</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#e2e9ee]">
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="px-4 py-2 font-semibold text-[#516777] bg-slate-100 rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-bold text-white bg-[#126fba] hover:bg-[#0f60a1] rounded-lg shadow"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Mine Modal */}
      <AddMineModal
        isOpen={isAddMineOpen}
        onClose={() => setIsAddMineOpen(false)}
        onMineAdded={(newMine) => setMines(mineService.getAllMines())}
      />
    </div>
  );
};
