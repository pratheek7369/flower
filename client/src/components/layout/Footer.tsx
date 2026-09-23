import React from 'react';
import { Link } from 'react-router-dom';
import { Flower2, ShieldCheck, ThermometerSnowflake, HeartHandshake, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Pillars: Cold-Chain, AI Longevity, Hyperlocal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-botanical-900/80 border border-botanical-700/50 text-botanical-400">
              <ThermometerSnowflake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Protected Cold-Chain</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Stems remain hydrated in aqua-sleeves and thermal foil pouches from cut to doorstep, preventing dehydration shock.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-rose-900/80 border border-rose-700/50 text-rose-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Gemini AI Longevity Engine</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Real-time custom water temperature, stem recutting angles, and ethylene defense tailored to every specific bouquet species.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-purple-900/80 border border-purple-700/50 text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Hyperlocal Multi-Vendor Splitting</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Orders split automatically to neighborhood growers and guild florists to ensure morning puja and anniversary deliveries within hours.
              </p>
            </div>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12 border-b border-slate-800">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 text-white font-serif text-2xl font-bold">
              <Flower2 className="w-6 h-6 text-botanical-500" />
              <span>FreshFlora</span>
            </Link>
            <p className="text-xs text-slate-400 mt-3 max-w-sm leading-relaxed">
              Enterprise horticultural commerce engine connecting conscious consumers with master regional florists, growers, and cold-chain logistics.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-botanical-400 font-medium">
              <HeartHandshake className="w-4 h-4" />
              <span>100% Farm-Fresh Longevity Guarantee</span>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Floral Types</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/catalog?category=BOUQUETS" className="hover:text-white transition-colors">Luxury Bouquets</Link></li>
              <li><Link to="/catalog?category=LOOSE_FLOWERS" className="hover:text-white transition-colors">Puja & Ritual Strings</Link></li>
              <li><Link to="/catalog?category=EXOTIC_CUT_STEMS" className="hover:text-white transition-colors">Exotic Orchids & Stems</Link></li>
              <li><Link to="/catalog?category=EVENT_DECOR" className="hover:text-white transition-colors">Ceremonial Decor</Link></li>
              <li><Link to="/catalog?category=INDOOR_PLANTS_FLORAL" className="hover:text-white transition-colors">Flowering Living Plants</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Occasions</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/catalog?occasion=FESTIVAL_PUJA" className="hover:text-white transition-colors">Morning Puja & Temples</Link></li>
              <li><Link to="/catalog?occasion=ANNIVERSARY" className="hover:text-white transition-colors">Anniversary Roses</Link></li>
              <li><Link to="/catalog?occasion=BIRTHDAY" className="hover:text-white transition-colors">Birthday Blooms</Link></li>
              <li><Link to="/catalog?occasion=CONGRATULATIONS" className="hover:text-white transition-colors">Celebrations</Link></li>
              <li><Link to="/catalog?occasion=CORPORATE" className="hover:text-white transition-colors">Corporate Hospitality</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Portals & RBAC</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/vendor/dashboard" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">Florist Vendor Portal</Link></li>
              <li><Link to="/vendor/orders" className="hover:text-white transition-colors">Vendor Kanban Board</Link></li>
              <li><Link to="/vendor/inventory" className="hover:text-white transition-colors">Inventory & Stem Sync</Link></li>
              <li><Link to="/admin/dashboard" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">Logistics Admin Portal</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">Live Delivery Timelines</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 FreshFlora Technologies Inc. Powered by Gemini 2.5 Flash.</p>
          <div className="flex items-center gap-6">
            <span>Cold-Chain SLA: 48h Post-Cut Window</span>
            <span>Hyperlocal Micro-Routing</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
