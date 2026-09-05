import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'green' | 'blue' | 'amber' | 'red' | 'neutral';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant, size = 'sm' }) => {
  // Infer variant if not provided
  let computedVariant = variant;
  const s = status.toLowerCase();

  if (!computedVariant) {
    if (s.includes('compliant') && !s.includes('non') || s.includes('resolved') || s.includes('done') || s.includes('approved') || s.includes('completed') || s.includes('verified') || s === 'low' || s === 'available' || s === 'active') {
      computedVariant = 'green';
    } else if (s.includes('sched') || s.includes('open') || s.includes('in progress') || s.includes('assigned') || s.includes('task') || s.includes('submitted')) {
      computedVariant = 'blue';
    } else if (s.includes('review') || s.includes('medium') || s.includes('amber') || s.includes('pending') || s.includes('priority') || s.includes('upcoming') || s.includes('warn')) {
      computedVariant = 'amber';
    } else if (s.includes('non-comp') || s.includes('high') || s.includes('critical') || s.includes('reject') || s.includes('overdue') || s.includes('violat') || s.includes('risk') || s.includes('cancel')) {
      computedVariant = 'red';
    } else {
      computedVariant = 'neutral';
    }
  }

  const variantStyles = {
    green: 'bg-[#e5f7ee] text-[#14704f] border-[#bfead5]',
    blue: 'bg-[#e8f2ff] text-[#1d649d] border-[#c2dbfc]',
    amber: 'bg-[#fff1cd] text-[#8e650a] border-[#fae19b]',
    red: 'bg-[#ffe8e8] text-[#c13d44] border-[#fbc9cc]',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const dotColors = {
    green: 'bg-[#18a873]',
    blue: 'bg-[#0f6fba]',
    amber: 'bg-[#e7a92b]',
    red: 'bg-[#df4d52]',
    neutral: 'bg-slate-400'
  };

  const sizeStyles = size === 'sm' ? 'text-[11px] py-0.5 px-2' : 'text-xs py-1 px-2.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${variantStyles[computedVariant]} ${sizeStyles} whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[computedVariant]}`} />
      {status}
    </span>
  );
};
