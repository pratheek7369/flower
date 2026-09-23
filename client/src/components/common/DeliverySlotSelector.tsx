import React from 'react';
import { DeliverySlotType } from '../../shared/types';
import { Zap, Sun, Clock, Moon } from 'lucide-react';

interface Props {
  selectedSlot: DeliverySlotType;
  onChange: (slot: DeliverySlotType) => void;
  className?: string;
}

export const DeliverySlotSelector: React.FC<Props> = ({
  selectedSlot,
  onChange,
  className = '',
}) => {
  const slots: Array<{
    id: DeliverySlotType;
    title: string;
    hours: string;
    icon: any;
    badge: string;
    badgeColor: string;
  }> = [
    {
      id: 'MORNING_SLOT',
      title: 'Dawn Puja & Ritual',
      hours: '6:00 AM - 9:00 AM',
      icon: Sun,
      badge: 'Best for Mandir & Puja',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
    },
    {
      id: 'EXPRESS_IMMEDIATE',
      title: 'Express Direct Courier',
      hours: 'Within 90 - 120 Mins',
      icon: Zap,
      badge: 'Protected Cold Bag',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-200',
    },
    {
      id: 'STANDARD_DAY',
      title: 'Standard Daytime',
      hours: '9:00 AM - 6:00 PM',
      icon: Clock,
      badge: 'Free Cold-Chain Box',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    },
    {
      id: 'EVENING_SLOT',
      title: 'Twilight Celebration',
      hours: '6:00 PM - 9:00 PM',
      icon: Moon,
      badge: 'Dinner & Party',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    },
  ];

  return (
    <div className={`space-y-2.5 ${className}`}>
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
        Select Guaranteed Delivery Slot
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {slots.map((s) => {
          const Icon = s.icon;
          const isSelected = selectedSlot === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onChange(s.id)}
              className={`p-3 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? 'border-botanical-700 bg-botanical-50/70 ring-2 ring-botanical-600/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-botanical-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-semibold text-slate-900">{s.title}</h5>
                    <p className="text-[11px] text-slate-500 font-medium">{s.hours}</p>
                  </div>
                </div>
              </div>
              <span className={`mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${s.badgeColor}`}>
                {s.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
