import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { ProductCard } from '../../components/floral/ProductCard';
import { PinCodeChecker } from '../../components/common/PinCodeChecker';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  ThermometerSnowflake, 
  Clock, 
  Sun, 
  Heart, 
  Award,
  Store,
  Layers
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['landing-products'],
    queryFn: () => api.getProducts(),
  });

  const products = data?.products || [];
  const bouquets = products.filter((p) => p.category === 'BOUQUETS').slice(0, 4);
  const ritualBlooms = products.filter((p) => p.category === 'LOOSE_FLOWERS').slice(0, 3);
  const exotics = products.filter((p) => p.category === 'EXOTIC_CUT_STEMS').slice(0, 3);

  const occasions = [
    { label: 'Morning Puja & Rituals', key: 'FESTIVAL_PUJA', icon: Sun, color: 'bg-amber-100 text-amber-900 border-amber-200' },
    { label: 'Anniversary Roses', key: 'ANNIVERSARY', icon: Heart, color: 'bg-rose-100 text-rose-900 border-rose-200' },
    { label: 'Birthday Radiance', key: 'BIRTHDAY', icon: Sparkles, color: 'bg-purple-100 text-purple-900 border-purple-200' },
    { label: 'Celebration & Success', key: 'CONGRATULATIONS', icon: Award, color: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-botanical-950 via-botanical-900 to-botanical-950 text-white pt-16 pb-24 sm:pt-20 sm:pb-32">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-botanical-800/80 border border-botanical-700 text-botanical-300 text-xs font-semibold">
                <ThermometerSnowflake className="w-4 h-4 text-emerald-400" />
                <span>Cold-Chain Preserved & AI Vase-Life Intelligence</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                Farm-Fresh Florals, <br />
                <span className="italic font-normal text-emerald-300">Engineered</span> for Longevity.
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                Direct harvest from artisanal growers to your door within hours. Hyperlocal order splitting, early-morning puja slots, and real-time Gemini AI stem care protocols.
              </p>

              {/* Pin Code Quick Checker Bar in Hero */}
              <div className="pt-2 max-w-lg mx-auto lg:mx-0">
                <PinCodeChecker />
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/catalog"
                  className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 group"
                >
                  <span>Explore Fresh Stems</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/catalog?category=LOOSE_FLOWERS"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition-all flex items-center gap-2"
                >
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Morning Puja Flowers</span>
                </Link>
              </div>

              {/* Badges bar */}
              <div className="pt-4 grid grid-cols-3 gap-3 border-t border-botanical-800/80 text-center lg:text-left text-xs text-slate-300">
                <div>
                  <strong className="block text-white font-semibold">0 - 2h Window</strong>
                  <span className="text-[11px] text-slate-400">Ultra-perishable express</span>
                </div>
                <div>
                  <strong className="block text-white font-semibold">Cold-Chain Wrap</strong>
                  <span className="text-[11px] text-slate-400">16°C thermal pouch</span>
                </div>
                <div>
                  <strong className="block text-white font-semibold">Gemini 2.5 Flash</strong>
                  <span className="text-[11px] text-slate-400">Custom vase-life protocols</span>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-slate-800 aspect-[4/5] max-w-md mx-auto">
                <img
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80"
                  alt="Dutch Crimson Rose Bouquet"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-600/90 text-white backdrop-blur-md self-start mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Featured Cold-Harvest Bouquet</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold">Velvet Dutch Red Rose Grandeur</h3>
                  <p className="text-xs text-slate-300 mt-1">24 Grand Prix Stems with Baby’s Breath & Eucalyptus</p>
                  
                  <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">From Artisan</span>
                      <span className="text-xs font-semibold text-emerald-300">Blossom & Vine (Mumbai)</span>
                    </div>
                    <Link
                      to="/product/p1111111-0001-4111-8111-111111111111"
                      className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Occasion-based Quick Filter Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="font-serif text-3xl font-bold text-slate-900">Curated by Sacred & Joyful Occasion</h2>
          <p className="text-xs text-slate-500 mt-1">Scheduled freshness slots matched to your ceremonial or gifting hour</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {occasions.map((occ) => {
            const Icon = occ.icon;
            return (
              <Link
                key={occ.key}
                to={`/catalog?occasion=${occ.key}`}
                className={`p-5 rounded-2xl border transition-all hover:scale-[1.02] hover:shadow-md flex flex-col justify-between ${occ.color}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-white/80 shadow-sm">
                    <Icon className="w-5 h-5 text-current" />
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-70" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-slate-900">{occ.label}</h4>
                  <span className="text-[11px] opacity-80 mt-1 block">View Curated Stems</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Section 1: Trending Bouquets */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-botanical-700 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Direct Cold-Chain Harvest</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-slate-900">Luxury Hand-Tied Bouquets</h2>
          </div>
          <Link to="/catalog?category=BOUQUETS" className="text-xs font-bold text-botanical-800 hover:text-botanical-900 flex items-center gap-1 group">
            <span>Browse All Bouquets</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-slate-200 rounded-2xl h-80"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bouquets.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Section 2: Dawn Puja & Ritual Florals Spotlight */}
      <section className="bg-amber-50/50 py-16 border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-200/80 text-amber-950 border border-amber-300 mb-2">
                <Sun className="w-3.5 h-3.5 text-amber-700" />
                <span>6:00 AM - 9:00 AM Guaranteed Puja Slot</span>
              </span>
              <h2 className="font-serif text-3xl font-bold text-slate-900">Sacred Ritual Blooms & Garlands</h2>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                Fresh Madurai Jasmine, saffron marigolds, and sacred lotuses harvested at bud-break and delivered in breathable banana leaf wrappers.
              </p>
            </div>
            <Link
              to="/catalog?category=LOOSE_FLOWERS"
              className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold transition-colors shrink-0 self-start md:self-auto"
            >
              View Puja Collection
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {ritualBlooms.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Exotic Stems & Architectural Blooms */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
              <Award className="w-4 h-4" />
              <span>7+ Day Long-Life Specimens</span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-slate-900">Exotic Orchids & Tropical Stems</h2>
          </div>
          <Link to="/catalog?category=EXOTIC_CUT_STEMS" className="text-xs font-bold text-blue-800 hover:text-blue-900 flex items-center gap-1 group">
            <span>View All Exotics</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {exotics.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Verified Florist Guild Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-botanical-500/20 text-botanical-300 border border-botanical-400/30">
                Guild of Master Growers
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                Are You a Commercial Florist or High-Altitude Grower?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Join our cold-chain network. Synchronize live stem stock, receive automated multi-vendor order splits, and leverage Gemini AI perishability alerts to protect your margins.
              </p>
              
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/vendor/dashboard"
                  className="px-6 py-3 rounded-xl bg-botanical-500 hover:bg-botanical-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2"
                >
                  <Store className="w-4 h-4" />
                  <span>Open Florist Portal</span>
                </Link>
                <Link
                  to="/admin/dashboard"
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors flex items-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  <span>Platform Operations</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <strong className="block text-2xl font-serif font-bold text-emerald-400">98.4%</strong>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Vase-Life Freshness SLA</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <strong className="block text-2xl font-serif font-bold text-emerald-400">&lt; 45m</strong>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Cut-to-Pack Target</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <strong className="block text-2xl font-serif font-bold text-emerald-400">100%</strong>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Automated Order Split</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <strong className="block text-2xl font-serif font-bold text-emerald-400">AI Powered</strong>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Gemini 2.5 Flash</span>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
