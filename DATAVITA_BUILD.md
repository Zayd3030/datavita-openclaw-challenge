# DataVita Enquiry Intelligence Agent — Claude Code Build Spec

## Project Overview

Build a production-ready AI-powered co-location enquiry qualification agent for the DataVita OpenClaw Challenge. Deadline: 26 May 2026.

**What it does:**
1. Accepts an inbound enquiry from a potential data centre client
2. Runs a structured qualification conversation (5–6 questions)
3. Maps the answers to the correct DataVita service
4. Fetches live intelligence about Scotland's AI Growth Zone and CoreWeave partnership
5. Generates a structured sales brief for the DataVita team
6. Logs every enquiry to Supabase

**Submission URL:** https://jobs.datavita.co.uk/openclaw-challenge

---

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **AI:** Claude API (`claude-sonnet-4-20250514`) via Anthropic SDK
- **Database:** Supabase (PostgreSQL) — log enquiries
- **Deployment:** Vercel
- **Version Control:** GitHub

---

## Project Structure

Scaffold exactly this structure:

```
datavita-enquiry-agent/
├── web/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── BriefOutput.jsx
│   │   │   ├── ServiceBadge.jsx
│   │   │   └── TypingIndicator.jsx
│   │   ├── lib/
│   │   │   ├── agent.js          # Core qualification agent logic
│   │   │   ├── routing.js        # Service mapping logic
│   │   │   ├── intelligence.js   # AI Growth Zone context fetcher
│   │   │   └── supabase.js       # Supabase client
│   │   ├── hooks/
│   │   │   └── useQualification.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── api/
│   │   ├── qualify.js            # Vercel serverless — runs Claude conversation
│   │   └── intelligence.js       # Vercel serverless — fetches live context
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── openclaw-skill/
│   ├── skill.yaml
│   └── prompts/
│       ├── qualify.md
│       └── brief.md
├── supabase/
│   └── schema.sql
├── .env.example
├── vercel.json
└── README.md
```

---

## Environment Variables

Create `.env.example` with:

```
ANTHROPIC_API_KEY=your_key_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 1. Supabase Schema (`supabase/schema.sql`)

```sql
create table enquiries (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  contact_name text,
  company_name text,
  email text,
  workload_type text,             -- 'hpc_ai' | 'enterprise' | 'government' | 'web_app' | 'other'
  power_kw numeric,
  compliance_needs text[],        -- e.g. ['iso27001', 'cyber_essentials', 'gcloud', 'official_sensitive']
  location_pref text,             -- 'glasgow_city' | 'lanarkshire' | 'flexible'
  budget_monthly text,
  timeline text,
  mapped_service text,            -- 'colocation' | 'hpc_ai' | 'national_cloud' | 'connectivity' | 'design_build'
  routing_confidence text,        -- 'high' | 'medium' | 'low'
  brief_text text,                -- full generated brief markdown
  intelligence_context text,      -- AI Growth Zone / CoreWeave context injected
  status text default 'new'       -- 'new' | 'reviewed' | 'contacted'
);

-- Enable Row Level Security
alter table enquiries enable row level security;

-- Allow service role full access
create policy "Service role full access"
  on enquiries
  for all
  using (true);
```

---

## 2. Core Agent Logic (`web/src/lib/agent.js`)

This is the most important file. Build it as a stateful conversation manager.

### System Prompt

```javascript
export const SYSTEM_PROMPT = `You are the DataVita Enquiry Intelligence Agent — a specialist AI assistant that qualifies inbound co-location and data centre enquiries for DataVita, Scotland's leading data centre provider.

DataVita operates:
- DV1: Lanarkshire — Tier III certified, 100% renewable energy, PUE 1.18
- DV2: Glasgow — 177 Bothwell Street, city centre, Tier III certified
- Designated UK AI Growth Zone in Lanarkshire
- CoreWeave partnership for GPU/HPC infrastructure
- Clients: Scottish Government, Virgin Money, South Lanarkshire Council, CGI, North Lanarkshire Council

DataVita Services:
1. Co-location — Standard enterprise rack/cage hosting
2. HPC/AI — High-performance compute, GPU clusters, AI training workloads (CoreWeave partnership)
3. National Cloud — UK sovereign cloud, government/regulated sector, G-Cloud
4. Connectivity — High-bandwidth, low-latency, carrier-neutral connectivity
5. Design & Build — Greenfield, custom build, bespoke data centre design

Your job:
- Greet the prospect warmly and professionally
- Ask exactly 5 qualifying questions, one at a time, in a natural conversational flow
- Never ask multiple questions at once
- After question 5, confirm you have everything you need
- Then call the generate_brief function

Qualifying questions to cover (adapt phrasing naturally):
1. What type of workload will you be running? (AI/ML training, standard enterprise, government/regulated, web/app hosting, other)
2. What are your power requirements? (kW per rack, or total footprint estimate)
3. Any specific compliance or regulatory requirements? (ISO 27001, Cyber Essentials Plus, G-Cloud, OFFICIAL-SENSITIVE, none)
4. Location preference? (Glasgow city centre, Central Scotland/Lanarkshire, flexible)
5. What's your rough timeline and indicative monthly budget?

Tone: Professional, knowledgeable, efficient. You represent Scotland's most advanced data centre provider. Be confident, not salesy.`;
```

### Qualification State Machine

```javascript
export const QUALIFICATION_STAGES = {
  GREETING: 'greeting',
  QUESTIONING: 'questioning',
  CONFIRMING: 'confirming',
  GENERATING: 'generating',
  COMPLETE: 'complete',
};

export function extractQualificationData(messages) {
  // Parse the conversation and extract structured data
  // Return an object matching the Supabase schema fields
}

export function mapToService(data) {
  const { workloadType, powerKw, complianceNeeds, locationPref } = data;
  
  // HPC/AI signals
  if (workloadType === 'hpc_ai' || powerKw > 20) {
    return { service: 'hpc_ai', confidence: 'high' };
  }
  
  // Government / sovereign cloud signals
  if (workloadType === 'government' || 
      complianceNeeds?.includes('gcloud') || 
      complianceNeeds?.includes('official_sensitive')) {
    return { service: 'national_cloud', confidence: 'high' };
  }
  
  // Connectivity-first signals
  if (workloadType === 'connectivity') {
    return { service: 'connectivity', confidence: 'high' };
  }
  
  // Design and build
  if (workloadType === 'greenfield') {
    return { service: 'design_build', confidence: 'high' };
  }
  
  // Default to colocation
  return { service: 'colocation', confidence: 'medium' };
}
```

---

## 3. Intelligence Layer (`web/src/lib/intelligence.js`)

Fetches live context about DataVita's AI Growth Zone and CoreWeave partnership.

```javascript
export async function fetchIntelligenceContext(qualificationData) {
  const response = await fetch('/api/intelligence', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qualificationData }),
  });
  return response.json();
}
```

### Serverless function (`web/api/intelligence.js`)

Uses Claude with web search tool enabled to pull live context:

```javascript
import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { qualificationData } = req.body;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const serviceContextMap = {
    hpc_ai: 'DataVita CoreWeave partnership GPU AI infrastructure Scotland',
    national_cloud: 'DataVita National Cloud Scottish Government G-Cloud sovereign',
    colocation: 'DataVita DV1 DV2 co-location Tier III Scotland renewable energy',
    connectivity: 'DataVita connectivity carrier-neutral Glasgow Scotland',
    design_build: 'DataVita design build data centre Scotland AI Growth Zone',
  };

  const searchQuery = serviceContextMap[qualificationData.mapped_service] || 
    'DataVita Scotland AI Growth Zone CoreWeave 2025 2026';

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    tools: [{ type: 'web_search_20250305', name: 'web_search' }],
    system: `You are a market intelligence assistant. Search for current information about DataVita, Scotland's AI Growth Zone designation in Lanarkshire, and the CoreWeave partnership. Return a concise 2-3 paragraph intelligence summary that would help a DataVita sales person walk into a meeting with this prospect already informed. Focus on facts and figures relevant to the prospect's needs.`,
    messages: [
      {
        role: 'user',
        content: `Search for: ${searchQuery}. The prospect needs: ${qualificationData.mapped_service}. Return only the intelligence summary, no preamble.`,
      },
    ],
  });

  const intelligenceText = response.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('\n');

  res.json({ context: intelligenceText });
}
```

---

## 4. Brief Generation

After qualification is complete, generate a structured brief using this template. The brief should be generated server-side in `/api/qualify.js` as the final step.

### Brief Prompt Template

```
Generate a structured DataVita Sales Brief in markdown format with these sections:

## DataVita Sales Brief
**Generated:** [timestamp]
**Status:** New Enquiry

### Prospect
- Company: [company]
- Contact: [name] / [email]

### Qualification Summary
- Workload Type: [workload]
- Power Requirements: [power] kW
- Compliance Needs: [compliance]
- Location Preference: [location]
- Timeline: [timeline]
- Budget: [budget]

### Recommended Service
**[SERVICE NAME]** — [one sentence rationale]

### Key Talking Points
[3 bullet points specific to this prospect's needs and DataVita's relevant capabilities]

### Market Intelligence
[inject fetched intelligence context here]

### Recommended Next Step
[specific action — e.g. "Schedule a site tour at DV2 Glasgow and discuss CoreWeave GPU allocation timelines"]

### Internal Routing
Route to: [team/contact based on service]
Priority: [High/Medium based on budget and timeline signals]
```

---

## 5. API Route (`web/api/qualify.js`)

Stateless serverless function that handles one turn of the conversation.

```javascript
import Anthropic from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages, stage } = req.body;
  
  // Validate input
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages array' });
  }

  // Rate limit: max 20 messages per session
  if (messages.length > 20) {
    return res.status(429).json({ error: 'Session too long' });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    system: SYSTEM_PROMPT, // imported from agent.js logic
    messages,
  });

  const assistantMessage = response.content[0].text;

  // Detect if qualification is complete (all 5 questions answered)
  const isComplete = messages.length >= 11 && // ~5 Q&A pairs
    assistantMessage.toLowerCase().includes('brief');

  res.json({
    message: assistantMessage,
    isComplete,
    stopReason: response.stop_reason,
  });
}
```

---

## 6. React Chat Interface

### Design Direction

Build a refined, professional dark-mode interface. Think: control room meets premium SaaS. Not generic chatbot UI.

**Aesthetic:**
- Dark background: `#0a0e1a` (deep navy)
- Surface: `#111827`
- Accent: DataVita green `#00c896` (use for agent messages, active states)
- Text: `#e2e8f0`
- Font: `'DM Mono'` for the agent (loaded from Google Fonts), `'Inter'` for user input
- Agent messages have a subtle left border in the accent colour
- User messages right-aligned, muted background
- The generated brief appears in a separate panel that slides in from the right

### Key Components

**`ChatInterface.jsx`**
- Full viewport height
- Two-column layout on desktop: chat (left 60%) + brief panel (right 40%, hidden until brief is generated)
- Mobile: single column, brief appears below chat
- Header: DataVita logo text + "Enquiry Intelligence Agent" subtitle
- Input area pinned to bottom with send button

**`MessageBubble.jsx`**
- Props: `role` ('user' | 'assistant'), `content`, `timestamp`
- Assistant messages: left-aligned, accent left border, DM Mono font
- User messages: right-aligned, pill shape, muted

**`BriefOutput.jsx`**
- Renders the markdown brief with syntax highlighting
- Download as PDF button (use `window.print()` or jsPDF — you've used jsPDF before)
- Copy to clipboard button
- Service badge prominently displayed at top

**`ServiceBadge.jsx`**
- Props: `service` ('colocation' | 'hpc_ai' | 'national_cloud' | 'connectivity' | 'design_build')
- Colour-coded pill badge
- Icon per service type (use lucide-react)

**`TypingIndicator.jsx`**
- Three animated dots while agent is responding

### `useQualification.js` Hook

```javascript
export function useQualification() {
  const [messages, setMessages] = useState([]);
  const [stage, setStage] = useState('greeting');
  const [isLoading, setIsLoading] = useState(false);
  const [brief, setBrief] = useState(null);
  const [qualificationData, setQualificationData] = useState(null);

  const sendMessage = async (userInput) => { ... };
  const generateBrief = async () => { ... };
  const reset = () => { ... };

  return { messages, stage, isLoading, brief, qualificationData, sendMessage, reset };
}
```

---

## 7. OpenClaw Skill (`openclaw-skill/skill.yaml`)

```yaml
name: datavita-enquiry-agent
version: 1.0.0
description: Qualifies inbound co-location enquiries for DataVita and generates structured sales briefs with live market intelligence.
author: Your Name

triggers:
  - keyword: "datavita enquiry"
  - keyword: "qualify data centre"
  - keyword: "colocation enquiry"

steps:
  - name: qualify
    type: conversation
    prompt_file: prompts/qualify.md
    collect:
      - workload_type
      - power_kw
      - compliance_needs
      - location_pref
      - budget_range
      - timeline

  - name: fetch_intelligence
    type: web_search
    query: "DataVita Scotland AI Growth Zone CoreWeave {workload_type}"

  - name: generate_brief
    type: llm
    prompt_file: prompts/brief.md
    inputs:
      - qualification_data
      - intelligence_context

  - name: log_enquiry
    type: http
    url: "{SUPABASE_URL}/rest/v1/enquiries"
    method: POST
    headers:
      apikey: "{SUPABASE_SERVICE_ROLE_KEY}"
      Authorization: "Bearer {SUPABASE_SERVICE_ROLE_KEY}"
      Content-Type: "application/json"
    body: "{qualification_data}"
```

---

## 8. Vercel Config (`vercel.json`)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "web/api/**/*.js",
      "use": "@vercel/node"
    },
    {
      "src": "web/package.json",
      "use": "@vercel/vite"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/web/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/web/$1"
    }
  ],
  "env": {
    "ANTHROPIC_API_KEY": "@anthropic_api_key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase_service_role_key"
  }
}
```

---

## 9. README.md

Write a README structured around the judging criteria. Include:

```markdown
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
[describe what it does]

## Live Demo
[vercel URL]

## How to Run Locally
[install steps]

## Architecture
[diagram or description]

## Tech Stack
[list]

## OpenClaw Integration
[how the skill works]

## Security Notes
- API keys never exposed to frontend
- Input validation on all serverless routes
- Rate limiting (20 messages per session)
- Supabase RLS enabled

## Built By
[your name, GCU Computing, Expected First Class Honours June 2026]
```

---

## 10. Git Commit Strategy

Make meaningful commits from the first file. Suggested sequence:

```
feat: initial project scaffold — React/Vite/Tailwind
feat: add Supabase schema for enquiry logging
feat: implement core qualification agent system prompt
feat: build ChatInterface component with dark theme
feat: add MessageBubble and TypingIndicator components
feat: implement useQualification state management hook
feat: add serverless /api/qualify route with Claude integration
feat: implement service routing logic for all DataVita services
feat: build BriefOutput component with markdown rendering
feat: add ServiceBadge component with service colour coding
feat: implement intelligence layer with web search
feat: wire intelligence context into brief generation
feat: add OpenClaw skill YAML and prompt templates
feat: configure Vercel deployment
feat: add PDF export to brief output
docs: write README structured for challenge judging criteria
chore: add .env.example and environment variable documentation
```

---

## Build Notes for Claude Code

- Use `@anthropic-ai/sdk` (not raw fetch) for Claude API calls
- Use `@supabase/supabase-js` for Supabase
- Use `lucide-react` for icons
- Use `react-markdown` for rendering the brief
- Load `DM Mono` and `Inter` from Google Fonts in `index.html`
- Tailwind config: extend with DataVita accent colour `#00c896`
- All API keys stay server-side only — never in `VITE_` prefixed vars except the Supabase anon key
- The brief panel should animate in using a CSS slide transition, not a jarring render
- Mobile responsive — judges may view on phone
- Add a subtle DataVita logo/wordmark to the header (text-based, styled with Tailwind)
- Do not use `<form>` elements — use `onClick` handlers throughout
- Target Lighthouse score: 90+ performance, 100 accessibility

## Priority Order

Build in this exact order so there's always a deployable version:

1. Project scaffold + Vercel deploy (even with placeholder UI)
2. ChatInterface UI (hardcoded responses first)
3. `/api/qualify` serverless route wired to Claude
4. Qualification flow end to end
5. Service routing + ServiceBadge
6. BriefOutput component
7. Supabase logging
8. Intelligence layer
9. OpenClaw skill YAML
10. PDF export
11. README polish
