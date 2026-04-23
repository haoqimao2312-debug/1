'use client'
import { useToastStore } from '@/lib/store/toast'

const ITEMS = [
  {
    key: 'diag',
    icon: '✦',
    title: 'AI 资料卡诊断',
    sub: '评分 B+ · 有 3 条优化建议',
    gradFrom: 'rgba(255, 143, 107, 0.22)',
    gradTo: 'rgba(255, 122, 140, 0.08)',
    iconColor: '#ff8f6b',
  },
  {
    key: 'avatar',
    icon: '◐',
    title: '我的虚拟形象',
    sub: '已解锁 3 种风格 · 管理道具',
    gradFrom: 'rgba(232, 184, 111, 0.22)',
    gradTo: 'rgba(212, 168, 112, 0.08)',
    iconColor: '#e8b86f',
  },
  {
    key: 'report',
    icon: '🧠',
    title: 'AI 恋爱人格报告',
    sub: 'ENTP · 安全型依恋 · 查看全文',
    gradFrom: 'rgba(255, 209, 118, 0.22)',
    gradTo: 'rgba(255, 143, 107, 0.08)',
    iconColor: '#ffd176',
  },
  {
    key: 'items',
    icon: '◆',
    title: '我的道具',
    sub: '超级喜欢 × 5 · 曝光加速 × 2',
    gradFrom: 'rgba(255, 122, 140, 0.22)',
    gradTo: 'rgba(255, 143, 107, 0.08)',
    iconColor: '#ff7a8c',
  },
]

export function ProfileMenu() {
  const show = useToastStore((s) => s.show)
  return (
    <div className="mx-4 my-3 rounded-2xl glass overflow-hidden">
      {ITEMS.map((it, i) => (
        <button
          key={it.key}
          onClick={() => show(`${it.title} 即将开放（Phase 3）`, it.icon)}
          className={`w-full flex items-center gap-3 px-4 py-3 text-left active:bg-white/5 transition ${
            i < ITEMS.length - 1 ? 'border-b border-white/5' : ''
          }`}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
            style={{
              background: `linear-gradient(135deg, ${it.gradFrom}, ${it.gradTo})`,
              color: it.iconColor,
            }}
          >
            {it.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-[14px]">{it.title}</div>
            <div className="text-[12px] text-[var(--ink-dim)] truncate">{it.sub}</div>
          </div>
          <div className="text-[var(--ink-faint)] shrink-0">›</div>
        </button>
      ))}
    </div>
  )
}
