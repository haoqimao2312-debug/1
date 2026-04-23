import type { ReactNode } from 'react'

export function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[420px] min-h-screen overflow-hidden">
      {children}
    </div>
  )
}
