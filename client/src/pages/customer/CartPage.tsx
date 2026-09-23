import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/useCartStore';
import { FreshnessBadge } from '../../components/common/FreshnessBadge';
import { DeliverySlotSelector } from '../../components/common/DeliverySlotSelector';
import { 
  ShoppingBag, 
  Trash2, 
  Store, 
  MapPin, 
  Tag, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Truck,
  Layers
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    updateItemSlot,
    getVendorGroups, 
    getSubtotal, 
    getDiscountAmount, 
    getTotal, 
    promoCode, 
    applyPromoCode, 
    removePromoCode, 
    recipientPinCode,
    isPinCodeVerified 
  } = useCartStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const vendorGroups = getVendorGroups();
  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const total = getTotal();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const success = applyPromoCode(promoInput);
    if (!success) {
      setPromoError('Invalid coupon. Try "BLOOM10" or "FIRSTVINE15"');
    } else {
      setPromoInput('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-botanical-50 text-botanical-800 flex items-center justify-center mx-auto mb-4 border border-botanical-200">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-slate-900">Your Floral Cart is Empty</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          Explore our collection of Dutch roses, sacred morning puja jasmine, and exotic orchids.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-botanical-800 hover:bg-botanical-900 text-white text-xs font-bold rounded-xl transition-all shadow-md"
        >
          <span>Explore Floral Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
          Shopping Cart & Multi-Vendor Dispatch
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review florist-grouped packages. Individual vendors will cut, pack, and ship according to their micro-schedules.
        </p>
      </div>

      {/* Multi-Vendor Order Splitting Explainer Pill */}
      {vendorGroups.length > 1 && (
        <div className="mb-6 p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 flex items-start gap-3 text-xs">
          <Layers className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-sm block">Automated Multi-Vendor Fulfillment Split</span>
            <span className="text-purple-800 leading-relaxed">
              Your cart contains fresh stems from <strong>{vendorGroups.length} distinct florists</strong>. You pay a single unified invoice, but each florist receives an independent fulfillment ticket with custom cutting & hydration protocols.
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Vendor Groups & Items */}
        <div className="lg:col-span-8 space-y-6">
          {vendorGroups.map((group) => {
            const vendor = group.vendor;
            const isVendorServicing = vendor.service_pincodes.includes(recipientPinCode);

            return (
              <div 
                key={vendor.id} 
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4"
              >
                {/* Vendor Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-botanical-100 text-botanical-800 flex items-center justify-center">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-bold text-slate-900">{vendor.store_name}</h3>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-botanical-600" />
                        <span>Fulfillment Hub: {vendor.city}</span>
                      </p>
                    </div>
                  </div>

                  {/* Serviceability indicator */}
                  <div>
                    {isVendorServicing ? (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <span>Services PIN {recipientPinCode}</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        <span>Unserviceable to PIN {recipientPinCode}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Items in this vendor group */}
                <div className="divide-y divide-slate-100">
                  {group.items.map((item) => (
                    <div key={item.product.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.images[0] || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80'}
                          alt={item.product.title}
                          className="w-16 h-16 rounded-xl object-cover bg-slate-100 shrink-0"
                        />
                        <div>
                          <Link to={`/product/${item.product.id}`} className="font-serif text-sm font-bold text-slate-900 hover:text-botanical-800 transition-colors">
                            {item.product.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-bold text-slate-800">₹{item.product.price.toLocaleString('en-IN')}</span>
                            <FreshnessBadge freshnessClass={item.product.freshness_class} hours={item.product.freshness_window_hours} showIcon={false} />
                          </div>
                        </div>
                      </div>

                      {/* Quantity & Actions */}
                      <div className="flex items-center justify-between w-full sm:w-auto gap-4 self-end sm:self-center">
                        <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50 text-xs font-bold">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2.5 py-1 text-slate-700 hover:bg-slate-200"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-slate-900">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2.5 py-1 text-slate-700 hover:bg-slate-200"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-sm font-bold text-slate-900 w-20 text-right">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

                {/* Sub-order total & slot notes */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    Florist Sub-Order Total:
                  </span>
                  <strong className="text-sm font-bold text-slate-900">
                    ₹{group.subtotal.toLocaleString('en-IN')}
                  </strong>
                </div>

              </div>
            );
          })}
        </div>

        {/* Right: Order Summary Ledger & Checkout Trigger */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
            
            <h3 className="font-serif text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary Ledger
            </h3>

            {/* Price breakdown */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Stems Subtotal</span>
                <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Promotional Discount ({promoCode})</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Cold-Chain Packaging & Aqua-Pack</span>
                <span className="font-semibold text-emerald-700">FREE</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Direct Courier Transit</span>
                <span className="font-semibold text-slate-900">₹99</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total Payable</span>
                <span className="text-2xl font-bold text-slate-950">
                  ₹{(total + 99).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Promo code input */}
            <form onSubmit={handleApplyPromo} className="pt-2">
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Have a Promo Code?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  placeholder="e.g. BLOOM10"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 uppercase font-semibold focus:outline-none focus:border-botanical-600 bg-slate-50"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoError && <p className="text-[11px] text-rose-600 mt-1">{promoError}</p>}
              {promoCode && (
                <div className="mt-2 flex items-center justify-between text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <span>Coupon {promoCode} applied</span>
                  <button type="button" onClick={removePromoCode} className="text-[10px] text-rose-600 underline">
                    Remove
                  </button>
                </div>
              )}
            </form>

            {/* Proceed to checkout button */}
            <button
              type="button"
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-botanical-800 hover:bg-botanical-900 text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-botanical-900/20 flex items-center justify-center gap-2 group"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Guarantee footer */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Guaranteed Freshness on Arrival</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
