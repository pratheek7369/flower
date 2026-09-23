import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { ProductCard } from '../../components/floral/ProductCard';
import { useFilterStore } from '../../stores/useFilterStore';
import { useCartStore } from '../../stores/useCartStore';
import { 
  FlowerCategory, 
  OccasionType, 
  FreshnessClassification 
} from '../../shared/types';
import { 
  Filter, 
  RotateCcw, 
  MapPin, 
  Search, 
  CheckCircle2, 
  SlidersHorizontal 
} from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = useFilterStore();
  const currentPin = useCartStore((s) => s.recipientPinCode);

  // Sync URL params to store on load
  useEffect(() => {
    const cat = searchParams.get('category') as FlowerCategory | null;
    const occ = searchParams.get('occasion') as OccasionType | null;
    const search = searchParams.get('search');
    if (cat) filter.setCategory(cat);
    if (occ) filter.setOccasion(occ);
    if (search) filter.setSearch(search);
  }, [searchParams]);

  const { data, isLoading } = useQuery({
    queryKey: [
      'catalog-products',
      filter.category,
      filter.occasion,
      filter.search,
      filter.freshnessClass,
      filter.minPrice,
      filter.maxPrice,
      filter.sortBy,
      currentPin,
    ],
    queryFn: () => api.getProducts({
      category: filter.category || undefined,
      occasion: filter.occasion || undefined,
      search: filter.search || undefined,
      freshness_class: filter.freshnessClass || undefined,
      min_price: filter.minPrice,
      max_price: filter.maxPrice,
      sort_by: filter.sortBy,
      pin_code: currentPin,
    }),
  });

  const products = data?.products || [];
  const serviceableCount = data?.serviceable_count || 0;

  const categories: Array<{ label: string; value: FlowerCategory | '' }> = [
    { label: 'All Categories', value: '' },
    { label: 'Bouquets', value: 'BOUQUETS' },
    { label: 'Loose Puja Flowers', value: 'LOOSE_FLOWERS' },
    { label: 'Exotic Cut Stems', value: 'EXOTIC_CUT_STEMS' },
    { label: 'Event Decor', value: 'EVENT_DECOR' },
    { label: 'Indoor Flowering Plants', value: 'INDOOR_PLANTS_FLORAL' },
  ];

  const occasions: Array<{ label: string; value: OccasionType | '' }> = [
    { label: 'All Occasions', value: '' },
    { label: 'Morning Puja & Mandir', value: 'FESTIVAL_PUJA' },
    { label: 'Anniversary', value: 'ANNIVERSARY' },
    { label: 'Birthday', value: 'BIRTHDAY' },
    { label: 'Congratulations', value: 'CONGRATULATIONS' },
    { label: 'Sympathy & Peace', value: 'SYMPATHY' },
    { label: 'Corporate', value: 'CORPORATE' },
  ];

  const freshnessLevels: Array<{ label: string; value: FreshnessClassification | '' }> = [
    { label: 'All Lifespans', value: '' },
    { label: 'Ultra Perishable (0-24h Express)', value: 'ULTRA_PERISHABLE' },
    { label: 'Standard Fresh (24-72h)', value: 'STANDARD_FRESH' },
    { label: 'Extended Life (72h+ / 7 Days)', value: 'EXTENDED_LIFE' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title & Serviceability Alert Banner */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
              Artisanal Floral Catalog
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Faceted fresh stems with strict cold-chain and micro-regional florist dispatch.
            </p>
          </div>

          {/* Current Pin Banner */}
          <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span>Checking serviceability for PIN: <strong className="font-bold">{currentPin}</strong></span>
              <span className="block text-[11px] text-emerald-700">
                {serviceableCount} of {products.length} products available for immediate delivery in this radius
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Faceted Filters Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Filter className="w-4 h-4 text-botanical-600" />
                <span>Filters</span>
              </div>
              <button
                onClick={filter.resetFilters}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Search Stems or Florists</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={filter.search}
                  onChange={(e) => filter.setSearch(e.target.value)}
                  placeholder="e.g. Dutch Rose, Jasmine..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-botanical-500 bg-slate-50"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Floral Category</label>
              <div className="space-y-1.5">
                {categories.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => filter.setCategory(c.value)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      filter.category === c.value
                        ? 'bg-botanical-100 text-botanical-900 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{c.label}</span>
                    {filter.category === c.value && <span className="w-1.5 h-1.5 rounded-full bg-botanical-600"></span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Occasions */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Occasion</label>
              <div className="space-y-1.5">
                {occasions.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => filter.setOccasion(o.value)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      filter.occasion === o.value
                        ? 'bg-rose-100 text-rose-900 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{o.label}</span>
                    {filter.occasion === o.value && <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Freshness Classification */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Vase-Life Freshness Window</label>
              <div className="space-y-1.5">
                {freshnessLevels.map((fl) => (
                  <button
                    key={fl.value}
                    onClick={() => filter.setFreshnessClass(fl.value)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      filter.freshnessClass === fl.value
                        ? 'bg-blue-100 text-blue-900 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{fl.label}</span>
                    {filter.freshnessClass === fl.value && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Price Cap (Max)</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="400"
                  max="4000"
                  step="100"
                  value={filter.maxPrice || 4000}
                  onChange={(e) => filter.setPriceRange(undefined, Number(e.target.value))}
                  className="w-full accent-botanical-700 cursor-pointer"
                />
              </div>
              <span className="text-[11px] font-semibold text-slate-600 mt-1 block">
                Up to ₹{(filter.maxPrice || 4000).toLocaleString('en-IN')}
              </span>
            </div>

          </div>
        </aside>

        {/* Product Catalog Grid */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Top Sort & Count Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-3">
            <span className="text-xs text-slate-500 font-medium">
              Showing <strong className="text-slate-900 font-bold">{products.length}</strong> freshly curated items
            </span>

            <div className="flex items-center gap-2 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <label htmlFor="sortBy" className="text-slate-500 font-medium">Sort By:</label>
              <select
                id="sortBy"
                value={filter.sortBy}
                onChange={(e) => filter.setSortBy(e.target.value as any)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-botanical-600"
              >
                <option value="popular">Most Popular</option>
                <option value="freshness">Shortest Freshness Window (RUSH)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-slate-200 rounded-2xl h-80"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-800">No Floral Items Found</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Try loosening your filters or resetting the price and category.
              </p>
              <button
                onClick={filter.resetFilters}
                className="px-4 py-2 bg-botanical-700 text-white rounded-xl text-xs font-semibold hover:bg-botanical-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

        </main>

      </div>

    </div>
  );
};
