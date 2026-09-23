import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Flower2, 
  ShoppingBag, 
  Truck, 
  Store, 
  ShieldCheck, 
  User, 
  ChevronDown, 
  Check, 
  Sparkles,
  MapPin
} from 'lucide-react';
import { useCartStore } from '../../stores/useCartStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { UserRole } from '../../shared/types';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const itemCount = useCartStore((s) => s.getItemCount());
  const recipientPin = useCartStore((s) => s.recipientPinCode);
  const isPinVerified = useCartStore((s) => s.isPinCodeVerified);
  
  const { user, switchRole, isLoading } = useAuthStore();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roles: Array<{ role: UserRole; label: string; icon: any; color: string; desc: string }> = [
    {
      role: 'CUSTOMER',
      label: 'Customer View',
      icon: User,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      desc: 'Browse, select puja slots, multi-vendor cart & tracking',
    },
    {
      role: 'VENDOR',
      label: 'Florist Portal',
      icon: Store,
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      desc: 'Manage cuts, stock sync, operational Kanban & AI risk assessor',
    },
    {
      role: 'ADMIN',
      label: 'Logistics Admin',
      icon: ShieldCheck,
      color: 'text-purple-700 bg-purple-50 border-purple-200',
      desc: 'Global GMV, vendor onboarding verification & platform commission',
    },
  ];

  const handleRoleChange = async (targetRole: UserRole) => {
    setRoleMenuOpen(false);
    await switchRole(targetRole);
    if (targetRole === 'VENDOR') {
      navigate('/vendor/dashboard');
    } else if (targetRole === 'ADMIN') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  const currentRole = user?.role || 'CUSTOMER';

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-botanical-800 to-botanical-600 flex items-center justify-center text-white shadow-md shadow-botanical-900/10 group-hover:scale-105 transition-transform">
              <Flower2 className="w-6 h-6 animate-pulse-subtle" />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                FreshFlora
                <span className="text-xs font-sans font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-botanical-100 text-botanical-800 border border-botanical-200">
                  Cold-Chain AI
                </span>
              </span>
              <p className="text-[11px] text-slate-500 font-medium">Hyperlocal Floral Marketplace & Longevity Intel</p>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'text-botanical-700 font-semibold' : 'text-slate-600 hover:text-botanical-700'
              }`}
            >
              Marketplace
            </Link>
            <Link
              to="/catalog"
              className={`text-sm font-medium transition-colors ${
                location.pathname.startsWith('/catalog') ? 'text-botanical-700 font-semibold' : 'text-slate-600 hover:text-botanical-700'
              }`}
            >
              Floral Catalog
            </Link>
            <Link
              to="/orders"
              className={`text-sm font-medium flex items-center gap-1.5 transition-colors ${
                location.pathname.startsWith('/orders') ? 'text-botanical-700 font-semibold' : 'text-slate-600 hover:text-botanical-700'
              }`}
            >
              <Truck className="w-4 h-4 text-botanical-600" />
              <span>Track Orders</span>
            </Link>
          </nav>

          {/* Right Header Actions: Pin Code, Role Switcher, Cart */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Quick Pin-code display */}
            <Link 
              to="/catalog" 
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 text-xs font-medium text-slate-700 transition-colors"
              title="Change Delivery Pin Code"
            >
              <MapPin className="w-3.5 h-3.5 text-botanical-600" />
              <span>PIN: <strong className="text-slate-900">{recipientPin}</strong></span>
              {isPinVerified && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
            </Link>

            {/* Multi-Role RBAC Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  currentRole === 'VENDOR' 
                    ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                    : currentRole === 'ADMIN'
                    ? 'bg-purple-50 text-purple-900 border-purple-300 hover:bg-purple-100'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full animate-ping bg-current" />
                <span className="capitalize">{currentRole.toLowerCase()} Mode</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Switch Application Role</p>
                    <p className="text-xs text-slate-600">Simulate any persona in this marketplace</p>
                  </div>
                  <div className="p-1.5 space-y-1">
                    {roles.map((r) => {
                      const Icon = r.icon;
                      const active = currentRole === r.role;
                      return (
                        <button
                          key={r.role}
                          onClick={() => handleRoleChange(r.role)}
                          disabled={isLoading}
                          className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-start gap-3 ${
                            active ? 'bg-slate-100 text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className={`p-2 rounded-lg border ${r.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold">{r.label}</span>
                              {active && <Check className="w-3.5 h-3.5 text-botanical-700" />}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{r.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full bg-botanical-800 hover:bg-botanical-900 text-white transition-all shadow-sm shadow-botanical-900/20 group"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {itemCount}
                </span>
              )}
            </Link>

          </div>
        </div>
      </div>
    </header>
  );
};
