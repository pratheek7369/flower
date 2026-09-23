// =========================================================================
// VENDOR PORTAL ROUTES: METRICS, PIN CODES, KANBAN ORDERS, SETTINGS
// =========================================================================

import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { PinCodeCheckSchema } from '../shared/schemas.js';

export const vendorRouter = Router();

// List all active vendors
vendorRouter.get('/', async (_req: Request, res: Response) => {
  try {
    const vendors = await db.getAllVendors();
    res.json(vendors);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Check pin-code serviceability
vendorRouter.post('/check-pincode', async (req: Request, res: Response) => {
  try {
    const { pin_code } = PinCodeCheckSchema.parse(req.body);
    const serviceableVendors = await db.getVendorsServicingPinCode(pin_code);
    
    res.json({
      pin_code,
      is_serviceable: serviceableVendors.length > 0,
      serviceable_vendors_count: serviceableVendors.length,
      vendors: serviceableVendors.map(v => ({
        id: v.id,
        store_name: v.store_name,
        city: v.city,
        rating: v.rating,
      })),
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Single Vendor Details
vendorRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const vendorId = req.params.id as string;
    const vendor = await db.getVendorById(vendorId);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.json(vendor);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Vendor Operational Metrics (Dashboard)
vendorRouter.get('/:id/metrics', async (req: Request, res: Response) => {
  try {
    const vendorId = req.params.id as string;
    const metrics = await db.getVendorMetrics(vendorId);
    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Vendor Kanban / Order Processing View
vendorRouter.get('/:id/orders', async (req: Request, res: Response) => {
  try {
    const vendorId = req.params.id as string;
    const items = await db.getOrderItemsByVendorId(vendorId);
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update Vendor Settings (service pincodes, store info)
vendorRouter.put('/:id/settings', async (req: Request, res: Response) => {
  try {
    const vendorId = req.params.id as string;
    const updated = await db.updateVendor(vendorId, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});
