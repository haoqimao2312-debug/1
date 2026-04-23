import { me } from '@/lib/mock-data/users/me'

const STATS = [
  { key: 'likes',    value: me.stats.likesReceived,        label: '收到喜欢' },
  { key: 'matches',  value: me.stats.matches,              label: '匹配成功' },
  { key: 'highest',  value: `${me.stats.highestCompatibility}%`, label: '最高契合' },
]

export function ProfileStats() {
  return (
    <div className="mx-4 my-3 flex items-center justify-around py-4 rounded-2xl glass">
      {STATS.map((s) => (
        <div key={s.key} className="flex-1 text-center">
          <div
            className="text-xl font-bold text-grad-love"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            {s.value}
          </div>
          <div className="text-[11px] text-[var(--ink-dim)] mt-0.5">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
