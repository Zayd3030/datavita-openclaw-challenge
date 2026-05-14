import { useState, useRef, useEffect } from 'react'
import { Send, RefreshCw, ChevronRight, Zap } from 'lucide-react'
import MessageBubble from './MessageBubble.jsx'
import TypingIndicator from './TypingIndicator.jsx'
import BriefOutput from './BriefOutput.jsx'
import { useQualification } from '../hooks/useQualification.js'
import { QUALIFICATION_STAGES } from '../lib/agent.js'

const STAGE_LABELS = {
  [QUALIFICATION_STAGES.GREETING]: 'Ready',
  [QUALIFICATION_STAGES.QUESTIONING]: 'Qualifying',
  [QUALIFICATION_STAGES.CONFIRMING]: 'Confirming',
  [QUALIFICATION_STAGES.GENERATING]: 'Generating Brief',
  [QUALIFICATION_STAGES.COMPLETE]: 'Complete',
}

export default function ChatInterface() {
  const [input, setInput] = useState('')
  const [showBrief, setShowBrief] = useState(false)
  const [timestampedMessages, setTimestampedMessages] = useState([])
  const messagesEndRef = useRef(null)
  const hasInitialized = useRef(false)

  const { messages, stage, isLoading, brief, qualificationData, error, sendMessage, reset } =
    useQualification()

  useEffect(() => {
    if (messages.length > timestampedMessages.length) {
      const newMessages = messages.slice(timestampedMessages.length).map(m => ({
        ...m,
        timestamp: Date.now(),
      }))
      setTimestampedMessages(prev => [...prev, ...newMessages])
    }
  }, [messages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [timestampedMessages, isLoading])

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true
      handleGreeting()
    }
  }, [])

  useEffect(() => {
    if (stage === QUALIFICATION_STAGES.COMPLETE && brief) {
      setShowBrief(true)
    }
  }, [stage, brief])

  const handleGreeting = async () => {
    try {
      const response = await fetch('/api/qualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [], stage: 'greeting' }),
      })
      if (!response.ok) return
      const { message } = await response.json()
      setTimestampedMessages([{ role: 'assistant', content: message, timestamp: Date.now() }])
    } catch {
      setTimestampedMessages([{
        role: 'assistant',
        content: "Welcome to DataVita Enquiry Intelligence. I'm here to help qualify your data centre requirements and match you with the right DataVita service. Could you start by telling me your name, company, and what brings you to DataVita today?",
        timestamp: Date.now(),
      }])
    }
  }

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
    setTimestampedMessages([])
    setShowBrief(false)
    hasInitialized.current = false
    setTimeout(() => {
      hasInitialized.current = true
      handleGreeting()
    }, 50)
  }

  const isGenerating = stage === QUALIFICATION_STAGES.GENERATING
  const isComplete = stage === QUALIFICATION_STAGES.COMPLETE

  return (
    <div className="flex flex-col h-screen bg-dv-bg overflow-hidden">
      <header className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-dv-surface/50 backdrop-blur-sm flex-shrink-0 no-print">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-dv-green animate-pulse" />
            <span className="font-mono-dv font-bold text-dv-green text-lg tracking-tight">
              DataVita
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 text-sm font-light tracking-wide">
            Enquiry Intelligence Agent
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5">
            <Zap size={12} className={isComplete ? 'text-dv-green' : 'text-slate-500'} />
            <span className="text-xs font-mono-dv text-slate-500">
              {STAGE_LABELS[stage] || 'Ready'}
            </span>
          </div>

          {isComplete && brief && (
            <button
              onClick={() => setShowBrief(v => !v)}
              className="hidden sm:flex items-center gap-1.5 text-xs font-mono-dv text-dv-green border border-dv-green/30 bg-dv-green/10 hover:bg-dv-green/20 px-3 py-1.5 rounded-full transition-colors"
            >
              {showBrief ? 'Hide Brief' : 'View Brief'}
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

      <div className="flex flex-1 overflow-hidden">
        <div className={`flex flex-col ${showBrief && brief ? 'w-full lg:w-[58%]' : 'w-full'} transition-all duration-300 min-w-0`}>
          <div className="flex-1 overflow-y-auto px-4 pt-5 pb-2">
            {timestampedMessages.map((msg, idx) => (
              <MessageBubble
                key={idx}
                role={msg.role}
                content={msg.content}
                timestamp={msg.timestamp}
              />
            ))}

            {(isLoading || isGenerating) && <TypingIndicator />}

            {error && (
              <div className="mx-auto my-2 max-w-md text-center text-xs font-mono-dv text-red-400 bg-red-900/20 border border-red-900/40 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {isComplete && brief && (
            <div className="lg:hidden px-4 pb-2 no-print">
              <button
                onClick={() => setShowBrief(v => !v)}
                className="w-full flex items-center justify-center gap-2 text-xs font-mono-dv text-dv-green border border-dv-green/30 bg-dv-green/10 hover:bg-dv-green/20 py-2.5 rounded-xl transition-colors"
              >
                <Zap size={13} />
                {showBrief ? 'Hide Sales Brief' : 'View Sales Brief'}
              </button>
            </div>
          )}

          <div className="px-4 pb-4 pt-2 flex-shrink-0 no-print">
            <div className="flex items-end gap-2 bg-dv-surface border border-slate-800 rounded-2xl px-4 py-3 focus-within:border-slate-600 transition-colors">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isComplete ? 'Qualification complete — start a new enquiry' : 'Type your response…'}
                disabled={isLoading || isGenerating || isComplete}
                rows={1}
                className="flex-1 bg-transparent text-sm text-dv-text placeholder-slate-600 resize-none outline-none leading-relaxed disabled:opacity-40 max-h-32 overflow-y-auto"
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
            <p className="text-xs text-slate-700 text-center mt-2 font-mono-dv">
              DataVita · Tier III · Scotland's AI Growth Zone
            </p>
          </div>
        </div>

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
