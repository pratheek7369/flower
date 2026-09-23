import React from 'react';
import { FloralCareGuide } from '../../shared/types';
import { 
  X, 
  Sparkles, 
  Droplet, 
  Scissors, 
  AlertTriangle, 
  CalendarCheck, 
  Clock, 
  Flower2, 
  FlaskConical 
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  guide: FloralCareGuide | null;
  bouquetTitle?: string;
}

export const CareGuideModal: React.FC<Props> = ({
  isOpen,
  onClose,
  guide,
  bouquetTitle = 'Fresh Floral Bouquet',
}) => {
  if (!isOpen || !guide) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-botanical-900 via-botanical-800 to-botanical-950 text-white rounded-t-3xl relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-botanical-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Gemini 2.5 Flash Post-Harvest Intelligence</span>
          </div>
          <h3 className="font-serif text-2xl font-bold">{bouquetTitle}</h3>
          <p className="text-xs text-botanical-100 mt-1 max-w-lg leading-relaxed">
            {guide.summary}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Expected Longevity: {guide.expected_vase_life_days} Days</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-blue-300" />
              <span>Water Temp: {guide.water_temperature_celsius}°C</span>
            </span>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 text-slate-800">

          {/* Stem Trimming & Vase Prep Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <div className="flex items-center gap-2 text-botanical-800 font-semibold text-xs mb-1.5">
                <Scissors className="w-4 h-4 text-botanical-600" />
                <span>Stem Trimming Technique</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {guide.trimming_technique}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
              <div className="flex items-center gap-2 text-blue-900 font-semibold text-xs mb-1.5">
                <Flower2 className="w-4 h-4 text-blue-600" />
                <span>Vase Sanitization & Fill</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {guide.vase_preparation}
              </p>
            </div>
          </div>

          {/* Nourishment Recipe */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs mb-1">
              <FlaskConical className="w-4 h-4 text-amber-600" />
              <span>Hydration Nourishment Recipe</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              {guide.nourishment_recipe}
            </p>
          </div>

          {/* Environmental Warnings */}
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider mb-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>Ambient Environmental Defense</span>
            </div>
            <div className="space-y-2">
              {guide.environmental_warnings.map((warn, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-900 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{warn}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Routine Checklist */}
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider mb-2.5">
              <CalendarCheck className="w-4 h-4 text-botanical-600" />
              <span>Daily Care Schedule</span>
            </div>
            <div className="space-y-2">
              {guide.daily_checklist.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-botanical-100 text-botanical-800 font-bold flex items-center justify-center text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-3xl flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-botanical-800 hover:bg-botanical-900 rounded-xl transition-colors"
          >
            Close Care Advisory
          </button>
        </div>

      </div>
    </div>
  );
};
