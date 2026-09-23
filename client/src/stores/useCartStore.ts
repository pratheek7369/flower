// =========================================================================
// ZUSTAND CART STORE: MULTI-VENDOR SPLITTING, PIN CODES, DELIVERY SLOTS
// =========================================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  CartItem, 
  FlowerProduct, 
  DeliverySlotType, 
  VendorSubOrderGroup 
} from '../shared/types';

interface CartState {
  items: CartItem[];
  recipientPinCode: string;
  isPinCodeVerified: boolean;
  serviceableVendorsCount: number;
  promoCode: string | null;
  discountPercentage: number;
  
  // Actions
  addItem: (product: FlowerProduct, quantity?: number, slot?: DeliverySlotType, date?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateItemSlot: (productId: string, slot: DeliverySlotType) => void;
  setRecipientPinCode: (pinCode: string, isVerified?: boolean, vendorCount?: number) => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  clearCart: () => void;
  
  // Computed helpers
  getVendorGroups: () => VendorSubOrderGroup[];
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      recipientPinCode: '400001', // Default Mumbai South pin code for seamless testing
      isPinCodeVerified: true,
      serviceableVendorsCount: 3,
      promoCode: null,
      discountPercentage: 0,

      addItem: (product, quantity = 1, slot = 'STANDARD_DAY', date) => {
        const defaultDate = date || new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0];
        set(state => {
          const existingIndex = state.items.findIndex(i => i.product.id === product.id);
          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const newQty = updatedItems[existingIndex].quantity + quantity;
            if (newQty <= product.stock_quantity) {
              updatedItems[existingIndex].quantity = newQty;
            }
            return { items: updatedItems };
          }
          return {
            items: [
              ...state.items,
              {
                product,
                quantity: Math.min(quantity, product.stock_quantity),
                selected_slot: slot,
                delivery_date: defaultDate,
              },
            ],
          };
        });
      },

      removeItem: (productId) => {
        set(state => ({
          items: state.items.filter(i => i.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set(state => {
          if (quantity <= 0) {
            return { items: state.items.filter(i => i.product.id !== productId) };
          }
          return {
            items: state.items.map(item => {
              if (item.product.id === productId) {
                return {
                  ...item,
                  quantity: Math.min(quantity, item.product.stock_quantity),
                };
              }
              return item;
            }),
          };
        });
      },

      updateItemSlot: (productId, slot) => {
        set(state => ({
          items: state.items.map(i => 
            i.product.id === productId ? { ...i, selected_slot: slot } : i
          ),
        }));
      },

      setRecipientPinCode: (pinCode, isVerified = false, vendorCount = 0) => {
        set({
          recipientPinCode: pinCode,
          isPinCodeVerified: isVerified,
          serviceableVendorsCount: vendorCount,
        });
      },

      applyPromoCode: (code) => {
        const clean = code.trim().toUpperCase();
        if (clean === 'BLOOM10' || clean === 'PUJA10') {
          set({ promoCode: clean, discountPercentage: 10 });
          return true;
        }
        if (clean === 'FIRSTVINE15') {
          set({ promoCode: clean, discountPercentage: 15 });
          return true;
        }
        return false;
      },

      removePromoCode: () => {
        set({ promoCode: null, discountPercentage: 0 });
      },

      clearCart: () => {
        set({ items: [], promoCode: null, discountPercentage: 0 });
      },

      // Helper to group items by florist vendor
      getVendorGroups: () => {
        const { items } = get();
        const groupMap = new Map<string, VendorSubOrderGroup>();

        for (const item of items) {
          const v = item.product.vendor;
          if (!v) continue;
          if (!groupMap.has(v.id)) {
            groupMap.set(v.id, {
              vendor: v,
              items: [],
              subtotal: 0,
            });
          }
          const group = groupMap.get(v.id)!;
          group.items.push(item);
          group.subtotal += item.product.price * item.quantity;
        }

        return Array.from(groupMap.values());
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      },

      getDiscountAmount: () => {
        const { getSubtotal, discountPercentage } = get();
        return Math.round((getSubtotal() * discountPercentage) / 100);
      },

      getTotal: () => {
        const { getSubtotal, getDiscountAmount } = get();
        return Math.max(0, getSubtotal() - getDiscountAmount());
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'freshflora-cart-storage',
    }
  )
);
