'use client'
import { useToastStore } from '@/lib/store/toast'

export function SvipCard() {
  const show = useToastStore((s) => s.show)
  return (
    <button
      onClick={() => show('支付系统开发中（Phase 5）', '♛')}
      className="block w-[calc(100%-2rem)] mx-4 my-3 p-4 rounded-3xl text-left active:scale-[0.99] transition relative overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at top right, rgba(255, 209, 118, 0.35), transparent 60%), linear-gradient(135deg, #2a1a0a 0%, #3a2010 50%, #2a1a0a 100%)',
        border: '1px solid rgba(255, 209, 118, 0.3)',
      }}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <div
              className="text-[13px] font-semibold uppercase tracking-[0.15em]"
              style={{ color: '#ffd176' }}
            >
              SVIP 会员 ♛
            </div>
            <div className="text-[11px] text-[var(--ink-dim)] mt-0.5">
              无限 AI 助聊 · 深度匹配报告 · 多风格 · 优先曝光
            </div>
          </div>
          <div className="text-right">
            <div
              className="text-2xl font-bold"
              style={{ fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', color: '#ffd176' }}
            >
              ¥58
            </div>
            <div className="text-[10px] text-[var(--ink-faint)]">月卡 · 首月 ¥38</div>
          </div>
        </div>
        <div
          className="mt-3 flex items-center justify-end gap-1 text-[13px] font-semibold"
          style={{ color: '#ffd176' }}
        >
          立即开通 <span>→</span>
        </div>
      </div>
    </button>
  )
}
