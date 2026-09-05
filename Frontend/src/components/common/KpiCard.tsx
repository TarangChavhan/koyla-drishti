import React, { ReactNode } from 'react';

interface KpiCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  subtextColor?: 'green' | 'amber' | 'red' | 'neutral';
  icon?: ReactNode;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  subtext,
  subtextColor = 'neutral',
  icon,
  onClick
}) => {
  const colorMap = {
    green: 'text-[#18a873]',
    amber: 'text-[#9a6a09]',
    red: 'text-[#df4d52]',
    neutral: 'text-[#708493]'
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#e2e9ee] rounded-xl p-4 shadow-[0_4px_16px_rgba(8,33,52,0.05)] transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-[#126fba]/40 hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <small className="block text-[11px] font-medium text-[#728594] tracking-wide uppercase">
            {label}
          </small>
          <strong className="block text-2xl font-bold text-[#152737] my-1 tracking-tight">
            {value}
          </strong>
          {subtext && (
            <span className={`text-[11px] font-semibold flex items-center gap-1 ${colorMap[subtextColor]}`}>
              {subtext}
            </span>
          )}
        </div>
        {icon && (
          <div className="w-9 h-9 rounded-lg bg-[#edf5fb] text-[#126fba] flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
