// =========================================================================
// ORDER SERVICE: MULTI-VENDOR SPLITTING, PIN-CODE CHECK, ATOMIC TRANSACTIONS
// =========================================================================

import { db } from '../db/database.js';
import { CreateOrderRequestSchema } from '../shared/schemas.js';
import { OrderItemStatus, Order } from '../shared/types.js';
import { generateVaseLifeCareGuide, assessPerishabilityRisk } from './aiService.js';
import { z } from 'zod';

export async function createOrder(rawPayload: z.infer<typeof CreateOrderRequestSchema>): Promise<Order> {
  const payload = CreateOrderRequestSchema.parse(rawPayload);
  const targetPinCode = payload.delivery_address.pin_code.trim();

  // 1. Fetch all products and verify pin-code serviceability per vendor
  let totalAmount = 0;
  for (const item of payload.items) {
    const product = await db.getProductById(item.product_id);
    if (!product) {
      throw new Error(`Flower product with ID ${item.product_id} not found.`);
    }

    const vendor = await db.getVendorById(product.vendor_id);
    if (!vendor || !vendor.is_active) {
      throw new Error(`Florist vendor for "${product.title}" is currently inactive.`);
    }

    // Strict Hyperlocal Pin Code Verification
    if (!vendor.service_pincodes.includes(targetPinCode)) {
      throw new Error(
        `Delivery unserviceable: Florist "${vendor.store_name}" does not service pin code ${targetPinCode} for item "${product.title}". Supported pin codes: ${vendor.service_pincodes.join(', ')}`
      );
    }

    // Verify stock
    if (product.stock_quantity < item.quantity) {
      throw new Error(
        `Insufficient stock for "${product.title}". Available: ${product.stock_quantity}, requested: ${item.quantity}`
      );
    }

    totalAmount += product.price * item.quantity;
  }

  // 2. Determine simulated payment reference
  const paymentRef = payload.payment_method === 'CASH_ON_DELIVERY' 
    ? 'COD_VERIFIED_' + Date.now().toString().slice(-6)
    : 'PAY_GATEWAY_' + Date.now();

  const newOrderId = `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // 3. Execute atomic order creation and multi-vendor item splitting
  const { order, items } = await db.createOrderWithVendorSplitting({
    order: {
      id: newOrderId,
      customer_id: payload.customer_id,
      total_amount: Math.round(totalAmount * 100) / 100,
      payment_status: payload.payment_method === 'CASH_ON_DELIVERY' ? 'UNPAID' : 'PAID',
      payment_reference: paymentRef,
      delivery_address: payload.delivery_address,
      scheduled_slot: payload.scheduled_slot,
      delivery_date: payload.delivery_date,
      gift_message: payload.gift_message || null,
    },
    items: payload.items,
  });

  // 4. Asynchronously/immediately enrich items with AI Floral Intelligence
  // (Both Vase-Life Care Guide for Customer and Perishability Risk Assessor for Vendor)
  for (const item of items) {
    const product = await db.getProductById(item.product_id);
    if (product) {
      // AI Care Guide
      generateVaseLifeCareGuide({
        bouquetTitle: product.title,
        stemTypes: [product.stem_type],
        freshnessClass: product.freshness_class,
      }).then(careGuide => {
        db.attachCareAdvisory(item.id, careGuide);
      }).catch(err => console.error('Failed to attach care guide:', err));

      // AI Vendor Risk Assessor
      assessPerishabilityRisk({
        productTitle: product.title,
        stemTypes: [product.stem_type],
        transitDurationHours: payload.scheduled_slot === 'EXPRESS_IMMEDIATE' ? 1.0 : 2.5,
        ambientTempC: 30, // Default warm Indian climate ambient baseline
        deliverySlot: payload.scheduled_slot,
        freshnessClass: product.freshness_class,
      }).then(riskAssessment => {
        db.attachRiskAssessment(item.id, riskAssessment);
      }).catch(err => console.error('Failed to attach risk assessment:', err));
    }
  }

  const finalOrder = await db.getOrderById(newOrderId);
  return finalOrder || order;
}

export async function getOrderWithTracking(orderId: string): Promise<Order | null> {
  return db.getOrderById(orderId);
}

export async function updateOrderItemStatus(
  itemId: string, 
  status: OrderItemStatus, 
  vendorId?: string
) {
  return db.updateOrderItemStatus(itemId, status, vendorId);
}
