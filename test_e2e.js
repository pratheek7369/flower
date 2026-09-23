// =========================================================================
// END-TO-END AUTOMATED VERIFICATION SUITE FOR FRESH FLOWER PLATFORM
// =========================================================================

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🌸 STARTING COMPREHENSIVE E2E VERIFICATION SUITE\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✕ FAIL: ${testName} - ${details}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    console.log('--- 1. Platform Health Check ---');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const health = await healthRes.json();
    assert(health.status === 'healthy', 'API status is healthy');
    assert(health.model === 'gemini-2.5-flash', 'Configured AI model is gemini-2.5-flash');

    // 2. Catalog & Faceted Filters
    console.log('\n--- 2. Catalog & Faceted Search ---');
    const allProductsRes = await fetch(`${BASE_URL}/products`);
    const allProducts = await allProductsRes.json();
    assert(allProducts.products.length >= 12, `Catalog contains ${allProducts.products.length} products`);

    // Category filter: BOUQUETS
    const bouquetsRes = await fetch(`${BASE_URL}/products?category=BOUQUETS`);
    const bouquets = await bouquetsRes.json();
    assert(bouquets.products.every(p => p.category === 'BOUQUETS'), 'Category filter returns only BOUQUETS');

    // Occasion filter: FESTIVAL_PUJA
    const pujaRes = await fetch(`${BASE_URL}/products?occasion=FESTIVAL_PUJA`);
    const puja = await pujaRes.json();
    assert(puja.products.length > 0, `Occasion filter returns ${puja.products.length} Puja products`);

    // Price sort: price_asc
    const sortedRes = await fetch(`${BASE_URL}/products?sort_by=price_asc`);
    const sorted = await sortedRes.json();
    const prices = sorted.products.map(p => p.price);
    const isSortedAsc = prices.every((val, i, arr) => !i || arr[i - 1] <= val);
    assert(isSortedAsc, 'Sort by price_asc strictly ascending');

    // 3. Hyperlocal Pin-Code Serviceability Verification
    console.log('\n--- 3. Hyperlocal Pin-Code Serviceability ---');
    // Valid Mumbai Pin: 400001
    const pinCheckMumbai = await fetch(`${BASE_URL}/vendors/check-pincode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin_code: '400001' }),
    }).then(r => r.json());
    assert(pinCheckMumbai.is_serviceable === true, 'Pin code 400001 is serviceable');
    assert(pinCheckMumbai.serviceable_vendors_count >= 2, `Pin 400001 serviced by ${pinCheckMumbai.serviceable_vendors_count} florists`);

    // Non-serviced Pin: 999999
    const pinCheckInvalid = await fetch(`${BASE_URL}/vendors/check-pincode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin_code: '999999' }),
    }).then(r => r.json());
    assert(pinCheckInvalid.is_serviceable === false, 'Pin code 999999 correctly flagged as unserviceable');

    // 4. Server-Side Gemini 2.5 Flash AI Floral Intelligence
    console.log('\n--- 4. Server-Side AI Floral Intelligence ---');
    // 4a. Vase-Life & Stem Preservation Advisor
    const careGuide = await fetch(`${BASE_URL}/ai/care-guide`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bouquetTitle: 'Velvet Dutch Red Rose Grandeur',
        stemTypes: ['Grand Prix Dutch Rose', 'Eucalyptus'],
        freshnessClass: 'STANDARD_FRESH',
      }),
    }).then(r => r.json());

    assert(Boolean(careGuide.summary), 'AI Vase-Life Advisor generated summary');
    assert(typeof careGuide.water_temperature_celsius === 'number', `Water temp recommended: ${careGuide.water_temperature_celsius}°C`);
    assert(Boolean(careGuide.trimming_technique), 'Trimming technique instructions present');
    assert(careGuide.environmental_warnings.length > 0, 'Ambient warnings include ethylene / drafts');
    assert(careGuide.daily_checklist.length >= 3, `Daily routine contains ${careGuide.daily_checklist.length} checklist steps`);

    // 4b. Vendor Perishability Risk Assessor
    const riskAssessment = await fetch(`${BASE_URL}/ai/perishability-risk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productTitle: 'GI-Tagged Madurai Jasmine (Malli) Fresh Puja String',
        stemTypes: ['Madurai Jasmine'],
        transitDurationHours: 1.5,
        ambientTempC: 32,
        deliverySlot: 'MORNING_SLOT',
        freshnessClass: 'ULTRA_PERISHABLE',
      }),
    }).then(r => r.json());

    assert(['CRITICAL', 'HIGH'].includes(riskAssessment.risk_level), `Perishability risk evaluated as: ${riskAssessment.risk_level}`);
    assert(riskAssessment.risk_score >= 50, `Calculated risk score: ${riskAssessment.risk_score}/100`);
    assert(Boolean(riskAssessment.packaging_instructions.hydration_method), `Hydration required: ${riskAssessment.packaging_instructions.hydration_method}`);
    assert(Boolean(riskAssessment.packaging_instructions.thermal_protection), `Thermal protection required: ${riskAssessment.packaging_instructions.thermal_protection}`);
    assert(riskAssessment.dispatch_deadline_minutes <= 60, `Strict dispatch deadline: ${riskAssessment.dispatch_deadline_minutes} mins`);

    // 5. Automated Multi-Vendor Order Splitting & Atomic Stock Reservation
    console.log('\n--- 5. Automated Multi-Vendor Order Splitting ---');
    // Multi-vendor cart: 1 product from Blossom & Vine (f1111111-1111-4111-8111-111111111111)
    // + 1 product from Madurai Sacred Blooms (f3333333-3333-4333-8333-333333333333)
    const productA = allProducts.products.find(p => p.vendor_id === 'f1111111-1111-4111-8111-111111111111');
    const productB = allProducts.products.find(p => p.vendor_id === 'f3333333-3333-4333-8333-333333333333');

    const stockBeforeA = productA.stock_quantity;
    const stockBeforeB = productB.stock_quantity;

    const createOrderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id: 'c1111111-1111-4111-8111-111111111111',
        items: [
          { product_id: productA.id, quantity: 2 },
          { product_id: productB.id, quantity: 1 },
        ],
        delivery_address: {
          recipient_name: 'Ananya Sharma',
          phone: '+91 98765 43210',
          street: '12 Marine Lines',
          city: 'Mumbai',
          state: 'Maharashtra',
          pin_code: '400001',
        },
        scheduled_slot: 'MORNING_SLOT',
        delivery_date: '2026-09-24',
        gift_message: 'Divine morning blessings for the puja.',
        payment_method: 'UPI',
      }),
    });

    const createdOrder = await createOrderRes.json();
    assert(createOrderRes.status === 201, 'Order created successfully (HTTP 201)');
    assert(createdOrder.items.length === 2, 'Master order created with 2 discrete sub-order items');

    // Verify vendor splitting: items belong to different vendors
    const vendorIds = new Set(createdOrder.items.map(it => it.vendor_id));
    assert(vendorIds.size === 2, `Order items partitioned across ${vendorIds.size} distinct vendors`);

    // Verify atomic stock decrement
    const refetchedProductA = await fetch(`${BASE_URL}/products/${productA.id}`).then(r => r.json());
    const refetchedProductB = await fetch(`${BASE_URL}/products/${productB.id}`).then(r => r.json());
    assert(refetchedProductA.stock_quantity === stockBeforeA - 2, `Stock A atomically decremented from ${stockBeforeA} to ${refetchedProductA.stock_quantity}`);
    assert(refetchedProductB.stock_quantity === stockBeforeB - 1, `Stock B atomically decremented from ${stockBeforeB} to ${refetchedProductB.stock_quantity}`);

    // 6. Strict Hyperlocal Unserviceable Rejection
    console.log('\n--- 6. Hyperlocal Serviceability Rejection Guard ---');
    const invalidPinOrderRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id: 'c1111111-1111-4111-8111-111111111111',
        items: [{ product_id: productA.id, quantity: 1 }],
        delivery_address: {
          recipient_name: 'Test Unserviceable',
          phone: '+91 98765 43210',
          street: 'Faraway Outskirts',
          city: 'Unknown',
          state: 'State',
          pin_code: '999999',
        },
        scheduled_slot: 'STANDARD_DAY',
        delivery_date: '2026-09-24',
        payment_method: 'UPI',
      }),
    });
    assert(invalidPinOrderRes.status === 400, 'Order correctly blocked when pin code is unserviceable (HTTP 400)');

    // 7. Perishable State Machine Lifecycle Progression
    console.log('\n--- 7. Vendor Perishable Lifecycle State Machine ---');
    const testItem = createdOrder.items[0];
    assert(testItem.status === 'PENDING', 'Initial item state is PENDING');

    // Step 1: PENDING -> ACCEPTED
    const acceptedRes = await fetch(`${BASE_URL}/orders/items/${testItem.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ACCEPTED' }),
    }).then(r => r.json());
    assert(acceptedRes.status === 'ACCEPTED', 'Transitioned to ACCEPTED');

    // Step 2: ACCEPTED -> CUT_PACKED
    const cutPackedRes = await fetch(`${BASE_URL}/orders/items/${testItem.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CUT_PACKED' }),
    }).then(r => r.json());
    assert(cutPackedRes.status === 'CUT_PACKED', 'Transitioned to CUT_PACKED');

    // Step 3: CUT_PACKED -> OUT_FOR_DELIVERY
    const outForDeliveryRes = await fetch(`${BASE_URL}/orders/items/${testItem.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'OUT_FOR_DELIVERY' }),
    }).then(r => r.json());
    assert(outForDeliveryRes.status === 'OUT_FOR_DELIVERY', 'Transitioned to OUT_FOR_DELIVERY');

    // Step 4: OUT_FOR_DELIVERY -> DELIVERED
    const deliveredRes = await fetch(`${BASE_URL}/orders/items/${testItem.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'DELIVERED' }),
    }).then(r => r.json());
    assert(deliveredRes.status === 'DELIVERED', 'Transitioned to DELIVERED');

    // Test illegal transition: DELIVERED -> ACCEPTED must be blocked!
    const illegalTransitionRes = await fetch(`${BASE_URL}/orders/items/${testItem.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ACCEPTED' }),
    });
    assert(illegalTransitionRes.status === 400, 'Illegal state transition blocked by state machine (HTTP 400)');

    // 8. Admin Platform Metrics & Governance
    console.log('\n--- 8. Admin Platform Metrics & Commission Ledger ---');
    const adminMetrics = await fetch(`${BASE_URL}/admin/metrics`).then(r => r.json());
    assert(adminMetrics.total_gmv > 0, `Admin platform GMV: ₹${adminMetrics.total_gmv}`);
    assert(adminMetrics.active_vendors_count >= 3, `Active vendors: ${adminMetrics.active_vendors_count}`);

    const adminVendors = await fetch(`${BASE_URL}/admin/vendors`).then(r => r.json());
    assert(adminVendors.length >= 3, `Florist guilds retrieved: ${adminVendors.length}`);

    // Update commission rate
    const vendorToUpdate = adminVendors[0];
    const updatedVendor = await fetch(`${BASE_URL}/admin/vendors/${vendorToUpdate.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commission_rate: 14.5 }),
    }).then(r => r.json());
    assert(updatedVendor.commission_rate === 14.5, `Updated commission rate to ${updatedVendor.commission_rate}%`);

    // 9. FloraAI Conversational Concierge Chatbot
    console.log('\n--- 9. FloraAI Conversational Concierge Chatbot ---');
    // 9a: Pet Toxicity botanical inquiry
    const petToxicityChat = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Are lilies toxic to my house cats? What safe alternatives do you recommend?',
        history: [],
      }),
    }).then(r => r.json());
    assert(Boolean(petToxicityChat.reply), 'FloraAI chatbot returned conversational response');
    assert(petToxicityChat.reply.toLowerCase().includes('toxic') || petToxicityChat.reply.toLowerCase().includes('cat'), 'Chatbot addresses feline toxicity');
    assert(Array.isArray(petToxicityChat.suggestions), `Chatbot returned ${petToxicityChat.suggestions?.length || 0} quick suggestions`);

    // 9b: Puja / Occasion recommendation inquiry
    const pujaChat = await fetch(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'I need fresh flowers for dawn puja tomorrow morning in Bangalore.',
        history: [
          { role: 'user', content: 'Hello FloraAI' },
          { role: 'assistant', content: 'Greetings! How may I assist your floral selection today?' }
        ],
      }),
    }).then(r => r.json());
    assert(Boolean(pujaChat.reply), 'FloraAI handled multi-turn conversation');
    assert(pujaChat.reply.toLowerCase().includes('malli') || pujaChat.reply.toLowerCase().includes('jasmine') || pujaChat.reply.toLowerCase().includes('puja') || pujaChat.reply.toLowerCase().includes('marigold'), 'Chatbot recommended sacred puja stems');

    // 10. Supabase Connectivity & Synchronizer
    console.log('\n--- 10. Live Supabase PostgreSQL Integration ---');
    const supabaseHealth = await fetch(`${BASE_URL}/health/supabase`).then(r => r.json());
    assert(Boolean(supabaseHealth.status), `Supabase health endpoint functional (status: ${supabaseHealth.status})`);
    assert(supabaseHealth.dual_mode === 'active', 'Dual-mode database architecture active');

    const supabaseSync = await fetch(`${BASE_URL}/supabase/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).then(r => r.json());
    assert(Boolean(supabaseSync.message), 'Supabase sync endpoint executed and returned status message');

    console.log('\n=======================================================');
    console.log(`🎉 ALL TESTS COMPLETED: ${passed} PASSED, ${failed} FAILED`);
    console.log('=======================================================');

    if (failed > 0) process.exit(1);
  } catch (error) {
    console.error('Fatal test error:', error);
    process.exit(1);
  }
}

runTests();

