// =========================================================================
// TYPED API CLIENT FOR FRESH FLOWER PLATFORM
// =========================================================================

import { 
  FlowerProduct, 
  VendorProfile, 
  Order, 
  OrderItem, 
  OrderItemStatus, 
  AdminPlatformMetrics, 
  VendorDashboardMetrics, 
  FloralCareGuide, 
  PerishabilityRiskAssessment,
  Profile
} from '../shared/types';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let errorMsg = `API request failed with status ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData.error) errorMsg = errorData.error;
    } catch {}
    throw new Error(errorMsg);
  }

  return res.json();
}

export const api = {
  // Products
  async getProducts(params?: Record<string, any>): Promise<{ products: FlowerProduct[]; total: number; serviceable_count: number }> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, String(val));
        }
      });
    }
    const qs = query.toString() ? `?${query.toString()}` : '';
    return fetchJson(`/products${qs}`);
  },

  async getProductById(id: string): Promise<FlowerProduct> {
    return fetchJson(`/products/${id}`);
  },

  async createProduct(data: any): Promise<FlowerProduct> {
    return fetchJson('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProduct(id: string, data: any): Promise<FlowerProduct> {
    return fetchJson(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteProduct(id: string): Promise<{ message: string }> {
    return fetchJson(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Vendors
  async getVendors(): Promise<VendorProfile[]> {
    return fetchJson('/vendors');
  },

  async getVendorById(id: string): Promise<VendorProfile> {
    return fetchJson(`/vendors/${id}`);
  },

  async checkPinCode(pin_code: string): Promise<{
    pin_code: string;
    is_serviceable: boolean;
    serviceable_vendors_count: number;
    vendors: Array<{ id: string; store_name: string; city: string; rating: number }>;
  }> {
    return fetchJson('/vendors/check-pincode', {
      method: 'POST',
      body: JSON.stringify({ pin_code }),
    });
  },

  async getVendorMetrics(vendorId: string): Promise<VendorDashboardMetrics> {
    return fetchJson(`/vendors/${vendorId}/metrics`);
  },

  async getVendorOrders(vendorId: string): Promise<OrderItem[]> {
    return fetchJson(`/vendors/${vendorId}/orders`);
  },

  async updateVendorSettings(vendorId: string, settings: Partial<VendorProfile>): Promise<VendorProfile> {
    return fetchJson(`/vendors/${vendorId}/settings`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  // Orders
  async createOrder(payload: any): Promise<Order> {
    return fetchJson('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getOrders(customerId?: string): Promise<Order[]> {
    const qs = customerId ? `?customer_id=${customerId}` : '';
    return fetchJson(`/orders${qs}`);
  },

  async getOrderById(orderId: string): Promise<Order> {
    return fetchJson(`/orders/${orderId}`);
  },

  async updateOrderItemStatus(itemId: string, status: OrderItemStatus, vendorId?: string): Promise<OrderItem> {
    return fetchJson(`/orders/items/${itemId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, vendor_id: vendorId }),
    });
  },

  // AI Intelligence (@google/genai)
  async getFloralCareGuide(params: {
    bouquetTitle: string;
    stemTypes: string[];
    freshnessClass?: string;
  }): Promise<FloralCareGuide> {
    return fetchJson('/ai/care-guide', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async getPerishabilityRisk(params: {
    productTitle: string;
    stemTypes: string[];
    transitDurationHours: number;
    ambientTempC: number;
    deliverySlot: string;
    freshnessClass?: string;
  }): Promise<PerishabilityRiskAssessment> {
    return fetchJson('/ai/perishability-risk', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // Admin
  async getAdminMetrics(): Promise<AdminPlatformMetrics> {
    return fetchJson('/admin/metrics');
  },

  async getAdminVendors(): Promise<VendorProfile[]> {
    return fetchJson('/admin/vendors');
  },

  async updateAdminVendor(id: string, updates: { is_active?: boolean; commission_rate?: number }): Promise<VendorProfile> {
    return fetchJson(`/admin/vendors/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  // Auth & Roles
  async login(email: string, role?: string): Promise<{ user: Profile; vendor?: VendorProfile; token: string }> {
    return fetchJson('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    });
  },

  async switchRole(targetRole: string): Promise<{ user: Profile; vendor?: VendorProfile; token: string }> {
    return fetchJson('/auth/switch-role', {
      method: 'POST',
      body: JSON.stringify({ targetRole }),
    });
  },

  async getDemoProfiles(): Promise<{ profiles: Profile[]; vendors: VendorProfile[] }> {
    return fetchJson('/auth/demo-profiles');
  },
};
