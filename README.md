# DataVita Enquiry Intelligence Agent

> An AI agent that qualifies inbound co-location enquiries, routes them to the
> right DataVita service, and enriches each brief with live intelligence about
> Scotland's AI infrastructure landscape — so your sales team walks into every
> conversation already informed.

## The Problem

DataVita's sales team receives unqualified inbound enquiries that take significant
time to triage. Without structured information upfront, the team can't route
enquiries efficiently or walk into first calls already prepared with relevant context.

## The Solution

A conversational AI agent that:

1. **Greets** the prospect and collects their contact details naturally
2. **Qualifies** them across 5 structured dimensions (workload type, power, compliance, location, budget/timeline)
3. **Routes** the enquiry to the correct DataVita service with confidence scoring
4. **Fetches live intelligence** about DataVita's AI Growth Zone and CoreWeave partnership
5. **Generates a structured sales brief** for the DataVita team — ready before the first call
6. **Logs every enquiry** to Supabase for CRM and reporting

## Live Demo

[Deployed on Vercel — URL to be added after deployment]

## How to Run Locally

```bash
# Clone the repo
git clone <repo-url>
cd datavita-enquiry-agent

# Install dependencies
cd web
npm install

# Set up environment variables
cp ../.env.example .env
# Edit .env with your Anthropic API key and Supabase credentials

# Start development server
npm run dev
```

The Vite dev server proxies `/api` requests to a local Node server. For full
local API testing, run the Vercel dev CLI from the `web` directory:

```bash
npx vercel dev
```

## Architecture

```
Browser (React/Vite)
    │
    ├── /api/qualify     → Serverless (Vercel Node)
    │       └── Anthropic Claude claude-sonnet-4-20250514 (conversation + brief generation)
    │
    └── /api/intelligence → Serverless (Vercel Node)
            └── Anthropic Claude claude-sonnet-4-20250514 + web_search tool
                    └── Live intelligence about DataVita, AI Growth Zone, CoreWeave

Supabase (PostgreSQL)
    └── enquiries table — logged after each qualification
```

### State Machine

```
GREETING → QUESTIONING (5 Q&A turns) → CONFIRMING → GENERATING → COMPLETE
```

### Service Routing Logic

| Service | Trigger |
|---|---|
| HPC/AI | AI/ML workload detected OR power > 20kW |
| National Cloud | Government workload OR G-Cloud/OFFICIAL-SENSITIVE compliance |
| Co-location | Standard enterprise (default) |
| Connectivity | Connectivity-primary requirement |
| Design & Build | Greenfield / custom build requirement |

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **AI:** Claude claude-sonnet-4-20250514 via Anthropic SDK (conversation + brief + intelligence)
- **Database:** Supabase (PostgreSQL) with Row Level Security
- **Deployment:** Vercel (serverless functions + static hosting)
- **Icons:** lucide-react
- **Markdown:** react-markdown
- **Fonts:** DM Mono (agent), Inter (UI)

## OpenClaw Integration

The `openclaw-skill/` directory contains a complete skill definition:

- **`skill.yaml`** — Skill manifest with triggers, step definitions, and I/O spec
- **`prompts/qualify.md`** — Qualification conversation prompt
- **`prompts/brief.md`** — Brief generation template and routing logic

The skill triggers on keywords: `"datavita enquiry"`, `"qualify data centre"`, `"colocation enquiry"`.

Steps: `qualify` → `fetch_intelligence` → `generate_brief` → `log_enquiry`

## Security Notes

- API keys never exposed to frontend (no `VITE_ANTHROPIC_*` vars)
- Input validation on all serverless routes
- Rate limiting: 20 messages maximum per session
- Supabase Row Level Security enabled on `enquiries` table
- Service role key kept server-side only

## Built By

Zayd Hussain — GCU Computing, Expected First Class Honours June 2026

Built for the DataVita OpenClaw Challenge, May 2026.
