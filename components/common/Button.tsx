'use client'
import type { ReactNode, ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'ghost' | 'glass'

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...rest
}: { children: ReactNode; variant?: Variant } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold transition active:scale-[0.98] disabled:opacity-50'
  const variants: Record<Variant, string> = {
    primary:
      'text-white shadow-[0_10px_30px_rgba(169,112,255,0.35)] bg-[image:var(--grad-love)]',
    ghost: 'text-[var(--ink-dim)] hover:text-white',
    glass:
      'text-white bg-[var(--glass)] border border-[var(--glass-border)] backdrop-blur',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}
