import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { 
  Store, 
  ShieldCheck, 
  MapPin, 
  Star, 
  ArrowLeft, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export const AdminVendorsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ['admin-vendors'],
    queryFn: () => api.getAdminVendors(),
  });

  const updateVendorMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: { is_active?: boolean; commission_rate?: number } }) =>
      api.updateAdminVendor(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vendors'] });
      queryClient.invalidateQueries({ queryKey: ['admin-metrics'] });
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <Link to="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-700 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Operations Dashboard</span>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700 mb-1">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Florist Network Verification</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            Registered Florist Guilds & Commissions
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Verify vendor cold-chain facilities, adjust marketplace commission rates, and toggle store activation.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-slate-200 rounded-3xl h-24"></div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-4 px-6">Florist Guild</th>
                  <th className="py-4 px-6">Hub City</th>
                  <th className="py-4 px-6">Service Area</th>
                  <th className="py-4 px-6">Rating</th>
                  <th className="py-4 px-6">Commission (%)</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vendors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                          <Store className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 text-sm block">{v.store_name}</span>
                          <span className="text-[11px] text-slate-500 font-mono">{v.store_slug}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {v.city}
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                        <MapPin className="w-3 h-3 text-botanical-600" />
                        <span>{v.service_pincodes.length} PIN Codes</span>
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{v.rating.toFixed(1)}</span>
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max="30"
                          defaultValue={v.commission_rate || 10.0}
                          onBlur={(e) => {
                            const val = parseFloat(e.target.value);
                            if (!isNaN(val)) {
                              updateVendorMutation.mutate({ id: v.id, updates: { commission_rate: val } });
                            }
                          }}
                          className="w-16 px-2 py-1 text-xs border border-slate-200 rounded-lg text-slate-900 font-bold focus:outline-none focus:border-purple-600"
                        />
                        <span className="text-slate-500 font-semibold">%</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        v.is_active ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {v.is_active ? 'Active Guild' : 'Suspended'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => updateVendorMutation.mutate({ id: v.id, updates: { is_active: !v.is_active } })}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-colors ${
                          v.is_active
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {v.is_active ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
