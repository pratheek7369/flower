import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useAuthStore } from '../../stores/useAuthStore';
import { FlowerCategory, FlowerProduct } from '../../shared/types';
import { FreshnessBadge } from '../../components/common/FreshnessBadge';
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Clock, 
  AlertTriangle, 
  Loader2 
} from 'lucide-react';

export const VendorInventoryPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { vendor } = useAuthStore();
  const vendorId = vendor?.id || 'f1111111-1111-4111-8111-111111111111';

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<FlowerProduct | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<FlowerCategory>('BOUQUETS');
  const [stemType, setStemType] = useState('');
  const [price, setPrice] = useState(1499);
  const [stockQuantity, setStockQuantity] = useState(30);
  const [freshnessWindowHours, setFreshnessWindowHours] = useState(48);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1000&q=80');
  const [description, setDescription] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['vendor-products', vendorId],
    queryFn: () => api.getProducts({ vendor_id: vendorId }),
  });

  const products = data?.products || [];

  // Update Stock Mutation
  const updateProductMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<FlowerProduct> }) =>
      api.updateProduct(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-products', vendorId] });
      queryClient.invalidateQueries({ queryKey: ['vendor-metrics', vendorId] });
    },
  });

  // Create Product Mutation
  const createProductMutation = useMutation({
    mutationFn: (newProd: any) => api.createProduct(newProd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-products', vendorId] });
      queryClient.invalidateQueries({ queryKey: ['vendor-metrics', vendorId] });
      setModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      alert(`Failed to create product: ${err.message}`);
    },
  });

  // Delete Product Mutation
  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => api.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-products', vendorId] });
    },
  });

  const resetForm = () => {
    setTitle('');
    setCategory('BOUQUETS');
    setStemType('');
    setPrice(1499);
    setStockQuantity(30);
    setFreshnessWindowHours(48);
    setDescription('');
    setEditingProduct(null);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !stemType || !description) {
      alert('Please fill all mandatory fields');
      return;
    }

    if (editingProduct) {
      updateProductMutation.mutate({
        id: editingProduct.id,
        updates: {
          title,
          category,
          stem_type: stemType,
          price,
          stock_quantity: stockQuantity,
          freshness_window_hours: freshnessWindowHours,
          images: [imageUrl],
          description,
        },
      });
      setModalOpen(false);
      resetForm();
    } else {
      createProductMutation.mutate({
        vendor_id: vendorId,
        title,
        category,
        stem_type: stemType,
        price,
        stock_quantity: stockQuantity,
        freshness_window_hours: freshnessWindowHours,
        images: [imageUrl],
        description,
        is_available: true,
      });
    }
  };

  const handleOpenEdit = (p: FlowerProduct) => {
    setEditingProduct(p);
    setTitle(p.title);
    setCategory(p.category);
    setStemType(p.stem_type);
    setPrice(p.price);
    setStockQuantity(p.stock_quantity);
    setFreshnessWindowHours(p.freshness_window_hours);
    setImageUrl(p.images[0] || '');
    setDescription(p.description);
    setModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            <Package className="w-4 h-4 text-botanical-600" />
            <span>Stem Inventory & Availability</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900">
            Floral Inventory Manager
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage live stock counts, cold-chain freshness windows, and availability toggles.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="px-5 py-2.5 bg-botanical-800 hover:bg-botanical-900 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Stem Specimen</span>
        </button>
      </div>

      {/* Inventory Table */}
      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-slate-200 rounded-2xl h-16"></div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3.5 px-6">Product / Stem Details</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Price</th>
                  <th className="py-3.5 px-6">Live Stock</th>
                  <th className="py-3.5 px-6">Freshness Window</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0] || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=80'}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                        />
                        <div>
                          <span className="font-serif font-bold text-sm text-slate-900 block">{p.title}</span>
                          <span className="text-[11px] text-slate-500">Stem: {p.stem_type}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-slate-700 font-medium">
                      {p.category.replace('_', ' ')}
                    </td>

                    <td className="py-4 px-6 font-bold text-slate-900 text-sm">
                      ₹{p.price.toLocaleString('en-IN')}
                    </td>

                    {/* Stock Quick Editor */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateProductMutation.mutate({ id: p.id, updates: { stock_quantity: Math.max(0, p.stock_quantity - 5) } })}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                          title="-5 Stems"
                        >
                          -
                        </button>
                        <span className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                          p.stock_quantity <= 15 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-900'
                        }`}>
                          {p.stock_quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateProductMutation.mutate({ id: p.id, updates: { stock_quantity: p.stock_quantity + 10 } })}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs"
                          title="+10 Stems"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <FreshnessBadge
                        freshnessClass={p.freshness_class}
                        hours={p.freshness_window_hours}
                      />
                    </td>

                    <td className="py-4 px-6">
                      <button
                        type="button"
                        onClick={() => updateProductMutation.mutate({ id: p.id, updates: { is_available: !p.is_available } })}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                          p.is_available && p.stock_quantity > 0
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        {p.is_available && p.stock_quantity > 0 ? 'Active' : 'Disabled'}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-botanical-700 hover:bg-slate-100 transition-colors"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete stem "${p.title}"?`)) {
                              deleteProductMutation.mutate(p.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Stem Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-serif text-xl font-bold text-slate-900">
                {editingProduct ? 'Edit Stem Specimen' : 'Add New Fresh Floral Specimen'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Velvet Grand Prix Dutch Roses"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-botanical-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-botanical-600"
                  >
                    <option value="BOUQUETS">Bouquets</option>
                    <option value="LOOSE_FLOWERS">Loose Puja Flowers</option>
                    <option value="EXOTIC_CUT_STEMS">Exotic Cut Stems</option>
                    <option value="EVENT_DECOR">Event Decor</option>
                    <option value="INDOOR_PLANTS_FLORAL">Indoor Plants</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stem Type</label>
                  <input
                    type="text"
                    required
                    value={stemType}
                    onChange={(e) => setStemType(e.target.value)}
                    placeholder="e.g. Dutch Crimson Rose"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-botanical-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-botanical-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-botanical-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Freshness Window (Hrs)</label>
                  <input
                    type="number"
                    min="6"
                    max="240"
                    required
                    value={freshnessWindowHours}
                    onChange={(e) => setFreshnessWindowHours(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-botanical-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-botanical-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description (Markdown / Text)</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail post-harvest conditioning, scent notes, and stem composition..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-botanical-600 resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createProductMutation.isPending || updateProductMutation.isPending}
                  className="px-6 py-2.5 bg-botanical-800 hover:bg-botanical-900 text-white font-bold rounded-xl transition-colors shadow-sm"
                >
                  {createProductMutation.isPending || updateProductMutation.isPending ? 'Saving...' : 'Save Specimen'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
