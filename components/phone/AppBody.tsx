import type { ReactNode } from 'react'

export function AppBody({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 flex flex-col min-h-[calc(100vh-32px)]">
      {children}
    </div>
  )
}
