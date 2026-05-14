import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Copy, Check, Printer, X } from 'lucide-react'
import ServiceBadge from './ServiceBadge.jsx'

export default function BriefOutput({ brief, qualificationData, onClose }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(brief)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  const service = qualificationData?.mapped_service || 'colocation'
  const confidence = qualificationData?.routing_confidence || 'medium'

  return (
    <div className="flex flex-col h-full brief-slide-in">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 flex-shrink-0 no-print">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-mono-dv text-slate-500 uppercase tracking-widest">
            Sales Brief Generated
          </span>
          <div className="flex items-center gap-2">
            <ServiceBadge service={service} size="lg" />
            <span className={`text-xs font-mono-dv px-2 py-0.5 rounded-full border ${
              confidence === 'high'
                ? 'text-dv-green border-dv-green/30 bg-dv-green/10'
                : 'text-amber-400 border-amber-400/30 bg-amber-400/10'
            }`}>
              {confidence.toUpperCase()} confidence
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            title="Copy to clipboard"
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-dv-green transition-colors"
          >
            {copied ? <Check size={16} className="text-dv-green" /> : <Copy size={16} />}
          </button>
          <button
            onClick={handlePrint}
            title="Print / Save as PDF"
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-dv-green transition-colors"
          >
            <Printer size={16} />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              title="Close brief"
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors ml-1"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 brief-content">
        <ReactMarkdown
          className="prose prose-invert prose-sm max-w-none
            prose-headings:font-mono-dv prose-headings:text-dv-text
            prose-h2:text-base prose-h2:text-dv-green prose-h2:border-b prose-h2:border-dv-green/20 prose-h2:pb-1.5 prose-h2:mb-3
            prose-h3:text-sm prose-h3:text-slate-300 prose-h3:mb-2 prose-h3:mt-4
            prose-p:text-slate-300 prose-p:text-sm prose-p:leading-relaxed
            prose-li:text-slate-300 prose-li:text-sm
            prose-strong:text-dv-text prose-strong:font-semibold
            prose-code:text-dv-green prose-code:bg-dv-bg prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono-dv"
        >
          {brief}
        </ReactMarkdown>
      </div>
    </div>
  )
}
