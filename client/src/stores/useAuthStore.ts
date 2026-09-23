// =========================================================================
// ZUSTAND AUTH STORE: RBAC SESSION & INSTANT ROLE SWITCHING
// =========================================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Profile, VendorProfile, UserRole } from '../shared/types';
import { api } from '../services/api';

interface AuthState {
  user: Profile | null;
  vendor: VendorProfile | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, role?: UserRole) => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  logout: () => void;
  setUser: (user: Profile, vendor?: VendorProfile, token?: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        id: 'c1111111-1111-4111-8111-111111111111',
        email: 'customer@freshflora.com',
        full_name: 'Ananya Sharma',
        phone: '+91 98765 43210',
        role: 'CUSTOMER',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      vendor: null,
      token: 'demo-token-customer',
      isLoading: false,
      error: null,

      login: async (email, role) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.login(email, role);
          set({
            user: res.user,
            vendor: res.vendor || null,
            token: res.token,
            isLoading: false,
          });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },

      switchRole: async (targetRole) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.switchRole(targetRole);
          set({
            user: res.user,
            vendor: res.vendor || null,
            token: res.token,
            isLoading: false,
          });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },

      logout: () => {
        set({ user: null, vendor: null, token: null });
      },

      setUser: (user, vendor, token) => {
        set({ user, vendor: vendor || null, token: token || null });
      },
    }),
    {
      name: 'freshflora-auth-session',
    }
  )
);
