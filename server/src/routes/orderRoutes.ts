// =========================================================================
// ORDER ROUTES: PLACEMENT, MULTI-VENDOR SPLITTING, STATE MACHINE TRANSITIONS
// =========================================================================

import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { createOrder, updateOrderItemStatus } from '../services/orderService.js';
import { UpdateOrderItemStatusSchema } from '@shared/schemas';

export const orderRouter = Router();

// Create new order with multi-vendor splitting
orderRouter.post('/', async (req: Request, res: Response) => {
  try {
    const order = await createOrder(req.body);
    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// List orders (by customer or all for admin)
orderRouter.get('/', async (req: Request, res: Response) => {
  try {
    const customerId = req.query.customer_id as string;
    if (customerId) {
      const orders = await db.getOrdersByCustomerId(customerId);
      return res.json(orders);
    }
    const allOrders = await db.getAllOrders();
    res.json(allOrders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Single Order with Real-Time Multi-Stop Visual Tracking
orderRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const orderId = req.params.id as string;
    const order = await db.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Vendor Perishable Lifecycle Transition (State Machine)
orderRouter.patch('/items/:itemId/status', async (req: Request, res: Response) => {
  try {
    const { status } = UpdateOrderItemStatusSchema.parse(req.body);
    const vendorId = req.body.vendor_id;
    const itemId = req.params.itemId as string;

    const updatedItem = await updateOrderItemStatus(itemId, status, vendorId);
    if (!updatedItem) {
      return res.status(404).json({ error: 'Order item not found' });
    }
    res.json(updatedItem);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});
