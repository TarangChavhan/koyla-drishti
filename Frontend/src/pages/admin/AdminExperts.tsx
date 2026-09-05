import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Users, UserCheck, ShieldCheck, Mail, Phone, Calendar, Search } from 'lucide-react';

interface ExpertItem {
  id: string;
  name: string;
  designation: string;
  organization: string;
  specialization: string;
  activeInspections: number;
  completedAudits: number;
  status: 'Active' | 'On Field Duty' | 'Leave';
  contactEmail: string;
  phone: string;
}

export const AdminExperts: React.FC = () => {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');

  const [experts, setExperts] = useState<ExpertItem[]>([
    {
      id: 'EXP-101',
      name: 'Rajesh Sharma',
      designation: 'Senior Mining Safety Inspector (DGMS)',
      organization: 'Directorate General of Mines Safety, Dhanbad',
      specialization: 'Underground Gas Hazards & Ventilation Engineering',
      activeInspections: 3,
      completedAudits: 48,
      status: 'On Field Duty',
      contactEmail: 'rajesh.sharma@dgms.gov.in',
      phone: '+91 326 220 4891'
    },
    {
      id: 'EXP-102',
      name: 'Dr. Sunil Verma',
      designation: 'Chief Environmental Scientist',
      organization: 'Central Pollution Control Board (CPCB)',
      specialization: 'Ambient Dust (PM10/PM2.5), Mine Runoff Effluents',
      activeInspections: 2,
      completedAudits: 62,
      status: 'Active',
      contactEmail: 'sunil.verma@cpcb.gov.in',
      phone: '+91 11 2230 5792'
    },
    {
      id: 'EXP-103',
      name: 'Anil Kumar',
      designation: 'HEMM Heavy Machinery Principal Auditor',
      organization: 'DGMS Mechanical Inspection Wing, Ranchi',
      specialization: 'Dragline, Hydraulic Shovels & Haul Truck Braking',
      activeInspections: 1,
      completedAudits: 37,
      status: 'Active',
      contactEmail: 'anil.kumar@dgms.gov.in',
      phone: '+91 651 249 1034'
    },
    {
      id: 'EXP-104',
      name: 'Priyanka Sen',
      designation: 'Geotechnical Slope Stability Specialist',
      organization: 'CMPDI Central Geotechnical Cell, Bilaspur',
      specialization: 'Overburden Bench Failure & InSAR Satellite Geodesy',
      activeInspections: 0,
      completedAudits: 29,
      status: 'Active',
      contactEmail: 'priyanka.sen@cmpdi.co.in',
      phone: '+91 7752 240 188'
    }
  ]);

  const filteredExperts = experts.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.specialization.toLowerCase().includes(search.toLowerCase()) ||
    e.organization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#152737] tracking-tight">
            DGMS Inspectors & Technical Experts Registry
          </h1>
          <p className="text-xs text-[#728594]">
            Statutory personnel authorized to verify AI alerts, conduct field audits, and issue violation notices.
          </p>
        </div>
        <button
          onClick={() => showToast('Inspector roster updated', 'info')}
          className="px-4 py-2 rounded-xl bg-[#126fba] hover:bg-[#0f60a1] text-xs font-bold text-white shadow transition-colors"
        >
          Assign Inspection Roster
        </button>
      </div>

      {/* Cards */}
      <div className="bg-white border border-[#e2e9ee] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-[#8195a2] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expert by name, specialization, department..."
            className="w-full h-9 pl-9 pr-3 bg-[#f8fafb] border border-[#e2e9ee] rounded-xl text-xs text-[#152737] outline-none focus:border-[#126fba]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filteredExperts.map((exp) => (
            <div
              key={exp.id}
              className="p-4 rounded-xl border border-[#e2e9ee] bg-white hover:border-[#126fba]/40 transition-all shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#152737]">{exp.name}</h3>
                    <span className="font-mono text-[10px] text-[#126fba] bg-[#edf5fb] px-1.5 py-0.5 rounded font-bold">
                      {exp.id}
                    </span>
                  </div>
                  <p className="text-xs text-[#526a79] mt-0.5">{exp.designation}</p>
                  <p className="text-[11px] text-[#728594]">{exp.organization}</p>
                </div>
                <StatusBadge status={exp.status} size="sm" />
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1 border border-[#e2e9ee]">
                <span className="text-[#728594] text-[10px] uppercase font-bold block">Specialization</span>
                <p className="font-medium text-[#152737]">{exp.specialization}</p>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] text-[#728594]">
                <div>
                  Active Audits: <strong className="text-[#126fba]">{exp.activeInspections}</strong> · Lifetime Completed: <strong className="text-[#18a873]">{exp.completedAudits}</strong>
                </div>
                <button
                  onClick={() => showToast(`Roster details opened for ${exp.name}`, 'info')}
                  className="px-2.5 py-1 rounded bg-[#edf5fb] text-[#126fba] font-bold hover:bg-[#dcebf7]"
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
