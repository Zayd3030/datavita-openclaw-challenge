import { MapPin, CheckCircle, Lightbulb } from 'lucide-react'
import { getServiceConfig } from '../lib/routing.js'

export default function ServiceExplainerCard({ service }) {
  const config = getServiceConfig(service)

  return (
    <div className={`rounded-xl border ${config.borderColor} ${config.bgColor} p-4 mt-4`}>
      <div className="flex items-start gap-2 mb-3">
        <Lightbulb size={14} className={`${config.color} flex-shrink-0 mt-0.5`} />
        <p className={`text-xs font-mono-dv font-semibold ${config.color} leading-tight`}>
          {config.highlight}
        </p>
      </div>

      <div className="flex items-center gap-1.5 mb-3">
        <MapPin size={11} className="text-slate-500 flex-shrink-0" />
        <span className="text-xs text-slate-400 font-mono-dv">{config.location}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-slate-500 font-mono-dv uppercase tracking-wider mb-1.5">Specs</p>
          <ul className="space-y-1">
            {config.specs.map(spec => (
              <li key={spec} className="flex items-start gap-1.5">
                <CheckCircle size={11} className={`${config.color} flex-shrink-0 mt-0.5`} />
                <span className="text-xs text-slate-300">{spec}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs text-slate-500 font-mono-dv uppercase tracking-wider mb-1.5">Use Cases</p>
          <ul className="space-y-1">
            {config.useCases.map(uc => (
              <li key={uc} className="flex items-start gap-1.5">
                <span className={`text-xs ${config.color} flex-shrink-0 mt-0.5`}>›</span>
                <span className="text-xs text-slate-300">{uc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
