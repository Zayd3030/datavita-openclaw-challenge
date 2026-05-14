export default function MessageBubble({ role, content, timestamp }) {
  const isAssistant = role === 'assistant'
  const time = timestamp
    ? new Date(timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : ''

  if (isAssistant) {
    return (
      <div className="flex items-start gap-3 mb-4">
        <div className="w-7 h-7 rounded-full bg-dv-green/20 border border-dv-green/40 flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-dv-green text-xs font-mono-dv font-bold">DV</span>
        </div>
        <div className="max-w-[85%]">
          <div className="bg-dv-surface border-l-2 border-dv-green px-4 py-3 rounded-r-xl rounded-bl-xl">
            <p className="font-mono-dv text-sm leading-relaxed text-dv-text whitespace-pre-wrap">
              {content}
            </p>
          </div>
          {time && (
            <span className="text-xs text-slate-600 mt-1 ml-1 block">{time}</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-end justify-end gap-3 mb-4">
      <div className="max-w-[75%]">
        <div className="bg-slate-700/60 px-4 py-2.5 rounded-2xl rounded-br-sm">
          <p className="text-sm leading-relaxed text-slate-200 whitespace-pre-wrap">
            {content}
          </p>
        </div>
        {time && (
          <span className="text-xs text-slate-600 mt-1 mr-1 block text-right">{time}</span>
        )}
      </div>
    </div>
  )
}
