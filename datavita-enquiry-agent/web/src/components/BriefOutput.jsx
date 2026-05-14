import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Copy, Check, Printer, X, BarChart2 } from 'lucide-react'
import ServiceBadge from './ServiceBadge.jsx'
import ServiceExplainerCard from './ServiceExplainerCard.jsx'
import { computeQualificationScore } from '../lib/routing.js'

export default function BriefOutput({ brief, qualificationData, onClose }) {
  const [copied, setCopied] = useState(false)
  const [displayedBrief, setDisplayedBrief] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  // Typewriter effect — reveals brief progressively on first render
  useEffect(() => {
    if (!brief) return
    setDisplayedBrief('')
    setIsTyping(true)
    let i = 0
    const timer = setInterval(() => {
      i += 5
      if (i >= brief.length) {
        setDisplayedBrief(brief)
        setIsTyping(false)
        clearInterval(timer)
      } else {
        setDisplayedBrief(brief.slice(0, i))
      }
    }, 10)
    return () => clearInterval(timer)
  }, [brief])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(brief)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => window.print()

  const service = qualificationData?.mapped_service || 'colocation'
  const confidence = qualificationData?.routing_confidence || 'medium'
  const score = qualificationData ? computeQualificationScore(qualificationData) : null

  return (
    <div className="flex flex-col h-full brief-slide-in">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-800 flex-shrink-0 no-print">
        <div className="flex flex-col gap-1.5 min-w-0">
          <span className="text-xs font-mono-dv text-slate-500 uppercase tracking-widest">
            Sales Brief
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <ServiceBadge service={service} size="lg" />
            <span className={`text-xs font-mono-dv px-2 py-0.5 rounded-full border ${
              confidence === 'high'
                ? 'text-dv-green border-dv-green/30 bg-dv-green/10'
                : 'text-amber-400 border-amber-400/30 bg-amber-400/10'
            }`}>
              {confidence.toUpperCase()} routing
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button onClick={handleCopy} title="Copy" className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-dv-green transition-colors">
            {copied ? <Check size={15} className="text-dv-green" /> : <Copy size={15} />}
          </button>
          <button onClick={handlePrint} title="Print / PDF" className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-dv-green transition-colors">
            <Printer size={15} />
          </button>
          {onClose && (
            <button onClick={onClose} title="Close" className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors">
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Confidence score bar */}
      {score && (
        <div className="px-4 sm:px-5 py-3 border-b border-slate-800/60 flex-shrink-0 no-print">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <BarChart2 size={12} className="text-slate-500" />
              <span className="text-xs font-mono-dv text-slate-500">Qualification completeness</span>
            </div>
            <span className={`text-xs font-mono-dv font-semibold px-2 py-0.5 rounded-full border ${score.color} ${score.bg} ${score.border}`}>
              {score.label} — {score.filled}/{score.total}
            </span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                score.label === 'High' ? 'bg-dv-green' :
                score.label === 'Medium' ? 'bg-amber-400' : 'bg-red-400'
              }`}
              style={{ width: `${(score.filled / score.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Service explainer card */}
      <div className="px-4 sm:px-5 pt-3 flex-shrink-0 no-print">
        <ServiceExplainerCard service={service} />
      </div>

      {/* Brief content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 brief-content">
        <div className="border-t border-slate-800/60 pt-4">
          <ReactMarkdown
            className="prose prose-invert prose-sm max-w-none
              [&>*+*]:mt-4
              prose-headings:font-mono-dv
              prose-h2:text-sm prose-h2:font-semibold prose-h2:text-dv-green prose-h2:uppercase prose-h2:tracking-widest prose-h2:border-b prose-h2:border-dv-green/20 prose-h2:pb-2 prose-h2:mb-4 prose-h2:mt-6 first:prose-h2:mt-0
              prose-h3:text-sm prose-h3:font-semibold prose-h3:text-slate-200 prose-h3:mb-2 prose-h3:mt-5
              prose-p:text-slate-300 prose-p:text-sm prose-p:leading-relaxed prose-p:my-2
              prose-ul:my-2 prose-ul:space-y-1.5
              prose-li:text-slate-300 prose-li:text-sm prose-li:leading-relaxed
              prose-strong:text-dv-text prose-strong:font-semibold
              prose-hr:border-slate-800 prose-hr:my-4
              prose-code:text-dv-green prose-code:bg-dv-bg/80 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono-dv"
          >
            {displayedBrief}
          </ReactMarkdown>
          {isTyping && (
            <span className="inline-block w-1.5 h-4 bg-dv-green rounded-sm ml-0.5 animate-pulse align-middle" />
          )}
        </div>
      </div>
    </div>
  )
}
