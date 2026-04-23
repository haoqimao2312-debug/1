# MatchU · 心遇 MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现 MatchU 心遇 2 屏 MVP（AI 性格测评 + AI 助聊聊天页），全部 AI 走 Mock，部署到 Vercel 免费子域名。

**Architecture:** Next.js 15 App Router 单体应用；三层结构 UI (`app/` + `components/`) → API (`app/api/`) → 业务逻辑 (`lib/`)；Mock AI 接口形状与真 LLM SDK 对齐，日后切换仅改环境变量。

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS 4, Zustand + persist, Zod, Framer Motion, Lucide React, Vercel.

**Spec:** `docs/superpowers/specs/2026-04-23-matchu-mvp-design.md`

**约定**（本计划通用）：
- 工作目录：`C:/Users/Administrator/Desktop/matchu`
- Shell：Git Bash（bash 语法）
- 本项目 MVP 不写自动化测试；每个主要任务末尾以"手动验证"取代"跑测试"
- 每次 commit 使用 HEREDOC 格式附带 Co-Authored-By 行

---

## 里程碑总览

| 里程碑 | 任务 | 用户评审点 |
|---|---|---|
| M1 项目骨架 | Task 1–4 | — |
| M2 AI 性格测评 | Task 5–10 | ✅ M1+M2 合并评审 |
| M3 AI 助聊聊天页 | Task 11–16 | ✅ M3 评审 |
| M4 PWA + 部署 | Task 17–20 | ✅ M4 交付评审 |

---

# 里程碑 M1：项目骨架

## Task 1：初始化 Next.js 项目

**Files:**
- Modify: `C:/Users/Administrator/Desktop/matchu/` （现有仓库，内含 `.git/`、`docs/`、`reference/`、`README.md`、`.gitignore`）

**注意**：`create-next-app` 不能往非空目录写。需要先在临时目录生成，再合并回来。

- [ ] **Step 1: 在临时目录生成 Next.js 脚手架**

```bash
cd /c/Users/Administrator/Desktop
npx --yes create-next-app@latest matchu-init \
  --typescript \
  --tailwind \
  --app \
  --src-dir=false \
  --import-alias="@/*" \
  --no-eslint \
  --no-turbopack \
  --use-npm
```

Expected: 生成 `C:/Users/Administrator/Desktop/matchu-init/` 含 `package.json`、`app/`、`next.config.ts`、`tailwind.config.ts` 等。

- [ ] **Step 2: 把脚手架文件合并进 matchu 项目**

```bash
cd /c/Users/Administrator/Desktop/matchu-init
# 复制所有文件（含隐藏文件），除 .git 外
shopt -s dotglob
for f in *; do
  [ "$f" = ".git" ] && continue
  cp -r "$f" "/c/Users/Administrator/Desktop/matchu/"
done
shopt -u dotglob
cd /c/Users/Administrator/Desktop
rm -rf matchu-init
```

Expected: `matchu/` 下出现 `app/`、`node_modules/`、`package.json` 等，原有 `docs/`、`reference/`、`README.md`、`.gitignore` 保持不变。

- [ ] **Step 3: 覆盖 `.gitignore` 合并已有内容**

Read 现有 `matchu/.gitignore`（已有自定义），确认 Next.js 生成的 `.gitignore` 已包含 `node_modules/`、`.next/`、`.env*.local`。若被 create-next-app 覆盖，append 以下内容（去重后）：

```
# Added by init
reference/*.docx
.vercel
```

- [ ] **Step 4: 启动开发服务器验证**

```bash
cd /c/Users/Administrator/Desktop/matchu
npm run dev
```

Expected: 控制台打印 `Local: http://localhost:3000`，浏览器打开应看到 Next.js 默认欢迎页。确认无报错后 `Ctrl+C` 停止。

- [ ] **Step 5: 提交**

```bash
cd /c/Users/Administrator/Desktop/matchu
git add -A
git commit -m "$(cat <<'EOF'
Task 1: 初始化 Next.js 15 脚手架

- TypeScript + Tailwind + App Router
- 合并至现有 matchu 仓库（保留 docs/, reference/, README.md）

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2：安装附加依赖 + 基础配置

**Files:**
- Modify: `package.json`
- Create: `.env.local`
- Create: `.env.example`

- [ ] **Step 1: 安装运行时依赖**

```bash
cd /c/Users/Administrator/Desktop/matchu
npm install zustand zod framer-motion lucide-react
```

Expected: `package.json` 中 `dependencies` 新增以上 4 项；无错误。

- [ ] **Step 2: 创建 `.env.local`**

```bash
cat > .env.local <<'EOF'
AI_PROVIDER=mock
EOF
```

- [ ] **Step 3: 创建 `.env.example`**

```bash
cat > .env.example <<'EOF'
# AI Provider: mock | deepseek | openai | anthropic
AI_PROVIDER=mock

# 日后接真 LLM 时填入对应 Key
# DEEPSEEK_API_KEY=
# OPENAI_API_KEY=
# ANTHROPIC_API_KEY=
EOF
```

- [ ] **Step 4: 提交**

```bash
git add -A
git commit -m "$(cat <<'EOF'
Task 2: 安装依赖 + 环境变量

- zustand, zod, framer-motion, lucide-react
- .env.local（AI_PROVIDER=mock）+ .env.example

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3：迁移 mockup 设计 token 到 globals.css

**Files:**
- Modify: `app/globals.css`

根据 spec 第 3.3、3.4 节，将原 mockup（`reference/matchu_app_original_mockup.html`）中的 CSS 变量、渐变、玻璃态背景等迁移为全局样式。

- [ ] **Step 1: 覆写 `app/globals.css`**

```css
@import "tailwindcss";

:root {
  --bg-0: #0d0520;
  --bg-1: #1a0d35;
  --bg-2: #281550;
  --ink: #faf5ff;
  --ink-dim: #b8a8d8;
  --ink-faint: #7a6b9a;
  --pink: #ff5ea0;
  --rose: #ff8fbc;
  --purple: #a970ff;
  --violet: #7c3aed;
  --cyan: #5df0ff;
  --mint: #6fffd4;
  --gold: #ffd176;
  --glass: rgba(255, 255, 255, 0.08);
  --glass-strong: rgba(255, 255, 255, 0.14);
  --glass-border: rgba(255, 255, 255, 0.16);
  --grad-love: linear-gradient(135deg, #ff5ea0 0%, #a970ff 50%, #5df0ff 100%);
  --grad-pink: linear-gradient(135deg, #ff5ea0 0%, #ff8fbc 100%);
  --grad-purple: linear-gradient(135deg, #a970ff 0%, #7c3aed 100%);
  --grad-cyan: linear-gradient(135deg, #5df0ff 0%, #6fffd4 100%);
  --grad-warm: linear-gradient(135deg, #ffd176 0%, #ff8fbc 100%);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html, body {
  background: #0a0414;
  color: var(--ink);
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
}

body {
  background:
    radial-gradient(ellipse 900px 700px at 10% 5%, rgba(169, 112, 255, 0.28), transparent 55%),
    radial-gradient(ellipse 700px 600px at 95% 85%, rgba(255, 94, 160, 0.25), transparent 55%),
    radial-gradient(ellipse 600px 500px at 95% 10%, rgba(93, 240, 255, 0.15), transparent 60%),
    linear-gradient(180deg, #0a0414 0%, #150829 100%);
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0);
  background-size: 32px 32px;
  opacity: 0.35;
  pointer-events: none;
  z-index: 0;
}

/* 毛玻璃卡片通用 */
.glass {
  background: var(--glass);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.glass-strong {
  background: var(--glass-strong);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

/* 渐变文字 */
.text-grad-love {
  background: var(--grad-love);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* 打字指示器动画 */
@keyframes typing-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-4px); opacity: 1; }
}
.typing-dot {
  animation: typing-bounce 1.2s infinite;
}
.typing-dot:nth-child(2) { animation-delay: 0.15s; }
.typing-dot:nth-child(3) { animation-delay: 0.3s; }

/* 禁用全局 user-select 保留输入框 */
*:not(input):not(textarea):not([contenteditable]) {
  user-select: none;
}
```

- [ ] **Step 2: 修改 `app/layout.tsx` 加载 Google Fonts**

完整替换内容为：

```tsx
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MatchU · 心遇',
  description: 'AI 帮你遇见对的人',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0414',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Noto+Serif+SC:wght@400;600;700&family=Noto+Sans+SC:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: 启动 dev 验证无语法错误**

```bash
npm run dev
```

Expected: 无编译错误；打开 `http://localhost:3000` 看到深紫渐变背景和点阵，即使内容还是默认欢迎页。

- [ ] **Step 4: 提交**

```bash
git add -A
git commit -m "$(cat <<'EOF'
Task 3: 迁移 mockup 设计 token 到 globals.css

- 色彩变量、渐变、玻璃态、打字动画
- layout.tsx 加载 Noto Sans/Serif SC + Instrument Serif + JetBrains Mono
- viewport meta 锁定，theme-color 深紫

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4：建立空骨架（路由、AI 接口、Store、共用组件）

**Files:**
- Create: `lib/ai/types.ts`
- Create: `lib/ai/mock.ts`
- Create: `lib/ai/index.ts`
- Create: `lib/store/user.ts`
- Create: `lib/store/chat.ts`
- Create: `components/phone/Phone.tsx`
- Create: `components/phone/StatusBar.tsx`
- Create: `components/phone/AppBody.tsx`
- Create: `components/common/Button.tsx`
- Modify: `app/page.tsx`
- Create: `app/onboard/page.tsx`
- Create: `app/chat/[userId]/page.tsx`

- [ ] **Step 1: `lib/ai/types.ts`**

```ts
import type { ZodSchema } from 'zod'

export type Role = 'system' | 'user' | 'assistant'
export type Message = { role: Role; content: string }

export interface AIProvider {
  stream(opts: {
    messages: Message[]
    temperature?: number
    maxTokens?: number
  }): AsyncIterable<string>

  json<T>(opts: {
    messages: Message[]
    schema: ZodSchema<T>
  }): Promise<T>
}

export type PersonalityTag = string

export type UserProfile = {
  answers: { questionId: string; option: 'A' | 'B' | 'C' | 'D' }[]
  tags: PersonalityTag[]
  profileId: string | null
  profileDisplayName: string | null
  completedAt: number | null
}

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: number
}
```

- [ ] **Step 2: `lib/ai/mock.ts` 骨架**

```ts
import type { AIProvider, Message } from './types'
import type { ZodSchema } from 'zod'

export class MockProvider implements AIProvider {
  async *stream(_opts: {
    messages: Message[]
    temperature?: number
    maxTokens?: number
  }): AsyncIterable<string> {
    yield '（Mock 尚未实现）'
  }

  async json<T>(_opts: {
    messages: Message[]
    schema: ZodSchema<T>
  }): Promise<T> {
    throw new Error('Mock.json not yet implemented')
  }
}
```

- [ ] **Step 3: `lib/ai/index.ts`**

```ts
import type { AIProvider } from './types'
import { MockProvider } from './mock'

function selectProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER ?? 'mock'
  switch (provider) {
    case 'mock':
      return new MockProvider()
    // 未来扩展：
    // case 'deepseek': return new DeepSeekProvider()
    // case 'openai':   return new OpenAIProvider()
    default:
      console.warn(`[ai] Unknown AI_PROVIDER "${provider}", falling back to mock`)
      return new MockProvider()
  }
}

export const aiProvider: AIProvider = selectProvider()
```

- [ ] **Step 4: `lib/store/user.ts` 骨架**

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProfile } from '@/lib/ai/types'

type UserState = {
  profile: UserProfile
  addAnswer: (questionId: string, option: 'A' | 'B' | 'C' | 'D', newTags: string[]) => void
  completeQuiz: (profileId: string, displayName: string) => void
  reset: () => void
}

const emptyProfile: UserProfile = {
  answers: [],
  tags: [],
  profileId: null,
  profileDisplayName: null,
  completedAt: null,
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: emptyProfile,
      addAnswer: (questionId, option, newTags) =>
        set((s) => ({
          profile: {
            ...s.profile,
            answers: [...s.profile.answers, { questionId, option }],
            tags: Array.from(new Set([...s.profile.tags, ...newTags])),
          },
        })),
      completeQuiz: (profileId, displayName) =>
        set((s) => ({
          profile: {
            ...s.profile,
            profileId,
            profileDisplayName: displayName,
            completedAt: Date.now(),
          },
        })),
      reset: () => set({ profile: emptyProfile }),
    }),
    { name: 'matchu:user-profile' }
  )
)
```

- [ ] **Step 5: `lib/store/chat.ts` 骨架**

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChatMessage } from '@/lib/ai/types'

type ChatState = {
  messages: Record<string, ChatMessage[]>
  isTyping: Record<string, boolean>
  addMessage: (userId: string, msg: ChatMessage) => void
  appendToLastAssistant: (userId: string, delta: string) => void
  setTyping: (userId: string, typing: boolean) => void
  reset: (userId: string) => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: {},
      isTyping: {},
      addMessage: (userId, msg) =>
        set((s) => ({
          messages: { ...s.messages, [userId]: [...(s.messages[userId] ?? []), msg] },
        })),
      appendToLastAssistant: (userId, delta) =>
        set((s) => {
          const arr = s.messages[userId] ?? []
          if (arr.length === 0) return {}
          const last = arr[arr.length - 1]
          if (last.role !== 'assistant') return {}
          const updated = { ...last, content: last.content + delta }
          return {
            messages: { ...s.messages, [userId]: [...arr.slice(0, -1), updated] },
          }
        }),
      setTyping: (userId, typing) =>
        set((s) => ({ isTyping: { ...s.isTyping, [userId]: typing } })),
      reset: (userId) =>
        set((s) => ({
          messages: { ...s.messages, [userId]: [] },
          isTyping: { ...s.isTyping, [userId]: false },
        })),
    }),
    { name: 'matchu:chat' }
  )
)
```

- [ ] **Step 6: `components/phone/Phone.tsx`**

```tsx
import type { ReactNode } from 'react'

export function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[420px] min-h-screen overflow-hidden">
      {children}
    </div>
  )
}
```

- [ ] **Step 7: `components/phone/StatusBar.tsx`**

```tsx
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
```

- [ ] **Step 8: `components/phone/AppBody.tsx`**

```tsx
import type { ReactNode } from 'react'

export function AppBody({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-10 flex flex-col min-h-[calc(100vh-32px)]">
      {children}
    </div>
  )
}
```

- [ ] **Step 9: `components/common/Button.tsx`**

```tsx
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
```

- [ ] **Step 10: `app/page.tsx` 首屏占位**

```tsx
import Link from 'next/link'
import { Phone } from '@/components/phone/Phone'
import { StatusBar } from '@/components/phone/StatusBar'
import { AppBody } from '@/components/phone/AppBody'
import { Button } from '@/components/common/Button'

export default function Home() {
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
            <Link href="/onboard"><Button className="w-full">开始心遇之旅</Button></Link>
            <Link href="/chat/xiaoyu"><Button variant="glass" className="w-full">跳过测评，直接聊</Button></Link>
          </div>
        </div>
      </AppBody>
    </Phone>
  )
}
```

- [ ] **Step 11: `app/onboard/page.tsx` 占位**

```tsx
import { Phone } from '@/components/phone/Phone'
import { StatusBar } from '@/components/phone/StatusBar'
import { AppBody } from '@/components/phone/AppBody'

export default function OnboardPage() {
  return (
    <Phone>
      <StatusBar />
      <AppBody>
        <div className="flex-1 flex items-center justify-center text-[var(--ink-dim)]">
          性格测评（M2 实施中）
        </div>
      </AppBody>
    </Phone>
  )
}
```

- [ ] **Step 12: `app/chat/[userId]/page.tsx` 占位**

```tsx
import { Phone } from '@/components/phone/Phone'
import { StatusBar } from '@/components/phone/StatusBar'
import { AppBody } from '@/components/phone/AppBody'

export default async function ChatPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  return (
    <Phone>
      <StatusBar />
      <AppBody>
        <div className="flex-1 flex items-center justify-center text-[var(--ink-dim)]">
          聊天页：{userId}（M3 实施中）
        </div>
      </AppBody>
    </Phone>
  )
}
```

- [ ] **Step 13: 启动 dev 验证 3 条路由**

```bash
npm run dev
```

Expected:
- `http://localhost:3000` 显示欢迎页，两个按钮
- `http://localhost:3000/onboard` 显示"性格测评（M2 实施中）"
- `http://localhost:3000/chat/xiaoyu` 显示"聊天页：xiaoyu（M3 实施中）"
- 点击"开始心遇之旅"正确跳转

- [ ] **Step 14: 提交**

```bash
git add -A
git commit -m "$(cat <<'EOF'
Task 4: 建立空骨架（AI 接口、Store、共用组件、3 路由）

- lib/ai/{types,mock,index}.ts：AIProvider 接口 + Mock 骨架 + 环境变量选择
- lib/store/{user,chat}.ts：Zustand + persist
- components/phone/{Phone,StatusBar,AppBody}、components/common/Button
- app/{page,onboard/page,chat/[userId]/page}.tsx 占位

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

# 里程碑 M2：AI 性格测评

## Task 5：测评题库 + 性格画像模板

**Files:**
- Create: `lib/mock-data/quiz.ts`
- Create: `lib/mock-data/profiles.ts`

- [ ] **Step 1: `lib/mock-data/quiz.ts`**

```ts
export type QuizOption = {
  key: 'A' | 'B' | 'C' | 'D'
  label: string
  tags: string[]
}

export type QuizQuestion = {
  id: string
  prompt: string
  options: QuizOption[]
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'social-mode',
    prompt: '周末朋友临时约你出门，但你已经躺平在家刷剧，通常会怎么做？',
    options: [
      { key: 'A', label: '立刻爬起来赴约，一个人太无聊', tags: ['外向驱动', '即兴', '社交渴望'] },
      { key: 'B', label: '看心情，如果是不熟的就算了', tags: ['选择性社交', '理性'] },
      { key: 'C', label: '婉拒，我需要自己的充电时间', tags: ['内向补能', '边界清晰', '独处友好'] },
      { key: 'D', label: '邀请朋友来家一起躺平', tags: ['折中', '居家型', '随和'] },
    ],
  },
  {
    id: 'emotion-regulation',
    prompt: '心情低落时，你更常做的是？',
    options: [
      { key: 'A', label: '找人聊聊把情绪说出来', tags: ['表达型', '共情需要'] },
      { key: 'B', label: '听音乐/看电影分散注意', tags: ['情绪调节', '内耗克制'] },
      { key: 'C', label: '写日记或一个人待着消化', tags: ['内省', '独处友好', '细腻'] },
      { key: 'D', label: '做点运动/折腾点什么发泄', tags: ['行动型', '外放'] },
    ],
  },
  {
    id: 'conflict-style',
    prompt: '和重要的人起了分歧，你会？',
    options: [
      { key: 'A', label: '当场讲清楚，别把问题过夜', tags: ['直接', '效率'] },
      { key: 'B', label: '先冷静一晚再谈', tags: ['理性', '稳重'] },
      { key: 'C', label: '等对方主动，避免正面冲突', tags: ['回避型', '温和'] },
      { key: 'D', label: '用一种让步/玩笑先化解气氛', tags: ['共情', '妥协友好', '温柔'] },
    ],
  },
  {
    id: 'distance',
    prompt: '一段关系里你更看重？',
    options: [
      { key: 'A', label: '共同话题和频繁互动', tags: ['高亲密度', '话题感'] },
      { key: 'B', label: '彼此独立但互相支持', tags: ['边界清晰', '成熟'] },
      { key: 'C', label: '情绪上的深度共鸣', tags: ['深度', '共情', '情绪稳定'] },
      { key: 'D', label: '一起做有意义的事', tags: ['行动派', '目标感'] },
    ],
  },
  {
    id: 'pace',
    prompt: '更适合描述你的生活节奏？',
    options: [
      { key: 'A', label: '日程满满才有安全感', tags: ['高能量', '计划型'] },
      { key: 'B', label: '有张有弛的规律', tags: ['平衡', '稳重'] },
      { key: 'C', label: '慢一点，能走深就好', tags: ['慢热', '细腻', '深度'] },
      { key: 'D', label: '看心情，灵感来了才动', tags: ['即兴', '创作型'] },
    ],
  },
  {
    id: 'interest',
    prompt: '最容易让你愿意聊天一小时的话题？',
    options: [
      { key: 'A', label: '正在看的剧/音乐/新东西', tags: ['轻快', '兴趣驱动', '话题感'] },
      { key: 'B', label: '某个复杂的想法/世界观', tags: ['思考型', '深度'] },
      { key: 'C', label: '最近的心情/遇到的人', tags: ['情绪分享', '共情'] },
      { key: 'D', label: '旅行/美食/各种体验', tags: ['体验派', '外放'] },
    ],
  },
  {
    id: 'expression',
    prompt: '聊天时你更像？',
    options: [
      { key: 'A', label: '接话快，emoji 和表情包从不缺', tags: ['俏皮', '外放', '话题感'] },
      { key: 'B', label: '认真回复，长段文字更习惯', tags: ['深度', '细腻'] },
      { key: 'C', label: '简洁克制，觉得"嗯"也够用', tags: ['内向', '克制'] },
      { key: 'D', label: '看状态，跟对的人才话多', tags: ['选择性社交', '真诚'] },
    ],
  },
  {
    id: 'stress',
    prompt: '压力大的时候最需要对方？',
    options: [
      { key: 'A', label: '陪我闹闹，把气氛搅活', tags: ['外向补能', '轻快'] },
      { key: 'B', label: '静静待着就好', tags: ['安静型', '独处友好'] },
      { key: 'C', label: '认真听，偶尔回一句懂我的话', tags: ['共情需要', '深度'] },
      { key: 'D', label: '给我一点实际的建议', tags: ['理性', '行动型'] },
    ],
  },
]
```

- [ ] **Step 2: `lib/mock-data/profiles.ts`**

```ts
export type Profile = {
  id: string
  displayName: string
  subtitle: string
  tags: string[]
  commentary: string
  compatibleTags: string[]
}

export const profiles: Profile[] = [
  {
    id: 'moonlight-recharger',
    displayName: '月光补能型',
    subtitle: '安静的温度，慢热但真诚',
    tags: ['内向补能', '独处友好', '细腻', '深度', '共情'],
    commentary:
      '你像月光一样 —— 不刺眼，却足够照亮一个人的夜。社交里你是补能型选手，不是不爱玩，是要回血才能继续散发热度。你需要的不是热闹，是一个不用解释就被懂的人。',
    compatibleTags: ['共情', '温柔', '深度', '情绪稳定', '话题感'],
  },
  {
    id: 'firefly-playful',
    displayName: '萤火俏皮型',
    subtitle: '情绪饱满，emoji 不离手',
    tags: ['俏皮', '外向驱动', '话题感', '情绪分享', '轻快'],
    commentary:
      '你是聊天框里那只停不下来的萤火虫，表情包比回车键按得还勤。你自带让气氛轻一度的魔法，但也正因如此，你需要一个能稳稳接住情绪的人。',
    compatibleTags: ['温柔', '共情', '轻快', '俏皮', '情绪稳定'],
  },
  {
    id: 'quiet-thinker',
    displayName: '深夜思考者',
    subtitle: '想得多，说得少',
    tags: ['思考型', '内向', '深度', '内省', '克制'],
    commentary:
      '你的世界里一个想法能绕上三圈才会被说出口。你不是冷，是筛选。能让你长段文字停不下来的话题和人都是稀有的珍宝。',
    compatibleTags: ['深度', '共情', '情绪稳定', '思考型', '真诚'],
  },
  {
    id: 'sunrise-action',
    displayName: '晨光行动派',
    subtitle: '想到就去做，能量满格',
    tags: ['行动型', '外向驱动', '高能量', '目标感', '即兴'],
    commentary:
      '别人还在想"要不要"，你已经出门了。你是那种用脚步代替嘴巴的人，计划是路牌，心情是油门。你需要一个能跟上节奏、也能偶尔把你摁下来喝口水的人。',
    compatibleTags: ['行动型', '共情', '情绪稳定', '话题感', '真诚'],
  },
  {
    id: 'tide-balanced',
    displayName: '潮汐平衡型',
    subtitle: '独立成熟，有分寸感',
    tags: ['边界清晰', '理性', '稳重', '成熟', '平衡'],
    commentary:
      '你像潮汐，有自己固定的节奏，进退都是自觉。不黏人但懂关心，给彼此留白的艺术你已经修到中级。这样的人最难的是找到同频节奏，而不是找到一个人。',
    compatibleTags: ['成熟', '稳重', '共情', '真诚', '深度'],
  },
  {
    id: 'amber-warm',
    displayName: '琥珀温柔型',
    subtitle: '共情厚，能接住别人的情绪',
    tags: ['共情', '温柔', '表达型', '情绪稳定', '细腻'],
    commentary:
      '你是那种"没事给我讲讲"说得最自然的人。温柔不是软弱，是每次都愿意再听一遍。你值得被同样温柔对待的人找到。',
    compatibleTags: ['温柔', '共情', '情绪稳定', '真诚', '深度'],
  },
]

export function selectProfile(userTags: string[]): Profile {
  const scored = profiles.map((p) => ({
    profile: p,
    score: p.tags.filter((t) => userTags.includes(t)).length,
  }))
  scored.sort((a, b) => b.score - a.score)
  return scored[0].score > 0 ? scored[0].profile : profiles[0]
}
```

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "$(cat <<'EOF'
Task 5: 测评题库 + 性格画像模板

- 8 道题，每题 4 选项，选项携带 2-3 个标签
- 6 种性格画像（月光补能、萤火俏皮、深夜思考者、晨光行动派、潮汐平衡、琥珀温柔）
- selectProfile() 按标签重合度选画像

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6：Mock AI — 流式基础 + analyzeQuizTurn

**Files:**
- Modify: `lib/ai/mock.ts`
- Create: `lib/ai/business.ts`

- [ ] **Step 1: 扩写 `lib/ai/mock.ts` 加入流式实现**

```ts
import type { AIProvider, Message } from './types'
import type { ZodSchema } from 'zod'

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

export async function* streamText(
  fullText: string,
  opts: { firstTokenDelayMs?: number; charDelayMs?: number } = {}
): AsyncIterable<string> {
  const firstDelay = opts.firstTokenDelayMs ?? 400 + Math.random() * 300
  const charDelay = opts.charDelayMs ?? 35
  await delay(firstDelay)
  // 以字符为单位流式吐出（中英文混合友好）
  for (const ch of Array.from(fullText)) {
    yield ch
    await delay(charDelay + Math.random() * 20)
  }
}

export class MockProvider implements AIProvider {
  async *stream(opts: {
    messages: Message[]
    temperature?: number
    maxTokens?: number
  }): AsyncIterable<string> {
    // 业务层会用 streamText 定制内容；这里提供一个兜底默认
    const last = opts.messages[opts.messages.length - 1]?.content ?? ''
    const text = last.length > 0 ? `收到：${last}` : '嗯，你说。'
    yield* streamText(text)
  }

  async json<T>(opts: { messages: Message[]; schema: ZodSchema<T> }): Promise<T> {
    throw new Error('MockProvider.json 需业务层显式实现（见 lib/ai/business.ts）')
  }
}
```

- [ ] **Step 2: `lib/ai/business.ts` 加入 analyzeQuizTurn**

```ts
import { streamText } from './mock'
import { quizQuestions } from '@/lib/mock-data/quiz'

export type QuizTurnInput = {
  questionId: string
  chosenOption: 'A' | 'B' | 'C' | 'D'
  historyTags: string[]
}

export type QuizTurnResult = {
  newTags: string[]
  commentaryStream: AsyncIterable<string>
  profileHint?: string
  questionIndex: number
  totalQuestions: number
}

// 简单的点评模板。真 LLM 替换时保留函数签名即可。
const commentaryPool: Record<string, string[]> = {
  外向驱动: ['你在社交里是那种「续命型」选手 🔋', '你看起来是"有人在就亮"的人呀'],
  内向补能: ['看出来了，你在社交里是个「补能型」选手 🌙', '你需要给自己留点白，这很棒'],
  共情: ['你的接收天线调得很细，能接住别人的情绪', '共情力拉满，是会被依赖的那种人'],
  俏皮: ['你语气里自带 BGM 欸，能想象聊天时很热闹', '看起来是"表情包不离手"的那种'],
  深度: ['你不是话多，是想得多', '你聊起真的感兴趣的东西应该停不下来'],
  克制: ['不爱多说但每句都算数，这种人少见', '你是那种"嗯"就够用的人'],
  稳重: ['你很少被情绪带跑，这在关系里很稀有', '你给人的是那种"靠谱"的安全感'],
  行动型: ['计划是路牌，心情是油门，能感觉到', '你不太纠结"要不要"，你纠结"几点出门"'],
  温柔: ['你对人是那种带回音的温柔', '连拒绝都会让人觉得好像也没关系'],
  真诚: ['你没什么滤镜，这最难得', '你让人想把真话说出口'],
}

function pickCommentary(newTags: string[], fallback: string): string {
  for (const tag of newTags) {
    const pool = commentaryPool[tag]
    if (pool && pool.length > 0) {
      return pool[Math.floor(Math.random() * pool.length)]
    }
  }
  return fallback
}

export async function analyzeQuizTurn(input: QuizTurnInput): Promise<QuizTurnResult> {
  const qIndex = quizQuestions.findIndex((q) => q.id === input.questionId)
  const question = quizQuestions[qIndex]
  if (!question) throw new Error(`Quiz question not found: ${input.questionId}`)
  const option = question.options.find((o) => o.key === input.chosenOption)
  if (!option) throw new Error(`Option not found: ${input.chosenOption}`)

  const newTags = option.tags
  const allTags = Array.from(new Set([...input.historyTags, ...newTags]))

  const commentary = pickCommentary(
    newTags,
    '收到，正在慢慢拼出你的样子…'
  )

  // 每 3 题给一次"已识别 N/10 维度"提示
  const answered = qIndex + 1
  const dims = Math.min(10, Math.round((allTags.length / 3) * 1.2))
  const profileHint =
    answered % 3 === 0
      ? `+1 ${newTags[0] ?? ''} 倾向 · 已识别 ${dims}/10 维度`
      : undefined

  return {
    newTags,
    commentaryStream: streamText(commentary),
    profileHint,
    questionIndex: qIndex,
    totalQuestions: quizQuestions.length,
  }
}
```

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "$(cat <<'EOF'
Task 6: Mock AI 流式基础 + analyzeQuizTurn

- streamText(): 首字延迟 400-700ms + 每字 35-55ms
- MockProvider.stream() 兜底实现
- business.ts: analyzeQuizTurn 按选项标签挑点评 + 每 3 题给维度提示

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7：测评 UI 组件

**Files:**
- Create: `components/quiz/QuizProgress.tsx`
- Create: `components/quiz/ChatHeader.tsx`
- Create: `components/quiz/MessageBubble.tsx`
- Create: `components/quiz/OptionGroup.tsx`
- Create: `components/quiz/ProfilePeek.tsx`
- Create: `components/quiz/TypingIndicator.tsx`

- [ ] **Step 1: `components/quiz/QuizProgress.tsx`**

```tsx
export function QuizProgress({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="px-5 py-3">
      <div className="flex items-center justify-between text-[12px] text-[var(--ink-dim)] mb-2">
        <span>性格画像 · 第 {current}/{total} 题</span>
        <span className="text-[var(--pink)] font-semibold" style={{ fontFamily: 'JetBrains Mono' }}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${pct}%`, background: 'var(--grad-love)' }}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: `components/quiz/ChatHeader.tsx`**

```tsx
export function ChatHeader({
  name,
  sub,
  avatarGlyph = '♥',
}: { name: string; sub: string; avatarGlyph?: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl text-white shadow-[0_8px_20px_rgba(169,112,255,0.4)]"
        style={{ background: 'var(--grad-love)' }}
      >
        {avatarGlyph}
      </div>
      <div className="flex-1">
        <div className="font-semibold">{name}</div>
        <div className="text-[12px] text-[var(--ink-dim)]">{sub}</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: `components/quiz/MessageBubble.tsx`**

```tsx
'use client'
import { motion } from 'framer-motion'

export function MessageBubble({
  role,
  children,
}: { role: 'ai' | 'you'; children: React.ReactNode }) {
  const isAI = role === 'ai'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-2 ${isAI ? 'justify-start' : 'justify-end'} px-5 py-1.5`}
    >
      {isAI && (
        <div
          className="w-7 h-7 rounded-xl flex items-center justify-center text-sm shrink-0"
          style={{ background: 'var(--grad-love)' }}
        >
          ♥
        </div>
      )}
      <div
        className={`max-w-[80%] px-3.5 py-2.5 text-[14px] leading-relaxed rounded-2xl ${
          isAI
            ? 'bg-white/8 border border-white/10 rounded-tl-sm'
            : 'text-white rounded-tr-sm'
        }`}
        style={isAI ? undefined : { background: 'var(--grad-love)' }}
      >
        {children}
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 4: `components/quiz/OptionGroup.tsx`**

```tsx
'use client'
import { motion } from 'framer-motion'
import type { QuizOption } from '@/lib/mock-data/quiz'

export function OptionGroup({
  options,
  selectedKey,
  onPick,
  disabled,
}: {
  options: QuizOption[]
  selectedKey?: 'A' | 'B' | 'C' | 'D'
  onPick: (key: 'A' | 'B' | 'C' | 'D') => void
  disabled?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-5 py-2 flex flex-col gap-2"
    >
      {options.map((o) => {
        const isSelected = selectedKey === o.key
        return (
          <button
            key={o.key}
            disabled={disabled}
            onClick={() => onPick(o.key)}
            className={`text-left flex items-center gap-3 px-4 py-3 rounded-2xl border transition ${
              isSelected
                ? 'bg-[rgba(255,94,160,0.18)] border-[rgba(255,94,160,0.45)]'
                : 'bg-[var(--glass)] border-[var(--glass-border)] hover:bg-white/12 active:scale-[0.98]'
            }`}
          >
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-[13px] font-bold ${
                isSelected ? 'text-[var(--pink)]' : 'text-[var(--ink-dim)]'
              } bg-white/10`}
              style={{ fontFamily: 'JetBrains Mono' }}
            >
              {o.key}
            </span>
            <span className="text-[14px]">{o.label}</span>
          </button>
        )
      })}
    </motion.div>
  )
}
```

- [ ] **Step 5: `components/quiz/ProfilePeek.tsx`**

```tsx
'use client'
import { motion } from 'framer-motion'

export function ProfilePeek({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="mx-5 my-2 px-4 py-2.5 rounded-2xl flex items-center gap-3 glass-strong"
    >
      <div className="text-xl">🌙</div>
      <div className="flex-1">
        <div className="text-[13px] font-semibold">{text}</div>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 6: `components/quiz/TypingIndicator.tsx`**

```tsx
export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-5 py-2">
      <div
        className="w-7 h-7 rounded-xl flex items-center justify-center text-sm shrink-0"
        style={{ background: 'var(--grad-love)' }}
      >
        ♥
      </div>
      <div className="flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-white/8 border border-white/10 rounded-tl-sm">
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/70" />
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/70" />
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/70" />
      </div>
    </div>
  )
}
```

- [ ] **Step 7: 提交**

```bash
git add -A
git commit -m "$(cat <<'EOF'
Task 7: 测评 UI 组件

- QuizProgress、ChatHeader、MessageBubble、OptionGroup、ProfilePeek、TypingIndicator

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8：测评页完整交互

**Files:**
- Modify: `app/onboard/page.tsx`
- Create: `components/quiz/ProfileResultCard.tsx`

- [ ] **Step 1: `components/quiz/ProfileResultCard.tsx`**

```tsx
'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Profile } from '@/lib/mock-data/profiles'
import { Button } from '@/components/common/Button'

export function ProfileResultCard({ profile, tags }: { profile: Profile; tags: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-5 my-4 p-6 rounded-3xl glass-strong flex flex-col gap-4"
    >
      <div
        className="self-center w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-[0_14px_40px_rgba(169,112,255,0.45)]"
        style={{ background: 'var(--grad-love)' }}
      >
        ✦
      </div>
      <div className="text-center">
        <div
          className="text-2xl font-semibold text-grad-love"
          style={{ fontFamily: 'Instrument Serif, Noto Serif SC, serif' }}
        >
          {profile.displayName}
        </div>
        <div className="text-[13px] text-[var(--ink-dim)] mt-1">{profile.subtitle}</div>
      </div>
      <p className="text-[14px] leading-relaxed text-[var(--ink-dim)]">{profile.commentary}</p>
      <div className="flex flex-wrap gap-1.5 justify-center">
        {tags.slice(0, 8).map((t) => (
          <span
            key={t}
            className="px-2.5 py-1 rounded-full text-[11px] bg-white/10 border border-white/15"
          >
            {t}
          </span>
        ))}
      </div>
      <Link href="/chat/xiaoyu">
        <Button className="w-full">进入心遇</Button>
      </Link>
    </motion.div>
  )
}
```

- [ ] **Step 2: 完整 `app/onboard/page.tsx`**

```tsx
'use client'
import { useEffect, useState } from 'react'
import { Phone } from '@/components/phone/Phone'
import { StatusBar } from '@/components/phone/StatusBar'
import { AppBody } from '@/components/phone/AppBody'
import { QuizProgress } from '@/components/quiz/QuizProgress'
import { ChatHeader } from '@/components/quiz/ChatHeader'
import { MessageBubble } from '@/components/quiz/MessageBubble'
import { OptionGroup } from '@/components/quiz/OptionGroup'
import { ProfilePeek } from '@/components/quiz/ProfilePeek'
import { TypingIndicator } from '@/components/quiz/TypingIndicator'
import { ProfileResultCard } from '@/components/quiz/ProfileResultCard'
import { quizQuestions } from '@/lib/mock-data/quiz'
import { selectProfile, type Profile } from '@/lib/mock-data/profiles'
import { analyzeQuizTurn } from '@/lib/ai/business'
import { useUserStore } from '@/lib/store/user'

type Turn =
  | { type: 'ai-greeting'; text: string }
  | { type: 'ai-question'; text: string; qIndex: number }
  | { type: 'ai-commentary'; text: string; streaming: boolean; hint?: string }
  | { type: 'user-pick'; text: string }
  | { type: 'options'; qIndex: number; disabledKey?: 'A' | 'B' | 'C' | 'D' }

export default function OnboardPage() {
  const addAnswer = useUserStore((s) => s.addAnswer)
  const completeQuiz = useUserStore((s) => s.completeQuiz)
  const reset = useUserStore((s) => s.reset)
  const profile = useUserStore((s) => s.profile)

  const [turns, setTurns] = useState<Turn[]>([])
  const [busy, setBusy] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [resultProfile, setResultProfile] = useState<Profile | null>(null)

  // 重置并播放开场
  useEffect(() => {
    reset()
    void beginQuiz()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function beginQuiz() {
    setTurns([{ type: 'ai-greeting', text: '你好呀，我是心遇 AI 😊 接下来我会通过聊天了解你，比填表有趣多啦～' }])
    await sleep(600)
    await askQuestion(0)
  }

  async function askQuestion(idx: number) {
    const q = quizQuestions[idx]
    setTurns((t) => [...t, { type: 'ai-question', text: q.prompt, qIndex: idx }])
    await sleep(300)
    setTurns((t) => [...t, { type: 'options', qIndex: idx }])
    setCurrentIdx(idx)
  }

  async function handlePick(qIndex: number, key: 'A' | 'B' | 'C' | 'D') {
    if (busy) return
    setBusy(true)
    const q = quizQuestions[qIndex]
    const opt = q.options.find((o) => o.key === key)!

    // 禁用该题选项组 + 插入用户气泡
    setTurns((t) =>
      t.map((x, i, arr) =>
        i === arr.length - 1 && x.type === 'options' && x.qIndex === qIndex
          ? { ...x, disabledKey: key }
          : x
      )
    )
    setTurns((t) => [...t, { type: 'user-pick', text: `${key} · ${opt.label}` }])

    // 写入 store
    addAnswer(q.id, key, opt.tags)

    // 调 Mock AI
    const result = await analyzeQuizTurn({
      questionId: q.id,
      chosenOption: key,
      historyTags: useUserStore.getState().profile.tags,
    })

    // 点评流式
    setTurns((t) => [...t, { type: 'ai-commentary', text: '', streaming: true, hint: result.profileHint }])
    for await (const chunk of result.commentaryStream) {
      setTurns((t) => {
        const copy = [...t]
        const last = copy[copy.length - 1]
        if (last.type === 'ai-commentary') {
          copy[copy.length - 1] = { ...last, text: last.text + chunk }
        }
        return copy
      })
    }
    setTurns((t) => {
      const copy = [...t]
      const last = copy[copy.length - 1]
      if (last.type === 'ai-commentary') copy[copy.length - 1] = { ...last, streaming: false }
      return copy
    })

    await sleep(500)

    // 下一题或结束
    const next = qIndex + 1
    if (next < quizQuestions.length) {
      await askQuestion(next)
    } else {
      const latestTags = useUserStore.getState().profile.tags
      const p = selectProfile(latestTags)
      completeQuiz(p.id, p.displayName)
      setResultProfile(p)
    }
    setBusy(false)
  }

  return (
    <Phone>
      <StatusBar />
      <AppBody>
        <ChatHeader name="心遇 AI" sub={resultProfile ? '已识别你的画像' : '正在深度了解你'} />
        {!resultProfile && (
          <QuizProgress current={Math.min(currentIdx + 1, quizQuestions.length)} total={quizQuestions.length} />
        )}
        <div className="flex-1 overflow-y-auto pb-6">
          {turns.map((t, i) => {
            if (t.type === 'ai-greeting' || t.type === 'ai-question') {
              return <MessageBubble key={i} role="ai">{t.text}</MessageBubble>
            }
            if (t.type === 'user-pick') {
              return <MessageBubble key={i} role="you">{t.text}</MessageBubble>
            }
            if (t.type === 'ai-commentary') {
              return (
                <div key={i}>
                  {t.text.length === 0 ? (
                    <TypingIndicator />
                  ) : (
                    <MessageBubble role="ai">{t.text}{t.streaming && <span className="inline-block w-[2px] h-[1em] align-middle bg-white ml-0.5 animate-pulse" />}</MessageBubble>
                  )}
                  {!t.streaming && t.hint && <ProfilePeek text={t.hint} />}
                </div>
              )
            }
            if (t.type === 'options') {
              return (
                <OptionGroup
                  key={i}
                  options={quizQuestions[t.qIndex].options}
                  selectedKey={t.disabledKey}
                  disabled={Boolean(t.disabledKey)}
                  onPick={(k) => handlePick(t.qIndex, k)}
                />
              )
            }
            return null
          })}
          {resultProfile && <ProfileResultCard profile={resultProfile} tags={profile.tags} />}
        </div>
      </AppBody>
    </Phone>
  )
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
```

- [ ] **Step 3: 手动验证（完整跑一次测评）**

```bash
npm run dev
```

在 `http://localhost:3000/onboard` 验证：
- 打开即看见 AI 打招呼 + 第 1 题
- 点选一个选项 → 进度条前进 → 出现打字指示器 → 流式点评出现 → 每 3 题出现一次"+1 XX 倾向"标签卡
- 走完 8 题 → 出现画像结果卡 → 标签 chip + "进入心遇" 按钮可点
- 点"进入心遇" → 跳到 `/chat/xiaoyu`
- 刷新 `/onboard` 页面 → 会重新开始（reset 逻辑）
- 打开 DevTools → Application → Local Storage → 能看到 `matchu:user-profile` 键有 profile 数据

- [ ] **Step 4: 提交**

```bash
git add -A
git commit -m "$(cat <<'EOF'
Task 8: 测评页完整交互

- ProfileResultCard 渲染最终画像 + 标签
- onboard/page.tsx 串联开场、出题、选项、流式点评、维度提示、画像选择、跳转
- 用户画像写入 useUserStore（localStorage persist）

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9：M1+M2 评审检查点

**此任务无代码改动**。向用户汇报 M1+M2 完成，请用户在本地评审。

- [ ] **Step 1: 汇总本地启动命令给用户**

告知用户：
> M1+M2 完成。请在本地跑：
> ```
> cd /c/Users/Administrator/Desktop/matchu
> npm run dev
> ```
> 打开 http://localhost:3000，走完测评，检查视觉 / 节奏 / 文案是否满意。
> 若有想改的：画像文案、题目措辞、打字速度、配色渐变 —— 任何一项告诉我。

- [ ] **Step 2: 等待用户反馈再继续 M3**

不继续 Task 10 直到用户反馈。

---

# 里程碑 M3：AI 助聊聊天页

## Task 10：小雨人设 + 对话剧本数据

**Files:**
- Create: `lib/mock-data/users/xiaoyu.ts`

- [ ] **Step 1: `lib/mock-data/users/xiaoyu.ts`**

```ts
export type ScriptedReply = {
  triggers?: {
    keywords?: string[]
    emotions?: ('tired' | 'happy' | 'sad' | 'curious' | 'greeting')[]
    turnRange?: [number, number]
  }
  replies: string[]
  once?: boolean
}

export const xiaoyu = {
  id: 'xiaoyu',
  displayName: '小雨',
  age: 22,
  subtitle: '初入职场 · 慢热俏皮',
  avatar: '🌧️',
  bio: '加班到十一点就想消失一下。喜欢 Lo-fi、村上春树、便利店关东煮。',
  compatibleTags: ['俏皮', '共情', '温柔', '话题感', '情绪稳定', '深度'],
  openingMessages: [
    '啊 你来啦～',
    '刚下班 打开外卖看了十分钟 还是不知道吃什么 救救',
  ],
  fallbackReplies: [
    '嗯嗯',
    '在的在的',
    '咦你说',
    '哈哈哈',
    '…那你呢',
    '我在听',
    '说来听听',
  ],
  scripted: [
    {
      triggers: { emotions: ['greeting'], keywords: ['你好', '嗨', 'hi', 'hello', '在吗'] },
      replies: ['嗨呀～你今天还好吗', '在呢在呢', '你来得正好 我无聊死了'],
      once: false,
    },
    {
      triggers: { keywords: ['累', '烦', '难受', '心累', '崩溃', '想哭', '不想'] },
      replies: [
        '抱抱你… 今天到底是什么天呀',
        '嗯… 我今天也是 累得只想点一份多加辣的炸鸡',
        '听起来很糟 说说看 我在',
        '不说也没关系 你就知道我在就好',
      ],
    },
    {
      triggers: { keywords: ['加班', '工作', '老板', '项目', 'ddl'] },
      replies: [
        '工作这个东西 真的 像雨',
        'ddl 是把我绑在椅子上的那根绳',
        '今天第二次被 review 嘎 打算用炸鸡和自己和解',
      ],
    },
    {
      triggers: { keywords: ['音乐', '歌', 'lofi', '耳机', '听'] },
      replies: [
        '最近一直在循环一首 lofi 的歌 没有人声 但像雨天',
        '你听什么～我播放器全是深夜电台',
        '推荐我一首吧 我现在需要音乐不需要对话',
      ],
    },
    {
      triggers: { keywords: ['剧', '电影', '追', '看', '综艺'] },
      replies: [
        '我在追一部很冷门的日剧 节奏慢得像在陪你过周末',
        '你最近看什么呀 我需要新推荐 晚上煮面下饭',
        '最近刷短视频刷得整个人都碎掉了',
      ],
    },
    {
      triggers: { keywords: ['吃', '饭', '外卖', '喝', '咖啡'] },
      replies: [
        '我今天选择了黯然销魂炸鸡',
        '咖啡 真的 是打工人的心脏',
        '你吃啥呀 我能云吃一顿吗',
      ],
    },
    {
      triggers: { keywords: ['睡', '晚安', '困', '梦'] },
      replies: [
        '你先睡～我等下也睡',
        '今天想早点睡 但我知道我不会',
        '晚安哦 愿你做一个不加班的梦',
      ],
    },
    {
      triggers: { emotions: ['happy'], keywords: ['哈', '笑', '喜欢', '开心', '可爱'] },
      replies: [
        '嘿嘿 有你在 气氛会好一点',
        '你笑我就也忍不住',
        '哈哈哈哈哈 干嘛可爱成这样',
      ],
    },
    {
      triggers: { keywords: ['周末', '明天', '放假', '假期'] },
      replies: [
        '周末我的打算是躺平但可能会失败',
        '明天想去一家小书店 你要不要来',
        '假期来得太快 心还没到',
      ],
    },
    {
      triggers: { keywords: ['猫', '狗', '宠物'] },
      replies: [
        '我没养猫 但我需要一只',
        '路过小区那只橘 我会专门下班绕过去',
        '宠物是治愈 我羡慕',
      ],
    },
  ] satisfies ScriptedReply[],
}

export type XiaoyuKnowledge = typeof xiaoyu
```

- [ ] **Step 2: 提交**

```bash
git add -A
git commit -m "$(cat <<'EOF'
Task 10: 小雨人设 + 10 组触发剧本 + 兜底万能回复

- 22 岁初入职场，俏皮+emo 风格
- 10 组关键词/情绪触发分支，每组 2-4 条候选
- 7 条兜底回复
- compatibleTags 用于契合度计算

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 11：Mock AI — xiaoyuReply + assistSuggest

**Files:**
- Modify: `lib/ai/business.ts`
- Create: `lib/ai/emotion.ts`

- [ ] **Step 1: `lib/ai/emotion.ts` 简单情绪检测器**

```ts
export type DetectedEmotion = 'tired' | 'happy' | 'sad' | 'curious' | 'greeting' | 'neutral'

const TIRED = /累|疲|困|烦|心累|崩|emo|难受|压力|烦死|麻了/
const HAPPY = /哈哈|嘿嘿|开心|笑|喜欢|可爱|好耶|yeah|真的太/
const SAD = /哭|难过|伤心|委屈|想哭|失落/
const CURIOUS = /\?|？|为啥|为什么|怎么|咋|呢$/
const GREETING = /^(你好|hi|hello|嗨|早|晚上好|在吗|在嘛|来了|hey)/i

export function detectEmotion(text: string): DetectedEmotion {
  if (GREETING.test(text)) return 'greeting'
  if (HAPPY.test(text)) return 'happy'
  if (SAD.test(text)) return 'sad'
  if (TIRED.test(text)) return 'tired'
  if (CURIOUS.test(text)) return 'curious'
  return 'neutral'
}
```

- [ ] **Step 2: 扩写 `lib/ai/business.ts` 追加 xiaoyuReply + assistSuggest**

append 到文件末尾：

```ts
import { xiaoyu, type ScriptedReply } from '@/lib/mock-data/users/xiaoyu'
import { detectEmotion } from './emotion'
import type { ChatMessage } from './types'

function pickScriptedReply(
  lastUserText: string,
  usedReplies: Set<string>
): string {
  const emotion = detectEmotion(lastUserText)

  // 优先级 1: 关键词匹配
  const keywordMatches = xiaoyu.scripted.filter((s: ScriptedReply) =>
    s.triggers?.keywords?.some((k) => lastUserText.includes(k))
  )
  // 优先级 2: 情绪匹配
  const emotionMatches = xiaoyu.scripted.filter((s: ScriptedReply) =>
    emotion !== 'neutral' && s.triggers?.emotions?.includes(emotion)
  )

  const candidates = [...keywordMatches, ...emotionMatches]
  for (const group of candidates) {
    const fresh = group.replies.filter((r) => !usedReplies.has(r))
    const pool = fresh.length > 0 ? fresh : group.replies
    if (pool.length > 0) return pool[Math.floor(Math.random() * pool.length)]
  }

  // 兜底
  const fresh = xiaoyu.fallbackReplies.filter((r) => !usedReplies.has(r))
  const pool = fresh.length > 0 ? fresh : xiaoyu.fallbackReplies
  return pool[Math.floor(Math.random() * pool.length)]
}

export async function xiaoyuReply(opts: {
  chatHistory: ChatMessage[]
}): Promise<{ stream: AsyncIterable<string>; fullText: string }> {
  const lastUser = [...opts.chatHistory].reverse().find((m) => m.role === 'user')
  const used = new Set(opts.chatHistory.filter((m) => m.role === 'assistant').map((m) => m.content))

  const text = lastUser
    ? pickScriptedReply(lastUser.content, used)
    : xiaoyu.fallbackReplies[0]

  return { stream: streamText(text), fullText: text }
}

export type AssistStyle = 'care' | 'playful' | 'direct'

export type AssistSuggestion = {
  style: AssistStyle
  emoji: string
  label: string
  text: string
}

type StylePool = {
  style: AssistStyle
  emoji: string
  label: string
  byEmotion: Partial<Record<DetectedEmotion, string[]>>
  default: string[]
}

const stylePools: StylePool[] = [
  {
    style: 'care',
    emoji: '🫂',
    label: '关心',
    byEmotion: {
      tired: [
        '辛苦你了，今晚想吃点什么我陪你念叨',
        '先歇会儿 不用马上回我',
        '抱抱 这种天我真的也扛不住',
      ],
      sad: ['我在听 你说', '不着急 慢慢讲', '你不孤单 我在的'],
      greeting: ['嗨呀 你怎么样 今天好吗', '刚想问你一句 你就来了'],
    },
    default: [
      '你还好吗',
      '最近是不是挺累',
      '我很在意你说的那个 能不能多讲一点',
    ],
  },
  {
    style: 'playful',
    emoji: '✨',
    label: '俏皮',
    byEmotion: {
      tired: [
        '把累意识传给我试试 我替你分担三成',
        '那就一起躺 但允许我吐槽两句',
        '累的时候最需要一个能胡说八道的人 (就是我)',
      ],
      happy: [
        '嘿嘿 我就知道你今天状态不错',
        '你这么开心 是不是有什么好事没告诉我',
        '被你传染了 也跟着咧嘴',
      ],
      greeting: ['哎嗨～ 你终于出现了', '我等你一整天了 (假的 但很想说)'],
    },
    default: [
      '欸 你这样说我就放心了',
      '你讲的这个 我要拿小本本记一下',
      '你有没有觉得 你一开口气氛就变好',
    ],
  },
  {
    style: 'direct',
    emoji: '🎯',
    label: '推进',
    byEmotion: {
      tired: [
        '讲讲看是什么事 能解决我们一起想',
        '有什么我能帮上的 直说',
      ],
      curious: ['你真正想问的是什么 告诉我', '这个我倒有想法 你先说完'],
      greeting: ['嗨 最近还顺吗', '你主动说 说明有事 对吧'],
    },
    default: [
      '你现在想做什么',
      '我接住了 下一步你想怎么走',
      '说清楚点 我好帮你想',
    ],
  },
]

function pickSuggestion(pool: StylePool, emotion: DetectedEmotion, tags: string[]): AssistSuggestion {
  const byEmo = pool.byEmotion[emotion] ?? []
  const source = byEmo.length > 0 ? byEmo : pool.default
  // 标签微调：内向/克制 → 偏短句；外放/话题感 → 偏长句
  const preferShort = tags.some((t) => ['内向补能', '克制', '内向', '独处友好'].includes(t))
  const sorted = [...source].sort((a, b) => (preferShort ? a.length - b.length : b.length - a.length))
  const text = sorted[Math.floor(Math.random() * Math.min(2, sorted.length))]
  return { style: pool.style, emoji: pool.emoji, label: pool.label, text }
}

export async function assistSuggest(opts: {
  chatHistory: ChatMessage[]
  userTags: string[]
}): Promise<{ suggestions: AssistSuggestion[] }> {
  const lastAssistant = [...opts.chatHistory].reverse().find((m) => m.role === 'assistant')
  const emotion = lastAssistant ? detectEmotion(lastAssistant.content) : 'neutral'
  return {
    suggestions: stylePools.map((p) => pickSuggestion(p, emotion, opts.userTags)),
  }
}

// 契合度算法（MVP 假算法）
export function computeCompatibility(userTags: string[], compatibleTags: string[]): number {
  if (compatibleTags.length === 0) return 75
  const hits = compatibleTags.filter((t) => userTags.includes(t)).length
  return Math.round(60 + 35 * (hits / compatibleTags.length))
}
```

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "$(cat <<'EOF'
Task 11: Mock AI — xiaoyuReply + assistSuggest + 契合度

- detectEmotion: 关键词正则识别 6 种情绪
- xiaoyuReply: 关键词优先 → 情绪兜底 → 万能兜底，剔除已用
- assistSuggest: 3 种风格（关心/俏皮/推进），按情绪选池 + 标签偏好微调长短
- computeCompatibility: 60-95 区间，基于标签重合

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 12：聊天 UI 组件

**Files:**
- Create: `components/chat/ChatHeader.tsx`
- Create: `components/chat/MessageBubble.tsx`
- Create: `components/chat/TypingIndicator.tsx`
- Create: `components/chat/InputBar.tsx`
- Create: `components/chat/AssistDrawer.tsx`

- [ ] **Step 1: `components/chat/ChatHeader.tsx`**

```tsx
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export function ChatHeader({
  name,
  subtitle,
  avatar,
  compatibility,
}: {
  name: string
  subtitle: string
  avatar: string
  compatibility: number
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
      <Link href="/" className="p-1 -ml-1 text-[var(--ink-dim)]">
        <ChevronLeft size={22} />
      </Link>
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
        style={{ background: 'var(--grad-love)' }}
      >
        {avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold truncate">{name}</div>
        <div className="text-[12px] text-[var(--ink-dim)] truncate">{subtitle}</div>
      </div>
      <div
        className="px-2.5 py-1 rounded-full glass text-[12px] font-semibold"
        style={{ fontFamily: 'JetBrains Mono' }}
      >
        契合 <span className="text-grad-love">{compatibility}%</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: `components/chat/MessageBubble.tsx`**

```tsx
'use client'
import { motion } from 'framer-motion'

export function MessageBubble({
  role,
  children,
  streaming,
}: { role: 'user' | 'assistant'; children: React.ReactNode; streaming?: boolean }) {
  const isAI = role === 'assistant'
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-2 ${isAI ? 'justify-start' : 'justify-end'} px-4 py-1`}
    >
      {isAI && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0"
          style={{ background: 'var(--grad-love)' }}
        >
          🌧️
        </div>
      )}
      <div
        className={`max-w-[78%] px-3.5 py-2.5 text-[14px] leading-relaxed rounded-2xl ${
          isAI
            ? 'bg-white/8 border border-white/10 rounded-tl-sm'
            : 'text-white rounded-tr-sm'
        }`}
        style={isAI ? undefined : { background: 'var(--grad-love)' }}
      >
        {children}
        {streaming && (
          <span className="inline-block w-[2px] h-[1em] align-middle bg-white ml-0.5 animate-pulse" />
        )}
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 3: `components/chat/TypingIndicator.tsx`**

```tsx
export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-1">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0"
        style={{ background: 'var(--grad-love)' }}
      >
        🌧️
      </div>
      <div className="flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-white/8 border border-white/10 rounded-tl-sm">
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/70" />
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/70" />
        <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/70" />
      </div>
    </div>
  )
}
```

- [ ] **Step 4: `components/chat/InputBar.tsx`**

```tsx
'use client'
import { useState } from 'react'
import { Sparkles, Send } from 'lucide-react'

export function InputBar({
  value,
  onChange,
  onSend,
  onOpenAssist,
  disabled,
}: {
  value: string
  onChange: (v: string) => void
  onSend: () => void
  onOpenAssist: () => void
  disabled?: boolean
}) {
  return (
    <div className="px-3 py-3 border-t border-white/10 flex items-center gap-2">
      <button
        onClick={onOpenAssist}
        disabled={disabled}
        className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full glass text-[13px] font-semibold disabled:opacity-40"
      >
        <Sparkles size={14} className="text-[var(--pink)]" />
        AI 助聊
      </button>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !disabled && value.trim()) onSend()
        }}
        placeholder="说点什么…"
        className="flex-1 min-w-0 px-4 py-2.5 rounded-full bg-white/8 border border-white/10 text-[14px] placeholder:text-[var(--ink-faint)] focus:outline-none focus:border-[var(--pink)]/50"
      />
      <button
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white disabled:opacity-40"
        style={{ background: 'var(--grad-love)' }}
        aria-label="发送"
      >
        <Send size={16} />
      </button>
    </div>
  )
}
```

- [ ] **Step 5: `components/chat/AssistDrawer.tsx`**

```tsx
'use client'
import { AnimatePresence, motion } from 'framer-motion'
import type { AssistSuggestion } from '@/lib/ai/business'

export function AssistDrawer({
  open,
  loading,
  suggestions,
  onPick,
  onClose,
}: {
  open: boolean
  loading: boolean
  suggestions: AssistSuggestion[]
  onPick: (text: string) => void
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] z-50 rounded-t-3xl glass-strong p-4 pt-6 pb-8"
          >
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
            <div className="text-[13px] font-semibold mb-3 text-[var(--ink-dim)]">
              ✦ AI 助聊 · 三种语气供你选
            </div>
            {loading ? (
              <div className="py-8 text-center text-[var(--ink-dim)] text-[13px]">
                正在想…
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s.style}
                    onClick={() => onPick(s.text)}
                    className="text-left flex items-start gap-3 px-4 py-3 rounded-2xl glass hover:bg-white/14 active:scale-[0.99] transition"
                  >
                    <span className="text-lg shrink-0">{s.emoji}</span>
                    <span className="flex-1">
                      <span className="block text-[11px] text-[var(--ink-dim)] mb-0.5">
                        {s.label}
                      </span>
                      <span className="block text-[14px] leading-relaxed">{s.text}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 6: 提交**

```bash
git add -A
git commit -m "$(cat <<'EOF'
Task 12: 聊天 UI 组件

- ChatHeader（含返回 + 契合度 badge）
- MessageBubble（含 streaming 光标）
- TypingIndicator（小雨头像版）
- InputBar（AI 助聊按钮 + 输入 + 发送）
- AssistDrawer（底部抽屉，3 条建议 + 遮罩）

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 13：聊天页完整交互

**Files:**
- Modify: `app/chat/[userId]/page.tsx`

- [ ] **Step 1: 完整替换 `app/chat/[userId]/page.tsx`**

```tsx
'use client'
import { useEffect, useRef, useState, use as usePromise } from 'react'
import { Phone } from '@/components/phone/Phone'
import { StatusBar } from '@/components/phone/StatusBar'
import { AppBody } from '@/components/phone/AppBody'
import { ChatHeader } from '@/components/chat/ChatHeader'
import { MessageBubble } from '@/components/chat/MessageBubble'
import { TypingIndicator } from '@/components/chat/TypingIndicator'
import { InputBar } from '@/components/chat/InputBar'
import { AssistDrawer } from '@/components/chat/AssistDrawer'
import { xiaoyu } from '@/lib/mock-data/users/xiaoyu'
import {
  xiaoyuReply,
  assistSuggest,
  computeCompatibility,
  type AssistSuggestion,
} from '@/lib/ai/business'
import { useChatStore } from '@/lib/store/chat'
import { useUserStore } from '@/lib/store/user'
import type { ChatMessage } from '@/lib/ai/types'

export default function ChatPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = usePromise(params)
  const messages = useChatStore((s) => s.messages[userId] ?? [])
  const isTyping = useChatStore((s) => s.isTyping[userId] ?? false)
  const addMessage = useChatStore((s) => s.addMessage)
  const appendToLastAssistant = useChatStore((s) => s.appendToLastAssistant)
  const setTyping = useChatStore((s) => s.setTyping)
  const userProfile = useUserStore((s) => s.profile)

  const [input, setInput] = useState('')
  const [assistOpen, setAssistOpen] = useState(false)
  const [assistLoading, setAssistLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<AssistSuggestion[]>([])
  const [busy, setBusy] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const compatibility = computeCompatibility(userProfile.tags, xiaoyu.compatibleTags)

  // 首次进入且没有消息时，注入开场白
  useEffect(() => {
    if (userId !== 'xiaoyu') return
    if (messages.length === 0) {
      void seedOpening()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  async function seedOpening() {
    for (let i = 0; i < xiaoyu.openingMessages.length; i++) {
      const text = xiaoyu.openingMessages[i]
      await sleep(i === 0 ? 300 : 900)
      setTyping(userId, true)
      await sleep(700 + Math.random() * 400)
      setTyping(userId, false)
      addMessage(userId, {
        id: `open-${i}-${Date.now()}`,
        role: 'assistant',
        content: text,
        createdAt: Date.now(),
      })
    }
  }

  async function handleSend() {
    const text = input.trim()
    if (!text || busy) return
    setBusy(true)
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: Date.now(),
    }
    addMessage(userId, userMsg)
    setInput('')

    await sleep(300)
    setTyping(userId, true)
    await sleep(800 + Math.random() * 1200)
    setTyping(userId, false)

    const history = [...useChatStore.getState().messages[userId]!, userMsg].slice(-10)
    const reply = await xiaoyuReply({ chatHistory: history })
    const assistantMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: '',
      createdAt: Date.now(),
    }
    addMessage(userId, assistantMsg)
    for await (const chunk of reply.stream) {
      appendToLastAssistant(userId, chunk)
    }
    setBusy(false)
  }

  async function openAssist() {
    setAssistOpen(true)
    setAssistLoading(true)
    try {
      const { suggestions } = await assistSuggest({
        chatHistory: messages.slice(-10),
        userTags: userProfile.tags,
      })
      setSuggestions(suggestions)
    } catch (e) {
      // 兜底
      setSuggestions([
        { style: 'care', emoji: '🫂', label: '关心', text: '你还好吗' },
        { style: 'playful', emoji: '✨', label: '俏皮', text: '在呢在呢 我在摸鱼' },
        { style: 'direct', emoji: '🎯', label: '推进', text: '说说看怎么了' },
      ])
    } finally {
      setAssistLoading(false)
    }
  }

  function handlePickSuggestion(text: string) {
    setInput(text)
    setAssistOpen(false)
  }

  if (userId !== 'xiaoyu') {
    return (
      <Phone>
        <StatusBar />
        <AppBody>
          <div className="flex-1 flex items-center justify-center text-[var(--ink-dim)]">
            用户不存在
          </div>
        </AppBody>
      </Phone>
    )
  }

  return (
    <Phone>
      <StatusBar />
      <AppBody>
        <ChatHeader
          name={xiaoyu.displayName}
          subtitle={xiaoyu.subtitle}
          avatar={xiaoyu.avatar}
          compatibility={compatibility}
        />
        <div ref={scrollRef} className="flex-1 overflow-y-auto py-3">
          {messages.map((m, i) => (
            <MessageBubble key={m.id} role={m.role} streaming={i === messages.length - 1 && busy && m.role === 'assistant' && m.content.length > 0}>
              {m.content}
            </MessageBubble>
          ))}
          {isTyping && <TypingIndicator />}
        </div>
        <InputBar
          value={input}
          onChange={setInput}
          onSend={handleSend}
          onOpenAssist={openAssist}
          disabled={busy}
        />
      </AppBody>
      <AssistDrawer
        open={assistOpen}
        loading={assistLoading}
        suggestions={suggestions}
        onPick={handlePickSuggestion}
        onClose={() => setAssistOpen(false)}
      />
    </Phone>
  )
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
```

- [ ] **Step 2: 手动验证**

```bash
npm run dev
```

打开 `http://localhost:3000/chat/xiaoyu`（或先走测评再进来）验证：
- 右上角显示"契合 NN%"，数字应落在 60–95 之间
- 第一次进入自动出现 2 条开场消息（有打字指示器）
- 输入一句话 → 发送 → 用户气泡出现 → 打字指示器 → 小雨流式回复
- 说"我好累"→ 小雨应走"tired"分支
- 说"嗨"→ 小雨应走"greeting"分支
- 点 "AI 助聊 ✦" → 底部抽屉升起 → 3 个风格按钮（🫂 关心、✨ 俏皮、🎯 推进）
- 点建议 → 抽屉关闭 → 输入框填入该文本 → 可编辑 → 可发出
- 刷新页面 → 聊天历史保留
- DevTools Local Storage 有 `matchu:chat`

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "$(cat <<'EOF'
Task 13: 聊天页完整交互

- 首次进入自动播放小雨 2 条开场白
- 发送 → 延迟 → 打字指示 → 流式回复全链路
- AI 助聊抽屉：调用 assistSuggest，失败走兜底
- 契合度基于标签重合实时计算
- 聊天历史 Zustand + localStorage 持久化

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 14：M3 评审检查点

**此任务无代码改动**。

- [ ] **Step 1: 向用户汇报 M3 完成**

告知用户：
> M3 完成。请跑 `npm run dev`，打开 `/chat/xiaoyu`（或先 `/onboard` 走一次再跳进来）测试：
> - 和小雨聊 5–10 句，试"累"、"嗨"、"听什么音乐"、"睡了"等关键词
> - AI 助聊按钮用 2–3 次，检查 3 种语气建议是否合理
> - 刷新页面验证历史保留
> 若想改：剧本台词、建议语气、契合度文案、动画速度 —— 告诉我。

- [ ] **Step 2: 等待用户反馈再继续 M4**

---

# 里程碑 M4：PWA + 部署 + 手机验证

## Task 15：PWA 清单 + 图标 + 错误兜底

**Files:**
- Create: `public/manifest.webmanifest`
- Create: `public/icon.svg`
- Create: `public/icon-192.png` (通过脚本或手动)
- Create: `public/icon-512.png`
- Modify: `app/layout.tsx`
- Create: `app/error.tsx`
- Create: `app/not-found.tsx`

- [ ] **Step 1: 创建 `public/icon.svg`（简易心遇图标）**

```bash
cat > public/icon.svg <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff5ea0"/>
      <stop offset="50%" stop-color="#a970ff"/>
      <stop offset="100%" stop-color="#5df0ff"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="#0a0414"/>
  <path transform="translate(256 270) scale(8)" fill="url(#g)"
    d="M0 18 C -16 4, -16 -12, -8 -14 C -2 -16, 0 -10, 0 -6 C 0 -10, 2 -16, 8 -14 C 16 -12, 16 4, 0 18 Z"/>
</svg>
EOF
```

- [ ] **Step 2: 生成 PNG 图标（用 Node 内置能力，不引外部依赖）**

安装一个纯 JS 的 SVG→PNG 转换器只为生成一次图标即可弃置：

```bash
npm install --save-dev --no-save sharp
```

然后一条 Node 脚本一次性生成：

```bash
node -e "
const sharp = require('sharp');
const svg = require('fs').readFileSync('public/icon.svg');
(async () => {
  await sharp(svg).resize(192, 192).png().toFile('public/icon-192.png');
  await sharp(svg).resize(512, 512).png().toFile('public/icon-512.png');
  await sharp(svg).resize(180, 180).png().toFile('public/apple-touch-icon.png');
  await sharp(svg).resize(32, 32).png().toFile('public/favicon-32.png');
  console.log('icons written');
})();
"
```

Expected: `public/` 下出现 `icon-192.png`、`icon-512.png`、`apple-touch-icon.png`、`favicon-32.png`。

- [ ] **Step 3: 卸载 sharp（仅用过一次）**

```bash
npm uninstall sharp
```

- [ ] **Step 4: `public/manifest.webmanifest`**

```bash
cat > public/manifest.webmanifest <<'EOF'
{
  "name": "MatchU · 心遇",
  "short_name": "心遇",
  "description": "AI 帮你遇见对的人",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#0a0414",
  "theme_color": "#a970ff",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" }
  ]
}
EOF
```

- [ ] **Step 5: 修改 `app/layout.tsx` 关联 manifest + apple icon**

完整替换 `metadata` 块与 `<head>`：

```tsx
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MatchU · 心遇',
  description: 'AI 帮你遇见对的人',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: '心遇',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0414',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Noto+Serif+SC:wght@400;600;700&family=Noto+Sans+SC:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 6: `app/error.tsx`**

```tsx
'use client'
import { Button } from '@/components/common/Button'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-8 text-center">
      <div className="text-5xl">😵‍💫</div>
      <div className="text-xl font-semibold">出了一点小问题</div>
      <div className="text-[13px] text-[var(--ink-dim)] max-w-xs">
        刷新一下试试。如果一直这样 —— 把这个告诉开发者：<br />
        <code className="text-[var(--pink)]">{error.message}</code>
      </div>
      <Button onClick={reset}>再试一次</Button>
    </div>
  )
}
```

- [ ] **Step 7: `app/not-found.tsx`**

```tsx
import Link from 'next/link'
import { Button } from '@/components/common/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-8 text-center">
      <div className="text-5xl">🌙</div>
      <div className="text-xl font-semibold">这里还没有内容</div>
      <Link href="/">
        <Button>回首页</Button>
      </Link>
    </div>
  )
}
```

- [ ] **Step 8: `localStorage` 可用性检测（降级提示）**

创建 `components/common/StorageWarning.tsx`：

```tsx
'use client'
import { useEffect, useState } from 'react'

export function StorageWarning() {
  const [blocked, setBlocked] = useState(false)
  useEffect(() => {
    try {
      localStorage.setItem('__matchu_probe__', '1')
      localStorage.removeItem('__matchu_probe__')
    } catch {
      setBlocked(true)
    }
  }, [])
  if (!blocked) return null
  return (
    <div className="fixed top-0 inset-x-0 z-[100] text-center text-[12px] py-1.5 bg-[var(--pink)] text-white">
      浏览器禁用了本地存储，测评和聊天历史将无法保留
    </div>
  )
}
```

然后在 `app/layout.tsx` 的 `<body>` 里引入：

```tsx
import { StorageWarning } from '@/components/common/StorageWarning'
// ...
<body>
  <StorageWarning />
  {children}
</body>
```

- [ ] **Step 9: 手动验证 PWA**

```bash
npm run build
npm run start
```

在 Chrome 打开 `http://localhost:3000`：
- DevTools → Application → Manifest → 无错误，显示 "心遇" 名称和紫色主题
- Application → Icons → 看到 192 / 512 图标
- 地址栏右侧出现"安装" 图标

若 build 报错 → 修复后再进行 Step 10。

- [ ] **Step 10: 提交**

```bash
git add -A
git commit -m "$(cat <<'EOF'
Task 15: PWA 清单 + 图标 + 错误页 + localStorage 降级

- public/icon.svg + 四种尺寸 PNG（sharp 一次性生成，已卸载）
- manifest.webmanifest + layout 关联
- app/error.tsx 与 app/not-found.tsx 兜底
- StorageWarning 组件检测 localStorage 禁用场景

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 16：本地生产构建 + 完整手动测试通关

**Files:** （无改动）

- [ ] **Step 1: 生产构建**

```bash
cd /c/Users/Administrator/Desktop/matchu
npm run build
```

Expected: 无错误。若报错，修正后重新构建。常见错误来源：
- TypeScript 类型错误 → 按提示修
- `use client` 缺失 → 给交互组件加
- `import` 路径大小写 → Windows 不敏感但 Vercel 敏感，统一全小写路径

- [ ] **Step 2: 本地生产预览**

```bash
npm run start
```

打开 `http://localhost:3000` 跑完整 spec 第 10.1 节的 11 条手动测试清单（全部打勾）：

- [ ] 首次打开 → 进入测评 → 完成 8 题 → 看到性格画像卡
- [ ] 画像卡 → 点"进入心遇" → 到达聊天页
- [ ] 聊天页右上角契合度数字落在 60–95
- [ ] 用户发消息 → 小雨在 1–3 秒内开始流式回复
- [ ] 点 "AI 助聊 ✦" → 弹出抽屉 → 看到 3 条不同风格的建议
- [ ] 点建议 → 文本进入输入框 → 可编辑 → 可发出
- [ ] 刷新页面 → 性格画像 + 聊天历史保留
- [ ] 清除浏览器数据 → 回到首屏初始态
- [ ] 跑 2 轮测评，每轮选不同答案，画像结果不应全部一致
- [ ] 无 console error（最多 warning 可接受）
- [ ] DevTools → Application → Manifest 无错误

- [ ] **Step 3: 如发现 bug，立即修复并 commit**

每修一个问题做一次小 commit：

```bash
git add -A
git commit -m "fix: <问题简述>"
```

---

## Task 17：推到 GitHub（需用户协作）

**此任务需用户操作 GitHub 账号创建仓库**。

- [ ] **Step 1: 告知用户创建 GitHub 仓库**

请用户执行：
> 1. 打开 https://github.com/new
> 2. Repository name: `matchu`（或任意名）
> 3. **不要勾选** "Initialize this repository with README" / "Add .gitignore" / "Add license"（因为本地已有内容）
> 4. Private 或 Public 均可
> 5. 点 "Create repository"
> 6. 复制页面上出现的 `git remote add origin <URL>` 那条命令（形如 `https://github.com/<你的用户名>/matchu.git`）贴给我

等待用户提供远程 URL。

- [ ] **Step 2: 接收到 URL 后执行 push**

假设用户给的 URL 是 `https://github.com/<USERNAME>/matchu.git`：

```bash
cd /c/Users/Administrator/Desktop/matchu
git remote add origin https://github.com/<USERNAME>/matchu.git
git branch -M main
git push -u origin main
```

Expected: 推送成功。如要求凭据，使用 GitHub Personal Access Token（见 https://github.com/settings/tokens）。

- [ ] **Step 3: 用户在浏览器打开仓库 URL 验证文件全部上去**

---

## Task 18：Vercel 部署（需用户协作）

**此任务需用户在 vercel.com 上操作**。

- [ ] **Step 1: 告知用户部署步骤**

请用户执行：
> 1. 打开 https://vercel.com/new
> 2. 用 GitHub 账号登录
> 3. 找到 `matchu` 仓库 → 点 "Import"
> 4. **Environment Variables** 区域添加一条：
>    - Key: `AI_PROVIDER`
>    - Value: `mock`
> 5. Framework Preset 应自动识别为 "Next.js"
> 6. 点 "Deploy"
> 7. 等 60–120 秒 → 拿到 `matchu-xxxx.vercel.app` URL → 贴给我

- [ ] **Step 2: 拿到 URL 后做公网验证**

在电脑浏览器打开 URL，跑 Task 16 Step 2 的 11 条测试清单中与客户端相关的部分（不包括 build 相关）：
- 首页视觉
- 测评跑一遍
- 聊天跑一遍
- AI 助聊
- 刷新保留

- [ ] **Step 3: 记录部署 URL 到 README**

Edit `README.md`，在 "当前状态" 前加一行：

```markdown
🌐 **在线演示**：https://matchu-xxxx.vercel.app
```

```bash
git add README.md
git commit -m "$(cat <<'EOF'
docs: 添加 Vercel 部署 URL 到 README

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
git push
```

Vercel 会自动 redeploy，但 URL 不变。

---

## Task 19：手机验证 + PWA 安装

**此任务需用户在自己手机上操作**。

- [ ] **Step 1: 告知用户手机验证步骤**

请用户：
> 1. 手机浏览器（iOS Safari 或 Android Chrome）打开 `matchu-xxxx.vercel.app`
> 2. 验证：
>    - 首页渲染无布局崩坏
>    - 性格测评完整走一遍（8 题）
>    - 和小雨聊 3–5 句，AI 助聊试一次
> 3. 加入主屏幕：
>    - iOS Safari：分享按钮 → "添加到主屏幕" → 图标出现在桌面
>    - Android Chrome：地址栏"安装应用"提示 / 菜单 "安装应用"
> 4. 从桌面图标打开 → 应为全屏无浏览器 UI 的"App"模式

- [ ] **Step 2: 任何问题记录并修复**

若发现 bug：修复 → commit → push → Vercel 自动重部署 → 手机刷新验证。

---

## Task 20：项目交付 + 交付单

**Files:**
- Modify: `README.md`

- [ ] **Step 1: 扩写 README 作为交付单**

```markdown
# MatchU · 心遇

🌐 **在线演示**：https://matchu-xxxx.vercel.app

AI 性格测评驱动的真人交友/匹配产品（MVP 阶段 · Mock AI 版）。

## 当前状态

- [x] 产品设计：[docs/superpowers/specs/2026-04-23-matchu-mvp-design.md](docs/superpowers/specs/2026-04-23-matchu-mvp-design.md)
- [x] 实施计划：[docs/superpowers/plans/2026-04-23-matchu-mvp-plan.md](docs/superpowers/plans/2026-04-23-matchu-mvp-plan.md)
- [x] M1 项目骨架
- [x] M2 AI 性格测评
- [x] M3 AI 助聊聊天页
- [x] M4 PWA + Vercel 部署

## 本地开发

```bash
npm install
npm run dev          # http://localhost:3000
```

## 主要路由

- `/` 首页欢迎
- `/onboard` AI 性格测评（8 题）
- `/chat/xiaoyu` 和 Mock 真人"小雨"的聊天 + AI 助聊副驾驶

## Mock AI → 真 LLM 切换路径

`.env.local` 修改：

```
AI_PROVIDER=deepseek    # 或 openai / anthropic
DEEPSEEK_API_KEY=...
```

然后实现 `lib/ai/real.ts` 即可（目前是空壳）。UI 与 API 层零改动。

## 参考资料

- `reference/matchu_app_original_mockup.html` — 原始 UI 设计稿
- `reference/AI虚拟陪伴社交平台_项目立项书_V2_AI工具箱扩展版.docx` — 远期立项书

## 后续阶段

- Phase 2：补齐另外 4 屏（匹配推荐、聊天列表、虚拟视频、我的）
- Phase 3：接真 LLM
- Phase 4：接真用户后端（Supabase）
- Phase 5：备案上架 / 微信小程序版
```

- [ ] **Step 2: 最终提交**

```bash
git add README.md
git commit -m "$(cat <<'EOF'
docs: 交付单 README

- 在线演示 URL
- 里程碑勾选完成
- 本地开发命令
- Mock → 真 LLM 切换指引

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
git push
```

- [ ] **Step 3: 向用户宣告交付**

> ✅ MatchU 心遇 MVP 交付完成。
>
> - 在线演示：`matchu-xxxx.vercel.app`
> - 本地仓库：`C:/Users/Administrator/Desktop/matchu`
> - GitHub：`github.com/<你>/matchu`
>
> MVP 验证目标全部达成：
> - ✅ 前端能跑
> - ✅ 后端（API 层与 lib 层）能跑
> - ✅ 前后端联通
> - ✅ 能演示（手机打开公网 URL）
> - ✅ 架构为日后接真 LLM / 真后端预留清晰升级路径
>
> 下一阶段想往哪走？Phase 2 补屏 / Phase 3 接真 AI / Phase 4 接真后端 / 暂时观察 —— 任选。
