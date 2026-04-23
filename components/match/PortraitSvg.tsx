// 用作卡片大肖像；5 个用户都共用同一套抽象 SVG 模板，由 props 控制色值
export function PortraitSvg({
  from,
  to,
  faceTone,
  hairColor,
  className = '',
}: {
  from: string
  to: string
  faceTone: string
  hairColor: string
  className?: string
}) {
  const gid = `pg-${from.replace(/[^a-z0-9]/gi, '')}`
  const fid = `pf-${faceTone.replace(/[^a-z0-9]/gi, '')}`
  const hid = `ph-${hairColor.replace(/[^a-z0-9]/gi, '')}`
  return (
    <svg viewBox="0 0 300 400" className={className} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="0.5" stopColor={to} />
          <stop offset="1" stopColor="#5a2880" />
        </linearGradient>
        <radialGradient id={fid} cx="0.5" cy="0.45">
          <stop offset="0" stopColor={faceTone} />
          <stop offset="1" stopColor={faceTone} stopOpacity={0.85} />
        </radialGradient>
        <linearGradient id={hid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={hairColor} />
          <stop offset="1" stopColor={hairColor} stopOpacity={0.75} />
        </linearGradient>
      </defs>
      <rect width="300" height="400" fill={`url(#${gid})`} />
      <circle cx="150" cy="340" r="120" fill={`url(#${fid})`} opacity="0.9" />
      <ellipse cx="150" cy="180" rx="70" ry="85" fill={`url(#${fid})`} />
      <path
        d="M 80 170 Q 80 90 150 85 Q 220 90 220 170 Q 225 140 210 120 Q 195 95 150 95 Q 105 95 90 120 Q 75 140 80 170 Z"
        fill={`url(#${hid})`}
      />
      <path d="M 85 160 Q 70 200 75 260 Q 80 220 90 200 Z" fill={`url(#${hid})`} />
      <path d="M 215 160 Q 230 200 225 260 Q 220 220 210 200 Z" fill={`url(#${hid})`} />
      <ellipse cx="128" cy="185" rx="5" ry="3" fill="#2a1810" />
      <ellipse cx="172" cy="185" rx="5" ry="3" fill="#2a1810" />
      <circle cx="120" cy="210" r="10" fill="#ff8fbc" opacity="0.35" />
      <circle cx="180" cy="210" r="10" fill="#ff8fbc" opacity="0.35" />
      <path d="M 140 225 Q 150 230 160 225 Q 155 232 150 232 Q 145 232 140 225" fill="#d05070" />
      <circle cx="60" cy="80" r="3" fill="#fff" opacity="0.8" />
      <circle cx="250" cy="60" r="4" fill="#fff" opacity="0.9" />
      <circle cx="220" cy="110" r="2" fill="#fff" opacity="0.7" />
      <circle cx="80" cy="130" r="2" fill="#fff" opacity="0.6" />
      <path d="M 245 55 L 250 60 L 245 65 L 240 60 Z" fill="#fff" opacity="0.7" />
    </svg>
  )
}
