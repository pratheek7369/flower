import React from 'react';
import { FreshnessClassification } from '../../shared/types';
import { Clock, ShieldAlert, Sparkles } from 'lucide-react';

interface Props {
  freshnessClass?: FreshnessClassification;
  hours?: number;
  showIcon?: boolean;
  className?: string;
}

export const FreshnessBadge: React.FC<Props> = ({
  freshnessClass = 'STANDARD_FRESH',
  hours,
  showIcon = true,
  className = '',
}) => {
  if (freshnessClass === 'ULTRA_PERISHABLE' || (hours && hours <= 24)) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 glow-ultra ${className}`}>
        {showIcon && <ShieldAlert className="w-3.5 h-3.5 text-rose-500 animate-pulse" />}
        <span>Ultra Perishable {hours ? `(${hours}h Window)` : '(0-24h Express)'}</span>
      </span>
    );
  }

  if (freshnessClass === 'EXTENDED_LIFE' || (hours && hours >= 72)) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 glow-extended ${className}`}>
        {showIcon && <Sparkles className="w-3.5 h-3.5 text-blue-500" />}
        <span>Long-Life Stems {hours ? `(${hours}h+)` : '(7+ Days)'}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 glow-fresh ${className}`}>
      {showIcon && <Clock className="w-3.5 h-3.5 text-emerald-600" />}
      <span>Standard Fresh {hours ? `(${hours}h Window)` : '(24-72h)'}</span>
    </span>
  );
};
