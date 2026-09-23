import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useCartStore } from '../../stores/useCartStore';
import { FreshnessBadge } from '../../components/common/FreshnessBadge';
import { DeliverySlotSelector } from '../../components/common/DeliverySlotSelector';
import { CareGuideModal } from '../../components/floral/CareGuideModal';
import { DeliverySlotType, FloralCareGuide } from '../../shared/types';
import { 
  Store, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Droplet, 
  Clock, 
  Check, 
  ShoppingBag, 
  ArrowLeft, 
  AlertCircle,
  Loader2
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const currentPin = useCartStore((s) => s.recipientPinCode);
  const setPinCode = useCartStore((s) => s.setRecipientPinCode);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState<DeliverySlotType>('STANDARD_DAY');
  const [pinInput, setPinInput] = useState(currentPin);
  const [pinChecked, setPinChecked] = useState(false);
  const [isServiceable, setIsServiceable] = useState(true);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // AI Care Guide Modal State
  const [careModalOpen, setCareModalOpen] = useState(false);
  const [careGuide, setCareGuide] = useState<FloralCareGuide | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.getProductById(id!),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="w-12 h-12 rounded-full bg-slate-200 mx-auto mb-4"></div>
        <p className="text-xs text-slate-500">Retrieving cold-chain stem details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="font-serif text-2xl font-bold text-slate-900">Floral Product Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">The requested botanical arrangement is unavailable or has expired.</p>
        <Link to="/catalog" className="px-5 py-2.5 bg-botanical-800 text-white rounded-xl text-xs font-semibold">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const handlePinCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pinInput)) {
      alert('Please enter a 6-digit pin code');
      return;
    }
    const services = product.vendor?.service_pincodes.includes(pinInput) || false;
    setIsServiceable(services);
    setPinChecked(true);
    setPinCode(pinInput, services, services ? 1 : 0);
  };

  const handleAddToCart = () => {
    addItem(product, quantity, selectedSlot);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      navigate('/cart');
    }, 700);
  };

  const handleOpenAiCareGuide = async () => {
    if (careGuide) {
      setCareModalOpen(true);
      return;
    }
    setLoadingAi(true);
    try {
      const guide = await api.getFloralCareGuide({
        bouquetTitle: product.title,
        stemTypes: [product.stem_type],
        freshnessClass: product.freshness_class,
      });
      setCareGuide(guide);
      setCareModalOpen(true);
    } catch (err) {
      console.error('Failed to load care guide:', err);
    } finally {
      setLoadingAi(false);
    }
  };

  const images = product.images.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back button */}
      <Link to="/catalog" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-botanical-800 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Floral Catalog</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left: High-Resolution Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md">
            <img
              src={images[activeImageIndex]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <FreshnessBadge
                freshnessClass={product.freshness_class}
                hours={product.freshness_window_hours}
                className="shadow-md"
              />
            </div>
            {product.origin && (
              <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-slate-950/70 text-slate-200 text-xs font-semibold backdrop-blur-md flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Origin: {product.origin}</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx ? 'border-botanical-600 ring-2 ring-botanical-600/30' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Stem Composition Breakdown Card */}
          {product.stem_composition && product.stem_composition.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm mt-8">
              <h4 className="font-serif text-lg font-bold text-slate-900 mb-1">
                Stem Composition & Botanical Anatomy
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Each bouquet is hand-assembled with calibrated stem ratios for balanced water absorption and staggered blooming.
              </p>

              <div className="divide-y divide-slate-100">
                {product.stem_composition.map((stem, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{stem.stem_name}</span>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700">
                        {stem.count} Stems
                      </span>
                      <FreshnessBadge freshnessClass={stem.perishability} showIcon={false} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right: Booking & Fulfillment Actions */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            
            {/* Florist Badge */}
            {product.vendor && (
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-botanical-100 text-botanical-800 flex items-center justify-center">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{product.vendor.store_name}</h4>
                    <p className="text-[11px] text-slate-500">{product.vendor.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-800 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{product.vendor.rating.toFixed(1)}</span>
                </div>
              </div>
            )}

            {/* Title & Price */}
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                {product.title}
              </h2>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Stem: <strong className="text-slate-800">{product.stem_type}</strong>
              </p>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-slate-950">₹{product.price.toLocaleString('en-IN')}</span>
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                  Includes Cold-Chain Aqua Pack
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Pin Code Delivery Estimator */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Hyperlocal Delivery Verification
              </label>
              <form onSubmit={handlePinCheck} className="flex gap-2">
                <input
                  type="text"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit PIN"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-botanical-600"
                  maxLength={6}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Verify
                </button>
              </form>

              {pinChecked && (
                <div className={`p-2 rounded-xl text-[11px] font-medium ${isServiceable ? 'text-emerald-700 bg-emerald-100/70' : 'text-rose-700 bg-rose-100/70'}`}>
                  {isServiceable 
                    ? `✓ Serviceable at ${pinInput}. Rapid cold courier available.`
                    : `✕ Florist does not deliver to ${pinInput}. Supported: ${product.vendor?.service_pincodes.join(', ')}`}
                </div>
              )}
            </div>

            {/* Delivery Slot Selector */}
            <DeliverySlotSelector
              selectedSlot={selectedSlot}
              onChange={setSelectedSlot}
            />

            {/* Quantity & Add to Cart */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-slate-700 hover:bg-slate-200 text-sm font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-bold text-slate-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="px-3 py-2 text-slate-700 hover:bg-slate-200 text-sm font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!product.is_available || product.stock_quantity === 0}
                  className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                    addedAnimation
                      ? 'bg-emerald-600 text-white'
                      : 'bg-botanical-800 hover:bg-botanical-900 text-white shadow-botanical-900/20'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Add to Cart • ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                    </>
                  )}
                </button>
              </div>

              {/* AI Stem Care Intelligence Preview Trigger */}
              <button
                type="button"
                onClick={handleOpenAiCareGuide}
                disabled={loadingAi}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-botanical-50 to-emerald-50 hover:from-botanical-100 hover:to-emerald-100 border border-botanical-200 text-botanical-900 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                {loadingAi ? (
                  <Loader2 className="w-4 h-4 animate-spin text-botanical-700" />
                ) : (
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                )}
                <span>Preview Gemini 2.5 Flash Vase-Life Care Guide</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* AI Care Guide Modal */}
      <CareGuideModal
        isOpen={careModalOpen}
        onClose={() => setCareModalOpen(false)}
        guide={careGuide}
        bouquetTitle={product.title}
      />

    </div>
  );
};
