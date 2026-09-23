import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useAuthStore } from '../../stores/useAuthStore';
import { 
  Store, 
  MapPin, 
  Save, 
  Plus, 
  X, 
  Clock, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

export const VendorSettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { vendor } = useAuthStore();
  const vendorId = vendor?.id || 'f1111111-1111-4111-8111-111111111111';

  const { data: vendorDetails, isLoading } = useQuery({
    queryKey: ['vendor-details', vendorId],
    queryFn: () => api.getVendorById(vendorId),
  });

  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [servicePincodes, setServicePincodes] = useState<string[]>([]);
  const [newPin, setNewPin] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state once data is loaded
  React.useEffect(() => {
    if (vendorDetails) {
      setStoreName(vendorDetails.store_name);
      setDescription(vendorDetails.description || '');
      setAddress(vendorDetails.address);
      setCity(vendorDetails.city);
      setServicePincodes(vendorDetails.service_pincodes || []);
    }
  }, [vendorDetails]);

  const updateMutation = useMutation({
    mutationFn: (updates: any) => api.updateVendorSettings(vendorId, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vendor-details', vendorId] });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    },
  });

  const handleAddPin = () => {
    const clean = newPin.trim();
    if (!/^\d{6}$/.test(clean)) {
      alert('PIN code must be 6 digits');
      return;
    }
    if (!servicePincodes.includes(clean)) {
      setServicePincodes([...servicePincodes, clean]);
      setNewPin('');
    }
  };

  const handleRemovePin = (pinToRemove: string) => {
    setServicePincodes(servicePincodes.filter((p) => p !== pinToRemove));
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      store_name: storeName,
      description,
      address,
      city,
      service_pincodes: servicePincodes,
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-pulse">
        <div className="w-12 h-12 rounded-full bg-slate-200 mx-auto mb-4"></div>
        <p className="text-xs text-slate-500">Loading store settings & logistics parameters...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
          <Store className="w-4 h-4 text-amber-600" />
          <span>Fulfillment Hub Configuration</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-slate-900">
          Florist Store & Service Radius Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure micro-serviceable pin codes, cutting cutoff limits, and cold storage location.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Settings and service pin codes updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 text-xs">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Store / Grower Guild Name</label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-botanical-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Hub City</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-botanical-600"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Cold-Storage Facility Address</label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-botanical-600"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Store Profile Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-botanical-600 resize-none"
          />
        </div>

        {/* Hyperlocal Serviceable PIN Codes */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div>
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-botanical-600" />
              <span>Hyperlocal Serviceable PIN Codes</span>
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Customers can only checkout items from your store if their delivery pin code is in this allowlist.
            </p>
          </div>

          {/* Add pin input */}
          <div className="flex gap-2 max-w-sm">
            <input
              type="text"
              maxLength={6}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit PIN"
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono font-bold focus:outline-none focus:border-botanical-600"
            />
            <button
              type="button"
              onClick={handleAddPin}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add PIN</span>
            </button>
          </div>

          {/* Current Pin Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {servicePincodes.map((pin) => (
              <span
                key={pin}
                className="px-3 py-1.5 rounded-xl bg-botanical-50 text-botanical-900 border border-botanical-200 font-mono font-bold text-xs flex items-center gap-2 shadow-sm"
              >
                <span>{pin}</span>
                <button
                  type="button"
                  onClick={() => handleRemovePin(pin)}
                  className="p-0.5 hover:bg-botanical-200 rounded-full text-botanical-700 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-6 py-2.5 bg-botanical-800 hover:bg-botanical-900 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{updateMutation.isPending ? 'Updating...' : 'Save Configuration'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
