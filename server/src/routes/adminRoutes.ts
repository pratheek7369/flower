// =========================================================================
// ADMIN ROUTES: GLOBAL GMV, VENDOR VERIFICATION & COMMISSION LEDGER
// =========================================================================

import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';

export const adminRouter = Router();

// Global Platform Metrics
adminRouter.get('/metrics', async (_req: Request, res: Response) => {
  try {
    const metrics = await db.getAdminMetrics();
    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: List all vendors with status & commission
adminRouter.get('/vendors', async (_req: Request, res: Response) => {
  try {
    const vendors = await db.getAllVendors();
    res.json(vendors);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Update vendor status (active/suspended) & commission
adminRouter.patch('/vendors/:id', async (req: Request, res: Response) => {
  try {
    const vendorId = req.params.id as string;
    const { is_active, commission_rate } = req.body;
    const updates: any = {};
    if (typeof is_active === 'boolean') updates.is_active = is_active;
    if (typeof commission_rate === 'number') updates.commission_rate = commission_rate;

    const updated = await db.updateVendor(vendorId, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});
