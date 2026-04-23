export function StatusBar({ time = '9:41' }: { time?: string }) {
  return (
    <div className="flex items-center justify-between px-5 pt-3 pb-2 text-[13px] font-medium text-white relative z-10">
      <span>{time}</span>
      <span className="flex items-center gap-1.5">
        <svg width="14" height="10" viewBox="0 0 14 10" fill="currentColor">
          <path d="M1 7h1.5v2H1zM4 5h1.5v4H4zM7 3h1.5v6H7zM10 1h1.5v8h-1.5z" />
        </svg>
        <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
          <rect x="1" y="2" width="14" height="6" rx="1.5" stroke="currentColor" strokeWidth="0.8" />
          <rect x="2.5" y="3.5" width="10" height="3" rx="0.5" fill="currentColor" />
          <rect x="16" y="3.5" width="1" height="3" rx="0.3" fill="currentColor" />
        </svg>
      </span>
    </div>
  )
}
