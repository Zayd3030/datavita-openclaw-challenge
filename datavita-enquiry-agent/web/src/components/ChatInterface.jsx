import { useState, useRef, useEffect } from 'react'
import { Send, RefreshCw, ChevronRight, Zap } from 'lucide-react'
import MessageBubble from './MessageBubble.jsx'
import TypingIndicator from './TypingIndicator.jsx'
import BriefOutput from './BriefOutput.jsx'
import { useQualification } from '../hooks/useQualification.js'
import { QUALIFICATION_STAGES, GREETING_TEXT } from '../lib/agent.js'

const STAGE_LABELS = {
  [QUALIFICATION_STAGES.GREETING]: 'Ready',
  [QUALIFICATION_STAGES.QUESTIONING]: 'Qualifying',
  [QUALIFICATION_STAGES.CONFIRMING]: 'Confirming',
  [QUALIFICATION_STAGES.GENERATING]: 'Generating Brief',
  [QUALIFICATION_STAGES.COMPLETE]: 'Complete',
}

function getSuggestions(content) {
  const lower = content.toLowerCase()
  if (lower.includes('workload') || lower.includes('running') || lower.includes('planning to host'))
    return ['AI/ML Training', 'Standard Enterprise', 'Government/Public Sector', 'Web/App Hosting']
  if (lower.includes('power') || lower.includes('kw') || lower.includes('kilowatt') || lower.includes('footprint'))
    return ['Under 10kW', '10-50kW', '50-100kW', '100kW+']
  if (lower.includes('compliance') || lower.includes('regulatory') || lower.includes('iso') || lower.includes('g-cloud') || lower.includes('cyber essentials'))
    return ['ISO 27001', 'Cyber Essentials Plus', 'G-Cloud', 'OFFICIAL-SENSITIVE', 'None Required']
  if (lower.includes('location') || lower.includes('facility') || lower.includes('glasgow') || lower.includes('lanarkshire'))
    return ['Glasgow City Centre (DV2)', 'Lanarkshire (DV1)', 'Flexible']
  if (lower.includes('timeline') || lower.includes('budget') || lower.includes('when') || lower.includes('monthly'))
    return ['3 months / Under £5k', '6 months / £5–15k', '12 months+ / £15k+', 'Flexible Timeline']
  return []
}

function makeGreeting() {
  return { role: 'assistant', content: GREETING_TEXT, timestamp: Date.now() }
}

export default function ChatInterface() {
  const [input, setInput] = useState('')
  const [showBrief, setShowBrief] = useState(false)
  // Greeting is hardcoded — no API call needed, instant display
  const [timestampedMessages, setTimestampedMessages] = useState(() => [makeGreeting()])
  const messagesEndRef = useRef(null)

  const { messages, stage, isLoading, brief, qualificationData, error, sendMessage, reset } =
    useQualification()

  // Sync hook messages into timestampedMessages.
  // Offset by 1 because timestampedMessages[0] is the hardcoded greeting
  // which is not in the hook's messages array.
  useEffect(() => {
    const offset = 1
    if (messages.length > timestampedMessages.length - offset) {
      const newMessages = messages
        .slice(timestampedMessages.length - offset)
        .map(m => ({ ...m, timestamp: Date.now() }))
      setTimestampedMessages(prev => [...prev, ...newMessages])
    }
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [timestampedMessages, isLoading])

  useEffect(() => {
    if (stage === QUALIFICATION_STAGES.COMPLETE && brief) {
      setShowBrief(true)
    }
  }, [stage, brief])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    const value = input.trim()
    setInput('')
    await sendMessage(value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleReset = () => {
    reset()
    setTimestampedMessages([makeGreeting()])
    setShowBrief(false)
  }

  const isGenerating = stage === QUALIFICATION_STAGES.GENERATING
  const isComplete = stage === QUALIFICATION_STAGES.COMPLETE

  const lastAssistantIdx = timestampedMessages.reduce(
    (last, msg, idx) => msg.role === 'assistant' ? idx : last, -1
  )
  const chipsIdx = lastAssistantIdx === timestampedMessages.length - 1 &&
    !isLoading && !isGenerating && !isComplete
    ? lastAssistantIdx
    : -1

  return (
    <div className="flex flex-col h-screen bg-dv-bg overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-800/80 bg-dv-surface/50 backdrop-blur-sm flex-shrink-0 no-print">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-dv-green animate-pulse" />
            <span className="font-mono-dv font-bold text-dv-green text-base sm:text-lg tracking-tight">
              DataVita
            </span>
          </div>
          <span className="text-slate-600 hidden sm:block">|</span>
          <span className="text-slate-400 text-xs sm:text-sm font-light tracking-wide truncate hidden sm:block">
            Enquiry Intelligence Agent
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="hidden md:flex items-center gap-1.5">
            <Zap size={12} className={isComplete ? 'text-dv-green' : 'text-slate-500'} />
            <span className="text-xs font-mono-dv text-slate-500">
              {STAGE_LABELS[stage] || 'Ready'}
            </span>
          </div>

          {isComplete && brief && (
            <button
              onClick={() => setShowBrief(v => !v)}
              className="flex items-center gap-1.5 text-xs font-mono-dv text-dv-green border border-dv-green/30 bg-dv-green/10 hover:bg-dv-green/20 px-2.5 sm:px-3 py-1.5 rounded-full transition-colors"
            >
              <span className="hidden sm:inline">{showBrief ? 'Hide Brief' : 'View Brief'}</span>
              <span className="sm:hidden">Brief</span>
              <ChevronRight size={12} className={showBrief ? 'rotate-180 transition-transform' : 'transition-transform'} />
            </button>
          )}

          <button
            onClick={handleReset}
            title="New enquiry"
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat panel */}
        <div className={`flex flex-col ${showBrief && brief ? 'w-full lg:w-[58%]' : 'w-full'} transition-all duration-300 min-w-0`}>
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 pt-4 sm:pt-5 pb-2">
            {timestampedMessages.map((msg, idx) => (
              <MessageBubble
                key={idx}
                role={msg.role}
                content={msg.content}
                timestamp={msg.timestamp}
                suggestions={idx === chipsIdx ? getSuggestions(msg.content) : undefined}
                onSuggestionClick={sendMessage}
              />
            ))}

            {(isLoading || isGenerating) && <TypingIndicator />}

            {error && (
              <div className="mx-auto my-2 max-w-md text-center text-xs font-mono-dv text-red-400 bg-red-900/20 border border-red-900/40 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {/* Prominent reset button after completion */}
            {isComplete && !isLoading && (
              <div className="flex justify-center my-5">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 text-sm font-mono-dv text-dv-bg bg-dv-green hover:bg-emerald-400 px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-dv-green/20"
                >
                  <RefreshCw size={14} />
                  Start New Enquiry
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Mobile brief toggle */}
          {isComplete && brief && (
            <div className="lg:hidden px-3 sm:px-4 pb-2 no-print">
              <button
                onClick={() => setShowBrief(v => !v)}
                className="w-full flex items-center justify-center gap-2 text-xs font-mono-dv text-dv-green border border-dv-green/30 bg-dv-green/10 hover:bg-dv-green/20 py-2.5 rounded-xl transition-colors"
              >
                <Zap size={13} />
                {showBrief ? 'Hide Sales Brief' : 'View Sales Brief'}
              </button>
            </div>
          )}

          {/* Input area */}
          <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2 flex-shrink-0 no-print">
            <div className="flex items-end gap-2 bg-dv-surface border border-slate-800 rounded-2xl px-3 sm:px-4 py-3 focus-within:border-slate-600 transition-colors">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isComplete ? 'Qualification complete — use the button above to start again' : 'Type your response…'}
                disabled={isLoading || isGenerating || isComplete}
                rows={1}
                className="flex-1 bg-transparent text-sm text-dv-text placeholder-slate-600 resize-none outline-none leading-relaxed disabled:opacity-40 max-h-28 overflow-y-auto"
                style={{ scrollbarWidth: 'none' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading || isGenerating || isComplete}
                className="flex-shrink-0 w-8 h-8 rounded-xl bg-dv-green disabled:bg-slate-700 hover:bg-emerald-400 disabled:opacity-40 transition-all flex items-center justify-center"
              >
                <Send size={14} className="text-dv-bg" />
              </button>
            </div>
            <p className="text-xs text-slate-700 text-center mt-1.5 font-mono-dv">
              DataVita · Tier III · Scotland's AI Growth Zone
            </p>
          </div>
        </div>

        {/* Brief panel — desktop */}
        {showBrief && brief && (
          <div className="hidden lg:flex flex-col w-[42%] border-l border-slate-800 bg-dv-surface/30 overflow-hidden">
            <BriefOutput
              brief={brief}
              qualificationData={qualificationData}
              onClose={() => setShowBrief(false)}
            />
          </div>
        )}
      </div>

      {/* Brief panel — mobile full-screen overlay */}
      {showBrief && brief && (
        <div className="lg:hidden fixed inset-0 bg-dv-bg z-50 flex flex-col no-print">
          <BriefOutput
            brief={brief}
            qualificationData={qualificationData}
            onClose={() => setShowBrief(false)}
          />
        </div>
      )}
    </div>
  )
}
