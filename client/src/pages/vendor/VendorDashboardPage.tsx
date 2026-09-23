import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useAuthStore } from '../../stores/useAuthStore';
import { 
  Store, 
  Scissors, 
  Package, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp, 
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';

export const VendorDashboardPage: React.FC = () => {
  const { vendor } = useAuthStore();
  const vendorId = vendor?.id || 'f1111111-1111-4111-8111-111111111111';

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['vendor-metrics', vendorId],
    queryFn: () => api.getVendorMetrics(vendorId),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
            <Store className="w-4 h-4 text-amber-600" />
            <span>Florist Operations Center</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            {vendor?.store_name || 'Blossom & Vine Artisanal Florists'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Cold-Chain Logistics Node • {vendor?.city || 'Mumbai Hub'} • Rating: {vendor?.rating || 4.9} ★
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/vendor/orders"
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <Scissors className="w-4 h-4" />
            <span>Open Kanban Orders</span>
          </Link>

          <Link
            to="/vendor/inventory"
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>Inventory & Stems</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-slate-200 rounded-3xl h-36"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Active Orders</span>
              <Package className="w-5 h-5 text-botanical-600" />
            </div>
            <strong className="text-3xl font-serif font-bold text-slate-900 block">
              {metrics?.active_orders_count || 0}
            </strong>
            <span className="text-[11px] text-slate-500 font-medium">Awaiting delivery or packing</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-sm space-y-2 bg-gradient-to-br from-white to-amber-50/50">
            <div className="flex items-center justify-between text-amber-900">
              <span className="text-xs font-bold uppercase tracking-wider">Pending Stem Cuts</span>
              <Scissors className="w-5 h-5 text-amber-600" />
            </div>
            <strong className="text-3xl font-serif font-bold text-amber-950 block">
              {metrics?.pending_cuts_count || 0}
            </strong>
            <span className="text-[11px] text-amber-700 font-medium">Accepted • Ready to hydrate</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Daily Stem Revenue</span>
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <strong className="text-3xl font-serif font-bold text-slate-900 block">
              ₹{(metrics?.daily_revenue || 0).toLocaleString('en-IN')}
            </strong>
            <span className="text-[11px] text-slate-500 font-medium">Total: ₹{(metrics?.total_revenue || 0).toLocaleString('en-IN')}</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Fulfillment Rate</span>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <strong className="text-3xl font-serif font-bold text-slate-900 block">
              {metrics?.fulfillment_rate || 98}%
            </strong>
            <span className="text-[11px] text-emerald-700 font-medium">On-time slot adherence</span>
          </div>

        </div>
      )}

      {/* Operational Highlights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Low Stock Stem Warnings */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="font-serif text-base font-bold text-slate-900">
                Low-Stock Stem Warnings
              </h3>
            </div>
            <Link to="/vendor/inventory" className="text-xs text-botanical-700 hover:text-botanical-800 font-semibold">
              Manage Stems →
            </Link>
          </div>

          {metrics?.low_stock_products && metrics.low_stock_products.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {metrics.low_stock_products.map((prod) => (
                <div key={prod.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-bold text-slate-900">{prod.title}</h5>
                    <p className="text-slate-500 text-[11px]">Stem: {prod.stem_type}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      {prod.stock_quantity} Left
                    </span>
                    <Link
                      to="/vendor/inventory"
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-semibold transition-colors"
                    >
                      Restock
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">
              All stem inventory levels are healthy (&gt; 15 units in cold storage).
            </p>
          )}
        </div>

        {/* Right: AI Cold-Chain Readiness Banner */}
        <div className="lg:col-span-6 bg-gradient-to-br from-botanical-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Gemini 2.5 Flash Logistics Intelligence</span>
            </div>
            <h3 className="font-serif text-2xl font-bold leading-tight">
              Automated Perishability Risk Monitoring
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed font-light">
              Every incoming order item is evaluated against ambient temperatures, transit slot duration, and transpiration decay. Look for risk tags on your Kanban cards to package with correct thermal insulation.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-slate-400">Next Scheduled Cut Window: <strong>5:30 AM Tomorrow</strong></span>
            <Link
              to="/vendor/orders"
              className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold rounded-xl transition-colors"
            >
              Review Kanban
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};
