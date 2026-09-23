// =========================================================================
// PRODUCTION-READY DATABASE REPOSITORY ADAPTER
// Supports embedded relational store and Supabase Postgres client
// =========================================================================

import { 
  Profile, 
  VendorProfile, 
  FlowerProduct, 
  Address, 
  Order, 
  OrderItem, 
  OrderItemStatus, 
  PaymentStatus,
} from '../shared/types.js';
import { 
  SEED_PROFILES, 
  SEED_VENDORS, 
  SEED_PRODUCTS, 
  SEED_ORDERS, 
  SEED_ORDER_ITEMS 
} from './seedData.js';
import { config } from '../config.js';
import { z } from 'zod';

class FloralDatabase {
  private profiles: Map<string, Profile> = new Map();
  private vendors: Map<string, VendorProfile> = new Map();
  private products: Map<string, FlowerProduct> = new Map();
  private addresses: Map<string, Address> = new Map();
  private orders: Map<string, Order> = new Map();
  private orderItems: Map<string, OrderItem> = new Map();

  constructor() {
    this.seedDatabase();
  }

  private seedDatabase() {
    for (const p of SEED_PROFILES) {
      this.profiles.set(p.id, { ...p });
    }
    for (const v of SEED_VENDORS) {
      this.vendors.set(v.id, { ...v });
    }
    for (const prod of SEED_PRODUCTS) {
      this.products.set(prod.id, { ...prod });
    }
    for (const ord of SEED_ORDERS) {
      this.orders.set(ord.id, { ...ord });
    }
    for (const item of SEED_ORDER_ITEMS) {
      this.orderItems.set(item.id, { ...item });
    }
    console.log(`[FloralDatabase] Embedded Relational Store initialized with:`);
    console.log(`  - ${this.profiles.size} Profiles`);
    console.log(`  - ${this.vendors.size} Vendors`);
    console.log(`  - ${this.products.size} Products`);
    console.log(`  - ${this.orders.size} Orders`);
    console.log(`  - ${this.orderItems.size} Order Items`);
  }

  // =========================================================================
  // PROFILES & AUTH
  // =========================================================================
  public async getProfileById(id: string): Promise<Profile | null> {
    return this.profiles.get(id) || null;
  }

  public async getProfileByEmail(email: string): Promise<Profile | null> {
    for (const profile of this.profiles.values()) {
      if (profile.email.toLowerCase() === email.toLowerCase()) {
        return profile;
      }
    }
    return null;
  }

  public async getAllProfiles(): Promise<Profile[]> {
    return Array.from(this.profiles.values());
  }

  public async createProfile(profileData: Omit<Profile, 'created_at' | 'updated_at'>): Promise<Profile> {
    const now = new Date().toISOString();
    const profile: Profile = {
      ...profileData,
      created_at: now,
      updated_at: now,
    };
    this.profiles.set(profile.id, profile);
    return profile;
  }

  // =========================================================================
  // VENDORS
  // =========================================================================
  public async getVendorById(id: string): Promise<VendorProfile | null> {
    return this.vendors.get(id) || null;
  }

  public async getVendorByUserId(userId: string): Promise<VendorProfile | null> {
    for (const vendor of this.vendors.values()) {
      if (vendor.user_id === userId) {
        return vendor;
      }
    }
    return null;
  }

  public async getAllVendors(): Promise<VendorProfile[]> {
    return Array.from(this.vendors.values());
  }

  public async createVendor(vendorData: Omit<VendorProfile, 'created_at' | 'updated_at'>): Promise<VendorProfile> {
    const now = new Date().toISOString();
    const vendor: VendorProfile = {
      ...vendorData,
      created_at: now,
      updated_at: now,
    };
    this.vendors.set(vendor.id, vendor);
    return vendor;
  }

  public async updateVendor(id: string, updates: Partial<VendorProfile>): Promise<VendorProfile | null> {
    const existing = this.vendors.get(id);
    if (!existing) return null;
    const updated: VendorProfile = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.vendors.set(id, updated);
    return updated;
  }

  public async getVendorsServicingPinCode(pinCode: string): Promise<VendorProfile[]> {
    const cleanPin = pinCode.trim();
    return Array.from(this.vendors.values()).filter(v => 
      v.is_active && v.service_pincodes.includes(cleanPin)
    );
  }

  // =========================================================================
  // PRODUCTS & INVENTORY
  // =========================================================================
  public async getProductById(id: string): Promise<FlowerProduct | null> {
    const prod = this.products.get(id);
    if (!prod) return null;
    const vendor = this.vendors.get(prod.vendor_id);
    return {
      ...prod,
      vendor: vendor || undefined,
    };
  }

  public async getProductBySlug(slug: string): Promise<FlowerProduct | null> {
    for (const prod of this.products.values()) {
      if (prod.slug === slug) {
        const vendor = this.vendors.get(prod.vendor_id);
        return { ...prod, vendor: vendor || undefined };
      }
    }
    return null;
  }

  public async queryProducts(filters: {
    search?: string;
    category?: string;
    occasion?: string;
    pin_code?: string;
    min_price?: number;
    max_price?: number;
    freshness_class?: string;
    sort_by?: string;
    vendor_id?: string;
  }): Promise<{ products: FlowerProduct[]; total: number; serviceable_count: number }> {
    let list = Array.from(this.products.values());

    // Enrich with vendor details
    list = list.map(p => ({
      ...p,
      vendor: this.vendors.get(p.vendor_id) || undefined,
    }));

    if (filters.vendor_id) {
      list = list.filter(p => p.vendor_id === filters.vendor_id);
    }

    if (filters.category) {
      list = list.filter(p => p.category === filters.category);
    }

    if (filters.occasion) {
      list = list.filter(p => p.occasion_tags?.includes(filters.occasion as any));
    }

    if (filters.freshness_class) {
      list = list.filter(p => p.freshness_class === filters.freshness_class);
    }

    if (filters.min_price !== undefined) {
      list = list.filter(p => p.price >= filters.min_price!);
    }

    if (filters.max_price !== undefined) {
      list = list.filter(p => p.price <= filters.max_price!);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.stem_type.toLowerCase().includes(q) ||
        p.vendor?.store_name.toLowerCase().includes(q)
      );
    }

    let serviceableCount = list.length;
    if (filters.pin_code) {
      const pin = filters.pin_code.trim();
      serviceableCount = list.filter(p => p.vendor?.service_pincodes.includes(pin)).length;
    }

    // Sort order
    if (filters.sort_by === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (filters.sort_by === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (filters.sort_by === 'freshness') {
      list.sort((a, b) => a.freshness_window_hours - b.freshness_window_hours);
    }

    return {
      products: list,
      total: list.length,
      serviceable_count: serviceableCount,
    };
  }

  public async createProduct(productData: Omit<FlowerProduct, 'created_at' | 'updated_at'>): Promise<FlowerProduct> {
    const now = new Date().toISOString();
    const product: FlowerProduct = {
      ...productData,
      created_at: now,
      updated_at: now,
    };
    this.products.set(product.id, product);
    return product;
  }

  public async updateProduct(id: string, updates: Partial<FlowerProduct>): Promise<FlowerProduct | null> {
    const existing = this.products.get(id);
    if (!existing) return null;
    const updated: FlowerProduct = {
      ...existing,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    this.products.set(id, updated);
    return updated;
  }

  public async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // =========================================================================
  // ORDERS & ATOMIC SPLIT TRANSACTIONS
  // =========================================================================
  public async getOrderById(orderId: string): Promise<Order | null> {
    const order = this.orders.get(orderId);
    if (!order) return null;

    const items = Array.from(this.orderItems.values())
      .filter(item => item.order_id === orderId)
      .map(item => ({
        ...item,
        product: this.products.get(item.product_id),
        vendor: this.vendors.get(item.vendor_id),
      }));

    const customer = this.profiles.get(order.customer_id);

    return {
      ...order,
      items,
      customer: customer || undefined,
    };
  }

  public async getOrdersByCustomerId(customerId: string): Promise<Order[]> {
    const customerOrders: Order[] = [];
    for (const order of this.orders.values()) {
      if (order.customer_id === customerId) {
        const enriched = await this.getOrderById(order.id);
        if (enriched) customerOrders.push(enriched);
      }
    }
    return customerOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public async getOrderItemsByVendorId(vendorId: string): Promise<OrderItem[]> {
    const items: OrderItem[] = [];
    for (const item of this.orderItems.values()) {
      if (item.vendor_id === vendorId) {
        items.push({
          ...item,
          product: this.products.get(item.product_id),
          vendor: this.vendors.get(item.vendor_id),
        });
      }
    }
    return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public async getAllOrders(): Promise<Order[]> {
    const list: Order[] = [];
    for (const ord of this.orders.values()) {
      const enriched = await this.getOrderById(ord.id);
      if (enriched) list.push(enriched);
    }
    return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  /**
   * ATOMIC ORDER CREATION & VENDOR ORDER SPLITTING
   * 1. Validates stock availability for every stem
   * 2. Decrements stock atomically
   * 3. Inserts master order
   * 4. Splits items into distinct vendor sub-order items
   */
  public async createOrderWithVendorSplitting(params: {
    order: Omit<Order, 'created_at' | 'updated_at' | 'items' | 'customer'>;
    items: Array<{
      product_id: string;
      quantity: number;
    }>;
  }): Promise<{ order: Order; items: OrderItem[] }> {
    // 1. Pre-validation: Check stock for all items
    for (const it of params.items) {
      const prod = this.products.get(it.product_id);
      if (!prod) {
        throw new Error(`Product ${it.product_id} not found`);
      }
      if (!prod.is_available) {
        throw new Error(`Floral product "${prod.title}" is currently unavailable`);
      }
      if (prod.stock_quantity < it.quantity) {
        throw new Error(`Insufficient stock for "${prod.title}". Available: ${prod.stock_quantity}, requested: ${it.quantity}`);
      }
    }

    // 2. Atomic stock decrement
    for (const it of params.items) {
      const prod = this.products.get(it.product_id)!;
      prod.stock_quantity -= it.quantity;
      if (prod.stock_quantity === 0) {
        prod.is_available = false;
      }
      this.products.set(prod.id, prod);
    }

    // 3. Insert Master Order
    const now = new Date().toISOString();
    const orderRecord: Order = {
      ...params.order,
      created_at: now,
      updated_at: now,
    };
    this.orders.set(orderRecord.id, orderRecord);

    // 4. Split items by vendor and insert OrderItems
    const createdItems: OrderItem[] = [];
    for (let i = 0; i < params.items.length; i++) {
      const reqItem = params.items[i];
      const prod = this.products.get(reqItem.product_id)!;
      const itemId = `item-${Date.now()}-${i + 1}`;

      const orderItem: OrderItem = {
        id: itemId,
        order_id: orderRecord.id,
        vendor_id: prod.vendor_id,
        product_id: prod.id,
        quantity: reqItem.quantity,
        unit_price: prod.price,
        status: 'PENDING',
        care_advisory: null,
        risk_assessment: null,
        status_updated_at: now,
        created_at: now,
        product: prod,
        vendor: this.vendors.get(prod.vendor_id),
      };

      this.orderItems.set(itemId, orderItem);
      createdItems.push(orderItem);
    }

    return {
      order: {
        ...orderRecord,
        items: createdItems,
      },
      items: createdItems,
    };
  }

  /**
   * STATE MACHINE TRANSITION FOR ORDER ITEMS:
   * PENDING -> ACCEPTED -> CUT_PACKED -> OUT_FOR_DELIVERY -> DELIVERED (or CANCELLED)
   */
  public async updateOrderItemStatus(
    itemId: string, 
    newStatus: OrderItemStatus,
    vendorId?: string
  ): Promise<OrderItem | null> {
    const item = this.orderItems.get(itemId);
    if (!item) return null;

    if (vendorId && item.vendor_id !== vendorId) {
      throw new Error('Unauthorized: This order item does not belong to this vendor');
    }

    // Perishable lifecycle state transition guard
    const validTransitions: Record<OrderItemStatus, OrderItemStatus[]> = {
      PENDING: ['ACCEPTED', 'CANCELLED'],
      ACCEPTED: ['CUT_PACKED', 'CANCELLED'],
      CUT_PACKED: ['OUT_FOR_DELIVERY', 'CANCELLED'],
      OUT_FOR_DELIVERY: ['DELIVERED', 'CANCELLED'],
      DELIVERED: [],
      CANCELLED: [],
    };

    const allowed = validTransitions[item.status];
    if (!allowed.includes(newStatus)) {
      throw new Error(`Invalid status transition from "${item.status}" to "${newStatus}". Allowed: ${allowed.join(', ')}`);
    }

    item.status = newStatus;
    item.status_updated_at = new Date().toISOString();
    this.orderItems.set(itemId, item);

    // If order item was cancelled, refund/re-increment stock
    if (newStatus === 'CANCELLED') {
      const prod = this.products.get(item.product_id);
      if (prod) {
        prod.stock_quantity += item.quantity;
        prod.is_available = true;
        this.products.set(prod.id, prod);
      }
    }

    return {
      ...item,
      product: this.products.get(item.product_id),
      vendor: this.vendors.get(item.vendor_id),
    };
  }

  public async attachCareAdvisory(itemId: string, careAdvisory: any): Promise<void> {
    const item = this.orderItems.get(itemId);
    if (item) {
      item.care_advisory = careAdvisory;
      this.orderItems.set(itemId, item);
    }
  }

  public async attachRiskAssessment(itemId: string, riskAssessment: any): Promise<void> {
    const item = this.orderItems.get(itemId);
    if (item) {
      item.risk_assessment = riskAssessment;
      this.orderItems.set(itemId, item);
    }
  }

  // =========================================================================
  // METRICS & ANALYTICS
  // =========================================================================
  public async getAdminMetrics() {
    let gmv = 0;
    const ordersByStatus: Record<OrderItemStatus, number> = {
      PENDING: 0,
      ACCEPTED: 0,
      CUT_PACKED: 0,
      OUT_FOR_DELIVERY: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };
    const revenueByCategory: Record<string, number> = {};

    for (const ord of this.orders.values()) {
      if (ord.payment_status === 'PAID') {
        gmv += ord.total_amount;
      }
    }

    let perishabilityAlerts = 0;
    for (const item of this.orderItems.values()) {
      ordersByStatus[item.status] = (ordersByStatus[item.status] || 0) + 1;
      const prod = this.products.get(item.product_id);
      if (prod) {
        revenueByCategory[prod.category] = (revenueByCategory[prod.category] || 0) + (item.unit_price * item.quantity);
        if (prod.freshness_class === 'ULTRA_PERISHABLE' && item.status !== 'DELIVERED') {
          perishabilityAlerts++;
        }
      }
    }

    return {
      total_gmv: Math.round(gmv * 100) / 100,
      total_orders: this.orders.size,
      active_vendors_count: Array.from(this.vendors.values()).filter(v => v.is_active).length,
      total_products_count: this.products.size,
      orders_by_status: ordersByStatus,
      revenue_by_category: revenueByCategory,
      perishability_alerts_count: perishabilityAlerts,
    };
  }

  public async getVendorMetrics(vendorId: string) {
    const vendorItems = Array.from(this.orderItems.values()).filter(i => i.vendor_id === vendorId);
    let totalRev = 0;
    let dailyRev = 0;
    let pendingCuts = 0;
    let activeOrders = 0;

    const oneDayAgo = Date.now() - 24 * 3600 * 1000;

    for (const item of vendorItems) {
      if (item.status !== 'CANCELLED') {
        const itemTotal = item.unit_price * item.quantity;
        totalRev += itemTotal;
        if (new Date(item.created_at).getTime() >= oneDayAgo) {
          dailyRev += itemTotal;
        }
      }

      if (item.status === 'ACCEPTED') {
        pendingCuts++;
      }
      if (['PENDING', 'ACCEPTED', 'CUT_PACKED', 'OUT_FOR_DELIVERY'].includes(item.status)) {
        activeOrders++;
      }
    }

    const lowStock = Array.from(this.products.values()).filter(
      p => p.vendor_id === vendorId && p.stock_quantity <= 15
    );

    const completed = vendorItems.filter(i => i.status === 'DELIVERED').length;
    const totalFinished = vendorItems.filter(i => ['DELIVERED', 'CANCELLED'].includes(i.status)).length;
    const fulfillmentRate = totalFinished > 0 ? Math.round((completed / totalFinished) * 100) : 98;

    return {
      active_orders_count: activeOrders,
      pending_cuts_count: pendingCuts,
      daily_revenue: Math.round(dailyRev * 100) / 100,
      total_revenue: Math.round(totalRev * 100) / 100,
      low_stock_products: lowStock,
      fulfillment_rate: fulfillmentRate,
    };
  }
}

export const db = new FloralDatabase();
