# MatchU · 心遇 — Phase 2 设计文档

- **文档日期**：2026-04-23
- **产品代号**：MatchU · 心遇 / Phase 2
- **文档状态**：设计稿（待用户最终确认 → 进入实施计划）
- **前置依赖**：[Phase 1 设计文档](./2026-04-23-matchu-mvp-design.md)、[Phase 1 实施计划](../plans/2026-04-23-matchu-mvp-plan.md)
- **原型参考**：`reference/matchu_app_original_mockup.html`（6 屏视觉设计稿，Phase 1 实施了屏 1 + 屏 4）

---

## 1. 概述

### 1.1 本期目标

Phase 1 交付了 6 屏设计中的 2 屏（AI 性格测评 + AI 助聊聊天页）+ 1 个 Mock 真人（小雨）。Phase 2 补齐 mockup 里剩余 4 屏 + 引入底部 TabBar，让产品从"2 屏演示"升级为"视觉完整的 App 形态"。

### 1.2 本期交付

- **4 个新页面**（匹配推荐、消息列表、虚拟视频、我的）
- **1 个底部 TabBar**（5 个 tab 贯穿除虚拟视频外的所有页面）
- **1 个 AI 工具 Tab 占位页**（立项书里第三梯队的 20+ AI 工具先以"即将开放"形式占坑）
- **5 个 Mock 假用户**（匹配 + 消息列表展示用，点击跳转提示"仅演示"）
- **默认用户身份**（"Alex · 27 · 程序员 · ENTP"，用于我的页显示）

### 1.3 本期明确不做

| 不做 | 后续阶段 |
|---|---|
| 可编辑的个人资料 | Phase 4（接真用户后端时） |
| 真实支付流程 | Phase 5 |
| 可滑动/可撤销的匹配卡片 | 未排期 |
| 匹配算法（卡片顺序是固定数组） | Phase 4 |
| 实时视频通话 | 未排期 |
| 虚拟角色风格切换 | 未排期 |
| AI 工具箱里任一工具的实际功能 | Phase 3 |
| 5 个 Mock 假用户的真实聊天 | 保留"仅小雨可真聊" |
| 实名认证、手机号、短信 | Phase 5 |

### 1.4 Phase 2 验证目标

- [x] 视觉上覆盖 mockup 全部 6 屏（含 TabBar）
- [x] 能在同一个 App 里自由切换 5 个 tab
- [x] "小雨"真实可聊的入口仍然工作（不破坏 Phase 1）
- [x] 架构预留 Phase 3/4 的升级空间：真 LLM、真用户、支付系统

---

## 2. 决策历史（对话中已确认）

| 决策点 | 选择 |
|---|---|
| 形态 | 沿用 Web（Next.js App Router），不变 |
| TabBar 5 个 tab 全做 | ✅ 是（AI 工具 tab 做占位） |
| 匹配屏交互深度 | ♥ / ✕ 触发卡片切换 + 浮动 toast；↺ ★ ⚡ 触发 "SVIP 专享" 提示 |
| Mock 假用户数量 | 5 个（林念念、Sara、Amy、小鹿Luna、一诺） |
| 5 假用户聊天 | 不可真聊；点进去提示"仅演示，点小雨体验真实聊天" |
| 我的页默认身份 | `Alex · 27 · 程序员 · ENTP`（硬编码，Phase 4 可编辑） |
| SVIP 购买 | Toast："支付系统开发中" |
| 我的页 4 个菜单项 | 都是 Toast："即将开放" |
| 虚拟视频屏 | 纯视觉展示页，无 TabBar，底部控制按钮 Toast |
| AI 工具 tab | 12 工具灰色卡片 + 锁图标 + 点击 Toast |

---

## 3. 架构

### 3.1 路由结构（新 + 旧）

```
app/
├── page.tsx                     ← 首页：欢迎屏（Phase 1）
├── onboard/page.tsx             ← AI 性格测评（Phase 1）
├── chat/[userId]/page.tsx       ← 与 Mock 真人聊天（Phase 1，仅 xiaoyu）
├── match/page.tsx               ← 🆕 智能匹配推荐
├── messages/page.tsx            ← 🆕 契合度 + 聊天列表
├── virtual/page.tsx             ← 🆕 虚拟视频展示
├── me/page.tsx                  ← 🆕 我的 + 会员
├── tools/page.tsx               ← 🆕 AI 工具占位页
├── layout.tsx                   ← 根布局（Phase 1）
├── error.tsx / not-found.tsx    ← 错误兜底（Phase 1）
└── globals.css                  ← 设计 token（Phase 1）
```

### 3.2 首页策略

**不改首页 `/`**：保留 Phase 1 的欢迎屏（"让 AI 帮你 遇见对的人" + 两个按钮）。

**新增：登录态判定**：如果 `useUserStore.profile.completedAt` 不为空（已做过测评），首页的"开始心遇之旅"按钮变为"进入心遇"，跳 `/match`（默认落点改为匹配屏）；否则维持"开始心遇之旅 → `/onboard`"。

### 3.3 TabBar 设计

**路由规则**：`/match`, `/messages`, `/tools`, `/virtual`, `/me` 五条路径顶层都显示 TabBar。`/`, `/onboard`, `/chat/[userId]` 不显示（这些是全屏沉浸流程）。

**实现方式**：Next.js 15 Route Groups。

```
app/
├── (tabs)/                      ← Route Group（不产生 URL）
│   ├── layout.tsx               ← 注入 TabBar 的子布局
│   ├── match/page.tsx
│   ├── messages/page.tsx
│   ├── tools/page.tsx
│   ├── virtual/page.tsx
│   └── me/page.tsx
├── page.tsx                     ← 仍在根，不含 TabBar
├── onboard/page.tsx             ← 不含 TabBar
└── chat/[userId]/page.tsx       ← 不含 TabBar
```

**注**：虚拟视频屏按 mockup 是"通话中沉浸态"、原本不带 TabBar。但为了导航可达，Phase 2 里 `/virtual` **保留 TabBar** —— 用户通过 "虚拟" tab 进入一个"我的虚拟形象预览"页面，而不是"正在通话"。等 Phase 3+ 接真实时通信再讨论沉浸态。

### 3.4 分层

继承 Phase 1 的三层结构：UI → API → lib。新增的 Mock 假用户走 lib/mock-data/，与小雨同层并列。

```
lib/mock-data/
├── quiz.ts                      ← Phase 1
├── profiles.ts                  ← Phase 1
├── users/
│   ├── xiaoyu.ts                ← Phase 1，真实可聊
│   ├── preview-users.ts         ← 🆕 Phase 2，5 个仅展示假用户
│   └── me.ts                    ← 🆕 Phase 2，当前用户（Alex）
└── tools.ts                     ← 🆕 Phase 2，12 个 AI 工具元信息
```

---

## 4. 屏设计

### 4.1 屏 2 · 智能匹配推荐（`/match`）

#### 布局

```
┌────────────────────────────────┐
│ StatusBar                      │
│ TopBar: 探索 · 今日推荐    [⚙] │
│ ──────────────────────────     │
│ Filter: [为你精选] 附近 同频...  │ ← 横向滚动 chip，可切换（UI 生效，数据不筛）
│ ──────────────────────────     │
│        ┌──────────────┐        │
│        │              │        │ ← Card Stack (当前卡 + 2 张背景虚影)
│        │   [肖像 SVG]  │        │
│        │              │        │
│        │ ♥ 92% 契合   │        │
│        │ ✓ 已认证     │        │
│        │              │        │
│        │  林念念 · 25 │        │
│        │  📍 上海·徐汇 │        │
│        │  "引言..."    │        │
│        │  [tags]       │        │
│        └──────────────┘        │
│ ──────────────────────────     │
│     ↺   ✕   ♥   ★   ⚡          │ ← 5 个动作按钮
│ ──────────────────────────     │
│ TabBar: [探索*] 消息 ...        │
└────────────────────────────────┘
```

#### 交互

| 动作 | 行为 |
|---|---|
| 点 filter chip | 视觉切到那个 chip active；底下卡片数据**不变**（Mock 阶段不真筛） |
| 点 ♥（喜欢） | 右上浮动 toast "已喜欢"；卡片滑出；展示下一张；最后一张后显示"今日推荐已看完，明天再来" |
| 点 ✕（跳过） | toast "已跳过"；卡片滑出；下一张 |
| 点 ↺（撤回） | toast "撤回是 SVIP 专享，即将开放" |
| 点 ★（超级喜欢） | toast "超级喜欢是 SVIP 专享，即将开放" |
| 点 ⚡（加速曝光） | toast "曝光加速是 SVIP 专享，即将开放" |
| 点当前卡（空白区） | 可选：跳 `/chat/[userId]`，但因为这些是假用户，会显示"仅演示"提示 |

#### 卡片滑出动效

用 Framer Motion。往右滑（♥）+ 右旋 15°；往左滑（✕）+ 左旋 15°；动画时长 300ms。同时底下的两张背景卡上浮成当前卡。

#### 数据源

`lib/mock-data/users/preview-users.ts` 导出 5 个假用户 + 匹配顺序。

### 4.2 屏 3 · 契合度 + 聊天列表（`/messages`）

#### 布局

```
┌────────────────────────────────┐
│ StatusBar                      │
│ TopBar: 消息 · 心遇          [🔍] │
│ ──────────────────────────     │
│ ┌──────────────────────────┐   │
│ │  NEW · 契合度解读卡  92%  │   │
│ │  [头像] ♥ [头像]          │   │ ← hero 卡：最近匹配（林念念 92%）
│ │  性格 三观 兴趣 节奏 依恋 生活圈  │ ← 6 维度雷达数字
│ │   95   88   94  90  89  96 │   │
│ └──────────────────────────┘   │
│                                │
│ AI 助聊 · 智能推荐             │
│ ┌──────────────────────────┐   │
│ │ ♥ 心遇 AI 助手       刚刚 │   │
│ │ [AI] 林念念回复了你..     │   │
│ └──────────────────────────┘   │
│                                │
│ 最近聊天                       │
│ ┌──────────────────────────┐   │
│ │ [头] 小雨  🌧🌧🌧   11:23  │2│ ← 小雨 + Phase 1 实际消息数
│ │     [最后消息预览]         │   │
│ ├──────────────────────────┤   │
│ │ [头] 林念念 92%    09:28  │2│ ← 4 个假人，预览为 mockup 写死
│ │     那家店的猫真的粘人 🐱 │   │
│ ├──────────────────────────┤   │
│ │ Sara/Amy/Luna/一诺  ...   │   │
│ └──────────────────────────┘   │
│ TabBar: 探索 [消息*] ...       │
└────────────────────────────────┘
```

#### 交互

| 动作 | 行为 |
|---|---|
| 点 hero 卡 | toast "契合度报告详情即将开放" |
| 点 "AI 助聊 · 智能推荐" 卡 | 跳 `/chat/xiaoyu` 或 toast（看设计） |
| 点最近聊天里的"小雨" | 跳 `/chat/xiaoyu`（Phase 1 真实聊天） |
| 点其他 4 个假人 | toast "此用户仅演示，请点小雨体验真实聊天" |
| 点搜索 🔍 | toast "搜索即将开放" |

#### 数据源

- "最近聊天"最顶一条：**从 Phase 1 的 `useChatStore` 读取最新消息作为小雨预览**（如果用户和小雨聊过就显示最后一条，否则显示默认问候语 + 未读=0）
- 其他 4 个假人：`preview-users.ts` 的预置 `chatPreview` 字段（写死）
- 契合度 hero 卡：显示 `preview-users.ts` 里契合度最高的那个（默认林念念 92%）

### 4.3 屏 5 · 虚拟人物视频（`/virtual`）

#### 布局

```
┌────────────────────────────────┐
│ StatusBar                      │
│ TopBar: 虚拟视频 · 樱花场景 [⋯] │
│ ──────────────────────────     │
│ ┌──────────────────────────┐   │
│ │  [樱花场景 SVG - 动漫少女] │   │ ← 整屏展示
│ │  LIVE · 虚拟驱动          │   │
│ │  04:38                   │   │
│ │  ┌─┐                     │   │
│ │  │你│ ← PIP               │   │
│ │  └─┘                     │   │
│ │  🌸 樱花树下              │   │
│ └──────────────────────────┘   │
│                                │
│ ♥ 亲密度  72 / 100             │
│ ███████░░░                     │
│ ✓ 文字 ✓ 视频 ◉ 场景 ○ 真人     │
│                                │
│ 你的虚拟形象风格  [切换 ›]      │
│ [🌸 日漫风*] 🎭 3D 写实 ...     │
│                                │
│  🎤   🌸   🎁   ✕              │
│ TabBar: 探索 ... [虚拟*] ...   │
└────────────────────────────────┘
```

#### 交互

| 动作 | 行为 |
|---|---|
| 点 🎤 🌸 🎁 | toast "实时虚拟通话即将开放（Phase 3+）" |
| 点 ✕ | toast 同上（Phase 2 里不实际结束任何通话） |
| 点风格 chip（日漫/3D/轻美化） | 视觉切换 active，不改变场景 SVG |
| 点锁住风格（国风/赛博） | toast "此风格 SVIP 专享" |
| 亲密度进度条 | 静态，不响应点击 |

#### 视觉实现

SVG 直接从 mockup 抄（包括樱花树、动漫少女角色、花瓣、PIP 小框），**不做任何动画/动效**（花瓣不飘落、计时器不走、嘴不动）。就是"定帧"展示。

如果 Phase 2 工作量够，可给花瓣加一个 CSS `@keyframes` 缓慢下落动画（可选增值）。

### 4.4 屏 6 · 我的（`/me`）

#### 布局

```
┌────────────────────────────────┐
│ StatusBar                      │
│ TopBar: 我的                 [⚙] │
│ ──────────────────────────     │
│   [头像 + ✓]                   │
│   Alex · 27                   │
│   📍 上海 · 浦东 · 程序员      │
│   [实名认证] [ENTP] [热门用户]  │
│ ──────────────────────────     │
│    148      23     92%         │ ← 3 统计
│  收到喜欢 匹配成功 最高契合     │
│ ──────────────────────────     │
│ ┌──────────────────────────┐   │
│ │  SVIP 会员  ♛            │   │
│ │  ¥58 月卡 · 首月 ¥38      │   │
│ │  无限 AI 助聊·深度报告...  │   │
│ │  [立即开通 →]             │   │
│ └──────────────────────────┘   │
│                                │
│ ┌──────────────────────────┐   │
│ │ ✦ AI 资料卡诊断      ›  │   │
│ │   评分 B+ · 3 条优化建议  │   │
│ │ ◐ 我的虚拟形象       ›  │   │
│ │   已解锁 3 种风格         │   │
│ │ 🧠 AI 恋爱人格报告    ›  │   │
│ │   ENTP · 安全型依恋       │   │
│ │ ◆ 我的道具           ›  │   │
│ │   超级喜欢 × 5 · 加速 × 2  │   │
│ └──────────────────────────┘   │
│ TabBar: 探索 ... [我的*]       │
└────────────────────────────────┘
```

#### 交互

| 动作 | 行为 |
|---|---|
| 点头像 / ⚙ | toast "资料编辑即将开放（Phase 4）" |
| 点 SVIP 开通 | toast "支付系统开发中（Phase 5）" |
| 点 4 个菜单项中任一个 | toast "即将开放（Phase 3）" |

#### 数据源

- 头像、姓名、年龄、位置、职业、MBTI：`lib/mock-data/users/me.ts` 硬编码 `Alex` 身份
- `ENTP · 安全型依恋`：硬编码
- 3 个统计（148、23、92）：硬编码，使用 mockup 数字
- **如果用户已完成 Phase 1 性格测评**：在 MBTI chip 位置显示 "ENTP" → 替换为 `useUserStore.profile.profileDisplayName`（如"月光补能型"）；如未完成测评，显示 "ENTP"

### 4.5 AI 工具 tab 占位页（`/tools`）

#### 布局

```
┌────────────────────────────────┐
│ StatusBar                      │
│ TopBar: AI 工具                 │
│ ──────────────────────────     │
│ 即将开放 · Phase 3             │
│ 12 款 AI 工具正在路上，让你      │
│ 不只是遇见，还能更好地成为自己   │
│ ──────────────────────────     │
│ [🎨 AI 头像]  [🔮 AI 占卜]      │
│ [💬 恋爱话术] [🧠 读心话]        │
│ [👗 AI 穿搭]  [🍳 AI 菜谱]      │
│ [💌 情感分析] [📡 关系雷达]      │
│ [🎪 约会规划] [🌆 心情壁纸]      │
│ [✨ 金句生成] [🏆 好友排序]      │
│ TabBar: ... [AI 工具*] ...     │
└────────────────────────────────┘
```

12 张灰色带锁图标的卡片。点任一都 toast "Phase 3 开放"。

---

## 5. 共享组件：TabBar

### 5.1 组件签名

```tsx
// components/phone/TabBar.tsx
'use client'
import { usePathname } from 'next/navigation'

export function TabBar() {
  const pathname = usePathname()
  const active = tabs.find(t => pathname.startsWith(t.path))?.key
  return (
    <nav className="...">
      {tabs.map(t => <TabItem key={t.key} {...t} isActive={active === t.key} />)}
    </nav>
  )
}
```

### 5.2 5 个 tab 定义

```ts
const tabs = [
  { key: 'explore',  icon: '◉', label: '探索',    path: '/match' },
  { key: 'messages', icon: '♥', label: '消息',    path: '/messages' },
  { key: 'tools',    icon: '✦', label: 'AI 工具', path: '/tools' },
  { key: 'virtual',  icon: '◐', label: '虚拟',    path: '/virtual' },
  { key: 'me',       icon: '◆', label: '我的',    path: '/me' },
]
```

### 5.3 视觉

固定底部，毛玻璃背景，active tab 的图标和文字用 `--grad-love` 渐变。

### 5.4 挂载策略

放在 `app/(tabs)/layout.tsx` 里，通过 Route Group 自动应用到 match/messages/tools/virtual/me，不污染 onboard/chat 路由。

---

## 6. 数据模型

### 6.1 `preview-users.ts`

```ts
export type PreviewUser = {
  id: string
  displayName: string
  age: number
  location: string
  mbti: string
  profession: string
  bio: string
  tags: { emoji: string; label: string }[]
  compatibility: number        // 60-95
  avatarGradientFrom: string   // CSS color
  avatarGradientTo: string
  chatPreview: string          // 最近一条假消息
  chatTime: string             // "09:28" / "昨天" / "周二"
  unread?: number
  online?: boolean
}

export const previewUsers: PreviewUser[] = [
  { id: 'linnian', displayName: '林念念', age: 25, ..., compatibility: 92, ... },
  { id: 'sara',    displayName: 'Sara · 沙拉', age: 24, ..., compatibility: 78, ... },
  { id: 'amy',     displayName: 'Amy_夏夏', age: 23, ..., compatibility: 71, ... },
  { id: 'luna',    displayName: '小鹿Luna', age: 26, ..., compatibility: 68, ... },
  { id: 'yinuo',   displayName: '一诺', age: 27, ..., compatibility: 63, ... },
]

// 匹配屏的卡片顺序（按契合度降序）
export const matchOrder = previewUsers.slice().sort((a, b) => b.compatibility - a.compatibility)
```

### 6.2 `me.ts`

```ts
export const me = {
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
}
```

### 6.3 `tools.ts`

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

---

## 7. 共用的 Toast 系统

多个屏都需要显示短时浮动提示（"已喜欢"、"即将开放"等）。不引入第三方库，自己做一个极小的 Zustand store + 组件。

```ts
// lib/store/toast.ts
type Toast = { id: string; text: string; emoji?: string }
type ToastState = {
  toasts: Toast[]
  show: (text: string, emoji?: string) => void
  dismiss: (id: string) => void
}
```

UI：右上角或屏幕顶部中央，黑半透明 + 毛玻璃，自动 2 秒消失。

---

## 8. 错误处理

本期新增的错误场景（延续 Phase 1 的"MVP 级"处理原则）：

| 场景 | 处理 |
|---|---|
| 用户点进假人聊天（如 `/chat/linnian`） | Phase 1 已处理："用户不存在" — 可选改为更友好的"此用户仅演示，请回到消息列表点击小雨" |
| 匹配屏看完所有卡 | 显示空态："今日推荐已看完，明天再来吧"，可点刷新按钮重置 |
| 5 个 tab 切换后 Zustand 状态不同步 | 不会发生（状态都是全局的；且 TabBar 是 `<Link>` 不重载） |

---

## 9. 测试策略

延续 Phase 1 的手动测试清单模式，不加自动化测试。新增测试清单（Phase 2 交付前必过）：

- [ ] 5 个 tab 切换流畅，active 状态正确高亮
- [ ] 从首页到匹配屏到消息列表到我的，整条导航无异常
- [ ] 匹配屏点 ♥/✕ 能切换卡片；看完显示"明日再来"
- [ ] 匹配屏点 ↺/★/⚡ 显示 SVIP 提示 toast
- [ ] 消息列表点"小雨"跳进真实聊天（Phase 1 功能不受影响）
- [ ] 消息列表点其他 4 个假人显示 toast
- [ ] 虚拟视频屏视觉完整（樱花 + 动漫少女 + 亲密度条）
- [ ] 虚拟视频屏 4 个控制按钮都 toast
- [ ] 我的屏：头像 / 姓名 / 3 统计 / SVIP 卡 / 4 菜单项视觉完整
- [ ] 我的屏：完成过测评时 MBTI 位置显示性格画像名；未完成时显示 "ENTP"
- [ ] AI 工具屏：12 个工具卡视觉完整，点任一都 toast
- [ ] Phase 1 全部功能未损坏：/ → /onboard 走完测评 → /chat/xiaoyu 能真实聊天 → AI 助聊按钮正常

---

## 10. 里程碑

### M5 · TabBar 基础 + 路由重构（≈ 半天）

- 创建 `app/(tabs)/layout.tsx` Route Group
- 创建 `components/phone/TabBar.tsx`
- 迁移 / 创建 5 条 tab 路由为空壳页（每个只显示"XX 页 - 开发中"）
- 修改首页 `/` 的"开始心遇之旅"按钮：已完成测评时跳 `/match`

**DONE**：5 个 tab 能点、能切换、active 正确高亮，路由切换无闪动。

### M6 · 匹配屏 + 5 Mock 用户数据（≈ 1 天）

- `lib/mock-data/users/preview-users.ts` 完整 5 个假用户
- `components/match/MatchCard.tsx`、`MatchFilter.tsx`、`MatchActions.tsx`、`EmptyMatchState.tsx`
- `components/common/Toast.tsx` + `lib/store/toast.ts`
- `app/(tabs)/match/page.tsx` 完整交互

**DONE**：打开 `/match` 看到林念念卡片，点 ♥ 切到下一张，看完 5 张显示"明日再来"，SVIP 按钮正确提示。

### M7 · 消息列表屏（≈ 半天）

- `components/messages/CompatibilityHero.tsx`、`AIAssistHint.tsx`、`ChatListItem.tsx`
- `app/(tabs)/messages/page.tsx` 完整渲染（hero + AI 助聊提示 + 最近聊天）
- 小雨的最近消息从 `useChatStore` 实时读取；无消息时显示默认问候

**DONE**：从 `/messages` 点击小雨能跳进真实聊天；点 4 个假人 toast 提示。

### M8 · 虚拟视频屏（≈ 半天）

- `app/(tabs)/virtual/page.tsx` 直接搬 mockup SVG（樱花+动漫少女+PIP）
- `components/virtual/IntimacyBar.tsx`、`StylePicker.tsx`、`CallControls.tsx`
- 4 个控制按钮 toast 挂载

**DONE**：视觉与 mockup 95% 一致；所有按钮可点 toast；TabBar 正常。

### M9 · 我的屏（≈ 半天）

- `lib/mock-data/users/me.ts`
- `components/me/ProfileHero.tsx`、`ProfileStats.tsx`、`SvipCard.tsx`、`ProfileMenu.tsx`
- `app/(tabs)/me/page.tsx` 集成
- MBTI chip 的 Phase 1 联动（完成测评时显示 profileDisplayName）

**DONE**：视觉完整，所有交互点 toast。

### M10 · AI 工具占位 + 部署（≈ 半天）

- `lib/mock-data/tools.ts`
- `components/tools/ToolCard.tsx`
- `app/(tabs)/tools/page.tsx` 12 卡片网格
- 合并所有变更 → push → Vercel 自动部署
- 手机走完全部 Phase 2 测试清单

**DONE**：Vercel 上能访问所有新屏；Phase 1 不回归。

---

## 11. Phase 2 完成后能往哪走

```
Phase 1  ✅   2 屏 + Mock AI + Vercel 演示
Phase 2  ✅ (本期)  补齐另外 4 屏 + TabBar + 视觉完整
Phase 3  ⭕   接真 LLM（改 AI_PROVIDER + 填 lib/ai/real.ts）
Phase 3.5 ⭕   实现 AI 工具 12 项（按优先级挑 3-5 个先做）
Phase 4  ⭕   接真用户后端（Supabase）+ 登录 + 可编辑资料
Phase 5  ⭕   备案 + 上架 + 支付
```

---

## 12. 附录

### 12.1 关键新增依赖

**无**。Phase 1 已安装的 Zustand、Framer Motion、Lucide React 足够覆盖本期全部需求。

### 12.2 影响 Phase 1 的变更

仅一处：**首页 `/` 的 "开始心遇之旅" 按钮逻辑**。加一个 `useUserStore.profile.completedAt` 判断，决定跳 `/match` 或 `/onboard`。不破坏 Phase 1 能力。

### 12.3 风险点

- **Next 16 Route Group 的 `<TabBar>` 在 Client Component 下使用 `usePathname`**：需加 `'use client'`。布局本身可以 Server Component，TabBar 子组件是 Client。
- **Framer Motion 卡片滑出动画在 Safari iOS 可能有 z-index 闪烁**：本期接受；如严重再加 `will-change: transform`。
- **Mock 假用户的肖像 SVG**：mockup 里是手绘 SVG，直接搬即可，不用任何图片文件。
