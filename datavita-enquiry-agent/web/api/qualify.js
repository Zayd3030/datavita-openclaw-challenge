import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are the DataVita Enquiry Intelligence Agent — a specialist AI assistant that qualifies inbound co-location and data centre enquiries for DataVita, Scotland's leading data centre provider.

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
- After question 5, confirm you have everything you need, thank the prospect, and let them know a sales brief is being prepared for the DataVita team
- Include the word "brief" in your confirmation message

Qualifying questions to cover (adapt phrasing naturally):
1. What type of workload will you be running? (AI/ML training, standard enterprise, government/regulated, web/app hosting, other)
2. What are your power requirements? (kW per rack, or total footprint estimate)
3. Any specific compliance or regulatory requirements? (ISO 27001, Cyber Essentials Plus, G-Cloud, OFFICIAL-SENSITIVE, none)
4. Location preference? (Glasgow city centre, Central Scotland/Lanarkshire, flexible)
5. What's your rough timeline and indicative monthly budget?

Tone: Professional, knowledgeable, efficient. You represent Scotland's most advanced data centre provider. Be confident, not salesy.`;

const BRIEF_SYSTEM_PROMPT = `You are a DataVita sales intelligence system. Generate a structured sales brief in markdown format based on the qualification data and intelligence context provided. Be specific, actionable, and professional. Use the exact template structure provided.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, stage, generateBrief, qualificationData, intelligenceContext, priority } = req.body;

  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid messages array' });
  }

  if (messages.length > 20) {
    return res.status(429).json({ error: 'Session too long — please start a new enquiry' });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    if (generateBrief && qualificationData) {
      const now = new Date().toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });

      const briefPrompt = `Generate a structured DataVita Sales Brief in markdown format with these exact sections:

## DataVita Sales Brief
**Generated:** ${now}
**Status:** New Enquiry

### Prospect
- Company: ${qualificationData.company_name || 'Not provided'}
- Contact: ${qualificationData.contact_name || 'Not provided'} / ${qualificationData.email || 'Not provided'}

### Qualification Summary
- Workload Type: ${qualificationData.workload_type?.replace('_', ' ').toUpperCase() || 'Not specified'}
- Power Requirements: ${qualificationData.power_kw ? qualificationData.power_kw + ' kW' : 'Not specified'}
- Compliance Needs: ${qualificationData.compliance_needs?.join(', ') || 'None specified'}
- Location Preference: ${qualificationData.location_pref?.replace('_', ' ') || 'Flexible'}
- Timeline: ${qualificationData.timeline || 'Not specified'}
- Budget: ${qualificationData.budget_monthly || 'Not specified'}

### Recommended Service
**[SERVICE NAME]** — [one sentence rationale based on the qualification data]

### Key Talking Points
[3 specific bullet points based on this prospect's needs and DataVita's relevant capabilities — be concrete and specific to their workload, compliance, and location needs]

### Market Intelligence
${intelligenceContext || 'DataVita operates DV1 (Lanarkshire) and DV2 (Glasgow City Centre), both Tier III certified. Lanarkshire is a designated UK AI Growth Zone. CoreWeave partnership enables GPU/HPC at scale.'}

### Recommended Next Step
[Specific actionable next step — tailor to their mapped service: ${qualificationData.mapped_service}]

### Internal Routing
Route to: [appropriate DataVita team based on service type: ${qualificationData.mapped_service}]
Priority: ${priority || 'Medium'}

Fill in all bracketed sections with specific, relevant content based on the full conversation context and qualification data. Do not leave any brackets unfilled.`;

      const response = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: BRIEF_SYSTEM_PROMPT,
        messages: [
          ...messages,
          { role: 'user', content: briefPrompt },
        ],
      });

      return res.json({ brief: response.content[0].text });
    }

    // Normal conversation turn
    const conversationMessages = messages.length === 0
      ? [{ role: 'user', content: 'Hello, I\'d like to enquire about DataVita services.' }]
      : messages;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: conversationMessages,
    });

    const assistantMessage = response.content[0].text;

    const isComplete = messages.length >= 10 &&
      assistantMessage.toLowerCase().includes('brief');

    return res.json({
      message: assistantMessage,
      isComplete,
      stopReason: response.stop_reason,
    });
  } catch (error) {
    console.error('Claude API error:', error);
    return res.status(500).json({ error: error.message || 'Failed to process request' });
  }
}
