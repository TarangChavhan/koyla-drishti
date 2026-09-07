import React, { useState, useMemo } from 'react';
import { inspectionService } from '../../services/inspectionService';
import { mineService } from '../../services/mineService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { AssignInspectorModal } from '../../components/admin/AssignInspectorModal';
import { InspectionExecutionModal } from '../../components/inspector/InspectionExecutionModal';
import { useToast } from '../../context/ToastContext';
import { Inspection } from '../../types';
import {
  Calendar,
  Search,
  Filter,
  Plus,
  FileCheck2,
  Clock,
  UserCheck,
  Building2,
  CheckCircle2
} from 'lucide-react';

export const AdminInspections: React.FC = () => {
  const { showToast } = useToast();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [mines, setMines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [isExecOpen, setIsExecOpen] = useState(false);

  const loadData = async () => {
    try {
      const [fetchedInspections, fetchedMines] = await Promise.all([
        inspectionService.getAllInspections(),
        mineService.getAllMines()
      ]);
      setInspections(fetchedInspections || []);
      setMines(fetchedMines || []);
    } catch (err) {
      console.error('Failed to load inspections', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const filteredInspections = useMemo(() => {
    return inspections.filter((ins) => {
      const matchSearch =
        ins.mineName.toLowerCase().includes(search.toLowerCase()) ||
        ins.inspectorName.toLowerCase().includes(search.toLowerCase()) ||
        ins.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || ins.status === statusFilter;
      const matchType = typeFilter === 'All' || ins.inspectionType === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [inspections, search, statusFilter, typeFilter]);

  const openInspection = (ins: Inspection) => {
    setSelectedInspection(ins);
    setIsExecOpen(true);
  };

  const refreshData = () => {
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#152737] tracking-tight">
            Statutory Field Inspections Schedule & Execution
          </h1>
          <p className="text-xs text-[#728594]">
            DGMS field verification mandates, checklist audits, photo evidence, and safety certificates.
          </p>
        </div>
        <button
          onClick={() => setIsAssignOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#126fba] hover:bg-[#0f60a1] text-xs font-bold text-white flex items-center gap-1.5 shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          Schedule Inspection
        </button>
      </div>

      {/* KPI counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white border border-[#e2e9ee] rounded-xl shadow-sm">
          <span className="text-[11px] text-[#728594] font-medium uppercase">Total Audits</span>
          <strong className="block text-xl font-black text-[#152737] mt-0.5">{inspections.length}</strong>
        </div>
        <div className="p-3.5 bg-white border border-[#e2e9ee] rounded-xl shadow-sm">
          <span className="text-[11px] text-[#728594] font-medium uppercase">Scheduled</span>
          <strong className="block text-xl font-black text-[#126fba] mt-0.5">
            {inspections.filter((i) => i.status === 'Scheduled').length}
          </strong>
        </div>
        <div className="p-3.5 bg-white border border-[#e2e9ee] rounded-xl shadow-sm">
          <span className="text-[11px] text-[#728594] font-medium uppercase">In Progress</span>
          <strong className="block text-xl font-black text-[#e7a92b] mt-0.5">
            {inspections.filter((i) => i.status === 'In Progress').length}
          </strong>
        </div>
        <div className="p-3.5 bg-white border border-[#e2e9ee] rounded-xl shadow-sm">
          <span className="text-[11px] text-[#728594] font-medium uppercase">Completed & Filed</span>
          <strong className="block text-xl font-black text-[#18a873] mt-0.5">
            {inspections.filter((i) => i.status === 'Completed').length}
          </strong>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#e2e9ee] rounded-2xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8195a2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inspection, mine or inspector..."
              className="w-full h-9 pl-9 pr-3 bg-[#f8fafb] border border-[#e2e9ee] rounded-xl text-xs text-[#152737] outline-none focus:border-[#126fba]"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-[#e2e9ee] rounded-xl text-xs text-[#152737] outline-none focus:border-[#126fba]"
            >
              <option value="All">All Audit Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full h-9 px-3 bg-white border border-[#e2e9ee] rounded-xl text-xs text-[#152737] outline-none focus:border-[#126fba]"
            >
              <option value="All">All Inspection Types</option>
              <option value="Safety">Safety Audit</option>
              <option value="Environment">Environmental Review</option>
              <option value="Full Audit">Comprehensive Full Audit</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] text-[#647988] border-b border-[#e2e9ee]">
                <th className="py-3 px-3 font-semibold">Inspection ID</th>
                <th className="py-3 px-3 font-semibold">Target Mine</th>
                <th className="py-3 px-3 font-semibold">Inspector In-Charge</th>
                <th className="py-3 px-3 font-semibold">Audit Type</th>
                <th className="py-3 px-3 font-semibold">Scheduled Date</th>
                <th className="py-3 px-3 font-semibold">Checklist Items</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e9ee]">
              {filteredInspections.map((ins) => {
                const totalChecks = ins.checklistItems.length;
                const completedChecks = ins.checklistItems.filter((c) => c.completed).length;

                return (
                  <tr key={ins.id} className="hover:bg-[#f9fbfc] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#126fba]">{ins.id}</td>
                    <td className="py-3 px-3 font-semibold text-[#152737]">{ins.mineName}</td>
                    <td className="py-3 px-3 text-[#526a79]">{ins.inspectorName}</td>
                    <td className="py-3 px-3 font-medium text-[#152737]">{ins.inspectionType}</td>
                    <td className="py-3 px-3 text-[#526a79]">{ins.date}</td>
                    <td className="py-3 px-3 text-[#152737]">
                      <span className="font-semibold text-[#126fba]">{completedChecks}/{totalChecks}</span> verified
                    </td>
                    <td className="py-3 px-3"><StatusBadge status={ins.status} size="sm" /></td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => openInspection(ins)}
                        className="px-3 py-1 rounded-md bg-[#edf5fb] hover:bg-[#dcebf7] text-[#126fba] font-bold text-[11px] transition-colors"
                      >
                        Inspect / View Report
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AssignInspectorModal
        isOpen={isAssignOpen}
        onClose={() => setIsAssignOpen(false)}
        mines={mines}
        onAssigned={refreshData}
      />

      <InspectionExecutionModal
        isOpen={isExecOpen}
        onClose={() => setIsExecOpen(false)}
        inspection={selectedInspection}
        onSaved={refreshData}
      />
    </div>
  );
};
