import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { 
  ShieldCheck, 
  DollarSign, 
  ShoppingBag, 
  Store, 
  AlertTriangle, 
  Layers, 
  TrendingUp, 
  ArrowRight,
  PieChart
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: () => api.getAdminMetrics(),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700 mb-1">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Platform Governance & Cold-Chain Oversight</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            Logistics & Operations Control Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monitor marketplace Gross Merchandise Value (GMV), multi-vendor order throughput, and perishability alerts.
          </p>
        </div>

        <Link
          to="/admin/vendors"
          className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Store className="w-4 h-4" />
          <span>Manage Florist Guilds & Commissions</span>
        </Link>
      </div>

      {/* Top Metric Cards */}
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
              <span className="text-xs font-bold uppercase tracking-wider">Platform GMV</span>
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <strong className="text-3xl font-serif font-bold text-slate-900 block">
              ₹{(metrics?.total_gmv || 0).toLocaleString('en-IN')}
            </strong>
            <span className="text-[11px] text-emerald-700 font-medium">Reconciled via mock gateway</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
              <ShoppingBag className="w-5 h-5 text-purple-600" />
            </div>
            <strong className="text-3xl font-serif font-bold text-slate-900 block">
              {metrics?.total_orders || 0}
            </strong>
            <span className="text-[11px] text-slate-500 font-medium">Partitioned into vendor sub-orders</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-bold uppercase tracking-wider">Active Florists</span>
              <Store className="w-5 h-5 text-amber-600" />
            </div>
            <strong className="text-3xl font-serif font-bold text-slate-900 block">
              {metrics?.active_vendors_count || 0}
            </strong>
            <span className="text-[11px] text-slate-500 font-medium">Servicing Mumbai, BLR & Madurai</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-rose-200 shadow-sm space-y-2 bg-gradient-to-br from-white to-rose-50/50">
            <div className="flex items-center justify-between text-rose-900">
              <span className="text-xs font-bold uppercase tracking-wider">Perishability Alerts</span>
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <strong className="text-3xl font-serif font-bold text-rose-950 block">
              {metrics?.perishability_alerts_count || 0}
            </strong>
            <span className="text-[11px] text-rose-700 font-medium">Ultra-perishable stems in transit</span>
          </div>

        </div>
      )}

      {/* Breakdown Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Orders by Status Progression */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
            Active Sub-Orders by State Machine Stage
          </h3>

          <div className="space-y-3">
            {metrics?.orders_by_status && Object.entries(metrics.orders_by_status).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{status.replace('_', ' ')}</span>
                <div className="flex items-center gap-3">
                  <div className="w-40 bg-slate-100 rounded-full h-2 overflow-hidden hidden sm:block">
                    <div 
                      className="bg-purple-600 h-full rounded-full" 
                      style={{ width: `${Math.min(100, (count / (metrics.total_orders || 1)) * 100)}%` }}
                    />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-bold text-slate-900 w-8 text-center">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Category */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
            Gross Volume by Floral Category
          </h3>

          <div className="space-y-3">
            {metrics?.revenue_by_category && Object.entries(metrics.revenue_by_category).map(([cat, rev]) => (
              <div key={cat} className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{cat.replace('_', ' ')}</span>
                <span className="font-bold text-slate-950">₹{rev.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
