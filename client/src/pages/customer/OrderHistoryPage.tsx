import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useAuthStore } from '../../stores/useAuthStore';
import { 
  Package, 
  Truck, 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowRight,
  ShoppingBag
} from 'lucide-react';

export const OrderHistoryPage: React.FC = () => {
  const { user } = useAuthStore();
  const customerId = user?.id || 'c1111111-1111-4111-8111-111111111111';

  const { data: orders, isLoading } = useQuery({
    queryKey: ['customer-orders', customerId],
    queryFn: () => api.getOrders(customerId),
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <h1 className="font-serif text-3xl font-bold text-slate-900">Your Fresh Orders</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review live fulfillment statuses, stem longevity guides, and courier tracking.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-slate-200 rounded-3xl h-40"></div>
          ))}
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm max-w-md mx-auto">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-slate-800">No Past Orders Found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">You haven't booked any floral deliveries yet.</p>
          <Link to="/catalog" className="px-5 py-2.5 bg-botanical-800 text-white rounded-xl text-xs font-semibold">
            Browse Stems
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => {
            const itemCount = ord.items?.length || 0;
            const primaryItem = ord.items?.[0];
            const status = primaryItem?.status || 'PENDING';

            return (
              <div 
                key={ord.id} 
                className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-botanical-300 transition-all shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {ord.id}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(ord.created_at).toLocaleDateString()}</span>
                    </span>
                  </div>

                  <p className="text-sm font-serif font-bold text-slate-900">
                    {primaryItem?.product?.title || 'Floral Arrangement'} 
                    {itemCount > 1 && <span className="text-slate-500 font-sans text-xs"> + {itemCount - 1} more stem(s)</span>}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-botanical-600" />
                      <span>PIN {ord.delivery_address.pin_code}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-botanical-600" />
                      <span>Slot: {ord.scheduled_slot.replace('_', ' ')}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full md:w-auto gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] text-slate-400 block font-medium">Total Paid</span>
                    <strong className="text-lg font-bold text-slate-950">₹{ord.total_amount.toLocaleString('en-IN')}</strong>
                  </div>

                  <Link
                    to={`/orders/${ord.id}`}
                    className="px-5 py-2.5 bg-botanical-800 hover:bg-botanical-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm group"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Track Stems</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
