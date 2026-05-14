import { Cpu, Cloud, Server, Network, Building2 } from 'lucide-react'
import { getServiceConfig } from '../lib/routing.js'

const ICONS = {
  hpc_ai: Cpu,
  national_cloud: Cloud,
  colocation: Server,
  connectivity: Network,
  design_build: Building2,
}

export default function ServiceBadge({ service, size = 'md' }) {
  const config = getServiceConfig(service)
  const Icon = ICONS[service] || Server

  const sizeClasses = size === 'lg'
    ? 'text-base px-4 py-2 gap-2.5'
    : 'text-xs px-3 py-1.5 gap-1.5'

  const iconSize = size === 'lg' ? 18 : 14

  return (
    <span
      className={`inline-flex items-center font-mono-dv font-medium rounded-full border ${sizeClasses} ${config.color} ${config.bgColor} ${config.borderColor}`}
    >
      <Icon size={iconSize} />
      {config.shortLabel}
    </span>
  )
}
