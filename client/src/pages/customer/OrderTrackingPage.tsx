import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { CareGuideModal } from '../../components/floral/CareGuideModal';
import { OrderItemStatus, FloralCareGuide } from '../../shared/types';
import { 
  Check, 
  Clock, 
  Scissors, 
  Truck, 
  CheckCircle2, 
  Sparkles, 
  Store, 
  MapPin, 
  ArrowLeft,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const [selectedCareGuide, setSelectedCareGuide] = useState<FloralCareGuide | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-tracking', orderId],
    queryFn: () => api.getOrderById(orderId!),
    enabled: Boolean(orderId),
    refetchInterval: 5000, // Poll every 5s for live status updates from vendor
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center animate-pulse">
        <div className="w-16 h-16 rounded-full bg-slate-200 mx-auto mb-4"></div>
        <p className="text-xs text-slate-500">Connecting to cold-chain dispatch nodes...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="font-serif text-2xl font-bold text-slate-900">Tracking Info Not Found</h2>
        <Link to="/orders" className="mt-4 inline-block text-xs font-semibold text-botanical-800 underline">
          View All Orders
        </Link>
      </div>
    );
  }

  // Calculate overall timeline step based on items
  const statusRanks: Record<OrderItemStatus, number> = {
    PENDING: 1,
    ACCEPTED: 2,
    CUT_PACKED: 3,
    OUT_FOR_DELIVERY: 4,
    DELIVERED: 5,
    CANCELLED: 0,
  };

  const steps = [
    { rank: 1, id: 'PENDING', label: 'Order Placed', desc: 'Payment verified & ledger created', icon: Check },
    { rank: 2, id: 'ACCEPTED', label: 'Florist Accepted', desc: 'Stem availability confirmed', icon: Clock },
    { rank: 3, id: 'CUT_PACKED', label: 'Cut & Packed', desc: 'Underwater stem cut & cold wrap', icon: Scissors },
    { rank: 4, id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Dedicated cold-chain courier', icon: Truck },
    { rank: 5, id: 'DELIVERED', label: 'Delivered Fresh', desc: 'Doorstep handoff verified', icon: CheckCircle2 },
  ];

  // Pick highest or lowest rank among active items
  const activeItems = order.items || [];
  const minRank = activeItems.reduce((acc, it) => Math.min(acc, statusRanks[it.status] || 1), 5);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      <Link to="/orders" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-botanical-800 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Order History</span>
      </Link>

      {/* Header Info */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Real-Time Visual Perishable Delivery Timeline
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Order #{order.id}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Scheduled for <strong>{order.scheduled_slot.replace('_', ' ')}</strong> on {order.delivery_date}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span>Live GPS Telemetry Active</span>
        </div>
      </div>

      {/* 5-Stage Multi-Stop Visual Timeline Stepper */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
        <h3 className="font-serif text-lg font-bold text-slate-900 mb-8 text-center sm:text-left">
          Cold-Chain Transit Progression
        </h3>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
            {steps.map((s) => {
              const Icon = s.icon;
              const isPast = minRank > s.rank;
              const isCurrent = minRank === s.rank;

              let iconBg = 'bg-slate-100 text-slate-400 border-slate-200';
              if (isPast) {
                iconBg = 'bg-botanical-700 text-white border-botanical-800';
              } else if (isCurrent) {
                iconBg = 'bg-emerald-500 text-slate-950 border-emerald-400 ring-4 ring-emerald-100 shadow-md shadow-emerald-500/20';
              }

              return (
                <div key={s.id} className="flex flex-row sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border-2 transition-all ${iconBg} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h5 className={`text-xs font-bold ${isCurrent ? 'text-emerald-800' : isPast ? 'text-slate-900' : 'text-slate-400'}`}>
                      {s.label}
                    </h5>
                    <p className="text-[10px] text-slate-500 hidden sm:block mt-0.5 leading-snug">
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Individual Vendor Sub-Order Cards */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-bold text-slate-900">
          Individual Florist Fulfillment Status
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {order.items?.map((it) => (
            <div key={it.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-botanical-600" />
                  <span className="font-bold text-xs text-slate-900">{it.vendor?.store_name}</span>
                  <span className="text-xs text-slate-400">({it.vendor?.city})</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    Sub-Order Status: {it.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={it.product?.images?.[0] || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=80'}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0"
                  />
                  <div>
                    <h4 className="font-serif text-sm font-bold text-slate-900">{it.product?.title}</h4>
                    <p className="text-xs text-slate-500">Stem: {it.product?.stem_type} • Qty: {it.quantity}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Updated: {new Date(it.status_updated_at).toLocaleTimeString()}</p>
                  </div>
                </div>

                {/* AI Care Guide Trigger if attached */}
                {it.care_advisory && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCareGuide(it.care_advisory!);
                      setModalOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-botanical-50 hover:bg-botanical-100 text-botanical-900 border border-botanical-200 text-xs font-bold flex items-center gap-2 transition-colors self-start sm:self-auto"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>View Gemini 2.5 Flash Care Guide</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recipient Details Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between gap-4 text-xs text-slate-600">
        <div>
          <h4 className="font-bold text-slate-900 text-sm mb-1">Delivering To</h4>
          <p>{order.delivery_address.recipient_name} ({order.delivery_address.phone})</p>
          <p>{order.delivery_address.street}, {order.delivery_address.city} - {order.delivery_address.pin_code}</p>
        </div>

        <div className="text-left sm:text-right">
          <h4 className="font-bold text-slate-900 text-sm mb-1">Total Paid</h4>
          <p className="text-base font-bold text-slate-950">₹{order.total_amount.toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-emerald-700 font-semibold">{order.payment_status}</p>
        </div>
      </div>

      {/* Care Guide Modal */}
      <CareGuideModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        guide={selectedCareGuide}
        bouquetTitle="Your Ordered Bouquet"
      />

    </div>
  );
};
