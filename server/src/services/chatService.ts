// =========================================================================
// AI FLORAL CONCIERGE & COLD-CHAIN CHATBOT SERVICE (FloraAI)
// Powered by Gemini 2.5 Flash (@google/genai)
// =========================================================================

import { GoogleGenAI } from '@google/genai';
import { config } from '../config.js';
import { db } from '../db/database.js';
import { FlowerProduct } from '../shared/types.js';

let geminiClient: GoogleGenAI | null = null;
if (config.geminiApiKey) {
  try {
    geminiClient = new GoogleGenAI({ apiKey: config.geminiApiKey });
  } catch (err) {
    console.warn('[ChatService] Failed to initialize GoogleGenAI for chatbot:', err);
  }
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ChatResponse {
  reply: string;
  recommendedProducts?: FlowerProduct[];
  suggestedPrompts?: string[];
  suggestions?: string[];
}

export async function processFloralChat(
  message: string,
  history: ChatMessage[] = []
): Promise<ChatResponse> {
  const query = message.toLowerCase().trim();
  const allProductsRes = await db.queryProducts({});
  const products = allProductsRes.products;

  // Find relevant product matches to provide rich interactive cards
  let matches: FlowerProduct[] = [];
  if (query.includes('puja') || query.includes('temple') || query.includes('ritual') || query.includes('jasmine') || query.includes('malli') || query.includes('marigold') || query.includes('lotus')) {
    matches = products.filter(p => p.category === 'LOOSE_FLOWERS');
  } else if (query.includes('rose') || query.includes('anniversary') || query.includes('valentine') || query.includes('love')) {
    matches = products.filter(p => p.stem_type.toLowerCase().includes('rose'));
  } else if (query.includes('lily') || query.includes('lilies')) {
    matches = products.filter(p => p.title.toLowerCase().includes('lily'));
  } else if (query.includes('orchid') || query.includes('exotic') || query.includes('tropical') || query.includes('corporate')) {
    matches = products.filter(p => p.category === 'EXOTIC_CUT_STEMS' || p.category === 'INDOOR_PLANTS_FLORAL');
  } else {
    // Default top 2 popular items
    matches = products.slice(0, 2);
  }

  // 1. If Gemini API is available, call live Gemini 2.5 Flash
  if (geminiClient) {
    try {
      const catalogSummary = products.map(p => 
        `- ${p.title} (Price: ₹${p.price}, Stem: ${p.stem_type}, Freshness: ${p.freshness_window_hours}h, Category: ${p.category})`
      ).join('\n');

      const systemPrompt = `You are FloraAI, the Chief Master Florist, Botanical Physiologist, and Cold-Chain Logistics Specialist for FreshFlora.
You speak with warmth, elegance, horticultural authority, and practical care wisdom.

Platform Capabilities & Policies:
1. Cold-Chain Guarantee: Flowers are harvested at bud break, hydrated in aqua-packs at 16°C, and dispatched in thermal-barrier pouches.
2. Scheduled Slots: Express Immediate (90 mins), Dawn Puja Slot (6:00 AM - 9:00 AM), Standard Daytime, and Twilight Celebration.
3. Multi-Vendor Splitting: Orders with items from different florists automatically partition into discrete artisan tickets.
4. Pet Safety Rule: Oriental Lilies (Lilium/Hemerocallis) are EXTREMELY toxic to domestic felines (cats). Never recommend lilies to cat owners; recommend Dutch Roses, Orchids, or Marigolds instead.
5. Current Live Catalog:
${catalogSummary}

User Query: "${message}"

Provide a concise, helpful, and beautifully formatted response in markdown. If recommending a flower, mention its vase life and optimal water temperature.`;

      // Build contents array with conversation history
      const contents: any[] = [];
      contents.push({ role: 'user', parts: [{ text: systemPrompt }] });
      contents.push({ role: 'model', parts: [{ text: 'Greetings! I am FloraAI. How may I assist your floral journey today?' }] });

      for (const h of history.slice(-6)) {
        contents.push({
          role: h.role,
          parts: [{ text: h.text }],
        });
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await geminiClient.models.generateContent({
        model: config.geminiModel,
        contents,
      });

      const reply = response.text || 'I am delighted to assist with your floral arrangements.';
      const prompts = getSuggestedPrompts(query);
      return {
        reply,
        recommendedProducts: matches.slice(0, 2),
        suggestedPrompts: prompts,
        suggestions: prompts,
      };
    } catch (err) {
      console.warn('[ChatService] Gemini live chat call failed, falling back to botanical intelligence engine:', err);
    }
  }

  // 2. High-Fidelity Botanical Fallback Engine
  const botanicalReply = generateBotanicalRuleReply(query, products);
  const prompts = getSuggestedPrompts(query);
  return {
    reply: botanicalReply,
    recommendedProducts: matches.slice(0, 2),
    suggestedPrompts: prompts,
    suggestions: prompts,
  };
}

function generateBotanicalRuleReply(query: string, products: FlowerProduct[]): string {
  if (query.includes('puja') || query.includes('mandir') || query.includes('temple') || query.includes('jasmine') || query.includes('malli')) {
    return `🌸 **Divine Morning Puja Recommendations:**

For morning devotional rituals, nothing matches our **GI-Tagged Madurai Jasmine (Malli) Fresh Puja String** and **Sacred Saffron Marigold & Sevanthi Garlands**.

- **Harvest Timing**: Strung at 4:00 AM at bud break so petals unfurl right at your altar at dawn.
- **Recommended Slot**: Select our **Dawn Puja Slot (6:00 AM - 9:00 AM)** at checkout.
- **Hydration Tip**: Keep unopened buds wrapped in the moist banana leaf wrapper in a cool spot until ceremonial offering. Avoid synthetic chemical flower food on puja flowers.`;
  }

  if (query.includes('cat') || query.includes('pet') || query.includes('toxic') || query.includes('dog')) {
    return `🐾 **Crucial Pet Safety Notice Regarding Lilies:**

**WARNING:** All parts of **Oriental and Asiatic Lilies (Lilium species)**—including petals, leaves, pollen, and even vase water—are **severely nephrotoxic (poisonous) to cats**. Ingestion of even microscopic pollen amounts can lead to acute renal failure within 18–36 hours.

**Safe & Stunning Botanical Alternatives:**
- **Dutch Roses**: 100% non-toxic to felines and canines.
- **Dendrobium & Phalaenopsis Orchids**: Completely pet-safe and exceptionally long-lasting (10–14 days).
- **Marigolds & Freesias**: Safe for curious domestic companions.`;
  }

  if (query.includes('rose') || query.includes('cut') || query.includes('vase') || query.includes('longer') || query.includes('trim')) {
    return `✂️ **Master Florist Secret to Double Rose Vase-Life:**

1. **Underwater 45° Angle Cut**: Always snip 2 cm off the stem base submerged underwater or under a running faucet. This prevents atmospheric air bubbles (embolisms) from lodging into the xylem vascular conduits.
2. **De-Foliate Submerged Stems**: Strip every leaf that sits below the water level. Submerged foliage decays rapidly, multiplying waterborne bacteria that choke stems.
3. **Conditioning Temperature**: Roses drink best in **tepid water (20°C–22°C)**. Add 1 sachet of Chrysal floral food to provide essential sucrose carbohydrates and bactericides.
4. **Ethylene Defense**: Keep your vase at least 2 meters away from ripening bananas, mangoes, or apples, which emit petal-shedding ethylene gas.`;
  }

  if (query.includes('pin') || query.includes('delivery') || query.includes('speed') || query.includes('express') || query.includes('where')) {
    return `🚚 **Hyperlocal Cold-Chain Serviceability:**

We operate direct regional cold-chain dispatch hubs in **Mumbai (400001, 400050, 400053)**, **Bangalore (560001, 560008, 560034)**, and **Madurai**.

- **Express Cold-Bag**: Delivered within 90–120 minutes inside active micro-zones.
- **Early Dawn Slot**: 6:00 AM - 9:00 AM for fresh ritual blooms.
- You can enter your 6-digit pin code anytime in the header checker to dynamically highlight serviceable florists!`;
  }

  if (query.includes('anniversary') || query.includes('love') || query.includes('romantic') || query.includes('birthday')) {
    return `🌹 **Curated Romantic & Anniversary Selections:**

For celebrations of love and milestones, our **Velvet Dutch Red Rose Grandeur** (24 long-stem Grand Prix roses) and **Stargazer Oriental Lily & Peach Rose Radiance** are hand-tied in Korean matte luxury paper with baby's breath and fresh eucalyptus.

Delivered with our signature temperature-controlled cold pouch and custom Gemini AI care instructions!`;
  }

  return `🌿 **Welcome to FreshFlora Concierge!**

I can assist you with:
- Selecting ritual flowers for **Morning Puja & Temples** (Madurai Jasmine, Marigold garlands, Sacred Lotuses).
- Gifting recommendations for **Anniversaries, Birthdays, and Corporate Foyers**.
- **Post-harvest stem care protocols** (water temperature, cutting angles, preservative recipes).
- **Pet safety checks** and cold-chain pin code delivery estimates.

How may I brighten your day with fresh blooms?`;
}

function getSuggestedPrompts(query: string): string[] {
  if (query.includes('puja')) {
    return ['What time does Dawn Puja slot deliver?', 'How long does Madurai Jasmine stay fragrant?', 'Can I add Lotus stems?'];
  }
  if (query.includes('cat') || query.includes('pet')) {
    return ['Are orchids safe for cats?', 'Show pet-friendly bouquets', 'How to clean lily pollen stains'];
  }
  return [
    'Best flowers for morning puja rituals',
    'How do I extend Dutch rose vase life?',
    'Are lilies safe for cats and pets?',
    'Can I get express delivery to 400001?',
  ];
}
