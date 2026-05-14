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

export const QUALIFICATION_STAGES = {
  GREETING: 'greeting',
  QUESTIONING: 'questioning',
  CONFIRMING: 'confirming',
  GENERATING: 'generating',
  COMPLETE: 'complete',
};

export function extractQualificationData(messages) {
  const conversation = messages
    .map(m => `${m.role}: ${m.content}`)
    .join('\n');

  const data = {
    contact_name: null,
    company_name: null,
    email: null,
    workload_type: 'other',
    power_kw: null,
    compliance_needs: [],
    location_pref: 'flexible',
    budget_monthly: null,
    timeline: null,
  };

  const lowerConv = conversation.toLowerCase();

  if (lowerConv.includes('ai') || lowerConv.includes('ml') || lowerConv.includes('machine learning') ||
      lowerConv.includes('gpu') || lowerConv.includes('training') || lowerConv.includes('hpc')) {
    data.workload_type = 'hpc_ai';
  } else if (lowerConv.includes('government') || lowerConv.includes('public sector') ||
             lowerConv.includes('council') || lowerConv.includes('nhs')) {
    data.workload_type = 'government';
  } else if (lowerConv.includes('enterprise') || lowerConv.includes('corporate') ||
             lowerConv.includes('business')) {
    data.workload_type = 'enterprise';
  } else if (lowerConv.includes('web') || lowerConv.includes('app') || lowerConv.includes('saas')) {
    data.workload_type = 'web_app';
  } else if (lowerConv.includes('greenfield') || lowerConv.includes('custom build')) {
    data.workload_type = 'greenfield';
  }

  const powerMatch = conversation.match(/(\d+)\s*kw/i);
  if (powerMatch) {
    data.power_kw = parseFloat(powerMatch[1]);
  }

  const complianceMap = {
    'iso 27001': 'iso27001',
    'iso27001': 'iso27001',
    'cyber essentials': 'cyber_essentials',
    'g-cloud': 'gcloud',
    'gcloud': 'gcloud',
    'g cloud': 'gcloud',
    'official sensitive': 'official_sensitive',
    'official-sensitive': 'official_sensitive',
  };

  for (const [phrase, code] of Object.entries(complianceMap)) {
    if (lowerConv.includes(phrase) && !data.compliance_needs.includes(code)) {
      data.compliance_needs.push(code);
    }
  }

  if (lowerConv.includes('glasgow') || lowerConv.includes('city centre') ||
      lowerConv.includes('city center')) {
    data.location_pref = 'glasgow_city';
  } else if (lowerConv.includes('lanarkshire') || lowerConv.includes('central scotland') ||
             lowerConv.includes('motherwell') || lowerConv.includes('hamilton')) {
    data.location_pref = 'lanarkshire';
  }

  const budgetMatch = conversation.match(/£([\d,]+)\s*(?:per\s+month|\/month|pm|monthly)?/i);
  if (budgetMatch) {
    data.budget_monthly = budgetMatch[0];
  }

  const timelinePatterns = [/(\d+)\s*months?/i, /q[1-4]\s*\d{4}/i, /immediately|asap|urgent/i, /\d{4}/];
  for (const pattern of timelinePatterns) {
    const m = conversation.match(pattern);
    if (m) { data.timeline = m[0]; break; }
  }

  return data;
}

export function mapToService(data) {
  const { workload_type, power_kw, compliance_needs } = data;

  if (workload_type === 'hpc_ai' || (power_kw && power_kw > 20)) {
    return { service: 'hpc_ai', confidence: 'high' };
  }
  if (workload_type === 'government' ||
      compliance_needs?.includes('gcloud') ||
      compliance_needs?.includes('official_sensitive')) {
    return { service: 'national_cloud', confidence: 'high' };
  }
  if (workload_type === 'connectivity') {
    return { service: 'connectivity', confidence: 'high' };
  }
  if (workload_type === 'greenfield') {
    return { service: 'design_build', confidence: 'high' };
  }
  if (compliance_needs?.includes('iso27001') || compliance_needs?.includes('cyber_essentials')) {
    return { service: 'colocation', confidence: 'high' };
  }
  return { service: 'colocation', confidence: 'medium' };
}
