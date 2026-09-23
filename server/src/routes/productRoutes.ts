// =========================================================================
// PRODUCT & CATALOG ROUTES: FACETED SEARCH & VENDOR INVENTORY CRUD
// =========================================================================

import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { CatalogFilterSchema, VendorProductSchema } from '../shared/schemas.js';

export const productRouter = Router();

// Faceted Catalog Search
productRouter.get('/', async (req: Request, res: Response) => {
  try {
    const minPrice = req.query.min_price ? parseFloat(req.query.min_price as string) : undefined;
    const maxPrice = req.query.max_price ? parseFloat(req.query.max_price as string) : undefined;

    const parsedQuery = CatalogFilterSchema.parse({
      search: req.query.search,
      category: req.query.category,
      occasion: req.query.occasion,
      pin_code: req.query.pin_code,
      min_price: minPrice,
      max_price: maxPrice,
      freshness_class: req.query.freshness_class,
      sort_by: req.query.sort_by,
      vendor_id: req.query.vendor_id,
    });

    const result = await db.queryProducts(parsedQuery);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Single Product Details
productRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const productId = req.params.id as string;
    const product = await db.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Flower product not found' });
    }
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Vendor: Create New Stem / Product
productRouter.post('/', async (req: Request, res: Response) => {
  try {
    const vendorId = req.body.vendor_id;
    if (!vendorId) {
      return res.status(400).json({ error: 'vendor_id is required' });
    }

    const validated = VendorProductSchema.parse(req.body);
    const slug = validated.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newProduct = await db.createProduct({
      id: `p-${Date.now()}`,
      vendor_id: vendorId,
      title: validated.title,
      slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
      description: validated.description,
      category: validated.category,
      stem_type: validated.stem_type,
      price: validated.price,
      stock_quantity: validated.stock_quantity,
      images: validated.images,
      freshness_window_hours: validated.freshness_window_hours,
      is_available: validated.is_available,
      occasion_tags: validated.occasion_tags,
      freshness_class: validated.freshness_window_hours <= 24 ? 'ULTRA_PERISHABLE' : validated.freshness_window_hours >= 72 ? 'EXTENDED_LIFE' : 'STANDARD_FRESH',
    });

    res.status(201).json(newProduct);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Vendor: Update Product Stock / Details
productRouter.put('/:id', async (req: Request, res: Response) => {
  try {
    const productId = req.params.id as string;
    const updated = await db.updateProduct(productId, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Vendor: Delete Product
productRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const productId = req.params.id as string;
    const success = await db.deleteProduct(productId);
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
