import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useAuthStore } from '../../stores/useAuthStore';
import { OrderItemStatus, OrderItem } from '../../shared/types';
import { PerishabilityAlertCard } from '../../components/vendor/PerishabilityAlertCard';
import { 
  Scissors, 
  Clock, 
  Package, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Store,
  ChevronRight,
  Filter
} from 'lucide-react';

export const VendorOrdersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { vendor } = useAuthStore();
  const vendorId = vendor?.id || 'f1111111-1111-4111-8111-111111111111';

  const [filterView, setFilterView] = useState<'KANBAN' | 'LIST'>('KANBAN');
  const [selectedRiskItem, setSelectedRiskItem] = useState<OrderItem | null>(null);

  const { data: orderItems = [], isLoading } = useQuery({
    queryKey: ['vendor-orders', vendorId],
    queryFn: () => api.getVendorOrders(vendorId),
    refetchInterval: 5000,
  });

  // State Transition Mutation
  const transitionMutation = useMutation({
    mutationFn: ({ itemId, newStatus }: { itemId: string; newStatus: OrderItemStatus }) =>
      api.updateOrderItemStatus(itemId, newStatus, vendorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-orders', vendorId] });
      queryClient.invalidateQueries({ queryKey: ['vendor-metrics', vendorId] });
    },
    onError: (err: any) => {
      alert(`Status transition failed: ${err.message}`);
    },
  });

  const columns: Array<{
    status: OrderItemStatus;
    title: string;
    actionLabel: string;
    nextStatus: OrderItemStatus | null;
    color: string;
    badgeBg: string;
  }> = [
    {
      status: 'PENDING',
      title: '1. Pending Acceptance',
      actionLabel: 'Accept & Lock Stems',
      nextStatus: 'ACCEPTED',
      color: 'border-yellow-400',
      badgeBg: 'bg-yellow-100 text-yellow-900',
    },
    {
      status: 'ACCEPTED',
      title: '2. Stems Ready for Cut',
      actionLabel: 'Mark Cut & Cold-Packed',
      nextStatus: 'CUT_PACKED',
      color: 'border-amber-400',
      badgeBg: 'bg-amber-100 text-amber-900',
    },
    {
      status: 'CUT_PACKED',
      title: '3. Cut & Cold-Packed',
      actionLabel: 'Dispatch to Courier',
      nextStatus: 'OUT_FOR_DELIVERY',
      color: 'border-blue-400',
      badgeBg: 'bg-blue-100 text-blue-900',
    },
    {
      status: 'OUT_FOR_DELIVERY',
      title: '4. Out for Delivery',
      actionLabel: 'Confirm Delivered',
      nextStatus: 'DELIVERED',
      color: 'border-purple-400',
      badgeBg: 'bg-purple-100 text-purple-900',
    },
    {
      status: 'DELIVERED',
      title: '5. Delivered',
      actionLabel: 'Completed',
      nextStatus: null,
      color: 'border-emerald-400',
      badgeBg: 'bg-emerald-100 text-emerald-900',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Title & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
            <Scissors className="w-4 h-4 text-amber-600" />
            <span>Perishable Lifecycle Kanban</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            Fulfillment & Cold-Chain Dispatch
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Transition orders through strict post-harvest states with integrated Gemini AI perishability alerts.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setFilterView('KANBAN')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterView === 'KANBAN' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setFilterView('LIST')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterView === 'LIST' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            List View
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="bg-slate-200 rounded-2xl h-96"></div>
          ))}
        </div>
      ) : filterView === 'KANBAN' ? (
        
        /* Operational Kanban Columns */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
          {columns.map((col) => {
            const colItems = orderItems.filter((it) => it.status === col.status);

            return (
              <div 
                key={col.status} 
                className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200/80 space-y-3 min-h-[500px] flex flex-col"
              >
                {/* Column Title */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-bold text-xs text-slate-800">{col.title}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${col.badgeBg}`}>
                    {colItems.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3 flex-1">
                  {colItems.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic text-center py-8">
                      No stems in this stage
                    </p>
                  ) : (
                    colItems.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm space-y-3 hover:border-slate-300 transition-all text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-mono text-[10px] text-slate-400 font-bold block truncate">
                            {item.order_id}
                          </span>
                          <span className="text-[11px] font-bold text-slate-900 shrink-0">
                            Qty: {item.quantity}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-serif font-bold text-sm text-slate-900 leading-snug">
                            {item.product?.title || 'Floral Stem'}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Stem: <strong className="text-slate-700">{item.product?.stem_type}</strong>
                          </p>
                        </div>

                        {/* AI Perishability Alert Pill */}
                        {item.risk_assessment && (
                          <div className="pt-1">
                            <PerishabilityAlertCard risk={item.risk_assessment} />
                          </div>
                        )}

                        {/* Transition Action Button */}
                        {col.nextStatus && (
                          <button
                            type="button"
                            disabled={transitionMutation.isPending}
                            onClick={() =>
                              transitionMutation.mutate({
                                itemId: item.id,
                                newStatus: col.nextStatus!,
                              })
                            }
                            className="w-full py-2 bg-botanical-800 hover:bg-botanical-900 text-white rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <span>{col.actionLabel}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        
        /* List View */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {orderItems.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-slate-400">{item.order_id}</span>
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-amber-50 text-amber-800 border border-amber-200">
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="font-serif text-sm font-bold text-slate-900">{item.product?.title}</h4>
                  <p className="text-slate-500">Stem: {item.product?.stem_type} • Qty: {item.quantity}</p>
                </div>

                <div className="flex items-center gap-4">
                  {item.risk_assessment && (
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                      Risk: {item.risk_assessment.risk_level} ({item.risk_assessment.risk_score}/100)
                    </span>
                  )}

                  {/* Actions based on status */}
                  {item.status === 'PENDING' && (
                    <button
                      onClick={() => transitionMutation.mutate({ itemId: item.id, newStatus: 'ACCEPTED' })}
                      className="px-4 py-2 bg-botanical-800 text-white font-bold rounded-xl text-xs hover:bg-botanical-900"
                    >
                      Accept Order
                    </button>
                  )}
                  {item.status === 'ACCEPTED' && (
                    <button
                      onClick={() => transitionMutation.mutate({ itemId: item.id, newStatus: 'CUT_PACKED' })}
                      className="px-4 py-2 bg-amber-700 text-white font-bold rounded-xl text-xs hover:bg-amber-800"
                    >
                      Mark Cut & Packed
                    </button>
                  )}
                  {item.status === 'CUT_PACKED' && (
                    <button
                      onClick={() => transitionMutation.mutate({ itemId: item.id, newStatus: 'OUT_FOR_DELIVERY' })}
                      className="px-4 py-2 bg-blue-700 text-white font-bold rounded-xl text-xs hover:bg-blue-800"
                    >
                      Dispatch
                    </button>
                  )}
                  {item.status === 'OUT_FOR_DELIVERY' && (
                    <button
                      onClick={() => transitionMutation.mutate({ itemId: item.id, newStatus: 'DELIVERED' })}
                      className="px-4 py-2 bg-emerald-700 text-white font-bold rounded-xl text-xs hover:bg-emerald-800"
                    >
                      Confirm Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
