export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-5 py-2">
      <div
        className="w-7 h-7 rounded-xl flex items-center justify-center text-sm shrink-0"
        style={{ background: 'var(--grad-love)' }}
      >
        ♥
      </div>
      <div className="flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-white/8 border border-white/10 rounded-tl-sm">
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/70" />
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/70" />
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/70" />
      </div>
    </div>
  )
}
