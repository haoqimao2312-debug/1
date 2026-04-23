'use client'
import { SakuraScene } from '@/components/virtual/SakuraScene'
import { IntimacyBar } from '@/components/virtual/IntimacyBar'
import { StylePicker } from '@/components/virtual/StylePicker'
import { CallControls } from '@/components/virtual/CallControls'
import { useToastStore } from '@/lib/store/toast'

export default function VirtualPage() {
  const show = useToastStore((s) => s.show)
  return (
    <>
      <div className="flex items-center justify-between px-5 pt-3 pb-3">
        <div className="text-[16px] font-semibold">虚拟视频 · 樱花场景</div>
        <button
          onClick={() => show('更多场景与设置即将开放', '⋯')}
          className="w-8 h-8 rounded-full glass flex items-center justify-center text-[var(--ink-dim)]"
          aria-label="更多"
        >
          ⋯
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <SakuraScene />
        <IntimacyBar value={72} />
        <StylePicker />
      </div>

      <CallControls />
    </>
  )
}
