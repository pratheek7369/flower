// =========================================================================
// ZOD SCHEMAS FOR FRESH FLOWER PLATFORM
// =========================================================================

import { z } from 'zod';

export const UserRoleSchema = z.enum(['CUSTOMER', 'VENDOR', 'ADMIN']);

export const OrderItemStatusSchema = z.enum([
  'PENDING',
  'ACCEPTED',
  'CUT_PACKED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
]);

export const PaymentStatusSchema = z.enum([
  'UNPAID',
  'AUTHORIZED',
  'PAID',
  'FAILED',
  'REFUNDED',
]);

export const FlowerCategorySchema = z.enum([
  'BOUQUETS',
  'LOOSE_FLOWERS',
  'EVENT_DECOR',
  'EXOTIC_CUT_STEMS',
  'INDOOR_PLANTS_FLORAL',
]);

export const DeliverySlotTypeSchema = z.enum([
  'EXPRESS_IMMEDIATE',
  'MORNING_SLOT',
  'STANDARD_DAY',
  'EVENING_SLOT',
]);

export const OccasionTypeSchema = z.enum([
  'ANNIVERSARY',
  'BIRTHDAY',
  'FESTIVAL_PUJA',
  'CONGRATULATIONS',
  'SYMPATHY',
  'VALENTINES',
  'CORPORATE',
]);

export const FreshnessClassificationSchema = z.enum([
  'ULTRA_PERISHABLE',
  'STANDARD_FRESH',
  'EXTENDED_LIFE',
]);

export const PinCodeCheckSchema = z.object({
  pin_code: z.string().trim().regex(/^\d{6}$/, 'Pin code must be exactly 6 digits'),
  vendor_id: z.string().uuid().optional(),
});

export const DeliveryAddressSchema = z.object({
  recipient_name: z.string().min(2, 'Recipient name is required'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pin_code: z.string().regex(/^\d{6}$/, 'Pin code must be 6 digits'),
});

export const CreateOrderItemPayloadSchema = z.object({
  product_id: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
});

export const CreateOrderRequestSchema = z.object({
  customer_id: z.string().min(1, 'Customer ID is required'),
  items: z.array(CreateOrderItemPayloadSchema).min(1, 'Order must contain at least 1 item'),
  delivery_address: DeliveryAddressSchema,
  scheduled_slot: DeliverySlotTypeSchema,
  delivery_date: z.string().min(10, 'Delivery date is required (YYYY-MM-DD)'),
  gift_message: z.string().max(250, 'Gift message cannot exceed 250 characters').optional().nullable(),
  payment_method: z.enum(['CREDIT_DEBIT_CARD', 'UPI', 'NET_BANKING', 'CASH_ON_DELIVERY']),
});

export const UpdateOrderItemStatusSchema = z.object({
  status: OrderItemStatusSchema,
  notes: z.string().optional(),
});

export const VendorProductSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  category: FlowerCategorySchema,
  stem_type: z.string().min(2, 'Stem type is required'),
  price: z.number().positive('Price must be greater than zero'),
  stock_quantity: z.number().int().min(0, 'Stock cannot be negative'),
  freshness_window_hours: z.number().int().positive('Freshness window hours must be positive'),
  images: z.array(z.string().url()).min(1, 'At least one image URL is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  is_available: z.boolean().default(true),
  occasion_tags: z.array(OccasionTypeSchema).optional(),
});

export const CatalogFilterSchema = z.object({
  search: z.string().optional(),
  category: FlowerCategorySchema.optional(),
  occasion: OccasionTypeSchema.optional(),
  pin_code: z.string().optional(),
  min_price: z.number().optional(),
  max_price: z.number().optional(),
  freshness_class: FreshnessClassificationSchema.optional(),
  sort_by: z.enum(['popular', 'price_asc', 'price_desc', 'freshness']).optional(),
  vendor_id: z.string().optional(),
});

export const FloralCareGuideSchema = z.object({
  summary: z.string(),
  water_temperature_celsius: z.number(),
  trimming_technique: z.string(),
  vase_preparation: z.string(),
  nourishment_recipe: z.string(),
  environmental_warnings: z.array(z.string()),
  expected_vase_life_days: z.number(),
  daily_checklist: z.array(z.string()),
});

export const PerishabilityRiskAssessmentSchema = z.object({
  risk_level: z.enum(['LOW', 'MODERATE', 'HIGH', 'CRITICAL']),
  risk_score: z.number().min(0).max(100),
  ambient_temp_assumed: z.number(),
  transit_duration_hours: z.number(),
  packaging_instructions: z.object({
    hydration_method: z.string(),
    thermal_protection: z.string(),
    boxed_orientation: z.string(),
  }),
  dispatch_deadline_minutes: z.number(),
  handling_precautions: z.array(z.string()),
  courier_notes: z.string(),
});

export const LogisticsRoutingNoteSchema = z.object({
  recommended_courier_type: z.enum(['REFRIGERATED_VAN', 'EXPRESS_TWO_WHEELER_COLD_BAG', 'STANDARD_SAME_DAY']),
  priority_flag: z.enum(['NORMAL', 'RUSH', 'CRITICAL_PERISHABLE']),
  maximum_ambient_exposure_hours: z.number(),
  special_handling: z.array(z.string()),
});
