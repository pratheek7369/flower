// =========================================================================
// SUPABASE CLIENT & LIVE POSTGRESQL DATA SYNCHRONIZER
// =========================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config.js';
import { SEED_PROFILES, SEED_VENDORS, SEED_PRODUCTS, SEED_ORDERS, SEED_ORDER_ITEMS } from './seedData.js';

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseInstance && config.supabaseUrl && config.supabaseKey) {
    try {
      supabaseInstance = createClient(config.supabaseUrl, config.supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      console.log(`[SupabaseClient] Initialized connection to ${config.supabaseUrl}`);
    } catch (err) {
      console.warn('[SupabaseClient] Failed to initialize Supabase client:', err);
    }
  }
  return supabaseInstance;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(config.supabaseUrl && config.supabaseKey);
}

/**
 * Validates connection to live Supabase project
 */
export async function testSupabaseConnection(): Promise<{
  status: 'connected' | 'not_configured' | 'error';
  connected: boolean;
  dual_mode: string;
  database_mode: string;
  url: string;
  tables?: Record<string, number>;
  error?: string;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      status: 'not_configured',
      connected: false,
      dual_mode: 'active',
      database_mode: 'embedded_relational',
      url: config.supabaseUrl || 'not_configured',
      error: 'SUPABASE_URL and SUPABASE_ANON_KEY / SERVICE_ROLE_KEY are not configured in environment or .env. The platform is running securely on the embedded relational engine.',
    };
  }

  try {
    const { error: prodErr, count: prodCount } = await client
      .from('flower_products')
      .select('*', { count: 'exact' })
      .limit(1);

    if (prodErr) {
      return {
        status: 'error',
        connected: false,
        dual_mode: 'active',
        database_mode: 'embedded_relational_fallback',
        url: config.supabaseUrl,
        error: `Supabase credentials valid, but tables are not yet created: "${prodErr.message}". Please paste and run schema.sql in your Supabase SQL Editor.`,
      };
    }

    const { count: vendorCount } = await client
      .from('vendor_profiles')
      .select('*', { count: 'exact' })
      .limit(1);

    const { count: orderCount } = await client
      .from('orders')
      .select('*', { count: 'exact' })
      .limit(1);

    return {
      status: 'connected',
      connected: true,
      dual_mode: 'active',
      database_mode: 'supabase_live',
      url: config.supabaseUrl,
      tables: {
        flower_products: prodCount || 0,
        vendor_profiles: vendorCount || 0,
        orders: orderCount || 0,
      },
    };
  } catch (err: any) {
    return {
      status: 'error',
      connected: false,
      dual_mode: 'active',
      database_mode: 'embedded_relational_fallback',
      url: config.supabaseUrl,
      error: err.message,
    };
  }
}

/**
 * Automatically seeds the Supabase tables if they are empty
 */
export async function syncSeedToSupabase(): Promise<{ synced: boolean; message: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { synced: false, message: 'Supabase credentials not configured' };
  }

  try {
    // Check if tables exist
    const { count, error: checkErr } = await client
      .from('flower_products')
      .select('*', { count: 'exact' })
      .limit(1);

    if (checkErr) {
      return {
        synced: false,
        message: `Supabase connected, but schema tables are missing: "${checkErr.message}". Please run schema.sql in your Supabase SQL Editor first.`,
      };
    }

    if (count && count > 0) {
      return { synced: true, message: `Supabase already populated with ${count} flower products.` };
    }

    console.log('[SupabaseSync] Seeding live Supabase PostgreSQL tables...');

    // 1. Profiles
    for (const p of SEED_PROFILES) {
      const { error: pErr } = await client.from('profiles').upsert({
        id: p.id,
        email: p.email,
        full_name: p.full_name,
        phone: p.phone,
        role: p.role,
      });
      if (pErr) throw new Error(`profiles: ${pErr.message}`);
    }

    // 2. Vendors
    for (const v of SEED_VENDORS) {
      const { error: vErr } = await client.from('vendor_profiles').upsert({
        id: v.id,
        user_id: v.user_id,
        store_name: v.store_name,
        store_slug: v.store_slug,
        description: v.description,
        address: v.address,
        city: v.city,
        service_pincodes: v.service_pincodes,
        is_active: v.is_active,
        rating: v.rating,
      });
      if (vErr) throw new Error(`vendor_profiles: ${vErr.message}`);
    }

    // 3. Flower Products
    for (const prod of SEED_PRODUCTS) {
      const { error: prErr } = await client.from('flower_products').upsert({
        id: prod.id,
        vendor_id: prod.vendor_id,
        title: prod.title,
        slug: prod.slug,
        description: prod.description,
        category: prod.category,
        stem_type: prod.stem_type,
        price: prod.price,
        stock_quantity: prod.stock_quantity,
        images: prod.images,
        freshness_window_hours: prod.freshness_window_hours,
        is_available: prod.is_available,
      });
      if (prErr) throw new Error(`flower_products: ${prErr.message}`);
    }

    return { synced: true, message: 'Successfully populated live Supabase database with master floral seed data.' };
  } catch (err: any) {
    console.error('[SupabaseSync] Error seeding Supabase:', err);
    return { synced: false, message: err.message };
  }
}
