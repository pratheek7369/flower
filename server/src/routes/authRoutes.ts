// =========================================================================
// AUTH & RBAC ROUTES: CUSTOMER, VENDOR, ADMIN
// =========================================================================

import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { UserRoleSchema } from '@shared/schemas';
import { UserRole } from '@shared/types';

export const authRouter = Router();

// Login or instant profile retrieval
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, role } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    let profile = await db.getProfileByEmail(email);
    if (!profile) {
      // Auto-create for seamless demonstration if not found
      profile = await db.createProfile({
        id: `u-${Date.now()}`,
        email,
        full_name: email.split('@')[0],
        role: role && ['CUSTOMER', 'VENDOR', 'ADMIN'].includes(role) ? role : 'CUSTOMER',
      });
    }

    let vendorProfile = null;
    if (profile.role === 'VENDOR') {
      vendorProfile = await db.getVendorByUserId(profile.id);
      if (!vendorProfile) {
        // Find first vendor or create a default store
        const allVendors = await db.getAllVendors();
        vendorProfile = allVendors[0] || null;
      }
    }

    res.json({
      user: profile,
      vendor: vendorProfile,
      token: `mock-jwt-token-for-${profile.id}`,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Switch role convenience endpoint for rapid role switching (Customer <-> Vendor <-> Admin)
authRouter.post('/switch-role', async (req: Request, res: Response) => {
  try {
    const { targetRole } = req.body;
    const validatedRole = UserRoleSchema.parse(targetRole);

    const allProfiles = await db.getAllProfiles();
    const matchingProfile = allProfiles.find(p => p.role === validatedRole);

    if (!matchingProfile) {
      return res.status(404).json({ error: `No seed profile found with role ${targetRole}` });
    }

    let vendorProfile = null;
    if (matchingProfile.role === 'VENDOR') {
      vendorProfile = await db.getVendorByUserId(matchingProfile.id);
      if (!vendorProfile) {
        const allVendors = await db.getAllVendors();
        vendorProfile = allVendors[0];
      }
    }

    res.json({
      user: matchingProfile,
      vendor: vendorProfile,
      token: `mock-jwt-token-for-${matchingProfile.id}`,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// List all registered demo profiles for header switcher
authRouter.get('/demo-profiles', async (_req: Request, res: Response) => {
  try {
    const profiles = await db.getAllProfiles();
    const vendors = await db.getAllVendors();
    res.json({ profiles, vendors });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
