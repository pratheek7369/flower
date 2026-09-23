import React from 'react';
import { PerishabilityRiskAssessment } from '../../shared/types';
import { 
  ShieldAlert, 
  Droplet, 
  Thermometer, 
  Package, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

interface Props {
  risk: PerishabilityRiskAssessment;
}

export const PerishabilityAlertCard: React.FC<Props> = ({ risk }) => {
  const getBadgeStyle = () => {
    switch (risk.risk_level) {
      case 'CRITICAL':
        return 'bg-rose-50 border-rose-200 text-rose-900';
      case 'HIGH':
        return 'bg-amber-50 border-amber-200 text-amber-900';
      case 'MODERATE':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      default:
        return 'bg-emerald-50 border-emerald-200 text-emerald-900';
    }
  };

  const getScoreColor = () => {
    if (risk.risk_score >= 75) return 'text-rose-600 bg-rose-100 border-rose-200';
    if (risk.risk_score >= 50) return 'text-amber-600 bg-amber-100 border-amber-200';
    return 'text-emerald-600 bg-emerald-100 border-emerald-200';
  };

  return (
    <div className={`p-4 rounded-2xl border text-xs ${getBadgeStyle()} space-y-3`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-current animate-pulse" />
          <span className="font-bold uppercase tracking-wider text-[11px]">
            AI Cold-Chain Risk: {risk.risk_level}
          </span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${getScoreColor()}`}>
          Risk Score: {risk.risk_score}/100
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="flex items-center gap-1.5 opacity-90">
          <Thermometer className="w-3.5 h-3.5" />
          <span>Ambient: {risk.ambient_temp_assumed}°C</span>
        </div>
        <div className="flex items-center gap-1.5 opacity-90">
          <Clock className="w-3.5 h-3.5" />
          <span>Deadline: {risk.dispatch_deadline_minutes} mins</span>
        </div>
      </div>

      {/* Packaging Protocol */}
      <div className="p-2.5 rounded-xl bg-white/70 border border-current/20 space-y-1.5 text-slate-800">
        <div className="flex items-start gap-1.5">
          <Droplet className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
          <span className="text-[11px]">
            <strong>Hydration:</strong> {risk.packaging_instructions.hydration_method}
          </span>
        </div>
        <div className="flex items-start gap-1.5">
          <Package className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <span className="text-[11px]">
            <strong>Thermal:</strong> {risk.packaging_instructions.thermal_protection}
          </span>
        </div>
      </div>

      {/* Courier Label Warning */}
      <div className="text-[10px] font-mono bg-black/5 p-2 rounded-lg flex items-center gap-1.5">
        <AlertCircle className="w-3.5 h-3.5 text-current shrink-0" />
        <span className="truncate">{risk.courier_notes}</span>
      </div>
    </div>
  );
};
