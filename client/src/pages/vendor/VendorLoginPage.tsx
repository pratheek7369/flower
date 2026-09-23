import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';
import { Store, ArrowRight, ShieldCheck, Flower2 } from 'lucide-react';

export const VendorLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuthStore();

  const handleSelectVendor = async () => {
    await switchRole('VENDOR');
    navigate('/vendor/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto shadow-sm">
          <Store className="w-7 h-7" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-slate-900">Florist Vendor Portal</h1>
        <p className="text-xs text-slate-500">
          Manage cut flower inventory, transition operational Kanban stages, and view Gemini AI cold-chain risk advisories.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
          Quick Access Demo Stores
        </h3>

        <button
          onClick={handleSelectVendor}
          className="w-full p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-left flex items-center justify-between group"
        >
          <div>
            <h4 className="font-bold text-sm text-slate-900">Blossom & Vine Artisans</h4>
            <p className="text-xs text-slate-500">Bandra West, Mumbai • Luxury Dutch Roses & Lilies</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-1 transition-all" />
        </button>

        <button
          onClick={handleSelectVendor}
          className="w-full p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-left flex items-center justify-between group"
        >
          <div>
            <h4 className="font-bold text-sm text-slate-900">PetalCraft Botanical Guild</h4>
            <p className="text-xs text-slate-500">Richmond Town, Bangalore • Orchids & Anthuriums</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-1 transition-all" />
        </button>

        <button
          onClick={handleSelectVendor}
          className="w-full p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-left flex items-center justify-between group"
        >
          <div>
            <h4 className="font-bold text-sm text-slate-900">Madurai Sacred Blooms</h4>
            <p className="text-xs text-slate-500">Flower Market, Madurai • Fresh Puja Malli Strings</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      <div className="text-center">
        <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
          ← Return to Marketplace
        </Link>
      </div>

    </div>
  );
};
