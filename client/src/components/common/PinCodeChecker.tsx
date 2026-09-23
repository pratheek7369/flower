import React, { useState } from 'react';
import { MapPin, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { useCartStore } from '../../stores/useCartStore';
import { useFilterStore } from '../../stores/useFilterStore';

interface Props {
  compact?: boolean;
  onVerified?: (pinCode: string, isServiceable: boolean) => void;
}

export const PinCodeChecker: React.FC<Props> = ({ compact = false, onVerified }) => {
  const currentPin = useCartStore((s) => s.recipientPinCode);
  const isVerified = useCartStore((s) => s.isPinCodeVerified);
  const setPinCode = useCartStore((s) => s.setRecipientPinCode);
  const setFilterPin = useFilterStore((s) => s.setPinCode);

  const [pinInput, setPinInput] = useState(currentPin || '');
  const [loading, setLoading] = useState(false);
  const [serviceInfo, setServiceInfo] = useState<{
    tested: boolean;
    serviceable: boolean;
    count: number;
    vendors: Array<{ id: string; store_name: string }>;
  }>({
    tested: isVerified,
    serviceable: isVerified,
    count: 3,
    vendors: [],
  });

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = pinInput.trim();
    if (!/^\d{6}$/.test(clean)) {
      alert('Please enter a valid 6-digit Indian postal pin code (e.g. 400001, 560001, 400050)');
      return;
    }

    setLoading(true);
    try {
      const res = await api.checkPinCode(clean);
      setServiceInfo({
        tested: true,
        serviceable: res.is_serviceable,
        count: res.serviceable_vendors_count,
        vendors: res.vendors,
      });

      setPinCode(clean, res.is_serviceable, res.serviceable_vendors_count);
      setFilterPin(clean);
      if (onVerified) onVerified(clean, res.is_serviceable);
    } catch (err) {
      console.error('Pin check error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <form onSubmit={handleVerify} className="relative flex items-center">
        <div className="relative flex items-center w-full">
          <MapPin className="absolute left-2.5 w-4 h-4 text-botanical-600 pointer-events-none" />
          <input
            type="text"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter Delivery Pin (e.g. 400001)"
            className="w-48 pl-8 pr-16 py-1.5 text-xs rounded-full border border-slate-200 focus:outline-none focus:border-botanical-500 bg-white/90 shadow-sm"
            maxLength={6}
          />
          <button
            type="submit"
            disabled={loading || pinInput.length !== 6}
            className="absolute right-1 px-2.5 py-1 text-[11px] font-semibold text-white bg-botanical-700 hover:bg-botanical-800 disabled:bg-slate-300 rounded-full transition-colors"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Check'}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
      <div className="flex items-center gap-2 mb-2 text-slate-800 font-semibold">
        <MapPin className="w-5 h-5 text-botanical-600" />
        <span>Check Hyperlocal Perishable Delivery</span>
      </div>
      <p className="text-xs text-slate-500 mb-3">
        Because cold-chain cut flowers are ultra-perishable, only verified florists within your micro-radius can fulfill rapid delivery.
      </p>

      <form onSubmit={handleVerify} className="flex gap-2">
        <input
          type="text"
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="Enter 6-digit pin code (e.g. 400001)"
          className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-botanical-500/20 focus:border-botanical-600 bg-slate-50/50"
          maxLength={6}
        />
        <button
          type="submit"
          disabled={loading || pinInput.length !== 6}
          className="px-5 py-2.5 bg-botanical-700 hover:bg-botanical-800 disabled:bg-slate-200 text-white font-medium text-sm rounded-xl transition-all flex items-center gap-2 shadow-sm"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>Verify Radius</span>
        </button>
      </form>

      {serviceInfo.tested && (
        <div className={`mt-3 p-3 rounded-xl text-xs flex items-start gap-2.5 ${
          serviceInfo.serviceable ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
        }`}>
          {serviceInfo.serviceable ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Serviceable at {pinInput}!</p>
                <p className="text-emerald-700 mt-0.5">
                  {serviceInfo.count} verified master florists can deliver within this pin code. Early Morning Puja and Express slots are unlocked.
                </p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Pin code {pinInput} currently outside cold-chain limits</p>
                <p className="text-rose-700 mt-0.5">
                  Try testing with <strong className="underline cursor-pointer" onClick={() => { setPinInput('400001'); }}>400001</strong> (Mumbai) or <strong className="underline cursor-pointer" onClick={() => { setPinInput('560001'); }}>560001</strong> (Bangalore).
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
