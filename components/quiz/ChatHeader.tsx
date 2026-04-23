export function ChatHeader({
  name,
  sub,
  avatarGlyph = '♥',
}: { name: string; sub: string; avatarGlyph?: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl text-white shadow-[0_8px_20px_rgba(169,112,255,0.4)]"
        style={{ background: 'var(--grad-love)' }}
      >
        {avatarGlyph}
      </div>
      <div className="flex-1">
        <div className="font-semibold">{name}</div>
        <div className="text-[12px] text-[var(--ink-dim)]">{sub}</div>
      </div>
    </div>
  )
}
