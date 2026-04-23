import { Phone } from '@/components/phone/Phone'
import { StatusBar } from '@/components/phone/StatusBar'
import { AppBody } from '@/components/phone/AppBody'

export default function OnboardPage() {
  return (
    <Phone>
      <StatusBar />
      <AppBody>
        <div className="flex-1 flex items-center justify-center text-[var(--ink-dim)]">
          性格测评（M2 实施中）
        </div>
      </AppBody>
    </Phone>
  )
}
