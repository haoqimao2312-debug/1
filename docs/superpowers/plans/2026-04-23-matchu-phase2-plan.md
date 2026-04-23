# MatchU · 心遇 Phase 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 补齐 mockup 里剩余 4 屏（匹配推荐、消息列表、虚拟视频、我的）+ 引入底部 TabBar（5 tab 含 AI 工具占位），让产品从 "2 屏演示" 升级为 "视觉完整的 App 形态"。

**Architecture:** 沿用 Phase 1 的 Next.js 16 App Router 三层结构（UI → API → lib）。引入 Next.js Route Group `app/(tabs)/` 把 5 条 tab 路由挂到共享的 `layout.tsx` 下，TabBar 注入到该 layout；`/`、`/onboard`、`/chat/[userId]` 三条"沉浸流"不属于 group，保持无 TabBar。

**Tech Stack:** 无新依赖。继续用 Next.js 16 + React 19 + TypeScript + Tailwind v4 + Zustand (持久化) + Framer Motion + Lucide React。

**Spec:** `docs/superpowers/specs/2026-04-23-matchu-phase2-design.md`

**约定**（继承 Phase 1）：
- 工作目录：`C:/Users/Administrator/Desktop/matchu`
- Shell：Git Bash（bash 语法）
- 不写自动化测试；每个主要 task 末尾用 `npx tsc --noEmit` + curl HTTP check + 人工视觉确认代替
- 每次 commit 用 HEREDOC + `git -c core.autocrlf=false` + `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` 尾行

---

## 里程碑总览

| 里程碑 | 任务 | 用户评审点 |
|---|---|---|
| M5 TabBar + 路由重构 | Task 1–2 | — |
| M6 匹配屏 + Mock 用户 | Task 3–5 | ✅ M5+M6 合并评审 |
| M7 消息列表屏 | Task 6–7 | — |
| M8 虚拟视频屏 | Task 8–9 | ✅ M7+M8 合并评审 |
| M9 我的屏 | Task 10–11 | — |
| M10 AI 工具占位 + 部署 | Task 12–13 | ✅ 最终交付评审 |

---

# 里程碑 M5：TabBar + 路由重构

## Task 1：Toast 系统 + TabBar 组件

**Files:**
- Create: `lib/store/toast.ts`
- Create: `components/common/Toast.tsx`
- Create: `components/phone/TabBar.tsx`

**Context**: Phase 2 的多屏需要频繁显示短时浮动提示（"已喜欢"、"SVIP 专享"、"即将开放"）。不引外部库，自己做一个极小的 Zustand store + 组件。同时创建底部 TabBar 作为 Route Group layout 的主角。

- [ ] **Step 1: 创建 `lib/store/toast.ts`**

```ts
import { create } from 'zustand'

export type ToastItem = {
  id: string
  text: string
  emoji?: string
}

type ToastState = {
  toasts: ToastItem[]
  show: (text: string, emoji?: string) => void
  dismiss: (id: string) => void
}

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  show: (text, emoji) => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    set((s) => ({ toasts: [...s.toasts, { id, text, emoji }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 2200)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
```

- [ ] **Step 2: 创建 `components/common/Toast.tsx`**

```tsx
'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { useToastStore } from '@/lib/store/toast'

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[120] flex flex-col gap-2 items-center pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="glass-strong px-4 py-2.5 rounded-full text-[13px] font-medium shadow-[0_8px_24px_rgba(0,0,0,0.35)] flex items-center gap-2"
          >
            {t.emoji && <span className="text-base leading-none">{t.emoji}</span>}
            <span>{t.text}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
```

- [ ] **Step 3: 把 `<ToastContainer />` 挂到根 layout**

Edit `app/layout.tsx`. Find the body section that looks like:

```tsx
      <body>
        <StorageWarning />
        {children}
      </body>
```

Replace with:

```tsx
      <body>
        <StorageWarning />
        <ToastContainer />
        {children}
      </body>
```

And add the import at the top (after StorageWarning import):

```tsx
import { ToastContainer } from '@/components/common/Toast'
```

- [ ] **Step 4: 创建 `components/phone/TabBar.tsx`**

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type TabKey = 'explore' | 'messages' | 'tools' | 'virtual' | 'me'

const tabs: { key: TabKey; icon: string; label: string; path: string }[] = [
  { key: 'explore',  icon: '◉', label: '探索',    path: '/match' },
  { key: 'messages', icon: '♥', label: '消息',    path: '/messages' },
  { key: 'tools',    icon: '✦', label: 'AI 工具', path: '/tools' },
  { key: 'virtual',  icon: '◐', label: '虚拟',    path: '/virtual' },
  { key: 'me',       icon: '◆', label: '我的',    path: '/me' },
]

export function TabBar() {
  const pathname = usePathname() ?? ''
  const activeKey = tabs.find((t) => pathname.startsWith(t.path))?.key
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] z-30 flex items-stretch justify-around pt-2 pb-5 px-2 glass-strong border-t border-white/10"
      style={{ paddingBottom: 'max(20px, env(safe-area-inset-bottom))' }}
    >
      {tabs.map((t) => {
        const isActive = t.key === activeKey
        return (
          <Link
            key={t.key}
            href={t.path}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5"
          >
            <span
              className={`text-[18px] leading-none ${isActive ? 'text-grad-love' : 'text-[var(--ink-faint)]'}`}
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {t.icon}
            </span>
            <span
              className={`text-[10px] ${isActive ? 'text-grad-love font-semibold' : 'text-[var(--ink-faint)]'}`}
            >
              {t.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
```

- [ ] **Step 5: tsc 检查**

```bash
cd /c/Users/Administrator/Desktop/matchu
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 6: 提交**

```bash
git add -A
git -c core.autocrlf=false commit -m "$(cat <<'EOF'
Task 1: Toast 系统 + TabBar 组件

- lib/store/toast.ts：Zustand store，2.2s 自动消失
- components/common/Toast.tsx：顶部中央，毛玻璃 + Framer Motion 出入场
- components/phone/TabBar.tsx：5 tab 固定底部，active 用渐变色
- ToastContainer 挂到 root layout

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2：Route Group + 5 tab 空壳路由 + 首页跳转逻辑

**Files:**
- Create: `app/(tabs)/layout.tsx`
- Create: `app/(tabs)/match/page.tsx` (placeholder)
- Create: `app/(tabs)/messages/page.tsx` (placeholder)
- Create: `app/(tabs)/tools/page.tsx` (placeholder)
- Create: `app/(tabs)/virtual/page.tsx` (placeholder)
- Create: `app/(tabs)/me/page.tsx` (placeholder)
- Modify: `app/page.tsx` (根据是否完成测评决定跳转目标)

**Context**: Next.js 16 Route Group `(tabs)` 不会产生 URL 段，但其下的 layout 会应用到所有子页面。这是给 5 条 tab 路由注入共享 TabBar 的惯用做法。同时把首页 "开始心遇之旅" 按钮改为根据测评状态跳转。

- [ ] **Step 1: 创建 `app/(tabs)/layout.tsx`**

```tsx
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
```

- [ ] **Step 2: 创建 `app/(tabs)/match/page.tsx` 空壳**

```tsx
export default function MatchPage() {
  return (
    <div className="flex-1 flex items-center justify-center text-[var(--ink-dim)]">
      匹配推荐（M6 实施中）
    </div>
  )
}
```

- [ ] **Step 3: 创建 `app/(tabs)/messages/page.tsx` 空壳**

```tsx
export default function MessagesPage() {
  return (
    <div className="flex-1 flex items-center justify-center text-[var(--ink-dim)]">
      消息列表（M7 实施中）
    </div>
  )
}
```

- [ ] **Step 4: 创建 `app/(tabs)/tools/page.tsx` 空壳**

```tsx
export default function ToolsPage() {
  return (
    <div className="flex-1 flex items-center justify-center text-[var(--ink-dim)]">
      AI 工具（M10 实施中）
    </div>
  )
}
```

- [ ] **Step 5: 创建 `app/(tabs)/virtual/page.tsx` 空壳**

```tsx
export default function VirtualPage() {
  return (
    <div className="flex-1 flex items-center justify-center text-[var(--ink-dim)]">
      虚拟视频（M8 实施中）
    </div>
  )
}
```

- [ ] **Step 6: 创建 `app/(tabs)/me/page.tsx` 空壳**

```tsx
export default function MePage() {
  return (
    <div className="flex-1 flex items-center justify-center text-[var(--ink-dim)]">
      我的（M9 实施中）
    </div>
  )
}
```

- [ ] **Step 7: 更新 `app/page.tsx` 加入条件跳转**

完全替换为：

```tsx
'use client'
import Link from 'next/link'
import { useUserStore } from '@/lib/store/user'
import { Phone } from '@/components/phone/Phone'
import { StatusBar } from '@/components/phone/StatusBar'
import { AppBody } from '@/components/phone/AppBody'
import { Button } from '@/components/common/Button'

export default function Home() {
  const completed = useUserStore((s) => Boolean(s.profile.completedAt))
  const primaryHref = completed ? '/match' : '/onboard'
  const primaryLabel = completed ? '进入心遇' : '开始心遇之旅'

  return (
    <Phone>
      <StatusBar />
      <AppBody>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
          <div
            className="text-[11px] tracking-[0.2em] uppercase glass rounded-full px-3.5 py-1.5"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            MATCHU · DESIGN PREVIEW
          </div>
          <h1
            className="text-4xl font-normal"
            style={{ fontFamily: 'Instrument Serif, Noto Serif SC, serif' }}
          >
            让 AI 帮你 <em className="text-grad-love not-italic">遇见对的人</em>
          </h1>
          <p className="text-[var(--ink-dim)] text-sm leading-relaxed max-w-xs">
            从一次聊天测评开始，遇见最合得来的那个人
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Link href={primaryHref}><Button className="w-full">{primaryLabel}</Button></Link>
            <Link href="/chat/xiaoyu"><Button variant="glass" className="w-full">跳过测评，直接聊</Button></Link>
          </div>
        </div>
      </AppBody>
    </Phone>
  )
}
```

- [ ] **Step 8: tsc 检查 + 5 路由 HTTP 验证**

```bash
cd /c/Users/Administrator/Desktop/matchu
npx tsc --noEmit
```

Expected: 0 errors.

启动 dev server（如果没在跑）：

```bash
npm run dev
```

等 Ready 后 curl 每条路由：

```bash
for path in / /onboard /chat/xiaoyu /match /messages /tools /virtual /me; do
  echo -n "$path -> "
  curl -sI "http://localhost:3000$path" | head -1
done
```

Expected: 所有 8 条都返回 `HTTP/1.1 200 OK`。

- [ ] **Step 9: 提交**

```bash
git add -A
git -c core.autocrlf=false commit -m "$(cat <<'EOF'
Task 2: Route Group + 5 tab 空壳 + 首页跳转条件

- app/(tabs)/layout.tsx：注入 Phone + StatusBar + TabBar 到 5 子路由
- app/(tabs)/{match,messages,tools,virtual,me}/page.tsx 空壳
- 首页 "开始心遇之旅" 按钮根据 profile.completedAt 跳转
  - 已测评 → /match（进入 App 主流）
  - 未测评 → /onboard（保留 Phase 1 入口）

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

# 里程碑 M6：匹配屏 + 5 个 Mock 用户

## Task 3：preview-users 数据 + 类型

**Files:**
- Create: `lib/mock-data/users/preview-users.ts`

**Context**: 5 个假用户的数据文件，既服务匹配屏（卡片堆叠），也服务消息列表屏（列表项预览）。肖像用纯 SVG 内联渲染，无图片资源。

- [ ] **Step 1: 创建 `lib/mock-data/users/preview-users.ts`**

```ts
export type PreviewUser = {
  id: string
  displayName: string
  age: number
  location: string
  distance: string
  mbti: string
  profession: string
  bio: string
  tags: { emoji: string; label: string }[]
  compatibility: number
  // 渐变肖像色
  avatarGradientFrom: string
  avatarGradientTo: string
  faceTone: string
  hairColor: string
  // 消息列表预览
  chatPreview: string
  chatTime: string
  unread?: number
  online?: boolean
  verified?: boolean
}

export const previewUsers: PreviewUser[] = [
  {
    id: 'linnian',
    displayName: '林念念',
    age: 25,
    location: '上海·徐汇',
    distance: '1.2km',
    mbti: 'INFJ',
    profession: '设计师',
    bio: '"喜欢下雨天看书，猫比人可爱一点点。"',
    tags: [
      { emoji: '✦', label: '读书' },
      { emoji: '🎨', label: '插画' },
      { emoji: '🌧', label: '独处' },
      { emoji: '🐈', label: '猫控' },
      { emoji: '☕', label: '咖啡' },
    ],
    compatibility: 92,
    avatarGradientFrom: '#ff8fbc',
    avatarGradientTo: '#a970ff',
    faceTone: '#ffe0d0',
    hairColor: '#3a1f1a',
    chatPreview: '那家店的猫真的很粘人 🐱',
    chatTime: '09:28',
    unread: 2,
    online: true,
    verified: true,
  },
  {
    id: 'sara',
    displayName: 'Sara · 沙拉',
    age: 24,
    location: '杭州·西湖',
    distance: '同城',
    mbti: 'ENFJ',
    profession: '咖啡师',
    bio: '"最近在学日语，想和你交换一句晚安。"',
    tags: [
      { emoji: '☕', label: '咖啡' },
      { emoji: '🇯🇵', label: '日语' },
      { emoji: '🎵', label: 'Lofi' },
      { emoji: '🌙', label: '夜猫子' },
      { emoji: '📚', label: '村上' },
    ],
    compatibility: 78,
    avatarGradientFrom: '#5df0ff',
    avatarGradientTo: '#7c3aed',
    faceTone: '#f8d8b8',
    hairColor: '#2a3040',
    chatPreview: '[AI 建议] 她提到了周末去展览，你可以…',
    chatTime: '昨天',
    online: true,
  },
  {
    id: 'amy',
    displayName: 'Amy_夏夏',
    age: 23,
    location: '成都·锦江',
    distance: '异地',
    mbti: 'ESFP',
    profession: '美妆博主',
    bio: '"你最近有没有想去的地方？"',
    tags: [
      { emoji: '💄', label: '美妆' },
      { emoji: '🍜', label: '火锅' },
      { emoji: '📷', label: '摄影' },
      { emoji: '🎤', label: 'KTV' },
      { emoji: '🌤', label: '阳光' },
    ],
    compatibility: 71,
    avatarGradientFrom: '#ffd176',
    avatarGradientTo: '#ff8fbc',
    faceTone: '#f8d8b8',
    hairColor: '#6a3050',
    chatPreview: '哈哈，那下次有机会一起去呀~',
    chatTime: '昨天',
  },
  {
    id: 'luna',
    displayName: '小鹿Luna',
    age: 26,
    location: '深圳·南山',
    distance: '异地',
    mbti: 'INFP',
    profession: '独立音乐人',
    bio: '"写的歌没什么人听，但我还在写。"',
    tags: [
      { emoji: '🎸', label: '吉他' },
      { emoji: '🎧', label: '电子' },
      { emoji: '🌌', label: '星空' },
      { emoji: '🍺', label: '精酿' },
      { emoji: '📝', label: '写作' },
    ],
    compatibility: 68,
    avatarGradientFrom: '#6fffd4',
    avatarGradientTo: '#5df0ff',
    faceTone: '#e8c8a0',
    hairColor: '#3a2030',
    chatPreview: '🎵 一首歌 · 晴天 - 周杰伦',
    chatTime: '周二',
  },
  {
    id: 'yinuo',
    displayName: '一诺',
    age: 27,
    location: '北京·朝阳',
    distance: '异地',
    mbti: 'ENTJ',
    profession: '产品经理',
    bio: '"效率控，但愿意为对的人慢下来。"',
    tags: [
      { emoji: '📈', label: '增长' },
      { emoji: '🏃', label: '跑步' },
      { emoji: '🎯', label: '目标感' },
      { emoji: '📖', label: '读书' },
      { emoji: '🍵', label: '茶' },
    ],
    compatibility: 63,
    avatarGradientFrom: '#a970ff',
    avatarGradientTo: '#ff5ea0',
    faceTone: '#ffdcc0',
    hairColor: '#4a2060',
    chatPreview: '好呀，什么时候方便？',
    chatTime: '周一',
    online: true,
  },
]

export const matchOrder = [...previewUsers].sort((a, b) => b.compatibility - a.compatibility)

export function getPreviewUser(id: string): PreviewUser | undefined {
  return previewUsers.find((u) => u.id === id)
}
```

- [ ] **Step 2: tsc + 提交**

```bash
cd /c/Users/Administrator/Desktop/matchu
npx tsc --noEmit
git add -A
git -c core.autocrlf=false commit -m "$(cat <<'EOF'
Task 3: 5 个 Mock 假用户数据

- 林念念 / Sara / Amy / 小鹿Luna / 一诺
- 每人：基本资料、契合度、5 个兴趣标签、肖像渐变、消息列表预览
- matchOrder（按契合度降序）用于匹配屏
- getPreviewUser(id) 辅助函数

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4：匹配屏 UI 组件

**Files:**
- Create: `components/match/PortraitSvg.tsx`
- Create: `components/match/MatchCard.tsx`
- Create: `components/match/MatchFilter.tsx`
- Create: `components/match/MatchActions.tsx`
- Create: `components/match/EmptyMatchState.tsx`

**Context**: 拆成 5 个小组件，职责清晰：PortraitSvg 负责内联肖像 SVG；MatchCard 负责单张卡片视觉；MatchFilter 负责顶部 filter chip 行；MatchActions 负责 5 个动作按钮；EmptyMatchState 是 "看完了" 空态。

- [ ] **Step 1: 创建 `components/match/PortraitSvg.tsx`**

```tsx
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
```

- [ ] **Step 2: 创建 `components/match/MatchCard.tsx`**

```tsx
'use client'
import { motion, type PanInfo } from 'framer-motion'
import type { PreviewUser } from '@/lib/mock-data/users/preview-users'
import { PortraitSvg } from './PortraitSvg'

export function MatchCard({
  user,
  isTop,
  stackOffset,
  onSwipe,
}: {
  user: PreviewUser
  isTop: boolean
  stackOffset: number  // 0 for top, 1 for one behind, 2 for two behind
  onSwipe?: (dir: 'left' | 'right') => void
}) {
  function handleDragEnd(_e: unknown, info: PanInfo) {
    if (!isTop || !onSwipe) return
    if (info.offset.x > 120) onSwipe('right')
    else if (info.offset.x < -120) onSwipe('left')
  }

  return (
    <motion.div
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.6}
      onDragEnd={handleDragEnd}
      initial={false}
      animate={{
        scale: 1 - stackOffset * 0.04,
        y: stackOffset * 10,
        opacity: stackOffset <= 2 ? 1 - stackOffset * 0.15 : 0,
      }}
      whileDrag={{ rotate: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      style={{ zIndex: 10 - stackOffset }}
      className="absolute inset-0 rounded-3xl overflow-hidden"
    >
      <div className="absolute inset-0">
        <PortraitSvg
          from={user.avatarGradientFrom}
          to={user.avatarGradientTo}
          faceTone={user.faceTone}
          hairColor={user.hairColor}
          className="w-full h-full"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 pointer-events-none" />

      <div className="absolute top-4 left-4 right-4 flex justify-between">
        <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur text-[12px] font-semibold">
          ♥ {user.compatibility}% 契合
        </span>
        {user.verified && (
          <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur text-[12px]">✓ 已认证</span>
        )}
      </div>

      <div className="absolute left-4 right-4 bottom-4 text-white pointer-events-none">
        <div className="text-2xl font-semibold">
          {user.displayName} <span className="text-base font-normal opacity-80">{user.age}</span>
        </div>
        <div className="text-[12px] opacity-85 mt-0.5">
          📍 {user.location} · {user.distance} · {user.mbti} · {user.profession}
        </div>
        <div className="text-[13px] italic opacity-90 my-2">{user.bio}</div>
        <div className="flex flex-wrap gap-1.5">
          {user.tags.map((t) => (
            <span
              key={t.label}
              className="px-2 py-0.5 rounded-full text-[11px] bg-white/15 border border-white/20"
            >
              {t.emoji} {t.label}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 3: 创建 `components/match/MatchFilter.tsx`**

```tsx
'use client'
import { useState } from 'react'

const chips = ['✦ 为你精选', '附近', '同频', '新人', '兴趣']

export function MatchFilter() {
  const [active, setActive] = useState(0)
  return (
    <div className="px-4 pb-3 flex items-center gap-2 overflow-x-auto">
      {chips.map((c, i) => {
        const isActive = i === active
        return (
          <button
            key={c}
            onClick={() => setActive(i)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-[12px] transition ${
              isActive
                ? 'bg-[rgba(255,94,160,0.18)] border border-[rgba(255,94,160,0.4)] text-white'
                : 'glass text-[var(--ink-dim)]'
            }`}
          >
            {c}
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4: 创建 `components/match/MatchActions.tsx`**

```tsx
'use client'

type ActionKey = 'rewind' | 'pass' | 'like' | 'super' | 'boost'

const actions: { key: ActionKey; glyph: string; label: string; color: string }[] = [
  { key: 'rewind', glyph: '↺', label: '撤回',    color: '#b8a8d8' },
  { key: 'pass',   glyph: '✕', label: '跳过',    color: '#ff8fbc' },
  { key: 'like',   glyph: '♥', label: '喜欢',    color: '#ff5ea0' },
  { key: 'super',  glyph: '★', label: '超级',    color: '#5df0ff' },
  { key: 'boost',  glyph: '⚡', label: '加速',    color: '#ffd176' },
]

export function MatchActions({
  disabled,
  onAction,
}: {
  disabled?: boolean
  onAction: (k: ActionKey) => void
}) {
  return (
    <div className="flex items-center justify-around px-4 pt-2 pb-4">
      {actions.map((a) => (
        <button
          key={a.key}
          disabled={disabled}
          onClick={() => onAction(a.key)}
          className={`
            w-12 h-12 rounded-full glass-strong flex items-center justify-center text-lg
            active:scale-90 transition disabled:opacity-40
            ${a.key === 'like' ? 'w-14 h-14 text-2xl' : ''}
          `}
          style={{ color: a.color }}
          aria-label={a.label}
        >
          {a.glyph}
        </button>
      ))}
    </div>
  )
}

export type { ActionKey }
```

- [ ] **Step 5: 创建 `components/match/EmptyMatchState.tsx`**

```tsx
'use client'
import { Button } from '@/components/common/Button'

export function EmptyMatchState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
      <div className="text-5xl">🌙</div>
      <div className="text-xl font-semibold">今日推荐已看完</div>
      <div className="text-[13px] text-[var(--ink-dim)] max-w-xs">
        明天这个时候再来，会有新的人等你。<br />
        或者现在先去和小雨聊聊？
      </div>
      <Button onClick={onRefresh} variant="glass">重置推荐</Button>
    </div>
  )
}
```

- [ ] **Step 6: tsc + 提交**

```bash
cd /c/Users/Administrator/Desktop/matchu
npx tsc --noEmit
git add -A
git -c core.autocrlf=false commit -m "$(cat <<'EOF'
Task 4: 匹配屏 5 个 UI 组件

- PortraitSvg：肖像渐变 + 抽象面部，由 props 控色
- MatchCard：卡片视觉 + Framer Motion 拖拽（仅顶张响应）
- MatchFilter：5 个横向 chip
- MatchActions：5 个动作按钮（♥ 居中稍大）
- EmptyMatchState：看完 5 张后的空态

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5：匹配屏 `/match` 集成

**Files:**
- Modify: `app/(tabs)/match/page.tsx` (overwrite)

**Context**: 把 Task 4 的 5 个组件串起来成为完整的匹配页。用本地 useState 管理当前卡片索引；按钮和拖拽都调 `handleSwipe`；装饰按钮（↺/★/⚡）显示 SVIP toast。

- [ ] **Step 1: 完全覆写 `app/(tabs)/match/page.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { matchOrder } from '@/lib/mock-data/users/preview-users'
import { MatchFilter } from '@/components/match/MatchFilter'
import { MatchCard } from '@/components/match/MatchCard'
import { MatchActions, type ActionKey } from '@/components/match/MatchActions'
import { EmptyMatchState } from '@/components/match/EmptyMatchState'
import { useToastStore } from '@/lib/store/toast'

export default function MatchPage() {
  const [idx, setIdx] = useState(0)
  const show = useToastStore((s) => s.show)
  const remaining = matchOrder.slice(idx)
  const done = idx >= matchOrder.length

  function swipeNext(dir: 'left' | 'right') {
    const user = remaining[0]
    if (!user) return
    show(dir === 'right' ? `已喜欢 · ${user.displayName}` : `已跳过 · ${user.displayName}`, dir === 'right' ? '♥' : '✕')
    setIdx((i) => i + 1)
  }

  function handleAction(a: ActionKey) {
    if (a === 'like') swipeNext('right')
    else if (a === 'pass') swipeNext('left')
    else if (a === 'rewind') show('撤回是 SVIP 专享，即将开放', '♛')
    else if (a === 'super') show('超级喜欢是 SVIP 专享，即将开放', '♛')
    else if (a === 'boost') show('曝光加速是 SVIP 专享，即将开放', '♛')
  }

  return (
    <>
      <div className="flex items-center justify-between px-5 pt-3 pb-2">
        <div className="text-[16px] font-semibold">探索 · 今日推荐</div>
        <button
          onClick={() => show('偏好设置即将开放', '⚙')}
          className="w-8 h-8 rounded-full glass flex items-center justify-center text-[var(--ink-dim)]"
          aria-label="设置"
        >
          ⚙
        </button>
      </div>

      <MatchFilter />

      {done ? (
        <EmptyMatchState onRefresh={() => setIdx(0)} />
      ) : (
        <>
          <div className="relative mx-4 flex-1 min-h-[480px]">
            {/* 渲染最多 3 张：顶 + 2 张背景 */}
            {remaining.slice(0, 3).reverse().map((user, revIndex) => {
              const stackOffset = remaining.slice(0, 3).length - 1 - revIndex
              const isTop = stackOffset === 0
              return (
                <MatchCard
                  key={user.id}
                  user={user}
                  isTop={isTop}
                  stackOffset={stackOffset}
                  onSwipe={isTop ? swipeNext : undefined}
                />
              )
            })}
          </div>

          <MatchActions onAction={handleAction} />
        </>
      )}
    </>
  )
}
```

- [ ] **Step 2: tsc 检查**

```bash
cd /c/Users/Administrator/Desktop/matchu
npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 3: HTTP + 视觉验证**

Ensure dev server is running. Visit `http://localhost:3000/match` in browser and verify:

- 顶栏显示 "探索 · 今日推荐" + ⚙
- 5 个 filter chip 可切换 active
- 林念念卡片显示在最上方（契合度 92%，因为排序是按契合度降序）
- 卡片可左右拖拽到 120px 以上就翻走
- 点 ♥ 切下一张，顶部弹 "已喜欢 · XXX"
- 点 ✕ 切下一张，弹 "已跳过"
- 点 ↺ ★ ⚡ 弹 SVIP 提示
- 5 张看完后显示 "今日推荐已看完"
- 点"重置推荐"回到第一张

- [ ] **Step 4: 提交**

```bash
git add -A
git -c core.autocrlf=false commit -m "$(cat <<'EOF'
Task 5: 匹配屏 /match 完整交互

- 卡片堆叠（顶 + 2 背景）
- ♥/✕ 切换 + toast；拖拽 120px 阈值触发
- ↺/★/⚡ 显示 SVIP 专享 toast
- 看完 5 张显示空态 + 可重置
- 顶栏 ⚙ 点击 toast

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6：M5+M6 评审检查点

**此任务无代码改动**。向用户汇报 M5+M6 完成，请用户在本地评审。

- [ ] **Step 1: 告知用户**

> M5+M6 完成。dev server 还在跑（或你本地跑 `npm run dev`），请你访问：
> - http://localhost:3000/match ：匹配屏应完整可用
> - http://localhost:3000/ → 点 "开始心遇之旅"（或 "进入心遇"）：应能正确跳转
> - 底部 TabBar 5 个 tab 可切换，其他 4 个目前是"实施中"占位，正常
> 验证清单：
> - 卡片堆叠视觉 + 可拖拽
> - ♥/✕ 切卡 + toast；↺/★/⚡ SVIP toast
> - 看完显示空态 + 可重置
> - TabBar 切换时 active 高亮正确

- [ ] **Step 2: 等待用户反馈再继续 M7**

---

# 里程碑 M7：消息列表屏

## Task 7：消息列表 UI 组件

**Files:**
- Create: `components/messages/ChatListAvatar.tsx`
- Create: `components/messages/CompatibilityHero.tsx`
- Create: `components/messages/AIAssistHint.tsx`
- Create: `components/messages/ChatListItem.tsx`

**Context**: 拆成 4 个组件：通用头像（SVG 渐变 + 简笔肖像）、顶部契合度 hero 卡（雷达数字）、AI 助聊提示条、单条聊天项。小雨的 hero 卡数字使用固定 Mock 值（92% 林念念），不跟用户数据变。

- [ ] **Step 1: 创建 `components/messages/ChatListAvatar.tsx`**

```tsx
export function ChatListAvatar({
  from,
  to,
  faceTone = '#ffe0d0',
  hairColor = '#3a1f1a',
  size = 42,
  online = false,
}: {
  from: string
  to: string
  faceTone?: string
  hairColor?: string
  size?: number
  online?: boolean
}) {
  const gid = `la-${from.replace(/[^a-z0-9]/gi, '')}-${to.replace(/[^a-z0-9]/gi, '')}`
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
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
      {online && (
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[var(--mint)] border-2 border-[#0a0414]" />
      )}
    </div>
  )
}
```

- [ ] **Step 2: 创建 `components/messages/CompatibilityHero.tsx`**

```tsx
'use client'
import { useToastStore } from '@/lib/store/toast'
import { ChatListAvatar } from './ChatListAvatar'

const DIMENSIONS = [
  { name: '性格',    value: 95 },
  { name: '三观',    value: 88 },
  { name: '兴趣',    value: 94 },
  { name: '节奏',    value: 90 },
  { name: '依恋',    value: 89 },
  { name: '生活圈',   value: 96 },
]

export function CompatibilityHero() {
  const show = useToastStore((s) => s.show)
  return (
    <div
      onClick={() => show('契合度报告详情即将开放', '💌')}
      className="mx-4 my-3 p-4 rounded-3xl glass-strong cursor-pointer active:scale-[0.99] transition"
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="text-[11px] tracking-[0.15em] text-[var(--ink-dim)]"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          NEW · 契合度解读卡
        </div>
        <div className="text-2xl font-bold text-grad-love">92<sup className="text-xs">%</sup></div>
      </div>
      <div className="flex items-center justify-center gap-3 mb-4">
        <ChatListAvatar from="#5df0ff" to="#7c3aed" faceTone="#f8d8b8" hairColor="#2a3040" size={44} />
        <div className="text-lg text-[var(--pink)]">♥</div>
        <ChatListAvatar from="#ff8fbc" to="#a970ff" faceTone="#ffe0d0" hairColor="#3a1f1a" size={44} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {DIMENSIONS.map((d) => (
          <div key={d.name} className="text-center py-2 rounded-xl bg-white/5">
            <div className="text-[10px] text-[var(--ink-faint)]">{d.name}</div>
            <div className="text-[15px] font-semibold text-grad-love" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {d.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 创建 `components/messages/AIAssistHint.tsx`**

```tsx
'use client'
import Link from 'next/link'

export function AIAssistHint() {
  return (
    <Link
      href="/chat/xiaoyu"
      className="mx-4 flex items-center gap-3 p-3 rounded-2xl glass active:bg-white/14 transition"
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 text-white"
        style={{ background: 'var(--grad-love)' }}
      >
        ♥
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <div className="font-semibold text-[14px]">心遇 AI 助手</div>
          <div className="text-[11px] text-[var(--ink-faint)] shrink-0">刚刚</div>
        </div>
        <div className="text-[12px] text-[var(--ink-dim)] truncate">
          <span className="text-[var(--pink)]">[AI]</span> 林念念回复了你 3 小时没回，要来看看吗？
        </div>
      </div>
      <div
        className="shrink-0 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
        style={{ background: 'var(--grad-pink)' }}
      >
        1
      </div>
    </Link>
  )
}
```

- [ ] **Step 4: 创建 `components/messages/ChatListItem.tsx`**

```tsx
'use client'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { ChatListAvatar } from './ChatListAvatar'

type Props = {
  href?: string
  onClick?: () => void
  displayName: string
  compatibility?: number
  time: string
  preview: ReactNode
  unread?: number
  online?: boolean
  avatarFrom: string
  avatarTo: string
  faceTone?: string
  hairColor?: string
}

export function ChatListItem({
  href,
  onClick,
  displayName,
  compatibility,
  time,
  preview,
  unread,
  online,
  avatarFrom,
  avatarTo,
  faceTone,
  hairColor,
}: Props) {
  const body = (
    <div className="flex items-center gap-3 px-4 py-3 active:bg-white/5 transition">
      <ChatListAvatar
        from={avatarFrom}
        to={avatarTo}
        faceTone={faceTone}
        hairColor={hairColor}
        online={online}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="font-semibold truncate">{displayName}</div>
            {compatibility != null && (
              <span
                className="shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-[var(--mint)]/20 text-[var(--mint)]"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {compatibility}%
              </span>
            )}
          </div>
          <div className="text-[11px] text-[var(--ink-faint)] shrink-0">{time}</div>
        </div>
        <div className="text-[12px] text-[var(--ink-dim)] truncate mt-0.5">{preview}</div>
      </div>
      {unread != null && unread > 0 && (
        <div
          className="shrink-0 min-w-5 h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
          style={{ background: 'var(--grad-pink)' }}
        >
          {unread}
        </div>
      )}
    </div>
  )

  if (href) return <Link href={href}>{body}</Link>
  return (
    <button onClick={onClick} className="w-full text-left">
      {body}
    </button>
  )
}
```

- [ ] **Step 5: tsc + 提交**

```bash
cd /c/Users/Administrator/Desktop/matchu
npx tsc --noEmit
git add -A
git -c core.autocrlf=false commit -m "$(cat <<'EOF'
Task 7: 消息列表 4 个 UI 组件

- ChatListAvatar：渐变头像 + 简笔肖像 + 在线小绿点
- CompatibilityHero：92% 契合度 hero 卡 + 6 维度数字
- AIAssistHint：AI 助手消息条（点击跳小雨聊天）
- ChatListItem：单条聊天项（href / onClick 两种用法）

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8：消息列表 `/messages` 集成

**Files:**
- Modify: `app/(tabs)/messages/page.tsx` (overwrite)

**Context**: 聚合所有消息组件；小雨条从 Phase 1 的 `useChatStore` 读取最后一条消息作为预览（如无则显示默认问候）；其他 4 个假人用 `previewUsers` 的 `chatPreview` 字段。

- [ ] **Step 1: 完全覆写 `app/(tabs)/messages/page.tsx`**

```tsx
'use client'
import { useChatStore } from '@/lib/store/chat'
import { useToastStore } from '@/lib/store/toast'
import { previewUsers } from '@/lib/mock-data/users/preview-users'
import { xiaoyu } from '@/lib/mock-data/users/xiaoyu'
import { CompatibilityHero } from '@/components/messages/CompatibilityHero'
import { AIAssistHint } from '@/components/messages/AIAssistHint'
import { ChatListItem } from '@/components/messages/ChatListItem'

export default function MessagesPage() {
  const messages = useChatStore((s) => s.messages[xiaoyu.id] ?? [])
  const show = useToastStore((s) => s.show)

  const xiaoyuLast = messages[messages.length - 1]
  const xiaoyuPreview = xiaoyuLast
    ? xiaoyuLast.content.length > 30
      ? xiaoyuLast.content.slice(0, 30) + '…'
      : xiaoyuLast.content
    : '啊 你来啦～'
  const xiaoyuTime = xiaoyuLast
    ? new Date(xiaoyuLast.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    : '刚刚'
  const xiaoyuUnread = messages.filter((m) => m.role === 'assistant').length > 0 ? 0 : 2

  function openPreview(name: string) {
    show(`${name} 仅演示。点小雨可以和 AI 真实聊天`, '💭')
  }

  return (
    <>
      <div className="flex items-center justify-between px-5 pt-3 pb-2">
        <div className="text-[16px] font-semibold">消息 · 心遇</div>
        <button
          onClick={() => show('搜索即将开放', '🔍')}
          className="w-8 h-8 rounded-full glass flex items-center justify-center text-[var(--ink-dim)]"
          aria-label="搜索"
        >
          🔍
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <CompatibilityHero />

        <div className="px-5 pt-2 pb-1 text-[11px] tracking-[0.1em] text-[var(--ink-faint)]">
          AI 助聊 · 智能推荐
        </div>
        <AIAssistHint />

        <div className="px-5 pt-4 pb-1 text-[11px] tracking-[0.1em] text-[var(--ink-faint)]">
          最近聊天
        </div>
        <div>
          {/* 小雨（真实聊天，Phase 1） */}
          <ChatListItem
            href="/chat/xiaoyu"
            displayName={xiaoyu.displayName}
            time={xiaoyuTime}
            preview={xiaoyuPreview}
            unread={xiaoyuUnread}
            online
            avatarFrom="#ff5ea0"
            avatarTo="#a970ff"
            faceTone="#ffd8c0"
            hairColor="#3a2030"
          />
          {/* 5 个假人 */}
          {previewUsers.map((u) => (
            <ChatListItem
              key={u.id}
              onClick={() => openPreview(u.displayName)}
              displayName={u.displayName}
              compatibility={u.compatibility}
              time={u.chatTime}
              preview={u.chatPreview}
              unread={u.unread}
              online={u.online}
              avatarFrom={u.avatarGradientFrom}
              avatarTo={u.avatarGradientTo}
              faceTone={u.faceTone}
              hairColor={u.hairColor}
            />
          ))}
        </div>

        <div className="h-4" />
      </div>
    </>
  )
}
```

- [ ] **Step 2: tsc + HTTP + 视觉验证**

```bash
cd /c/Users/Administrator/Desktop/matchu
npx tsc --noEmit
curl -sI http://localhost:3000/messages | head -1
```

Expected: tsc 0 errors, HTTP 200 OK.

浏览器 visit `/messages`：
- hero 卡显示 92% + 6 个维度数字
- AI 助聊提示条点击跳 `/chat/xiaoyu`（真聊天）
- 最近聊天第一条是小雨 —— 如果你之前在 `/chat/xiaoyu` 聊过，应显示那次最后一条
- 点小雨跳真聊天
- 点其他 5 个假人 toast "仅演示"
- 在线小绿点正常显示

- [ ] **Step 3: 提交**

```bash
git add -A
git -c core.autocrlf=false commit -m "$(cat <<'EOF'
Task 8: 消息列表 /messages 完整页面

- Hero 卡 + AI 助聊提示 + "最近聊天" 分组
- 小雨条 href=/chat/xiaoyu，预览从 useChatStore 实时读
- 5 个假人 onClick toast "仅演示"
- 搜索按钮 toast

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

# 里程碑 M8：虚拟视频屏

## Task 9：虚拟视频屏组件 + 页面

**Files:**
- Create: `components/virtual/SakuraScene.tsx`
- Create: `components/virtual/IntimacyBar.tsx`
- Create: `components/virtual/StylePicker.tsx`
- Create: `components/virtual/CallControls.tsx`
- Modify: `app/(tabs)/virtual/page.tsx` (overwrite)

**Context**: 这一屏的主体是 mockup 里那张复杂的 SVG 插画（樱花 + 动漫少女 + PIP），我们原样搬过来（修改 JSX 语法）。其他 3 个组件是辅助块。所有交互都走 toast。

- [ ] **Step 1: 创建 `components/virtual/SakuraScene.tsx`**

```tsx
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

        {/* 飘落的花瓣 - 给 CSS 加缓慢动画 */}
        <g className="sakura-petals">
          <path d="M 100 200 Q 103 197 106 200 Q 103 203 100 200" fill="#ff8fbc" opacity="0.8" />
          <path d="M 280 180 Q 283 177 286 180 Q 283 183 280 180" fill="#ff8fbc" opacity="0.8" />
          <path d="M 180 250 Q 183 247 186 250 Q 183 253 180 250" fill="#ff8fbc" opacity="0.8" />
          <path d="M 330 300 Q 333 297 336 300 Q 333 303 330 300" fill="#ff8fbc" opacity="0.8" />
          <path d="M 60 280 Q 63 277 66 280 Q 63 283 60 280" fill="#ff8fbc" opacity="0.8" />
          <path d="M 220 320 Q 223 317 226 320 Q 223 323 220 320" fill="#ff8fbc" opacity="0.8" />
        </g>

        {/* 动漫少女 */}
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

      {/* LIVE 徽标 */}
      <div
        className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-red-500/85 text-white text-[10px] font-bold backdrop-blur flex items-center gap-1.5"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        LIVE · 虚拟驱动
      </div>

      {/* 计时器 */}
      <div
        className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-[11px] font-semibold backdrop-blur"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        04:38
      </div>

      {/* 场景标签 */}
      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/40 text-white text-[11px] backdrop-blur">
        🌸 樱花树下
      </div>

      {/* PIP 画中画（你） */}
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
```

- [ ] **Step 2: 在 `app/globals.css` 末尾追加花瓣动画**

Edit `app/globals.css`. Append at the very end of the file (after the existing `user-select` rule):

```css
/* 樱花花瓣飘落 */
@keyframes sakura-fall {
  0%   { transform: translate(0, 0); opacity: 0.6; }
  50%  { transform: translate(8px, 30px); opacity: 0.85; }
  100% { transform: translate(-4px, 60px); opacity: 0; }
}
.sakura-petals path {
  animation: sakura-fall 6s ease-in-out infinite;
}
.sakura-petals path:nth-child(2) { animation-delay: 1.2s; }
.sakura-petals path:nth-child(3) { animation-delay: 2.4s; }
.sakura-petals path:nth-child(4) { animation-delay: 0.6s; }
.sakura-petals path:nth-child(5) { animation-delay: 3.0s; }
.sakura-petals path:nth-child(6) { animation-delay: 1.8s; }
```

- [ ] **Step 3: 创建 `components/virtual/IntimacyBar.tsx`**

```tsx
const MILESTONES = [
  { label: '文字', active: true },
  { label: '视频', active: true },
  { label: '场景', active: true, current: true },
  { label: '真人', active: false },
]

export function IntimacyBar({ value = 72 }: { value?: number }) {
  return (
    <div className="mx-4 my-3 p-4 rounded-2xl glass">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[13px] font-semibold flex items-center gap-1.5">
          <span className="text-[var(--pink)]">♥</span> 亲密度
        </div>
        <div className="text-[13px] font-semibold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          <span className="text-grad-love">{value}</span>
          <span className="text-[var(--ink-faint)]"> / 100</span>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-3">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: 'var(--grad-love)' }} />
      </div>
      <div className="flex items-center justify-between text-[11px]">
        {MILESTONES.map((m) => (
          <span
            key={m.label}
            className={`${
              m.current
                ? 'text-grad-love font-semibold'
                : m.active
                ? 'text-[var(--ink-dim)]'
                : 'text-[var(--ink-faint)]'
            }`}
          >
            {m.active ? (m.current ? '◉ ' : '✓ ') : '○ '}
            {m.label}
          </span>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 创建 `components/virtual/StylePicker.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { useToastStore } from '@/lib/store/toast'

const STYLES = [
  { id: 'anime',   emoji: '🌸', label: '日漫风',  locked: false },
  { id: '3d',      emoji: '🎭', label: '3D 写实', locked: false },
  { id: 'soft',    emoji: '✨', label: '轻美化',  locked: false },
  { id: 'guofeng', emoji: '🏮', label: '国风',    locked: true },
  { id: 'cyber',   emoji: '🔮', label: '赛博',    locked: true },
]

export function StylePicker() {
  const [active, setActive] = useState('anime')
  const show = useToastStore((s) => s.show)
  return (
    <div className="mx-4 my-3">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="text-[13px] font-semibold">你的虚拟形象风格</div>
        <div
          className="text-[11px] text-[var(--ink-dim)]"
          onClick={() => show('风格商店即将开放', '🎨')}
        >
          切换风格 ›
        </div>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto">
        {STYLES.map((s) => {
          const isActive = s.id === active
          return (
            <button
              key={s.id}
              onClick={() => {
                if (s.locked) {
                  show(`${s.label} 风格 SVIP 专享`, '♛')
                } else {
                  setActive(s.id)
                }
              }}
              className={`shrink-0 px-3 py-1.5 rounded-full text-[12px] transition flex items-center gap-1 ${
                isActive
                  ? 'bg-[rgba(255,94,160,0.18)] border border-[rgba(255,94,160,0.4)] text-white'
                  : 'glass text-[var(--ink-dim)]'
              }`}
            >
              <span>{s.emoji}</span>
              <span>{s.label}</span>
              {s.locked && <span className="text-[10px] ml-0.5">🔒</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: 创建 `components/virtual/CallControls.tsx`**

```tsx
'use client'
import { useToastStore } from '@/lib/store/toast'

const BUTTONS = [
  { key: 'mic',   glyph: '🎤', msg: '麦克风控制即将开放（Phase 3）',       color: '#5df0ff' },
  { key: 'scene', glyph: '🌸', msg: '更多场景：海边 / 雪山 / 露台 即将开放', color: '#ff8fbc' },
  { key: 'gift',  glyph: '🎁', msg: '虚拟礼物系统即将开放',                  color: '#ffd176' },
  { key: 'end',   glyph: '✕',  msg: '（演示模式下无通话可结束）',              color: '#ff5e5e' },
]

export function CallControls() {
  const show = useToastStore((s) => s.show)
  return (
    <div className="flex items-center justify-around px-4 pt-1 pb-3">
      {BUTTONS.map((b) => (
        <button
          key={b.key}
          onClick={() => show(b.msg, b.glyph)}
          className={`
            w-12 h-12 rounded-full glass-strong flex items-center justify-center text-lg
            active:scale-90 transition
            ${b.key === 'end' ? 'bg-red-500/60' : ''}
          `}
          style={b.key === 'end' ? undefined : { color: b.color }}
          aria-label={b.key}
        >
          {b.glyph}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 6: 覆写 `app/(tabs)/virtual/page.tsx`**

```tsx
'use client'
import { SakuraScene } from '@/components/virtual/SakuraScene'
import { IntimacyBar } from '@/components/virtual/IntimacyBar'
import { StylePicker } from '@/components/virtual/StylePicker'
import { CallControls } from '@/components/virtual/CallControls'
import { useToastStore } from '@/lib/store/toast'

export default function VirtualPage() {
  const show = useToastStore((s) => s.show)
  return (
    <>
      <div className="flex items-center justify-between px-5 pt-3 pb-3">
        <div className="text-[16px] font-semibold">虚拟视频 · 樱花场景</div>
        <button
          onClick={() => show('更多场景与设置即将开放', '⋯')}
          className="w-8 h-8 rounded-full glass flex items-center justify-center text-[var(--ink-dim)]"
          aria-label="更多"
        >
          ⋯
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <SakuraScene />
        <IntimacyBar value={72} />
        <StylePicker />
      </div>

      <CallControls />
    </>
  )
}
```

- [ ] **Step 7: tsc + HTTP + 视觉验证**

```bash
cd /c/Users/Administrator/Desktop/matchu
npx tsc --noEmit
curl -sI http://localhost:3000/virtual | head -1
```

Expected: 0 errors, HTTP 200 OK.

浏览器 visit `/virtual`：
- 樱花粉紫天空 + 动漫少女在中央
- 花瓣应该在缓慢飘落（CSS 动画）
- 右上 "04:38" 计时器（静态数字）
- 左上 LIVE 徽标
- 右下角你的 PIP
- 亲密度条 72/100，4 个阶段："✓ 文字 ✓ 视频 ◉ 场景 ○ 真人"
- 5 个风格 chip：日漫风 active，国风/赛博锁
- 点锁风格 toast "SVIP 专享"
- 底部 4 个控制按钮，点任一 toast
- TabBar 显示 "虚拟" active

- [ ] **Step 8: 提交**

```bash
git add -A
git -c core.autocrlf=false commit -m "$(cat <<'EOF'
Task 9: 虚拟视频屏 /virtual 完整页面

- SakuraScene：樱花树 + 动漫少女 + 花瓣 CSS 动画 + PIP
- IntimacyBar：72/100 + 4 阶段里程碑
- StylePicker：5 风格 chip，国风/赛博锁 toast
- CallControls：4 按钮全部 toast
- globals.css 追加 sakura-fall keyframes

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10：M7+M8 评审检查点

**此任务无代码改动**。

- [ ] **Step 1: 告知用户**

> M7+M8 完成。请看：
> - http://localhost:3000/messages ：hero 卡 + AI 助手条 + 6 条聊天；小雨可点进真聊天，其他 toast
> - http://localhost:3000/virtual ：樱花场景完整 + 花瓣飘落动画 + 亲密度 + 风格 + 4 控制按钮

- [ ] **Step 2: 等待用户反馈再继续 M9**

---

# 里程碑 M9：我的屏 + 会员

## Task 11：me 数据 + 我的屏 UI 组件

**Files:**
- Create: `lib/mock-data/users/me.ts`
- Create: `components/me/ProfileHero.tsx`
- Create: `components/me/ProfileStats.tsx`
- Create: `components/me/SvipCard.tsx`
- Create: `components/me/ProfileMenu.tsx`

**Context**: "当前用户" 硬编码为 `Alex`；如果用户完成了 Phase 1 测评，MBTI chip 位置显示性格画像名（如 "月光补能型"）。4 个菜单项和 SVIP 购买都走 toast。

- [ ] **Step 1: 创建 `lib/mock-data/users/me.ts`**

```ts
export type MeProfile = {
  id: string
  displayName: string
  age: number
  location: string
  profession: string
  mbti: string
  attachmentStyle: string
  verified: boolean
  hotUser: boolean
  stats: {
    likesReceived: number
    matches: number
    highestCompatibility: number
  }
  avatarGradientFrom: string
  avatarGradientTo: string
  faceTone: string
  hairColor: string
}

export const me: MeProfile = {
  id: 'alex',
  displayName: 'Alex',
  age: 27,
  location: '上海 · 浦东',
  profession: '程序员',
  mbti: 'ENTP',
  attachmentStyle: '安全型',
  verified: true,
  hotUser: true,
  stats: {
    likesReceived: 148,
    matches: 23,
    highestCompatibility: 92,
  },
  avatarGradientFrom: '#5df0ff',
  avatarGradientTo: '#7c3aed',
  faceTone: '#ffdcc0',
  hairColor: '#2a1a30',
}
```

- [ ] **Step 2: 创建 `components/me/ProfileHero.tsx`**

```tsx
'use client'
import { me } from '@/lib/mock-data/users/me'
import { useUserStore } from '@/lib/store/user'

export function ProfileHero() {
  const profileDisplayName = useUserStore((s) => s.profile.profileDisplayName)
  const mbtiOrProfile = profileDisplayName || me.mbti

  return (
    <div className="flex flex-col items-center gap-2 pt-2 pb-4">
      <div className="relative">
        <div
          className="w-[84px] h-[84px] rounded-full overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${me.avatarGradientFrom}, ${me.avatarGradientTo})` }}
        >
          <svg viewBox="0 0 84 84" width="100%" height="100%">
            <ellipse cx="42" cy="36" rx="16" ry="20" fill={me.faceTone} />
            <path
              d="M 22 32 Q 22 14 42 12 Q 62 14 62 32 Q 62 24 55 20 Q 48 16 42 16 Q 36 16 29 20 Q 22 24 22 32 Z"
              fill={me.hairColor}
            />
            <ellipse cx="35" cy="38" rx="2.5" ry="3" fill="#2a0a4a" />
            <ellipse cx="49" cy="38" rx="2.5" ry="3" fill="#2a0a4a" />
            <path d="M 36 48 Q 42 52 48 48" stroke="#d07060" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 20 84 L 25 64 Q 42 58 59 64 L 64 84 Z" fill={me.hairColor} />
          </svg>
        </div>
        {me.verified && (
          <div
            className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs border-2 border-[#0a0414]"
            style={{ background: 'var(--grad-love)' }}
          >
            ✓
          </div>
        )}
      </div>
      <div
        className="text-xl font-semibold"
        style={{ fontFamily: 'Instrument Serif, Noto Serif SC, serif' }}
      >
        {me.displayName} <span className="text-sm opacity-70 font-normal">· {me.age}</span>
      </div>
      <div className="text-[12px] text-[var(--ink-dim)]">
        📍 {me.location} · {me.profession}
      </div>
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {me.verified && (
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-[var(--mint)]/20 text-[var(--mint)]">
            ✓ 实名认证
          </span>
        )}
        <span
          className="px-2 py-0.5 rounded-full text-[11px] text-white font-semibold"
          style={{ background: 'var(--grad-love)' }}
        >
          {mbtiOrProfile}
        </span>
        {me.hotUser && (
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-[var(--pink)]/20 text-[var(--pink)]">
            ♥ 热门用户
          </span>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 创建 `components/me/ProfileStats.tsx`**

```tsx
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
```

- [ ] **Step 4: 创建 `components/me/SvipCard.tsx`**

```tsx
'use client'
import { useToastStore } from '@/lib/store/toast'

export function SvipCard() {
  const show = useToastStore((s) => s.show)
  return (
    <button
      onClick={() => show('支付系统开发中（Phase 5）', '♛')}
      className="block w-full mx-4 my-3 p-4 rounded-3xl text-left active:scale-[0.99] transition relative overflow-hidden"
      style={{ background: 'var(--grad-warm)', width: 'calc(100% - 2rem)' }}
    >
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.3) 1px, transparent 0)',
          backgroundSize: '10px 10px',
        }}
      />
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[13px] font-semibold text-black/80 uppercase tracking-[0.1em]">
              SVIP 会员 ♛
            </div>
            <div className="text-[11px] text-black/60 mt-0.5">无限 AI 助聊 · 深度匹配报告 · 多风格 · 优先曝光</div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-black/90" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              ¥58
            </div>
            <div className="text-[10px] text-black/60">月卡 · 首月 ¥38</div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-end gap-1 text-[13px] font-semibold text-black/90">
          立即开通 <span>→</span>
        </div>
      </div>
    </button>
  )
}
```

- [ ] **Step 5: 创建 `components/me/ProfileMenu.tsx`**

```tsx
'use client'
import { useToastStore } from '@/lib/store/toast'

const ITEMS = [
  { key: 'diag',    icon: '✦',  title: 'AI 资料卡诊断',   sub: '评分 B+ · 有 3 条优化建议',        color: '#ff5ea0' },
  { key: 'avatar',  icon: '◐',  title: '我的虚拟形象',    sub: '已解锁 3 种风格 · 管理道具',        color: '#a970ff' },
  { key: 'report',  icon: '🧠', title: 'AI 恋爱人格报告',  sub: 'ENTP · 安全型依恋 · 查看全文',      color: '#5df0ff' },
  { key: 'items',   icon: '◆',  title: '我的道具',        sub: '超级喜欢 × 5 · 曝光加速 × 2',      color: '#ffd176' },
]

export function ProfileMenu() {
  const show = useToastStore((s) => s.show)
  return (
    <div className="mx-4 my-3 rounded-2xl glass overflow-hidden">
      {ITEMS.map((it, i) => (
        <button
          key={it.key}
          onClick={() => show(`${it.title} 即将开放（Phase 3）`, it.icon)}
          className={`w-full flex items-center gap-3 px-4 py-3 text-left active:bg-white/5 transition ${
            i < ITEMS.length - 1 ? 'border-b border-white/5' : ''
          }`}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
            style={{ background: `${it.color}25`, color: it.color }}
          >
            {it.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-[14px]">{it.title}</div>
            <div className="text-[12px] text-[var(--ink-dim)] truncate">{it.sub}</div>
          </div>
          <div className="text-[var(--ink-faint)] shrink-0">›</div>
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 6: tsc + 提交**

```bash
cd /c/Users/Administrator/Desktop/matchu
npx tsc --noEmit
git add -A
git -c core.autocrlf=false commit -m "$(cat <<'EOF'
Task 11: 我的屏数据 + 4 个 UI 组件

- lib/mock-data/users/me.ts：Alex · 27 · 程序员 · ENTP
- ProfileHero：头像 + 认证徽章 + 3 个 chip
  （MBTI chip 在完成测评后显示性格画像名，否则显示 ENTP）
- ProfileStats：3 个统计（148/23/92%）
- SvipCard：¥58 月卡，toast "支付开发中"
- ProfileMenu：4 菜单项全部 toast "Phase 3 开放"

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 12：我的屏 `/me` 集成

**Files:**
- Modify: `app/(tabs)/me/page.tsx` (overwrite)

- [ ] **Step 1: 覆写 `app/(tabs)/me/page.tsx`**

```tsx
'use client'
import { useToastStore } from '@/lib/store/toast'
import { ProfileHero } from '@/components/me/ProfileHero'
import { ProfileStats } from '@/components/me/ProfileStats'
import { SvipCard } from '@/components/me/SvipCard'
import { ProfileMenu } from '@/components/me/ProfileMenu'

export default function MePage() {
  const show = useToastStore((s) => s.show)
  return (
    <>
      <div className="flex items-center justify-between px-5 pt-3 pb-2">
        <div className="text-[16px] font-semibold">我的</div>
        <button
          onClick={() => show('设置即将开放（Phase 4）', '⚙')}
          className="w-8 h-8 rounded-full glass flex items-center justify-center text-[var(--ink-dim)]"
          aria-label="设置"
        >
          ⚙
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ProfileHero />
        <ProfileStats />
        <SvipCard />
        <ProfileMenu />
        <div className="h-4" />
      </div>
    </>
  )
}
```

- [ ] **Step 2: tsc + HTTP + 视觉验证**

```bash
cd /c/Users/Administrator/Desktop/matchu
npx tsc --noEmit
curl -sI http://localhost:3000/me | head -1
```

Expected: 0 errors, 200 OK.

浏览器 `/me` 验证：
- 头像 + ✓ 认证徽章 + 名字 "Alex · 27"
- 位置 "📍 上海 · 浦东 · 程序员"
- 3 个 chip："实名认证"、MBTI（如果做过测评显示画像名，否则 "ENTP"）、"热门用户"
- 3 个统计：148 / 23 / 92%
- SVIP 金黄渐变卡，点击 toast "支付开发中"
- 4 个菜单项各自 toast

**测试 MBTI 联动**：
1. 打开 DevTools Application → Local Storage → 删 `matchu:user-profile` 或 clear all
2. 刷新 `/me` → chip 显示 "ENTP"
3. 走完 `/onboard` 测评
4. 再进 `/me` → chip 显示性格画像名（如 "月光补能型"）

- [ ] **Step 3: 提交**

```bash
git add -A
git -c core.autocrlf=false commit -m "$(cat <<'EOF'
Task 12: 我的屏 /me 完整页面

- 聚合 ProfileHero / Stats / SvipCard / ProfileMenu
- MBTI chip 条件渲染：完成测评显示性格画像名，否则显示 ENTP

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

# 里程碑 M10：AI 工具占位 + 部署

## Task 13：AI 工具占位页 + 最终部署

**Files:**
- Create: `lib/mock-data/tools.ts`
- Create: `components/tools/ToolCard.tsx`
- Modify: `app/(tabs)/tools/page.tsx` (overwrite)
- Modify: `README.md`

**Context**: 12 个 AI 工具卡片（灰色 + 锁图标 + 点击 toast），加上顶部 "即将开放 Phase 3" 说明。完成后做最终的全路由 HTTP smoke + build sanity + push。

- [ ] **Step 1: 创建 `lib/mock-data/tools.ts`**

```ts
export type ToolInfo = {
  id: string
  name: string
  emoji: string
  tagline: string
}

export const tools: ToolInfo[] = [
  { id: 'avatar',     name: 'AI 头像生成',  emoji: '🎨', tagline: '12 种风格一键切换' },
  { id: 'divination', name: 'AI 占卜',     emoji: '🔮', tagline: '塔罗 / 星座 / 生肖' },
  { id: 'scripts',    name: '恋爱话术',    emoji: '💬', tagline: '开场白 / 挽回 / 撩拨' },
  { id: 'mindread',   name: '读心话',      emoji: '🧠', tagline: '揭开你我之间的未说' },
  { id: 'outfit',     name: 'AI 穿搭',     emoji: '👗', tagline: '按场合帮你配一整套' },
  { id: 'recipe',     name: 'AI 菜谱',     emoji: '🍳', tagline: '晚安粥 / 约会料理' },
  { id: 'sentiment',  name: '情感分析',    emoji: '💌', tagline: '这段话对方在想什么' },
  { id: 'radar',      name: '关系雷达',    emoji: '📡', tagline: '看清距离 / 感情温度' },
  { id: 'date-plan',  name: '约会规划',    emoji: '🎪', tagline: '首次约会 / 纪念日' },
  { id: 'wallpaper',  name: '心情壁纸',    emoji: '🌆', tagline: '把心情画成壁纸' },
  { id: 'quotes',     name: '金句生成',    emoji: '✨', tagline: '发朋友圈一键获赞' },
  { id: 'rank',       name: '好友排序',    emoji: '🏆', tagline: '谁是你真正的同频' },
]
```

- [ ] **Step 2: 创建 `components/tools/ToolCard.tsx`**

```tsx
'use client'
import { useToastStore } from '@/lib/store/toast'
import type { ToolInfo } from '@/lib/mock-data/tools'

export function ToolCard({ tool }: { tool: ToolInfo }) {
  const show = useToastStore((s) => s.show)
  return (
    <button
      onClick={() => show(`${tool.name} 即将开放（Phase 3）`, '🔒')}
      className="relative glass p-4 rounded-2xl text-left flex flex-col gap-2 active:scale-[0.97] transition"
    >
      <div className="absolute top-2 right-2 text-[var(--ink-faint)] text-xs">🔒</div>
      <div className="text-2xl leading-none">{tool.emoji}</div>
      <div className="font-semibold text-[13px] leading-snug">{tool.name}</div>
      <div className="text-[11px] text-[var(--ink-faint)] leading-relaxed">{tool.tagline}</div>
    </button>
  )
}
```

- [ ] **Step 3: 覆写 `app/(tabs)/tools/page.tsx`**

```tsx
import { tools } from '@/lib/mock-data/tools'
import { ToolCard } from '@/components/tools/ToolCard'

export default function ToolsPage() {
  return (
    <>
      <div className="flex items-center justify-between px-5 pt-3 pb-2">
        <div className="text-[16px] font-semibold">AI 工具</div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="p-4 rounded-2xl glass-strong mb-4">
          <div
            className="text-[11px] tracking-[0.15em] text-[var(--pink)] mb-1"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            COMING SOON · PHASE 3
          </div>
          <div className="text-[14px] font-semibold mb-1">12 款 AI 工具正在路上</div>
          <div className="text-[12px] text-[var(--ink-dim)] leading-relaxed">
            让你不只是遇见，还能更好地成为自己。接入真 LLM 后逐步解锁。
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {tools.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>

        <div className="h-4" />
      </div>
    </>
  )
}
```

- [ ] **Step 4: tsc + 全路由 HTTP smoke 测试**

```bash
cd /c/Users/Administrator/Desktop/matchu
npx tsc --noEmit
```

Expected: 0 errors.

```bash
for path in / /onboard /chat/xiaoyu /match /messages /tools /virtual /me /this-does-not-exist; do
  echo -n "$path -> "
  curl -sI "http://localhost:3000$path" | head -1
done
```

Expected: 前 8 条都是 `HTTP/1.1 200 OK`，最后一条 `HTTP/1.1 404 Not Found`。

- [ ] **Step 5: 生产构建验证**

```bash
# 先杀掉 dev server（Next 16 的 lockfile 机制）
for pid in $(netstat -ano | grep ':3000 ' | grep LISTENING | awk '{print $NF}' | sort -u); do
  taskkill //PID $pid //F 2>/dev/null
done
sleep 2

# 清构建缓存
rm -rf .next

# 生产构建
npm run build 2>&1 | tail -20
```

Expected: "Compiled successfully"，route 表列出所有 Phase 1 + Phase 2 新增路由（`/match`、`/messages`、`/tools`、`/virtual`、`/me`）。

如果有任何 TypeScript error → 修复后重来。

- [ ] **Step 6: 更新 `README.md`**

完全替换 "## 当前状态" 和 "## 主要路由" 和 "## 已交付能力" 节。用 Read 先读当前 README，找到第 7 行（"## 当前状态"），替换从第 7 行到文件第一次出现 "## 本期明确不做" 之前的所有行。

使用 Edit tool with this change — replace:

```markdown
## 当前状态

- [x] 产品设计：[docs/superpowers/specs/2026-04-23-matchu-mvp-design.md](docs/superpowers/specs/2026-04-23-matchu-mvp-design.md)
- [x] 实施计划：[docs/superpowers/plans/2026-04-23-matchu-mvp-plan.md](docs/superpowers/plans/2026-04-23-matchu-mvp-plan.md)
- [x] M1 项目骨架
- [x] M2 AI 性格测评
- [x] M3 AI 助聊聊天页
- [x] M4 PWA + Vercel 部署
```

With:

```markdown
## 当前状态

### Phase 1 ✅
- [x] 产品设计：[docs/superpowers/specs/2026-04-23-matchu-mvp-design.md](docs/superpowers/specs/2026-04-23-matchu-mvp-design.md)
- [x] 实施计划：[docs/superpowers/plans/2026-04-23-matchu-mvp-plan.md](docs/superpowers/plans/2026-04-23-matchu-mvp-plan.md)
- [x] M1 项目骨架
- [x] M2 AI 性格测评
- [x] M3 AI 助聊聊天页
- [x] M4 PWA + Vercel 部署

### Phase 2 ✅
- [x] 产品设计：[docs/superpowers/specs/2026-04-23-matchu-phase2-design.md](docs/superpowers/specs/2026-04-23-matchu-phase2-design.md)
- [x] 实施计划：[docs/superpowers/plans/2026-04-23-matchu-phase2-plan.md](docs/superpowers/plans/2026-04-23-matchu-phase2-plan.md)
- [x] M5 TabBar + 路由重构
- [x] M6 匹配推荐屏（5 Mock 用户）
- [x] M7 消息列表屏
- [x] M8 虚拟视频屏
- [x] M9 我的屏 + SVIP 卡
- [x] M10 AI 工具占位页
```

Then replace:

```markdown
## 主要路由

- `/` — 首页（欢迎 + 开始测评 / 跳过测评入口）
- `/onboard` — AI 性格测评（8 道题 · 流式点评 · 生成性格画像）
- `/chat/xiaoyu` — 和 Mock 真人"小雨"聊天 + AI 助聊副驾驶
```

With:

```markdown
## 主要路由

**沉浸流**（无 TabBar）
- `/` — 首页（欢迎 + 开始测评 / 直接进入主流）
- `/onboard` — AI 性格测评（8 道题 · 流式点评 · 生成性格画像）
- `/chat/xiaoyu` — 和 Mock 真人"小雨"聊天 + AI 助聊副驾驶

**5-Tab 主流**（底部 TabBar）
- `/match` — 智能匹配推荐（5 个 Mock 假人卡片堆叠）
- `/messages` — 契合度 hero 卡 + 最近聊天列表
- `/tools` — AI 工具占位页（12 款，Phase 3 开放）
- `/virtual` — 虚拟人物视频（樱花场景展示）
- `/me` — 我的 + 会员卡 + 4 菜单项
```

- [ ] **Step 7: 提交 + 推送**

```bash
cd /c/Users/Administrator/Desktop/matchu
git add -A
git -c core.autocrlf=false commit -m "$(cat <<'EOF'
Task 13: AI 工具占位 + README 更新 Phase 2 交付单

- /tools 页面：顶部 COMING SOON 说明 + 12 工具网格
- 每卡带锁图标，点击 toast "Phase 3 开放"
- README 更新为双 Phase 交付状态

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
git push
```

- [ ] **Step 8: Vercel 自动部署验证**

Vercel 接收到 push 后自动 redeploy。等 60–120 秒，然后：

```bash
sleep 90
for path in / /onboard /chat/xiaoyu /match /messages /tools /virtual /me; do
  echo -n "$path -> "
  curl -sI "https://matchu-nine.vercel.app$path" | head -1
done
```

Expected: 所有路径 `200 OK`。

也可以 curl 首页确认没有 build 破坏：

```bash
curl -sS https://matchu-nine.vercel.app/ | grep -oE 'MatchU|遇见对的人' | sort -u
```

Expected: 看到 "MatchU" 和 "遇见对的人"。

- [ ] **Step 9: 向用户宣告交付**

> ✅ Phase 2 交付完成。
>
> - 在线演示：https://matchu-nine.vercel.app
> - 新增 4 屏 + TabBar + AI 工具占位
> - Phase 1 全部功能保留不回归
>
> **请在手机上跑一遍 Phase 2 手动测试清单**（见 spec 第 9 节）确认没有破坏性问题。
>
> 下一阶段想往哪走？
> - Phase 3：接真 LLM + 实现 AI 工具里的几个
> - Phase 4：接真用户后端 + 登录
> - 暂停观察

---

## 手动测试清单（所有 task 完成后必过）

- [ ] http://localhost:3000/ → 欢迎屏；未测评时"开始心遇之旅" → `/onboard`；已测评时"进入心遇" → `/match`
- [ ] `/onboard` 走完 8 题 → `/chat/xiaoyu`（Phase 1 功能）
- [ ] TabBar 5 个 tab 切换流畅，active 正确高亮
- [ ] `/match`：卡片堆叠 + 拖拽 + ♥/✕ + 5 张看完 + 重置；↺/★/⚡ SVIP toast
- [ ] `/messages`：hero 卡 + AI 助聊条 + 6 条列表；小雨真聊天，其他 4 个 toast
- [ ] `/virtual`：樱花 + 少女 + 花瓣飘落 + 亲密度 + 风格 + 4 控制按钮 toast
- [ ] `/me`：头像 + 3 统计 + SVIP + 4 菜单；MBTI chip 条件渲染
- [ ] `/tools`：12 工具卡 + 点击 toast
- [ ] Vercel URL 所有 8 条路由返回 200
- [ ] `npm run build` 无错误
- [ ] Phase 1 的 `/chat/xiaoyu` 所有功能（开场白、小雨回复、AI 助聊建议）未破坏
