import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { CareGuideModal } from '../../components/floral/CareGuideModal';
import { FloralCareGuide } from '../../shared/types';
import { 
  CheckCircle2, 
  Truck, 
  Sparkles, 
  Store, 
  MapPin, 
  Clock, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  Droplet
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const [activeCareGuide, setActiveCareGuide] = useState<FloralCareGuide | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => api.getOrderById(orderId!),
    enabled: Boolean(orderId),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center animate-pulse">
        <div className="w-16 h-16 rounded-full bg-slate-200 mx-auto mb-4"></div>
        <p className="text-xs text-slate-500">Generating multi-vendor fulfillment tickets & AI care advisory...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-2xl font-bold text-slate-900">Order Not Found</h2>
        <Link to="/orders" className="mt-4 inline-block text-xs font-semibold text-botanical-800 underline">
          View Past Orders
        </Link>
      </div>
    );
  }

  // Group items by vendor
  const vendorGroupsMap = new Map<string, typeof order.items>();
  for (const item of order.items || []) {
    const vId = item.vendor_id;
    if (!vendorGroupsMap.has(vId)) {
      vendorGroupsMap.set(vId, []);
    }
    vendorGroupsMap.get(vId)!.push(item);
  }
  const vendorSubOrders = Array.from(vendorGroupsMap.entries());

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-botanical-900 via-botanical-800 to-botanical-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Payment Authorized • Stock Reserved</span>
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold">
              Thank You! Your Stems Are Scheduled for Cut.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 font-light">
              Order ID: <strong className="font-mono text-white">{order.id}</strong> • Ref: {order.payment_reference}
            </p>
          </div>

          <Link
            to={`/orders/${order.id}`}
            className="px-6 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 shrink-0 group"
          >
            <Truck className="w-4 h-4" />
            <span>Track Live Delivery</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Multi-Vendor Sub-Orders Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Multi-Vendor Sub-Orders ({vendorSubOrders.length})
            </h2>
            <p className="text-xs text-slate-500">
              Each florist has received their partitioned dispatch ticket and hydration guidelines.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {vendorSubOrders.map(([vId, items]) => {
            const vendor = items?.[0]?.vendor;
            return (
              <div key={vId} className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
                
                {/* Vendor Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-botanical-100 text-botanical-800 flex items-center justify-center">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{vendor?.store_name || 'Florist'}</h4>
                      <p className="text-[11px] text-slate-500">{vendor?.city}</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    Status: {items?.[0]?.status || 'PENDING'}
                  </span>
                </div>

                {/* Items */}
                <div className="divide-y divide-slate-100">
                  {items?.map((item) => (
                    <div key={item.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=80'}
                          alt=""
                          className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0"
                        />
                        <div>
                          <p className="font-serif text-sm font-bold text-slate-900">{item.product?.title}</p>
                          <p className="text-xs text-slate-500">Qty: {item.quantity} • ₹{item.unit_price} each</p>
                        </div>
                      </div>

                      {/* AI Care Guide Button if attached */}
                      {item.care_advisory && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCareGuide(item.care_advisory!);
                            setModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-botanical-50 hover:bg-botanical-100 text-botanical-900 border border-botanical-200 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          <span>View Gemini 2.5 Flash Care Protocol</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Recipient Address & Schedule Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Delivery Destination</h4>
          <p className="font-bold text-sm text-slate-900">{order.delivery_address.recipient_name}</p>
          <p className="text-xs text-slate-600 leading-relaxed">
            {order.delivery_address.street}, {order.delivery_address.city}, {order.delivery_address.state} - <strong>{order.delivery_address.pin_code}</strong>
          </p>
          <p className="text-xs text-slate-500">Phone: {order.delivery_address.phone}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Guaranteed Time Slot</h4>
          <p className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-botanical-600" />
            <span>Slot: {order.scheduled_slot.replace('_', ' ')}</span>
          </p>
          <p className="text-xs text-slate-600 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Delivery Date: {order.delivery_date}</span>
          </p>
          {order.gift_message && (
            <p className="text-xs text-slate-500 italic pt-2 border-t border-slate-100">
              "{order.gift_message}"
            </p>
          )}
        </div>
      </div>

      {/* Care Guide Modal */}
      <CareGuideModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        guide={activeCareGuide}
        bouquetTitle="Your Ordered Bouquet"
      />

    </div>
  );
};
