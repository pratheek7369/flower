# 🌸 FreshFlora: Multi-Vendor Fresh Flower Marketplace & Cold-Chain Logistics Engine

> **Production-grade full-stack fresh floral e-commerce platform** engineered for acute inventory decay, cold-chain perishability, and hyperlocal multi-vendor order fulfillment. Powered by **Google Gemini 2.5 Flash (`@google/genai`)**, **Supabase PostgreSQL**, **React 19**, **Tailwind CSS**, and **Express TypeScript**.

---

## 🌟 Key Architecture & Highlights

- **Hyperlocal 6-Digit Pin-Code Serviceability**: Live serviceability evaluation per regional florist guild (Mumbai, Bangalore, Madurai).
- **Automated Multi-Vendor Order Splitting**: Single customer checkout partitions items into discrete sub-orders grouped by `vendor_id` with atomic stem stock reservation.
- **Perishable Lifecycle State Machine**: Enforces strict transitions (`PENDING` $\rightarrow$ `ACCEPTED` $\rightarrow$ `CUT_PACKED` $\rightarrow$ `OUT_FOR_DELIVERY` $\rightarrow$ `DELIVERED`).
- **AI Floral & Logistics Intelligence (`@google/genai` Gemini 2.5 Flash)**:
  - **Vase-Life & Stem Preservation Advisor**: Structured water temperature, 45° underwater cutting techniques, de-foliation, and ambient ethylene defense.
  - **Vendor Perishability Risk Assessor**: Evaluates transit duration, ambient Celsius, and stem category to specify packaging and courier deadlines.
- **FloraAI Conversational Concierge Chatbot**:
  - Global floating botanical concierge with live conversation, pet toxicity alerts (feline nephrotoxicity warnings for lilies), puja ritual advice, and direct-to-cart additions.
- **Dual-Mode Supabase PostgreSQL Integration**:
  - Live connection to remote Supabase database with schema DDL, RLS policies, and 1-click synchronizer (`POST /api/supabase/sync`), with graceful zero-downtime fallback to embedded relational storage.
- **Multi-Role RBAC**: Instant switching between **Customer**, **Florist Portal (Kanban & Inventory)**, and **Admin Governance**.

---

## 🚀 Quick Start

### 1. Installation
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..

# Install server dependencies
cd server && npm install && cd ..
```

### 2. Configure Environment
Copy `.env.example` to `.env` in the root and in `server/`:
```env
PORT=5000
NODE_ENV=production
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_google_ai_studio_key
GEMINI_MODEL=gemini-2.5-flash
```

### 3. Run Locally
```bash
# Run both client and server concurrently
npm run dev
```
- **Web App**: [http://localhost:5173](http://localhost:5173) (or [http://localhost:5000](http://localhost:5000))
- **API Health**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Supabase Diagnostics**: [http://localhost:5000/api/health/supabase](http://localhost:5000/api/health/supabase)

### 4. Run Automated E2E Verification Suite
```bash
node test_e2e.js
```
*Executes all 43 automated integration tests across catalog, cart, split-orders, state machines, AI advisor, chatbot, and Supabase integration.*

---

## 🗄️ Database Setup (Supabase)

1. Open your project on the [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to the **SQL Editor**.
3. Copy and run the contents of [`schema.sql`](./schema.sql).
4. Run the 1-click seeder:
   ```bash
   curl -X POST http://localhost:5000/api/supabase/sync
   ```

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Zustand
- **Backend**: Node.js, Express, TypeScript, Helmet, CORS, Rate Limit
- **Database**: Supabase PostgreSQL (`@supabase/supabase-js`), Dual-Mode In-Memory Relational Engine
- **AI Intelligence**: Google Gemini 2.5 Flash (`@google/genai`)
- **Validation**: Zod (shared defensive contracts)
- **Testing**: Native Node.js HTTP/API automated integration suite