export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="w-7 h-7 rounded-full bg-dv-green/20 border border-dv-green/40 flex items-center justify-center flex-shrink-0 mt-1">
        <span className="text-dv-green text-xs font-mono-dv font-bold">DV</span>
      </div>
      <div className="flex items-center gap-1.5 bg-dv-surface border-l-2 border-dv-green px-4 py-3 rounded-r-xl rounded-bl-xl">
        <span className="typing-dot w-2 h-2 rounded-full bg-dv-green inline-block" />
        <span className="typing-dot w-2 h-2 rounded-full bg-dv-green inline-block" />
        <span className="typing-dot w-2 h-2 rounded-full bg-dv-green inline-block" />
      </div>
    </div>
  )
}
