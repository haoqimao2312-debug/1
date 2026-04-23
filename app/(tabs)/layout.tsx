import type { ReactNode } from 'react'
import { Phone } from '@/components/phone/Phone'
import { StatusBar } from '@/components/phone/StatusBar'
import { TabBar } from '@/components/phone/TabBar'

export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <Phone>
      <StatusBar />
      <div className="relative z-10 flex flex-col min-h-screen pb-20">
        {children}
      </div>
      <TabBar />
    </Phone>
  )
}
