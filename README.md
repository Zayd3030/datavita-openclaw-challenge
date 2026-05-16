# DataVita Enquiry Intelligence Agent

## Live Deployed Demo

[https://datavita-openclaw-challenge.vercel.app](https://datavita-openclaw-challenge.vercel.app)

---

## Video Demo

[https://www.loom.com/share/1596ab5eeca14f05a22ee0cf93861914](https://www.loom.com/share/1596ab5eeca14f05a22ee0cf93861914)

---



> An AI agent that qualifies inbound co-location enquiries, routes them to the right DataVita service, and enriches each brief with live intelligence about Scotland's AI infrastructure landscape — so your sales team walks into every conversation already informed.

---

## Overview

The DataVita Enquiry Intelligence Agent is a production-ready AI qualification system built for the DataVita OpenClaw Challenge. It replaces the unstructured inbound enquiry process with a conversational agent that collects contact details, qualifies prospects across five structured dimensions, maps them to the right DataVita service, and generates a structured sales brief enriched with live market intelligence — all before a human picks up the phone.

---

## The Problem

DataVita receives inbound enquiries with no consistent structure. A prospect might email asking about "hosting" with no mention of workload type, power requirements, compliance needs, or budget. The sales team then spends time in back-and-forth triage to gather basic information before they can even route the enquiry, let alone prepare for a first call.

Every unqualified enquiry costs time — and time lost in the first response window directly affects conversion.

---

## The Solution

A conversational qualification agent that works in two phases:

**Phase 1 — Qualification**
The agent greets the prospect, captures their contact details, then asks five targeted questions in natural conversation:
1. What type of workload are you running?
2. Power requirements (only asked for AI/ML and HPC workloads — skipped for standard enterprise)
3. Compliance or regulatory requirements
4. Location preference (DV1 Lanarkshire or DV2 Glasgow)
5. Timeline and indicative monthly budget

**Phase 2 — Brief Generation**
Once qualified, the agent maps the prospect to the correct DataVita service using a confidence-scored routing engine, fetches live intelligence about DataVita's AI Growth Zone and CoreWeave partnership via web search, and generates a structured sales brief — complete with key talking points, recommended next steps, and internal routing instructions.

The sales team receives a fully prepared brief. The prospect receives a seamless, professional experience.

---


## Features

- Conversational qualification flow with context-aware quick-reply chips per question
- Intelligent service routing across 5 DataVita services with confidence scoring
- Structured sales brief generation with live market intelligence via web search
- AI Growth Zone and CoreWeave context injected into every brief
- Qualification completeness score displayed in the brief panel
- Supabase logging of every enquiry for CRM and reporting
- OpenClaw skill with Telegram trigger
- Mobile-responsive UI with print/PDF export

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| AI model | Claude claude-sonnet-4-5 (Anthropic) |
| AI SDK | @anthropic-ai/sdk |
| Intelligence | Claude + `web_search` tool (live search) |
| Database | Supabase (PostgreSQL + Row Level Security) |
| Deployment | Vercel (serverless functions + static hosting) |
| Skill platform | OpenClaw |
| UI utilities | lucide-react, react-markdown, DM Mono font |

---

## Architecture

```
User (Browser or Telegram)
    │
    ├── Chat Interface (React 18 / Vite)
    │       └── useQualification hook — manages state machine
    │
    ├── POST /api/qualify  (Vercel serverless)
    │       ├── Qualification turns → Claude (claude-sonnet-4-5)
    │       └── Brief generation → Claude (claude-sonnet-4-5)
    │
    └── POST /api/intelligence  (Vercel serverless)
            └── Claude + web_search tool
                    └── Live DataVita / AI Growth Zone / CoreWeave context

Supabase (PostgreSQL)
    └── enquiries table — written after every completed qualification

OpenClaw
    └── openclaw-skill/skill.yaml → proxies Telegram messages to /api/qualify
```

**State machine:** `GREETING → QUESTIONING → GENERATING → COMPLETE`

---

## Service Routing Logic

| Workload Signal | Mapped Service | DataVita Team |
|---|---|---|
| AI/ML training or power > 20kW | HPC/AI (CoreWeave) | HPC & AI Solutions |
| Government / G-Cloud / OFFICIAL-SENSITIVE | National Cloud | Government & Public Sector |
| Standard enterprise (default) | Co-location | Enterprise Sales |
| Connectivity-primary requirement | Connectivity | Connectivity & Network |
| Greenfield / custom build | Design & Build | Design & Build Projects |

Routing confidence is scored (High / Medium) based on how many qualification fields are populated. The confidence rating is displayed in the brief panel.

---

## Security & Resilience

- API keys are server-side only — never shipped to the browser (`ANTHROPIC_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` are Vercel environment variables only, not `VITE_*` prefixed)
- Input validation on all serverless routes — messages array type-checked, malformed requests rejected with 400
- Rate limiting: 20 messages maximum per session, returning 429 if exceeded
- Supabase Row Level Security enabled on the `enquiries` table — service role key never exposed client-side
- Intelligence API falls back to a hardcoded DataVita context string if web search fails, so brief generation never breaks
- All errors surface to the UI with a clear message rather than silent failures

---

## OpenClaw Integration

The skill at `openclaw-skill/skill.yaml` connects the live Vercel API to Telegram.

**Triggers:** `"datavita enquiry"`, `"data centre enquiry"`, `"colocation"`

**How it works:**
1. On trigger, the skill opens a session and maintains the full conversation history
2. Each user message is forwarded as the `messages` array to `POST /api/qualify` — the same payload format the web app uses
3. The agent's response is returned verbatim to the Telegram user
4. Once `isComplete` is true, the skill calls `/api/qualify` with `generateBrief: true` and posts the brief inline

Set `DATAVITA_API_URL=https://datavita-openclaw-challenge.vercel.app` in your OpenClaw environment config. No other configuration required.

---

## How to Run Locally

```bash
# 1. Clone the repo
git clone <repo-url>

# 2. Enter the web directory
cd datavita-enquiry-agent/web

# 3. Install dependencies
npm install

# 4. Create .env.local with your credentials
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# 5. Start the dev server with Vercel (runs serverless functions locally)
npx vercel dev
```

---

## About the Builder

**Zayd Hussain** — New Computing student at Glasgow Caledonian University, expected First Class Honours, June 2026.

Previously built a full business management platform with CRM, quote generator, and client portal for a real client (House of AB) using React, Supabase, and serverless functions. This project applies that production experience to an AI-native architecture.

Co-founded **ExoCard.bio** — an NFC digital networking platform. Runs **VZN Media** — a content agency with clients across the UK, USA, and UAE.

---

## Why This Will Help DataVita

Every unqualified inbound enquiry that lands in a sales inbox costs 15–30 minutes of triage time before the first meaningful conversation can happen. At any reasonable volume, that adds up to hours per week spent on administration rather than selling.

This agent eliminates that entirely. A prospect who engages takes 3–5 minutes to qualify themselves. The sales team receives a structured brief with service routing, talking points, market context, and a recommended next step — before they've picked up the phone.

The brief generation is not generic. It fetches live intelligence about DataVita's AI Growth Zone status, CoreWeave partnership, and competitive positioning, and injects that context into every brief. A salesperson walking into a call on an AI/ML workload already knows the Lanarkshire AI Growth Zone angle, the CoreWeave GPU allocation story, and the right next step to propose.

This could be deployed as a real product tomorrow. The Vercel deployment is live, the Supabase logging is active, and the OpenClaw skill is ready to connect to any Telegram channel. The only remaining step is pointing a custom domain at it.
