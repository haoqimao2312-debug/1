export function ChatListAvatar({
  from,
  to,
  faceTone = '#ffe0d0',
  hairColor = '#3a1f1a',
  size = 42,
  online = false,
  photo,
  alt,
}: {
  from: string
  to: string
  faceTone?: string
  hairColor?: string
  size?: number
  online?: boolean
  photo?: string
  alt?: string
}) {
  const gid = `la-${from.replace(/[^a-z0-9]/gi, '')}-${to.replace(/[^a-z0-9]/gi, '')}`
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {photo ? (
        <img
          src={photo}
          alt={alt ?? ''}
          width={size}
          height={size}
          draggable={false}
          className="w-full h-full rounded-full object-cover pointer-events-none select-none"
        />
      ) : (
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full rounded-full overflow-hidden">
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={from} />
              <stop offset="1" stopColor={to} />
            </linearGradient>
          </defs>
          <rect width={size} height={size} fill={`url(#${gid})`} />
          <circle cx={size / 2} cy={size * 0.4} r={size * 0.17} fill={faceTone} />
          <path
            d={`M ${size * 0.19} ${size} Q ${size * 0.19} ${size * 0.67} ${size / 2} ${size * 0.67} Q ${size * 0.81} ${size * 0.67} ${size * 0.81} ${size} Z`}
            fill={hairColor}
          />
        </svg>
      )}
      {online && (
        <span
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
          style={{ background: '#ff8f6b', borderColor: '#1a0f14' }}
        />
      )}
    </div>
  )
}
