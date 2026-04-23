'use client'
import { useToastStore } from '@/lib/store/toast'
import type { ToolInfo } from '@/lib/mock-data/tools'

export function ToolCard({ tool }: { tool: ToolInfo }) {
  const show = useToastStore((s) => s.show)
  return (
    <button
      onClick={() => show(`${tool.name} 即将开放（Phase 3）`, '🔒')}
      className="relative glass p-4 rounded-2xl text-left flex flex-col gap-2 active:scale-[0.97] transition"
    >
      <div className="absolute top-2 right-2 text-[var(--ink-faint)] text-xs">🔒</div>
      <div className="text-2xl leading-none">{tool.emoji}</div>
      <div className="font-semibold text-[13px] leading-snug">{tool.name}</div>
      <div className="text-[11px] text-[var(--ink-faint)] leading-relaxed">{tool.tagline}</div>
    </button>
  )
}
