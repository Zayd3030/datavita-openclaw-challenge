export const SERVICE_CONFIG = {
  hpc_ai: {
    label: 'HPC / AI Infrastructure',
    shortLabel: 'HPC/AI',
    color: 'text-purple-400',
    bgColor: 'bg-purple-900/30',
    borderColor: 'border-purple-500/50',
    routeTo: 'HPC & AI Solutions Team',
    description: 'High-performance compute, GPU clusters, AI training workloads via CoreWeave partnership',
    location: 'DV1 Lanarkshire — UK AI Growth Zone',
    specs: ['CoreWeave GPU cluster access', 'Up to 100kW/rack power density', 'Sub-10ms to Scottish internet exchanges'],
    useCases: ['AI/ML model training & inference', 'GPU-accelerated workloads', 'Large-scale data processing'],
    highlight: "Scotland's only CoreWeave-partnered AI infrastructure",
  },
  national_cloud: {
    label: 'National Cloud',
    shortLabel: 'National Cloud',
    color: 'text-blue-400',
    bgColor: 'bg-blue-900/30',
    borderColor: 'border-blue-500/50',
    routeTo: 'Government & Public Sector Team',
    description: 'UK sovereign cloud, G-Cloud accredited, OFFICIAL-SENSITIVE capable',
    location: 'DV1 Lanarkshire & DV2 Glasgow',
    specs: ['G-Cloud 13 accredited', 'OFFICIAL-SENSITIVE capable', 'UK data sovereignty guaranteed'],
    useCases: ['Scottish Government workloads', 'NHS and regulated public sector', 'Financial services compliance'],
    highlight: 'Trusted by the Scottish Government and major public bodies',
  },
  colocation: {
    label: 'Co-location',
    shortLabel: 'Co-location',
    color: 'text-dv-green',
    bgColor: 'bg-emerald-900/30',
    borderColor: 'border-emerald-500/50',
    routeTo: 'Enterprise Sales Team',
    description: 'Standard enterprise rack/cage hosting at DV1 Lanarkshire or DV2 Glasgow',
    location: 'DV1 Lanarkshire or DV2 Glasgow City Centre',
    specs: ['Tier III certified', '100% renewable energy', 'PUE 1.18 (industry leading)'],
    useCases: ['Enterprise server hosting', 'Hybrid cloud extension', 'Disaster recovery'],
    highlight: "Scotland's greenest Tier III certified data centres",
  },
  connectivity: {
    label: 'Connectivity',
    shortLabel: 'Connectivity',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-900/30',
    borderColor: 'border-cyan-500/50',
    routeTo: 'Connectivity & Network Team',
    description: 'High-bandwidth, low-latency, carrier-neutral connectivity solutions',
    location: 'DV2 Glasgow — 177 Bothwell Street',
    specs: ['Carrier-neutral facility', '100GbE uplinks available', 'Scottish IX low-latency peering'],
    useCases: ['High-bandwidth transit', 'Private cloud interconnects', 'AWS / Azure / GCP on-ramps'],
    highlight: "Glasgow's most connected carrier-neutral facility",
  },
  design_build: {
    label: 'Design & Build',
    shortLabel: 'Design & Build',
    color: 'text-orange-400',
    bgColor: 'bg-orange-900/30',
    borderColor: 'border-orange-500/50',
    routeTo: 'Design & Build Projects Team',
    description: 'Greenfield, custom build, bespoke data centre design projects',
    location: 'Central Scotland — AI Growth Zone',
    specs: ['Greenfield development', 'Custom power densities', 'Renewable energy integration'],
    useCases: ['Hyperscale campus expansion', 'Custom HPC builds', 'Bespoke data centre design'],
    highlight: "Build within the UK's designated AI Growth Zone",
  },
};

export function getServiceConfig(service) {
  return SERVICE_CONFIG[service] || SERVICE_CONFIG.colocation;
}

export function getPriorityLevel(qualificationData) {
  const { budget_monthly, timeline } = qualificationData;
  const urgentSignals = ['asap', 'immediately', 'urgent', 'q1', 'q2', '3 months', '6 months'];
  const highBudgetSignals = ['100k', '50k', '£100', '£50', '£200'];
  const timelineLower = (timeline || '').toLowerCase();
  const budgetLower = (budget_monthly || '').toLowerCase();
  const isUrgent = urgentSignals.some(s => timelineLower.includes(s));
  const isHighBudget = highBudgetSignals.some(s => budgetLower.includes(s));
  if (isUrgent || isHighBudget) return 'High';
  return 'Medium';
}

export function computeQualificationScore(data) {
  const checks = [
    !!data.contact_name,
    !!data.company_name,
    !!data.email,
    data.workload_type !== 'other',
    data.compliance_needs?.length > 0,
    data.location_pref !== 'flexible',
    !!data.budget_monthly,
    !!data.timeline,
  ];
  const filled = checks.filter(Boolean).length;
  const pct = filled / checks.length;
  if (pct >= 0.75) return { label: 'High', color: 'text-dv-green', bg: 'bg-dv-green/10', border: 'border-dv-green/30', filled, total: checks.length };
  if (pct >= 0.5)  return { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30', filled, total: checks.length };
  return { label: 'Low', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30', filled, total: checks.length };
}
