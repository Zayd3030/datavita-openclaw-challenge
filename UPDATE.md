Write a professional README.md for the DataVita Enquiry Intelligence Agent — a submission for the DataVita OpenClaw Challenge.

The README must be structured to directly address the judging criteria:
1. Originality
2. Technical thinking
3. Business value
4. Security & resilience
5. Communication

Include these sections:

## Overview
One paragraph pitch: "An AI agent that qualifies inbound co-location enquiries, routes them to the right DataVita service, and enriches each brief with live intelligence about Scotland's AI infrastructure landscape — so your sales team walks into every conversation already informed."

## The Problem
DataVita receives unqualified inbound enquiries. Without structured information upfront, the sales team can't route efficiently or walk into first calls prepared. Every unqualified enquiry costs time.

## The Solution
What the agent does — qualification flow, service routing logic, brief generation, intelligence layer. Mention the 5 qualifying questions and the service mapping logic.

## Live Demo
Placeholder: [VERCEL_URL]

## Features
- Conversational qualification flow with context-aware quick reply chips
- Intelligent service routing (Co-location, HPC/AI, National Cloud, Connectivity, Design & Build)
- Structured sales brief generation with market intelligence
- Live AI Growth Zone and CoreWeave context injected into every brief
- Supabase logging of every enquiry
- OpenClaw skill with Telegram trigger
- Mobile responsive

## Tech Stack
Table format — React 18, Vite, Tailwind CSS, Claude API (claude-sonnet-4-5), Anthropic SDK, Supabase, Vercel, OpenClaw

## Architecture
Describe the flow: User → Chat Interface → /api/qualify (Vercel serverless) → Claude → Service Router → Brief Generator → /api/intelligence (web search) → Supabase log

## Service Routing Logic
Table showing: Workload signal → Mapped service. E.g. AI/ML Training + high power → HPC/AI (CoreWeave), Government/regulated → National Cloud, etc.

## Security
- API keys server-side only, never exposed to frontend
- Input validation on all serverless routes  
- Rate limiting (20 messages per session)
- Supabase Row Level Security enabled
- Environment variables via Vercel

## OpenClaw Integration
Explain the skill — triggers on "datavita enquiry", "data centre enquiry", "colocation" in Telegram. Skill file at openclaw-skill/skill.yaml.

## How to Run Locally
1. Clone the repo
2. cd datavita-enquiry-agent/web
3. npm install
4. Create .env.local with the four environment variables
5. npx vercel dev

## About the Builder
Zayd Hussain, New Computing student Graduate at GCU, Expected First Class Honours June 2026. Previously built a full business management platform with CRM, quote generator, and client portal for a real client (House of AB) using the same stack. This project applies that domain knowledge to an AI-native context.

Co-founded ExoCard.bio (NFC networking platform). Runs VZN Media (content agency, UK/USA/UAE clients).

## Why This Will Help DataVita
Close with a business case paragraph — what this saves in sales team time, how it improves lead quality, and how it could be deployed as a real product tomorrow.

Write in a confident, professional tone. No fluff. Every section should make a judge think "this person understands the business problem and built something real."