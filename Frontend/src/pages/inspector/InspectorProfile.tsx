import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, UserCheck, Award, MapPin, Mail, Phone, Calendar, CheckCircle2 } from 'lucide-react';

export const InspectorProfile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#152737] tracking-tight">
          Inspector Official Identification & Credentials
        </h1>
        <p className="text-xs text-[#728594]">
          Directorate General of Mines Safety (DGMS) statutory warrant & digital signing authority.
        </p>
      </div>

      <div className="bg-white border border-[#e2e9ee] rounded-2xl p-6 shadow-sm space-y-6">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-[#e2e9ee]">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#159e89] to-[#0f6e60] text-white font-black text-2xl flex items-center justify-center shadow-lg">
            RS
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#152737]">{user?.name || 'Rajesh Sharma'}</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#ebf8f5] text-[#159e89] text-[10px] font-extrabold uppercase tracking-wider">
                DGMS Certified
              </span>
            </div>
            <p className="text-xs text-[#526a79]">{user?.designation || 'Senior Mining Safety Inspector (DGMS)'}</p>
            <p className="text-xs text-[#728594]">{user?.department || 'Directorate General of Mines Safety, Dhanbad Region'}</p>
          </div>
        </div>

        {/* Credentials Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-[#e2e9ee] space-y-1">
            <span className="text-[#728594] text-[11px] block">Government Inspector ID</span>
            <strong className="text-[#152737] font-mono text-sm">{user?.id || 'USR-002'}</strong>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-[#e2e9ee] space-y-1">
            <span className="text-[#728594] text-[11px] block">Statutory Jurisdiction</span>
            <strong className="text-[#152737]">Dhanbad, Bokaro & Ramgarh Coalfields</strong>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-[#e2e9ee] space-y-1">
            <span className="text-[#728594] text-[11px] block">Official Email</span>
            <strong className="text-[#126fba]">{user?.email || 'inspector@dgms.gov.in'}</strong>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-[#e2e9ee] space-y-1">
            <span className="text-[#728594] text-[11px] block">Contact Terminal</span>
            <strong className="text-[#152737]">{user?.phone || '+91 326 220 4891'}</strong>
          </div>
        </div>

        {/* Warrant & PKI Digital Signature Status */}
        <div className="p-4 bg-[#f0faf5] border border-[#bfe8d2] rounded-xl flex items-center gap-3 text-xs text-[#14704f]">
          <ShieldCheck className="w-6 h-6 text-[#159e89] shrink-0" />
          <div>
            <strong className="block text-sm">Valid Statutory Field Inspection Warrant</strong>
            <span>
              Certified under Section 7 of Mines Act, 1952. Authorized for unannounced pit inspections, equipment seizure, and statutory rectification orders.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
