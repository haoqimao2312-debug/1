import Link from 'next/link'
import { Phone } from '@/components/phone/Phone'
import { StatusBar } from '@/components/phone/StatusBar'
import { AppBody } from '@/components/phone/AppBody'
import { Button } from '@/components/common/Button'

export default function Home() {
  return (
    <Phone>
      <StatusBar />
      <AppBody>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
          <div
            className="text-[11px] tracking-[0.2em] uppercase glass rounded-full px-3.5 py-1.5"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            MATCHU · DESIGN PREVIEW
          </div>
          <h1
            className="text-4xl font-normal"
            style={{ fontFamily: 'Instrument Serif, Noto Serif SC, serif' }}
          >
            让 AI 帮你 <em className="text-grad-love not-italic">遇见对的人</em>
          </h1>
          <p className="text-[var(--ink-dim)] text-sm leading-relaxed max-w-xs">
            从一次聊天测评开始，遇见最合得来的那个人
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Link href="/onboard"><Button className="w-full">开始心遇之旅</Button></Link>
            <Link href="/chat/xiaoyu"><Button variant="glass" className="w-full">跳过测评，直接聊</Button></Link>
          </div>
        </div>
      </AppBody>
    </Phone>
  )
}
