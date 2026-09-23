// =========================================================================
// CLIENT-SIDE SHARED TYPES FOR FRESH FLOWER PLATFORM
// =========================================================================

export type UserRole = 'CUSTOMER' | 'VENDOR' | 'ADMIN';

export type OrderItemStatus = 
  | 'PENDING'
  | 'ACCEPTED'
  | 'CUT_PACKED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus = 
  | 'UNPAID'
  | 'AUTHORIZED'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED';

export type FlowerCategory = 
  | 'BOUQUETS'
  | 'LOOSE_FLOWERS'
  | 'EVENT_DECOR'
  | 'EXOTIC_CUT_STEMS'
  | 'INDOOR_PLANTS_FLORAL';

export type DeliverySlotType = 
  | 'EXPRESS_IMMEDIATE'
  | 'MORNING_SLOT'
  | 'STANDARD_DAY'
  | 'EVENING_SLOT';

export type OccasionType = 
  | 'ANNIVERSARY'
  | 'BIRTHDAY'
  | 'FESTIVAL_PUJA'
  | 'CONGRATULATIONS'
  | 'SYMPATHY'
  | 'VALENTINES'
  | 'CORPORATE';

export type FreshnessClassification = 
  | 'ULTRA_PERISHABLE'
  | 'STANDARD_FRESH'
  | 'EXTENDED_LIFE';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface VendorProfile {
  id: string;
  user_id: string;
  store_name: string;
  store_slug: string;
  description?: string;
  address: string;
  city: string;
  service_pincodes: string[];
  is_active: boolean;
  rating: number;
  phone?: string;
  email?: string;
  commission_rate?: number;
  created_at: string;
  updated_at: string;
}

export interface StemCompositionItem {
  stem_name: string;
  count: number;
  perishability: FreshnessClassification;
}

export interface FlowerProduct {
  id: string;
  vendor_id: string;
  title: string;
  slug: string;
  description: string;
  category: FlowerCategory;
  stem_type: string;
  price: number;
  stock_quantity: number;
  images: string[];
  freshness_window_hours: number;
  is_available: boolean;
  occasion_tags?: OccasionType[];
  stem_composition?: StemCompositionItem[];
  freshness_class?: FreshnessClassification;
  origin?: string;
  created_at: string;
  updated_at: string;
  vendor?: VendorProfile;
}

export interface DeliveryAddressPayload {
  recipient_name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pin_code: string;
}

export interface FloralCareGuide {
  summary: string;
  water_temperature_celsius: number;
  trimming_technique: string;
  vase_preparation: string;
  nourishment_recipe: string;
  environmental_warnings: string[];
  expected_vase_life_days: number;
  daily_checklist: string[];
}

export interface PerishabilityRiskAssessment {
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  risk_score: number;
  ambient_temp_assumed: number;
  transit_duration_hours: number;
  packaging_instructions: {
    hydration_method: string;
    thermal_protection: string;
    boxed_orientation: string;
  };
  dispatch_deadline_minutes: number;
  handling_precautions: string[];
  courier_notes: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  vendor_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  status: OrderItemStatus;
  care_advisory?: FloralCareGuide | null;
  risk_assessment?: PerishabilityRiskAssessment | null;
  status_updated_at: string;
  created_at: string;
  product?: FlowerProduct;
  vendor?: VendorProfile;
}

export interface Order {
  id: string;
  customer_id: string;
  total_amount: number;
  payment_status: PaymentStatus;
  payment_reference?: string | null;
  delivery_address: DeliveryAddressPayload;
  scheduled_slot: DeliverySlotType;
  delivery_date: string;
  gift_message?: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  customer?: Profile;
}

export interface CartItem {
  product: FlowerProduct;
  quantity: number;
  selected_slot: DeliverySlotType;
  delivery_date: string;
  gift_message?: string;
}

export interface VendorSubOrderGroup {
  vendor: VendorProfile;
  items: CartItem[];
  subtotal: number;
}

export interface AdminPlatformMetrics {
  total_gmv: number;
  total_orders: number;
  active_vendors_count: number;
  total_products_count: number;
  orders_by_status: Record<OrderItemStatus, number>;
  revenue_by_category: Record<FlowerCategory, number>;
  perishability_alerts_count: number;
}

export interface VendorDashboardMetrics {
  active_orders_count: number;
  pending_cuts_count: number;
  daily_revenue: number;
  total_revenue: number;
  low_stock_products: FlowerProduct[];
  fulfillment_rate: number;
}
