import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mineService } from '../../services/mineService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Building2, MapPin, ShieldCheck, Mail, Phone, Calendar, UserCheck } from 'lucide-react';
import { Mine } from '../../types';

export const MineProfile: React.FC = () => {
  const { user } = useAuth();
  const currentMineId = user?.mineId || 'KD-101';
  const [mine, setMine] = useState<Mine | null>(null);

  useEffect(() => {
    mineService.getMineById(currentMineId).then((m) => {
      if (m) setMine(m);
      else mineService.getAllMines().then((all) => setMine(all[0] || null));
    }).catch(() => {});
  }, [currentMineId]);

  if (!mine) {
    return (
      <div className="p-8 text-center text-xs text-[#728594]">
        Loading mine lease profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#152737] tracking-tight">
          Mine Lease Profile & Statutory Registry Record
        </h1>
        <p className="text-xs text-[#728594]">
          National Coal Inventory Record · Directorate General of Mines Safety
        </p>
      </div>

      <div className="bg-white border border-[#e2e9ee] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-[#e2e9ee]">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#e5a52a] to-[#be8210] text-[#071a2b] font-black text-2xl flex items-center justify-center shadow-lg">
            {mine.id}
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#152737]">{mine.name}</h2>
              <StatusBadge status={mine.status} />
            </div>
            <p className="text-xs text-[#526a79]">{mine.operator}</p>
            <p className="text-xs text-[#728594]">{mine.address}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-[#e2e9ee] space-y-1">
            <span className="text-[#728594] text-[11px] block">Statutory Lease Registration</span>
            <strong className="text-[#152737] font-mono">GOI-COAL-JH-2018-0412</strong>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-[#e2e9ee] space-y-1">
            <span className="text-[#728594] text-[11px] block">Mining Category</span>
            <strong className="text-[#152737]">{mine.mineType}</strong>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-[#e2e9ee] space-y-1">
            <span className="text-[#728594] text-[11px] block">Designated Safety In-Charge</span>
            <strong className="text-[#152737]">{mine.contactOfficer}</strong>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-[#e2e9ee] space-y-1">
            <span className="text-[#728594] text-[11px] block">Statutory Official Email</span>
            <strong className="text-[#126fba]">{mine.contactEmail}</strong>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-[#e2e9ee] text-xs space-y-2">
          <h4 className="font-bold text-[#152737] uppercase tracking-wider text-[11px]">
            Demarcated Lease GPS Boundary Coordinates
          </h4>
          <div className="font-mono text-[#526a79] bg-white p-3 rounded-lg border border-[#e2e9ee] space-y-1 text-[11px]">
            <div>Vertex A: 23°47'12.4"N 86°24'35.8"E (RL +218.4m)</div>
            <div>Vertex B: 23°47'19.1"N 86°25'08.2"E (RL +221.0m)</div>
            <div>Vertex C: 23°46'45.0"N 86°25'14.6"E (RL +214.2m)</div>
            <div>Vertex D: 23°46'38.8"N 86°24'40.1"E (RL +210.5m)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
