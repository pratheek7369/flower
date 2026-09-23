// =========================================================================
// SHARED ZOD VALIDATION SCHEMAS FOR FRESH FLOWER PLATFORM
// =========================================================================

import { z } from 'zod';

// Enum schemas
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

// Pin code check schema (6-digit Indian PIN code standard or general alphanumeric)
export const PinCodeCheckSchema = z.object({
  pin_code: z.string().trim().regex(/^\d{6}$/, 'Pin code must be exactly 6 digits'),
  vendor_id: z.string().uuid().optional(),
});

// Checkout delivery address schema
export const DeliveryAddressSchema = z.object({
  recipient_name: z.string().min(2, 'Recipient name is required'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pin_code: z.string().regex(/^\d{6}$/, 'Pin code must be 6 digits'),
});

// Order creation payload schema
export const CreateOrderItemPayloadSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().positive('Quantity must be greater than 0'),
});

export const CreateOrderRequestSchema = z.object({
  customer_id: z.string().uuid(),
  items: z.array(CreateOrderItemPayloadSchema).min(1, 'Order must contain at least 1 item'),
  delivery_address: DeliveryAddressSchema,
  scheduled_slot: DeliverySlotTypeSchema,
  delivery_date: z.string().min(10, 'Delivery date is required (YYYY-MM-DD)'),
  gift_message: z.string().max(250, 'Gift message cannot exceed 250 characters').optional().nullable(),
  payment_method: z.enum(['CREDIT_DEBIT_CARD', 'UPI', 'NET_BANKING', 'CASH_ON_DELIVERY']),
});

// Vendor order item status update schema
export const UpdateOrderItemStatusSchema = z.object({
  status: OrderItemStatusSchema,
  notes: z.string().optional(),
});

// Vendor product inventory schema
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

// Faceted catalog search query schema
export const CatalogFilterSchema = z.object({
  search: z.string().optional(),
  category: FlowerCategorySchema.optional(),
  occasion: OccasionTypeSchema.optional(),
  pin_code: z.string().optional(),
  min_price: z.number().optional(),
  max_price: z.number().optional(),
  freshness_class: FreshnessClassificationSchema.optional(),
  sort_by: z.enum(['popular', 'price_asc', 'price_desc', 'freshness']).optional(),
  vendor_id: z.string().uuid().optional(),
});

// =========================================================================
// AI STRUCTURED OUTPUT SCHEMAS (@google/genai structured JSON)
// =========================================================================

export const FloralCareGuideSchema = z.object({
  summary: z.string().describe('Concise 1-2 sentence overview of the bouquet preservation protocol'),
  water_temperature_celsius: z.number().describe('Recommended water temperature in Celsius (e.g., 20-22°C tepid for roses, cool for bulb flowers)'),
  trimming_technique: z.string().describe('Precise cutting instructions, angle (45 degrees), underwater cutting advice, and frequency'),
  vase_preparation: z.string().describe('Sanitization, water depth, and foliage removal instructions'),
  nourishment_recipe: z.string().describe('Floral nutrient packet dilution or homemade sugar/citric acid formulation'),
  environmental_warnings: z.array(z.string()).describe('List of ambient risks like ripening fruit ethylene gas, draft vents, or direct heat'),
  expected_vase_life_days: z.number().describe('Estimated total days flowers will remain fresh if steps are adhered to'),
  daily_checklist: z.array(z.string()).describe('Daily routine steps (Day 1, Day 3 water change, etc.)'),
});

export const PerishabilityRiskAssessmentSchema = z.object({
  risk_level: z.enum(['LOW', 'MODERATE', 'HIGH', 'CRITICAL']).describe('Calculated perishability risk category based on transit time and weather'),
  risk_score: z.number().min(0).max(100).describe('Perishability vulnerability score from 0 (very durable) to 100 (extreme danger of wilting)'),
  ambient_temp_assumed: z.number().describe('Ambient operating temperature used for transit calculation in Celsius'),
  transit_duration_hours: z.number().describe('Estimated transit window in hours'),
  packaging_instructions: z.object({
    hydration_method: z.string().describe('e.g., Eco-sponge wrap, aqua-tube, soaked cotton fleece at stem base'),
    thermal_protection: z.string().describe('e.g., Reflective thermal foil liner, gel ice wrap, ventilated corrugated box'),
    boxed_orientation: z.string().describe('Vertical standing or horizontal cushion pack'),
  }),
  dispatch_deadline_minutes: z.number().describe('Maximum permissible elapsed time between cutting/packing and customer handoff'),
  handling_precautions: z.array(z.string()).describe('Key instructions for courier e.g., keep out of direct boot heat, fragile petal heads'),
  courier_notes: z.string().describe('Short instruction label to affix to courier dispatch manifest'),
});

export const LogisticsRoutingNoteSchema = z.object({
  recommended_courier_type: z.enum(['REFRIGERATED_VAN', 'EXPRESS_TWO_WHEELER_COLD_BAG', 'STANDARD_SAME_DAY']),
  priority_flag: z.enum(['NORMAL', 'RUSH', 'CRITICAL_PERISHABLE']),
  maximum_ambient_exposure_hours: z.number(),
  special_handling: z.array(z.string()),
});
