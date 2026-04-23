import { tools } from '@/lib/mock-data/tools'
import { ToolCard } from '@/components/tools/ToolCard'

export default function ToolsPage() {
  return (
    <>
      <div className="flex items-center justify-between px-5 pt-3 pb-3">
        <div className="page-title">AI 工具</div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="p-4 rounded-2xl glass-strong mb-4">
          <div
            className="text-[11px] tracking-[0.15em] mb-1"
            style={{ fontFamily: 'JetBrains Mono, monospace', color: '#ff8f6b' }}
          >
            COMING SOON · PHASE 3
          </div>
          <div className="text-[14px] font-semibold mb-1">12 款 AI 工具正在路上</div>
          <div className="text-[12px] text-[var(--ink-dim)] leading-relaxed">
            让你不只是遇见，还能更好地成为自己。接入真 LLM 后逐步解锁。
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {tools.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>

        <div className="h-4" />
      </div>
    </>
  )
}
