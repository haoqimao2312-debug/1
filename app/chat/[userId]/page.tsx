import { Phone } from '@/components/phone/Phone'
import { StatusBar } from '@/components/phone/StatusBar'
import { AppBody } from '@/components/phone/AppBody'

export default async function ChatPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  return (
    <Phone>
      <StatusBar />
      <AppBody>
        <div className="flex-1 flex items-center justify-center text-[var(--ink-dim)]">
          聊天页：{userId}（M3 实施中）
        </div>
      </AppBody>
    </Phone>
  )
}
