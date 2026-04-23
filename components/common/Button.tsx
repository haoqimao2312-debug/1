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
    'inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-semibold transition active:scale-[0.98] disabled:opacity-50'
  const variants: Record<Variant, string> = {
    primary:
      'text-white shadow-[0_6px_20px_rgba(255,143,107,0.28)] bg-[#ff8f6b] hover:bg-[#ff9d7e]',
    ghost: 'text-[var(--ink-dim)] hover:text-white',
    glass:
      'text-[var(--ink)] bg-[var(--glass-strong)] border border-[var(--glass-border)] backdrop-blur',
  }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}
