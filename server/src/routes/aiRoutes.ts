// =========================================================================
// AI FLORAL & LOGISTICS INTELLIGENCE ROUTES (@google/genai)
// =========================================================================

import { Router, Request, Response } from 'express';
import { 
  generateVaseLifeCareGuide, 
  assessPerishabilityRisk, 
  generateLogisticsRoutingNotes 
} from '../services/aiService.js';

export const aiRouter = Router();

// 1. Vase-Life & Stem Preservation Advisor
aiRouter.post('/care-guide', async (req: Request, res: Response) => {
  try {
    const { bouquetTitle, stemTypes, freshnessClass, weatherNote } = req.body;
    if (!bouquetTitle || !stemTypes) {
      return res.status(400).json({ error: 'bouquetTitle and stemTypes are required' });
    }

    const careGuide = await generateVaseLifeCareGuide({
      bouquetTitle,
      stemTypes: Array.isArray(stemTypes) ? stemTypes : [stemTypes],
      freshnessClass,
      weatherNote,
    });

    res.json(careGuide);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Vendor Perishability Risk Assessor
aiRouter.post('/perishability-risk', async (req: Request, res: Response) => {
  try {
    const { 
      productTitle, 
      stemTypes, 
      transitDurationHours, 
      ambientTempC, 
      deliverySlot, 
      freshnessClass 
    } = req.body;

    if (!productTitle || !stemTypes) {
      return res.status(400).json({ error: 'productTitle and stemTypes are required' });
    }

    const riskAssessment = await assessPerishabilityRisk({
      productTitle,
      stemTypes: Array.isArray(stemTypes) ? stemTypes : [stemTypes],
      transitDurationHours: typeof transitDurationHours === 'number' ? transitDurationHours : 2.0,
      ambientTempC: typeof ambientTempC === 'number' ? ambientTempC : 28,
      deliverySlot: deliverySlot || 'STANDARD_DAY',
      freshnessClass,
    });

    res.json(riskAssessment);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Automated Courier Routing Notes
aiRouter.post('/routing-notes', async (req: Request, res: Response) => {
  try {
    const { productTitle, freshnessClass, ambientTempC, slot } = req.body;
    const notes = await generateLogisticsRoutingNotes({
      productTitle: productTitle || 'Fresh Floral Item',
      freshnessClass: freshnessClass || 'STANDARD_FRESH',
      ambientTempC: typeof ambientTempC === 'number' ? ambientTempC : 28,
      slot: slot || 'STANDARD_DAY',
    });
    res.json(notes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Interactive AI Floral Concierge Chatbot (FloraAI)
aiRouter.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const { processFloralChat } = await import('../services/chatService.js');
    const result = await processFloralChat(message, Array.isArray(history) ? history : []);
    res.json(result);
  } catch (error: any) {
    console.error('[AI Chat Error]', error);
    res.status(500).json({ error: error.message || 'Failed to process chat' });
  }
});
