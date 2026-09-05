import React from 'react';
import { HelpCircle, Phone, Mail, FileText, ExternalLink, ShieldCheck } from 'lucide-react';

export const MineHelp: React.FC = () => {
  return (
    <div className="max-w-4xl space-y-6 text-xs">
      <div>
        <h1 className="text-xl font-bold text-[#152737] tracking-tight">
          Help Desk & Regulatory Compliance Support
        </h1>
        <p className="text-xs text-[#728594]">
          Directorate General of Mines Safety (DGMS) guidance, SOPs, and technical support.
        </p>
      </div>

      <div className="bg-white border border-[#e2e9ee] rounded-2xl p-6 shadow-sm space-y-6">
        {/* Contact Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-[#e2e9ee] space-y-1">
            <Phone className="w-4 h-4 text-[#126fba] mb-1" />
            <strong className="block text-[#152737]">DGMS Central Toll-Free Helpline</strong>
            <p className="text-[#526a79]">1800-180-2625 (Toll Free · 24/7)</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-[#e2e9ee] space-y-1">
            <Mail className="w-4 h-4 text-[#159e89] mb-1" />
            <strong className="block text-[#152737]">Official Compliance Desk</strong>
            <p className="text-[#526a79]">compliance-support@dgms.gov.in</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-[#e2e9ee] space-y-1">
            <ShieldCheck className="w-4 h-4 text-[#e5a52a] mb-1" />
            <strong className="block text-[#152737]">Emergency Pit Safety Dispatch</strong>
            <p className="text-[#526a79]">+91 326 220 5410 (Dhanbad HQ)</p>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold text-[#152737] uppercase tracking-wider">
            Frequently Asked Compliance Questions
          </h3>

          <div className="space-y-2">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-[#e2e9ee] space-y-1">
              <strong className="text-[#152737] block">How does the AI identify potential violations?</strong>
              <p className="text-[#526a79] leading-relaxed">
                KOYLA DRISHTI fuses Sentinel synthetic aperture radar (SAR) satellite imagery with continuous ambient PM10 air monitors and acoustic blasting sensors to detect surface deformations and emissions exceeding statutory limits.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-[#e2e9ee] space-y-1">
              <strong className="text-[#152737] block">What is the deadline to submit evidence for a violation?</strong>
              <p className="text-[#526a79] leading-relaxed">
                Unless an emergency cessation order is served, mine operators are given between 7 to 14 statutory days to complete remedial work and submit proof via the Corrective Actions portal.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-[#e2e9ee] space-y-1">
              <strong className="text-[#152737] block">Can AI automatically close or issue a legal violation?</strong>
              <p className="text-[#526a79] leading-relaxed">
                No. AI signals are decision-support anomalies only. Only authorized Government Inspectors from the Directorate General of Mines Safety (DGMS) can legally verify, issue, and adjudicate cases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
