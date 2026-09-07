import React, { useState, useMemo } from 'react';
import { inspectionService } from '../../services/inspectionService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { InspectionExecutionModal } from '../../components/inspector/InspectionExecutionModal';
import { useToast } from '../../context/ToastContext';
import { Inspection } from '../../types';
import { Calendar, Search, Filter, Play, CheckCircle2, FileText, Clock } from 'lucide-react';

export const InspectorInspections: React.FC = () => {
  const { showToast } = useToast();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [isExecOpen, setIsExecOpen] = useState(false);

  const loadData = async () => {
    try {
      const data = await inspectionService.getAllInspections();
      setInspections(data || []);
    } catch (err) {
      console.error('Failed to load inspector inspections', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    return inspections.filter((ins) => {
      const matchSearch =
        ins.mineName.toLowerCase().includes(search.toLowerCase()) ||
        ins.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || ins.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [inspections, search, statusFilter]);

  const openExecute = (ins: Inspection) => {
    setSelectedInspection(ins);
    setIsExecOpen(true);
  };

  const refreshData = () => {
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#152737] tracking-tight">
            Assigned Field Inspections & Digital Checklists
          </h1>
          <p className="text-xs text-[#728594]">
            Execute on-site safety audits, verify atmospheric telemetry, log observations, and attach geo-tagged photos.
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#e2e9ee] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8195a2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assigned inspection or mine..."
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
              <option value="Completed">Completed & Filed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8fafc] text-[#647988] border-b border-[#e2e9ee]">
                <th className="py-3 px-3 font-semibold">Audit ID</th>
                <th className="py-3 px-3 font-semibold">Mine Facility</th>
                <th className="py-3 px-3 font-semibold">Category</th>
                <th className="py-3 px-3 font-semibold">Date & Time</th>
                <th className="py-3 px-3 font-semibold">Priority</th>
                <th className="py-3 px-3 font-semibold">Checklist Items</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e9ee]">
              {filtered.map((ins) => {
                const total = ins.checklistItems.length;
                const done = ins.checklistItems.filter((c) => c.completed).length;

                return (
                  <tr key={ins.id} className="hover:bg-[#f9fbfc] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#126fba]">{ins.id}</td>
                    <td className="py-3 px-3 font-semibold text-[#152737]">{ins.mineName}</td>
                    <td className="py-3 px-3 text-[#526a79]">{ins.inspectionType}</td>
                    <td className="py-3 px-3 text-[#526a79]">{ins.date}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ins.priority === 'Urgent'
                            ? 'bg-rose-100 text-rose-700'
                            : ins.priority === 'Priority'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {ins.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#152737]">
                      <span className="font-bold text-[#126fba]">{done}/{total}</span> verified
                    </td>
                    <td className="py-3 px-3"><StatusBadge status={ins.status} size="sm" /></td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => openExecute(ins)}
                        className="px-3 py-1.5 rounded-lg bg-[#126fba] hover:bg-[#0f60a1] text-white font-bold text-xs shadow flex items-center gap-1 inline-flex transition-colors"
                      >
                        <Play className="w-3 h-3" /> Audit Checklist
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <InspectionExecutionModal
        isOpen={isExecOpen}
        onClose={() => setIsExecOpen(false)}
        inspection={selectedInspection}
        onSaved={refreshData}
      />
    </div>
  );
};
