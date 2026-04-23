// 樱花场景主画面 + LIVE 徽标 + 计时器 + PIP + 场景标签
export function SakuraScene() {
  return (
    <div className="relative mx-4 rounded-3xl overflow-hidden aspect-[4/5] glass border border-white/10">
      <svg
        viewBox="0 0 400 500"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffd9e8" />
            <stop offset="0.6" stopColor="#e8a8cc" />
            <stop offset="1" stopColor="#a970ff" />
          </linearGradient>
          <radialGradient id="bloom" cx="0.5" cy="0.5">
            <stop offset="0" stopColor="#ffe0f0" />
            <stop offset="1" stopColor="#ff8fbc" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="face2" cx="0.5" cy="0.4">
            <stop offset="0" stopColor="#fff0e5" />
            <stop offset="1" stopColor="#ffccb0" />
          </radialGradient>
        </defs>
        <rect width="400" height="500" fill="url(#sky)" />
        <path d="M 0 280 Q 100 240 200 260 Q 300 280 400 250 L 400 500 L 0 500 Z" fill="#8a5ac0" opacity="0.35" />
        <path
          d="M -20 150 Q 40 130 90 100 Q 110 90 130 85 M 90 100 Q 120 80 160 70 M 400 160 Q 340 140 300 110 Q 280 100 270 100 M 300 110 Q 270 90 230 80"
          stroke="#4a2a1a"
          strokeWidth="4"
          fill="none"
          opacity="0.7"
        />
        <circle cx="40" cy="140" r="18" fill="url(#bloom)" />
        <circle cx="90" cy="95" r="22" fill="url(#bloom)" />
        <circle cx="130" cy="80" r="18" fill="url(#bloom)" />
        <circle cx="170" cy="70" r="14" fill="url(#bloom)" />
        <circle cx="20" cy="180" r="14" fill="url(#bloom)" />
        <circle cx="360" cy="150" r="22" fill="url(#bloom)" />
        <circle cx="320" cy="120" r="18" fill="url(#bloom)" />
        <circle cx="270" cy="100" r="16" fill="url(#bloom)" />
        <circle cx="230" cy="80" r="14" fill="url(#bloom)" />

        <g className="sakura-petals">
          <path d="M 100 200 Q 103 197 106 200 Q 103 203 100 200" fill="#ff8fbc" opacity="0.8" />
          <path d="M 280 180 Q 283 177 286 180 Q 283 183 280 180" fill="#ff8fbc" opacity="0.8" />
          <path d="M 180 250 Q 183 247 186 250 Q 183 253 180 250" fill="#ff8fbc" opacity="0.8" />
          <path d="M 330 300 Q 333 297 336 300 Q 333 303 330 300" fill="#ff8fbc" opacity="0.8" />
          <path d="M 60 280 Q 63 277 66 280 Q 63 283 60 280" fill="#ff8fbc" opacity="0.8" />
          <path d="M 220 320 Q 223 317 226 320 Q 223 323 220 320" fill="#ff8fbc" opacity="0.8" />
        </g>

        <path d="M 150 500 L 130 360 Q 130 340 150 335 L 250 335 Q 270 340 270 360 L 250 500 Z" fill="#ff8fbc" />
        <path d="M 145 500 L 155 400 L 165 500 Z" fill="#d05080" opacity="0.7" />
        <rect x="185" y="310" width="30" height="30" rx="6" fill="url(#face2)" />
        <path d="M 140 240 Q 130 300 135 360 Q 125 320 130 240 Z" fill="#2a1a1a" />
        <path d="M 260 240 Q 270 300 265 360 Q 275 320 270 240 Z" fill="#2a1a1a" />
        <ellipse cx="200" cy="250" rx="55" ry="65" fill="url(#face2)" />
        <path
          d="M 145 230 Q 150 160 200 155 Q 250 160 255 230 Q 252 200 240 185 Q 225 175 200 173 Q 175 175 160 185 Q 148 200 145 230 Z"
          fill="#2a1a1a"
        />
        <path d="M 148 220 Q 145 260 155 290 Q 150 270 150 230 Z" fill="#2a1a1a" />
        <path d="M 252 220 Q 255 260 245 290 Q 250 270 250 230 Z" fill="#2a1a1a" />
        <path d="M 160 230 Q 155 280 165 310 Q 160 290 162 240 Z" fill="#3a2020" />
        <path d="M 240 230 Q 245 280 235 310 Q 240 290 238 240 Z" fill="#3a2020" />
        <ellipse cx="178" cy="258" rx="11" ry="14" fill="#ffffff" />
        <ellipse cx="222" cy="258" rx="11" ry="14" fill="#ffffff" />
        <ellipse cx="178" cy="260" rx="9" ry="12" fill="#7c3aed" />
        <ellipse cx="222" cy="260" rx="9" ry="12" fill="#7c3aed" />
        <circle cx="178" cy="262" r="5" fill="#2a0a4a" />
        <circle cx="222" cy="262" r="5" fill="#2a0a4a" />
        <circle cx="180" cy="258" r="2.5" fill="#ffffff" />
        <circle cx="224" cy="258" r="2.5" fill="#ffffff" />
        <path d="M 200 275 L 198 282 L 202 282 Z" fill="#e8b098" opacity="0.5" />
        <ellipse cx="170" cy="282" rx="9" ry="5" fill="#ff8fbc" opacity="0.5" />
        <ellipse cx="230" cy="282" rx="9" ry="5" fill="#ff8fbc" opacity="0.5" />
        <path d="M 190 297 Q 200 303 210 297" stroke="#d05070" strokeWidth="2" fill="none" strokeLinecap="round" />
        <circle cx="165" cy="195" r="6" fill="#ff5ea0" />
        <circle cx="165" cy="195" r="3" fill="#ffd176" />
      </svg>

      <div
        className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-red-500/85 text-white text-[10px] font-bold backdrop-blur flex items-center gap-1.5"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        LIVE · 虚拟驱动
      </div>

      <div
        className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-[11px] font-semibold backdrop-blur"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        04:38
      </div>

      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/40 text-white text-[11px] backdrop-blur">
        🌸 樱花树下
      </div>

      <div className="absolute bottom-3 right-3 w-16 h-20 rounded-xl overflow-hidden border-2 border-white/60 shadow-lg">
        <svg viewBox="0 0 74 98" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
          <defs>
            <linearGradient id="pipbg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#5df0ff" />
              <stop offset="1" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          <rect width="74" height="98" fill="url(#pipbg)" />
          <ellipse cx="37" cy="45" rx="18" ry="22" fill="#ffdcc0" />
          <path
            d="M 19 40 Q 19 22 37 20 Q 55 22 55 40 Q 55 30 50 26 Q 43 22 37 22 Q 31 22 24 26 Q 19 30 19 40 Z"
            fill="#2a2040"
          />
          <ellipse cx="30" cy="48" rx="2" ry="2.5" fill="#2a0a4a" />
          <ellipse cx="44" cy="48" rx="2" ry="2.5" fill="#2a0a4a" />
          <path d="M 32 58 Q 37 61 42 58" stroke="#d07060" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M 20 98 L 22 75 Q 37 70 52 75 L 54 98 Z" fill="#5a4080" />
        </svg>
        <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[9px] text-white font-semibold">你</div>
      </div>
    </div>
  )
}
