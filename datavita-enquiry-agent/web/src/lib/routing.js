export const SERVICE_CONFIG = {
  hpc_ai: {
    label: 'HPC / AI Infrastructure',
    shortLabel: 'HPC/AI',
    color: 'text-purple-400',
    bgColor: 'bg-purple-900/30',
    borderColor: 'border-purple-500/50',
    routeTo: 'HPC & AI Solutions Team',
    description: 'High-performance compute, GPU clusters, AI training workloads via CoreWeave partnership',
  },
  national_cloud: {
    label: 'National Cloud',
    shortLabel: 'National Cloud',
    color: 'text-blue-400',
    bgColor: 'bg-blue-900/30',
    borderColor: 'border-blue-500/50',
    routeTo: 'Government & Public Sector Team',
    description: 'UK sovereign cloud, G-Cloud accredited, OFFICIAL-SENSITIVE capable',
  },
  colocation: {
    label: 'Co-location',
    shortLabel: 'Co-location',
    color: 'text-dv-green',
    bgColor: 'bg-emerald-900/30',
    borderColor: 'border-emerald-500/50',
    routeTo: 'Enterprise Sales Team',
    description: 'Standard enterprise rack/cage hosting at DV1 Lanarkshire or DV2 Glasgow',
  },
  connectivity: {
    label: 'Connectivity',
    shortLabel: 'Connectivity',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-900/30',
    borderColor: 'border-cyan-500/50',
    routeTo: 'Connectivity & Network Team',
    description: 'High-bandwidth, low-latency, carrier-neutral connectivity solutions',
  },
  design_build: {
    label: 'Design & Build',
    shortLabel: 'Design & Build',
    color: 'text-orange-400',
    bgColor: 'bg-orange-900/30',
    borderColor: 'border-orange-500/50',
    routeTo: 'Design & Build Projects Team',
    description: 'Greenfield, custom build, bespoke data centre design projects',
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
