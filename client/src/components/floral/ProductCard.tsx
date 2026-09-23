import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FlowerProduct } from '../../shared/types';
import { FreshnessBadge } from '../common/FreshnessBadge';
import { useCartStore } from '../../stores/useCartStore';
import { ShoppingBag, Star, Check, MapPin, Store } from 'lucide-react';

interface Props {
  product: FlowerProduct;
}

export const ProductCard: React.FC<Props> = ({ product }) => {
  const addItem = useCartStore((s) => s.addItem);
  const currentPin = useCartStore((s) => s.recipientPinCode);
  const [added, setAdded] = useState(false);

  const isServiceable = product.vendor?.service_pincodes.includes(currentPin.trim());

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const primaryImage = product.images[0] || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-botanical-300 hover:shadow-xl hover:shadow-botanical-900/5 transition-all duration-300 flex flex-col justify-between">
      
      {/* Product Image & Badges */}
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={primaryImage}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none gap-2">
          <FreshnessBadge
            freshnessClass={product.freshness_class}
            hours={product.freshness_window_hours}
            className="shadow-sm backdrop-blur-md"
          />
          {product.vendor && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-slate-800 shadow-sm border border-slate-100">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>{product.vendor.rating.toFixed(1)}</span>
            </span>
          )}
        </div>

        {/* Serviceability Banner */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          {isServiceable ? (
            <span className="px-2 py-1 rounded-md text-[10px] font-semibold bg-emerald-950/80 text-emerald-200 backdrop-blur-md flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>Services PIN {currentPin}</span>
            </span>
          ) : (
            <span className="px-2 py-1 rounded-md text-[10px] font-semibold bg-slate-900/80 text-slate-300 backdrop-blur-md flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>Check Radius</span>
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Vendor name */}
          {product.vendor && (
            <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-1">
              <Store className="w-3 h-3 text-botanical-600" />
              <span className="truncate">{product.vendor.store_name}</span>
            </p>
          )}

          {/* Product Title */}
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-serif text-base font-bold text-slate-900 group-hover:text-botanical-800 transition-colors line-clamp-1">
              {product.title}
            </h3>
          </Link>

          {/* Stem type specification */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
            Stem: <span className="text-slate-700 font-medium">{product.stem_type}</span>
          </p>
        </div>

        {/* Price & Quick Add */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-lg font-bold text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!product.is_available || product.stock_quantity === 0}
            className={`p-2.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all shadow-sm ${
              added
                ? 'bg-emerald-600 text-white'
                : 'bg-botanical-50 text-botanical-800 hover:bg-botanical-800 hover:text-white border border-botanical-200'
            }`}
            title="Quick add 1 bouquet to cart"
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
