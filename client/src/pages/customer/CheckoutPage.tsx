import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../../stores/useCartStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { api } from '../../services/api';
import { DeliverySlotType } from '../../shared/types';
import { DeliverySlotSelector } from '../../components/common/DeliverySlotSelector';
import { 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Building2, 
  Banknote, 
  Lock, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  MapPin, 
  Gift 
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getTotal, getSubtotal, recipientPinCode, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [recipientName, setRecipientName] = useState(user?.full_name || 'Ananya Sharma');
  const [recipientPhone, setRecipientPhone] = useState(user?.phone || '+91 98765 43210');
  const [streetAddress, setStreetAddress] = useState('Flat 402, Sea Pearl Towers, Carter Road');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [pinCode, setPinCode] = useState(recipientPinCode || '400001');
  const [deliverySlot, setDeliverySlot] = useState<DeliverySlotType>('MORNING_SLOT');
  const [giftMessage, setGiftMessage] = useState('With love and fragrant blessings for a beautiful day.');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_DEBIT_CARD' | 'UPI' | 'NET_BANKING' | 'CASH_ON_DELIVERY'>('UPI');

  // Simulated Card State
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('342');
  const [cardName, setCardName] = useState('Ananya Sharma');

  // Simulated UPI State
  const [upiId, setUpiId] = useState('ananya@okhdfcbank');

  const total = getTotal() + 99; // Total + 99 courier fee

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('Your cart is empty');
      return;
    }

    if (!/^\d{6}$/.test(pinCode.trim())) {
      setErrorMsg('Pin code must be exactly 6 digits');
      return;
    }

    setLoading(true);

    try {
      const tomorrow = new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0];

      const orderPayload = {
        customer_id: user?.id || 'c1111111-1111-4111-8111-111111111111',
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
        })),
        delivery_address: {
          recipient_name: recipientName.trim(),
          phone: recipientPhone.trim(),
          street: streetAddress.trim(),
          city: city.trim(),
          state: state.trim(),
          pin_code: pinCode.trim(),
        },
        scheduled_slot: deliverySlot,
        delivery_date: tomorrow,
        gift_message: giftMessage.trim() || null,
        payment_method: paymentMethod,
      };

      const createdOrder = await api.createOrder(orderPayload);
      clearCart();
      navigate(`/order-success/${createdOrder.id}`);
    } catch (err: any) {
      console.error('Order creation error:', err);
      setErrorMsg(err.message || 'Failed to place order. Please review your address or pin code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-botanical-800 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Cart</span>
      </Link>

      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900">
          Checkout & Cold-Chain Dispatch
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Guaranteed hyperlocal delivery with temperature-controlled transit packaging.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Address, Slot, Gift Message, Payment */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Step 1: Delivery Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-botanical-100 text-botanical-800 font-bold text-xs flex items-center justify-center">
                1
              </div>
              <h3 className="font-serif text-base font-bold text-slate-900">Recipient & Delivery Address</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-botanical-600 bg-slate-50/50"
                  autoComplete="shipping name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Recipient Mobile Phone</label>
                <input
                  type="tel"
                  required
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-botanical-600 bg-slate-50/50"
                  autoComplete="shipping tel"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address / Society / Flat No</label>
                <textarea
                  rows={2}
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-botanical-600 bg-slate-50/50 resize-none"
                  autoComplete="shipping street-address"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-botanical-600 bg-slate-50/50"
                  autoComplete="shipping address-level2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Postal PIN Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-botanical-600 bg-slate-50/50 font-mono font-bold"
                  autoComplete="shipping postal-code"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Slot & Personal Gift Message */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-botanical-100 text-botanical-800 font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h3 className="font-serif text-base font-bold text-slate-900">Delivery Schedule & Message</h3>
            </div>

            <DeliverySlotSelector
              selectedSlot={deliverySlot}
              onChange={setDeliverySlot}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-rose-500" />
                <span>Complimentary Floral Card Message (Max 250 chars)</span>
              </label>
              <textarea
                rows={2}
                maxLength={250}
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                placeholder="Write your wishes to be hand-inscribed on our botanical card..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-botanical-600 bg-slate-50/50 resize-none"
              />
              <span className="text-[10px] text-slate-400 text-right block">{giftMessage.length}/250 chars</span>
            </div>
          </div>

          {/* Step 3: Payment Gateway Simulation */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-botanical-100 text-botanical-800 font-bold text-xs flex items-center justify-center">
                  3
                </div>
                <h3 className="font-serif text-base font-bold text-slate-900">Simulated Payment Gateway</h3>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>256-Bit Encrypted</span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-botanical-700 bg-botanical-50/80 text-botanical-900 ring-2 ring-botanical-600/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <QrCode className="w-4 h-4 text-botanical-700" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CREDIT_DEBIT_CARD')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'CREDIT_DEBIT_CARD'
                    ? 'border-botanical-700 bg-botanical-50/80 text-botanical-900 ring-2 ring-botanical-600/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4 text-botanical-700" />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NET_BANKING')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'NET_BANKING'
                    ? 'border-botanical-700 bg-botanical-50/80 text-botanical-900 ring-2 ring-botanical-600/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Building2 className="w-4 h-4 text-botanical-700" />
                <span>NetBanking</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'border-botanical-700 bg-botanical-50/80 text-botanical-900 ring-2 ring-botanical-600/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Banknote className="w-4 h-4 text-botanical-700" />
                <span>Pay on Drop</span>
              </button>
            </div>

            {/* Method Details */}
            {paymentMethod === 'UPI' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <label className="block text-xs font-semibold text-slate-700">Virtual Payment Address (VPA)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@okhdfcbank"
                    className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                  />
                  <span className="px-3 py-2 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Instant authorization webhook simulated on submit.
                </p>
              </div>
            )}

            {paymentMethod === 'CREDIT_DEBIT_CARD' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                    autoComplete="cc-number"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Expiry Date (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                      autoComplete="cc-exp"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Security Code (CVV)</label>
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                      autoComplete="cc-csc"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'NET_BANKING' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
                <p className="font-semibold text-slate-800 mb-1">Select Bank for Mock Payment</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <span className="p-2 rounded-lg bg-white border border-slate-200 text-center font-bold text-slate-700">HDFC Bank</span>
                  <span className="p-2 rounded-lg bg-white border border-slate-200 text-center font-bold text-slate-700">ICICI Bank</span>
                  <span className="p-2 rounded-lg bg-white border border-slate-200 text-center font-bold text-slate-700">State Bank of India</span>
                  <span className="p-2 rounded-lg bg-white border border-slate-200 text-center font-bold text-slate-700">Axis Bank</span>
                </div>
              </div>
            )}

            {paymentMethod === 'CASH_ON_DELIVERY' && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <p className="font-semibold">Cash on Doorstep Delivery</p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Keep exact change ready. Order items remain marked as UNPAID until delivery boy verifies cash collection.
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Right: Cart Summary Review & Place Order Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
            <h3 className="font-serif text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Items in this Shipment ({items.length})
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((it) => (
                <div key={it.product.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={it.product.images[0] || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=80'}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{it.product.title}</p>
                    <p className="text-[11px] text-slate-500">Qty: {it.quantity} • By {it.product.vendor?.store_name}</p>
                  </div>
                  <span className="font-bold text-slate-900">₹{(it.product.price * it.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Stems Subtotal</span>
                <span>₹{getSubtotal().toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Direct Cold Courier</span>
                <span>₹99</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total Payable</span>
                <span className="text-2xl font-bold text-slate-950">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Submit Order Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-botanical-800 hover:bg-botanical-900 disabled:bg-slate-300 text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-botanical-900/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Splitting & Dispatching Orders...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Place Order • ₹{total.toLocaleString('en-IN')}</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              By confirming, this order will be atomically partitioned into discrete vendor tickets. Stock is reserved instantly.
            </p>

          </div>
        </div>

      </form>

    </div>
  );
};
