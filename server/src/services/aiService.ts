// =========================================================================
// SERVER-SIDE AI FLORAL INTELLIGENCE ENGINE (@google/genai)
// Powered by Gemini 2.5 Flash with Zod Runtime Schema Validation
// =========================================================================

import { GoogleGenAI } from '@google/genai';
import { 
  FloralCareGuideSchema, 
  PerishabilityRiskAssessmentSchema, 
  LogisticsRoutingNoteSchema 
} from '@shared/schemas';
import { 
  FloralCareGuide, 
  PerishabilityRiskAssessment 
} from '@shared/types';
import { config } from '../config.js';

let geminiClient: GoogleGenAI | null = null;
if (config.geminiApiKey) {
  try {
    geminiClient = new GoogleGenAI({ apiKey: config.geminiApiKey });
    console.log('[AIService] @google/genai client initialized with Gemini 2.5 Flash');
  } catch (err) {
    console.warn('[AIService] Error initializing @google/genai, using botanical fallback engine:', err);
  }
} else {
  console.log('[AIService] No GEMINI_API_KEY detected. Active botanical knowledge engine will handle AI advisories.');
}

/**
 * 1. VASE-LIFE & STEM PRESERVATION ADVISOR
 * Generates dynamic post-harvest care protocols for customer order confirmations
 */
export async function generateVaseLifeCareGuide(params: {
  bouquetTitle: string;
  stemTypes: string[];
  freshnessClass?: string;
  weatherNote?: string;
}): Promise<FloralCareGuide> {
  const { bouquetTitle, stemTypes, freshnessClass, weatherNote } = params;

  if (geminiClient) {
    try {
      const prompt = `You are a World-Class Master Horticulturist and Post-Harvest Floral Physiologist.
Generate an actionable, scientifically grounded vase-life preservation guide for a customer who just received:
Bouquet Name: "${bouquetTitle}"
Stems Included: ${stemTypes.join(', ')}
Freshness Classification: ${freshnessClass || 'STANDARD_FRESH'}
Transit / Season Context: ${weatherNote || 'Moderate urban room temperature (22-26°C)'}

Return pure JSON complying strictly with this structure:
{
  "summary": "1-2 sentence overview of care priorities",
  "water_temperature_celsius": number,
  "trimming_technique": "angle, underwater cutting, leaf removal instructions",
  "vase_preparation": "sanitizing, water depth instructions",
  "nourishment_recipe": "exact packet dilution or sugar/citrus alternative recipe",
  "environmental_warnings": ["warning 1", "warning 2", "warning 3"],
  "expected_vase_life_days": number,
  "daily_checklist": ["Day 1 action", "Day 2 action", "Day 3 action", "Day 4+ action"]
}`;

      const response = await geminiClient.models.generateContent({
        model: config.geminiModel,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text?.trim() || '';
      const parsedJson = JSON.parse(responseText);
      const validated = FloralCareGuideSchema.parse(parsedJson);
      return validated;
    } catch (error) {
      console.warn('[AIService] Live Gemini API call failed, falling back to botanical rule engine:', error);
    }
  }

  // High-fidelity botanical intelligence fallback
  return getBotanicalFallbackCareGuide(bouquetTitle, stemTypes, freshnessClass);
}

/**
 * 2. VENDOR PERISHABILITY RISK ASSESSOR
 * Analyzes transit duration, ambient temperature, and stem type to alert vendors on necessary packaging
 */
export async function assessPerishabilityRisk(params: {
  productTitle: string;
  stemTypes: string[];
  transitDurationHours: number;
  ambientTempC: number;
  deliverySlot: string;
  freshnessClass?: string;
}): Promise<PerishabilityRiskAssessment> {
  const { productTitle, stemTypes, transitDurationHours, ambientTempC, deliverySlot, freshnessClass } = params;

  if (geminiClient) {
    try {
      const prompt = `You are an Elite Cold-Chain Logistics Specialist for Fresh Horticultural Freight.
Analyze the transit perishability risk for this floral shipment:
Product: "${productTitle}"
Stem Varieties: ${stemTypes.join(', ')}
Transit Window: ${transitDurationHours} hours
Ambient Transit Temperature: ${ambientTempC}°C
Delivery Slot: ${deliverySlot}
Freshness Classification: ${freshnessClass || 'STANDARD_FRESH'}

Evaluate thermal shock, ethylene vulnerability, transpiration loss, and mechanical bruising.
Return pure JSON complying strictly with this structure:
{
  "risk_level": "LOW" | "MODERATE" | "HIGH" | "CRITICAL",
  "risk_score": number (0 to 100),
  "ambient_temp_assumed": number,
  "transit_duration_hours": number,
  "packaging_instructions": {
    "hydration_method": "exact stem reservoir specification",
    "thermal_protection": "insulation or cooling pack specification",
    "boxed_orientation": "standing or flat specification"
  },
  "dispatch_deadline_minutes": number,
  "handling_precautions": ["precaution 1", "precaution 2"],
  "courier_notes": "bold label for delivery person"
}`;

      const response = await geminiClient.models.generateContent({
        model: config.geminiModel,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text?.trim() || '';
      const parsedJson = JSON.parse(responseText);
      const validated = PerishabilityRiskAssessmentSchema.parse(parsedJson);
      return validated;
    } catch (error) {
      console.warn('[AIService] Live Gemini risk assessment failed, using logistics rule engine:', error);
    }
  }

  // Botanical cold-chain rule engine fallback
  return calculateColdChainRiskAssessment(productTitle, stemTypes, transitDurationHours, ambientTempC, deliverySlot, freshnessClass);
}

/**
 * 3. LOGISTICS ROUTING NOTE GENERATOR
 */
export async function generateLogisticsRoutingNotes(params: {
  productTitle: string;
  freshnessClass: string;
  ambientTempC: number;
  slot: string;
}) {
  const isUltra = params.freshnessClass === 'ULTRA_PERISHABLE' || params.productTitle.toLowerCase().includes('jasmine');
  const isWarm = params.ambientTempC >= 30;

  return LogisticsRoutingNoteSchema.parse({
    recommended_courier_type: isUltra || isWarm ? 'EXPRESS_TWO_WHEELER_COLD_BAG' : 'STANDARD_SAME_DAY',
    priority_flag: isUltra ? 'CRITICAL_PERISHABLE' : isWarm ? 'RUSH' : 'NORMAL',
    maximum_ambient_exposure_hours: isUltra ? 1.5 : 4.0,
    special_handling: [
      'Maintain thermal pouch below 20°C',
      'Do not place in rear boot near engine exhaust',
      'Verify recipient handoff directly without leaving in open doorway',
    ],
  });
}

// =========================================================================
// BOTANICAL INTELLIGENCE RULES (FALLBACK ENGINE)
// =========================================================================

function getBotanicalFallbackCareGuide(
  title: string, 
  stems: string[], 
  freshnessClass?: string
): FloralCareGuide {
  const combined = (title + ' ' + stems.join(' ')).toLowerCase();

  if (combined.includes('jasmine') || combined.includes('malli') || combined.includes('lotus')) {
    return {
      summary: 'Sacred delicate buds with high metabolic activity. Keep wrapped in moist natural fiber until ritual or puja offering.',
      water_temperature_celsius: 16,
      trimming_technique: 'Do not trim delicate unopened bud clusters. For lotus stems, submerge cut ends in a 20°C water bowl to maintain stem turgidity.',
      vase_preparation: 'Use a wide shallow brass, copper, or ceramic urlis vessel filled with clean cool water.',
      nourishment_recipe: 'Light misting with chilled mineral water; avoid synthetic floral food on edible puja blooms.',
      environmental_warnings: [
        'Keep away from incense flames and camphor smoke until ceremonial offering time',
        'Avoid warm direct afternoon sun which forces premature petal opening',
      ],
      expected_vase_life_days: 2,
      daily_checklist: [
        'Hour 0: Unpack immediately and place in a shaded cool room',
        'Hour 6: Lightly mist with chilled water if ambient air is dry',
        'Morning: Float in traditional water bowl for maximum aroma diffusion',
      ],
    };
  }

  if (combined.includes('orchid') || combined.includes('anthurium') || combined.includes('cymbidium')) {
    return {
      summary: 'Exotic tropical blooms featuring long-lasting waxy spathes and low ethylene sensitivity.',
      water_temperature_celsius: 24,
      trimming_technique: 'Recut 1 cm from the stem base at a 45-degree angle every 3 days. Never crush or split the stem bases.',
      vase_preparation: 'Wash vase with mild soap. Fill with 7-10 cm of room-temperature water. Avoid drowning upper stem nodes.',
      nourishment_recipe: 'Dilute standard flower food to 50% strength; tropicals require less carbohydrate than temperate cut flowers.',
      environmental_warnings: [
        'Do not refrigerate below 12°C (tropical blooms suffer chill injury and blackened spots)',
        'Shield from drafts originating from ceiling fans or air-conditioners',
      ],
      expected_vase_life_days: 12,
      daily_checklist: [
        'Day 1: Trim stem base underwater, set in ambient diffused light',
        'Day 3: Top up clean water reservoir',
        'Day 6: Complete water change, clean vase walls, and recut 1 cm',
        'Day 9: Mist aerial bloom spikes lightly',
      ],
    };
  }

  if (combined.includes('lily') || combined.includes('stargazer')) {
    return {
      summary: 'Highly fragrant Oriental Lilies benefit from prompt pollen removal to extend bloom duration and prevent staining.',
      water_temperature_celsius: 20,
      trimming_technique: 'Cut stems at a 45-degree angle under lukewarm water. Strip all foliage submerged below the waterline to curb bacterial growth.',
      vase_preparation: 'Heavy, tall glass vase filled 60% with fresh water containing bactericide and sucrose flower food.',
      nourishment_recipe: '1 packet Chrysal or Floralife powder per 1 litre of clean filtered water.',
      environmental_warnings: [
        'CAUTION: Lily pollen is toxic to domestic felines; remove yellow anthers with a tissue as soon as petals open',
        'Keep away from ripening fruit displays to delay senescence',
      ],
      expected_vase_life_days: 8,
      daily_checklist: [
        'Day 1: Unbox, trim 2 cm at 45° angle, place in deep water',
        'Day 2: Pluck out powdery pollen stamens as buds unfurl',
        'Day 4: Empty vase water, rinse stems, and add fresh nutrient solution',
        'Day 7: Snip faded lower florets to direct sap to upper terminal buds',
      ],
    };
  }

  // Default Luxury Rose & Mixed Bouquet Guide
  return {
    summary: 'Premium cut stems require clean hydraulic pathways. Recut underwater and condition in tepid nutrient solution.',
    water_temperature_celsius: 21,
    trimming_technique: 'Cut 2 cm off stem ends at a sharp 45-degree angle with sterilized bypass shears underwater to prevent air embolisms.',
    vase_preparation: 'Sanitize glass vase thoroughly with diluted bleach rinse, dry, and fill 50% with clean cool water.',
    nourishment_recipe: 'Mix 1 standard floral nutrient sachet (or 1 tsp sugar + 2 drops lemon juice + 2 drops clear bleach per litre).',
    environmental_warnings: [
      'Do not place in direct sunlight, atop electronics, or in line with heating/cooling vents',
      'Keep away from ripening fruits which emit petal-dropping ethylene gas',
    ],
    expected_vase_life_days: 7,
    daily_checklist: [
      'Day 1: Unbox, strip lower leaves, trim stems underwater, and allow 2 hours to hydrate',
      'Day 2: Verify water level (thirsty blooms can drink half the vase overnight)',
      'Day 3: Replace cloudy water, sanitize vase, and recut stem bases by 1 cm',
      'Day 5: Remove any wilted outer petals to preserve inner core vibrancy',
    ],
  };
}

function calculateColdChainRiskAssessment(
  title: string,
  stems: string[],
  transitHours: number,
  ambientTempC: number,
  slot: string,
  freshnessClass?: string
): PerishabilityRiskAssessment {
  const text = (title + ' ' + stems.join(' ')).toLowerCase();
  const isUltra = freshnessClass === 'ULTRA_PERISHABLE' || text.includes('jasmine') || text.includes('lotus');
  const isExotic = freshnessClass === 'EXTENDED_LIFE' || text.includes('orchid') || text.includes('anthurium');

  let riskScore = 20;

  if (isUltra) riskScore += 45;
  if (ambientTempC > 28) riskScore += (ambientTempC - 28) * 4;
  if (transitHours > 2) riskScore += (transitHours - 2) * 10;
  if (slot === 'EXPRESS_IMMEDIATE') riskScore -= 10;
  if (isExotic) riskScore = Math.max(15, riskScore - 25);

  riskScore = Math.min(95, Math.max(10, Math.round(riskScore)));

  let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (riskScore >= 75) riskLevel = 'CRITICAL';
  else if (riskScore >= 50) riskLevel = 'HIGH';
  else if (riskScore >= 30) riskLevel = 'MODERATE';

  let hydrationMethod = 'Saturated floral foam stem collar with botanical preservative';
  let thermalProtection = 'Corrugated double-wall carton with breathable air channels';
  let boxedOrientation = 'Vertical upright carrier';
  let deadlineMinutes = 120;
  const precautions: string[] = [];

  if (riskLevel === 'CRITICAL') {
    hydrationMethod = 'Pre-cooled wet cellulose wrap sealed with botanical paraffin wax wrap';
    thermalProtection = 'Thermal reflective foil pouch with conditioned 16°C gel freeze pack';
    boxedOrientation = 'Flat horizontal cushioned shock-resistant tray';
    deadlineMinutes = 45;
    precautions.push('Priority express dispatch required: do not leave in courier staging area');
    precautions.push('Monitor temperature; ensure pouch does not exceed 24°C in direct transit');
  } else if (riskLevel === 'HIGH') {
    hydrationMethod = 'Individual rubberized aqua-tubes with liquid glucose solution on each stem';
    thermalProtection = 'Insulated foil liner inside rigid delivery box';
    boxedOrientation = 'Vertical standing pack with anti-tip base';
    deadlineMinutes = 75;
    precautions.push('Keep upright during transport to maintain reservoir seal');
    precautions.push('Avoid direct sunlight in delivery carrier boot');
  } else {
    precautions.push('Standard careful handling; keep flowers shaded');
    precautions.push('Deliver within scheduled delivery window');
  }

  return {
    risk_level: riskLevel,
    risk_score: riskScore,
    ambient_temp_assumed: ambientTempC,
    transit_duration_hours: transitHours,
    packaging_instructions: {
      hydration_method: hydrationMethod,
      thermal_protection: thermalProtection,
      boxed_orientation: boxedOrientation,
    },
    dispatch_deadline_minutes: deadlineMinutes,
    handling_precautions: precautions,
    courier_notes: `${riskLevel} PERISHABILITY: Deliver within ${deadlineMinutes} mins. Handle with care.`,
  };
}
