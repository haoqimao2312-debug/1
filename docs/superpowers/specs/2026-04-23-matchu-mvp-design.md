# MatchU · 心遇 — MVP 设计文档

- **文档日期**：2026-04-23
- **产品代号**：MatchU · 心遇
- **文档状态**：设计稿（待用户最终确认 → 进入实施计划阶段）
- **原型参考**：`reference/matchu_app_original_mockup.html`（6 屏视觉设计稿）
- **立项参考**：`reference/AI虚拟陪伴社交平台_项目立项书_V2_AI工具箱扩展版.docx`（远期产品愿景，本期不全量实施）

---

## 1. 概述

### 1.1 产品定位（本期为准）

MatchU · 心遇 是一款**以 AI 性格测评驱动的真人交友/匹配产品**，核心差异化在于"AI 助聊副驾驶"—— 用户和真人的对话由 AI 提供回复建议、语气调优、场景化开场白。

**对标定位**：Soul / Tantan / Hinge 的交友产品 + Character.AI 级别的 AI 助手（作为副驾驶，而非主角）。

> 注：公司立项书原版本（WarmU）以"AI 陪伴对话"为主角。本期 MVP 与用户已设计的 UI 原型（MatchU 心遇）对齐，以**真人匹配 + AI 助手**为产品形态。立项书中 AI 陪伴能力将作为后续阶段的可选扩展。

### 1.2 本期 MVP 范围

**本期交付**：
- 形态：移动端优先的 Web 应用（手机浏览器打开，可"添加到主屏幕"作为 PWA 使用）
- 2 屏核心流程：**AI 性格测评** + **AI 助聊聊天页**
- 所有 AI 能力走 **Mock 实现**（脚本/模板回复），但接口形状与真实 LLM SDK 对齐
- 1 位 Mock 真人用户：**小雨**（22 岁，初入职场，俏皮带点 emo）
- 前后端连通、数据持久化到 `localStorage`
- 部署到 Vercel 免费域名（`matchu-xxxx.vercel.app`）

**本期明确不做**：
- 注册/登录/实名认证
- 真实用户数据库
- 真实 LLM API（Mock 即可）
- 支付/会员体系
- 实时语音/视频通话
- 上架 App Store / Google Play
- ICP 备案 / 算法备案 / 深度合成服务备案
- 自动化测试（手动测试清单替代）
- 另外 4 屏（匹配推荐、聊天列表、虚拟视频、我的）—— 后续阶段补

### 1.3 MVP 验证目标

完成后能验证：

- [x] 前端能跑
- [x] 后端（API 路由）能跑
- [x] 前后端能联通
- [x] 能演示给别人看（手机打开一个公网链接）
- [x] 架构为日后接真 LLM / 真后端预留了清晰升级路径

---

## 2. 背景与关键决策

### 2.1 决策历史（对话中已确认）

| 决策点 | 选项 | 依据 |
|---|---|---|
| 目标阶段 | **真实 MVP，准备小范围上线** | 用户明确意图 |
| 实施主体 | **用户主导 + Claude 实现** | 用户不写代码，用 AI 工具实现 |
| 产品形态 | **网页版（H5 链接分享），先不备案** | 降低合规门槛，验证可跑通 |
| AI 能力 | **Mock（脚本/模板），接口模仿真 LLM** | 极省成本 + 接口对齐 |
| 原型以哪版为准 | **以展示页 MatchU 为准**（真人匹配 + AI 助手） | 用户 UI 已画好，立项书方向差异较大，统一于 UI |
| 技术栈 | **Next.js + Tailwind + Vercel** | 单体应用、部署零门槛、日后可扩展 |
| 首期屏数 | **2 屏**（测评 + 聊天） | 最小验证闭环 |
| Mock 用户数量 | **1 位**（小雨） | 多做等量复制粘贴，对验证无增益 |
| 小雨人设 | **22 岁初入职场，俏皮+emo** | 用户选定 |
| 持久化 | **localStorage**（Zustand persist） | 无需数据库，刷新不丢 |
| 域名 | **vercel.app 免费子域名** | 本期演示足够 |
| 里程碑节奏 | **M1+M2 合并评审 → M3 评审 → M4 评审** | 折中："跑起来"才看，早期骨架不浪费评审时间 |

### 2.2 MVP 约束下的取舍

- **不做用户账号** → "账号"即浏览器本地的一份 `UserProfile`，换浏览器/清缓存数据丢失，MVP 接受此代价
- **不做自动化测试** → Mock 脚本测等于抄脚本，UI 天天改测试天天改，改用手动测试清单
- **不引入任何"AI 工程"中间件** → 不用 LangChain、LlamaIndex、向量库、Agent 框架；Mock 和真 LLM 都是简单的 `stream()` + `json()` 调用
- **契合度用假算法** → 基于性格标签重合度编一个 60–95 的数字，MVP 无需真实匹配算法

---

## 3. 架构

### 3.1 一句话架构

> Next.js 单体应用。一个代码库同时包含 UI 页面、API 后端、Mock 数据、Mock AI 接口。前端调用自己的 API 路由，路由调用业务逻辑层，业务逻辑层返回 Mock 数据或 Mock AI 结果。

### 3.2 三层结构

```
┌──────────────────────────────────────────────────┐
│  UI 层（app/ + components/）                      │
│  只负责"展示和交互"，不知道数据从哪来                │
└─────────────────────┬────────────────────────────┘
                      │
┌─────────────────────▼────────────────────────────┐
│  API 层（app/api/）                               │
│  只负责"收请求、派活、返回"                         │
└─────────────────────┬────────────────────────────┘
                      │
┌─────────────────────▼────────────────────────────┐
│  业务逻辑层（lib/）                                │
│  Mock 数据、Mock AI、状态管理                      │
│  换真 LLM / 真数据库时，只动这一层                  │
└──────────────────────────────────────────────────┘
```

### 3.3 目录结构

```
matchu/
├── app/
│   ├── page.tsx                 首屏（欢迎 + 开始按钮）
│   ├── onboard/page.tsx         屏 1 AI 性格测评
│   ├── chat/[userId]/page.tsx   屏 2 AI 助聊聊天页（MVP 只有 xiaoyu）
│   ├── layout.tsx               全局布局（字体、viewport meta）
│   ├── globals.css              全局样式（迁移自原 mockup 的 CSS 变量）
│   └── api/
│       ├── ai/quiz/route.ts     性格分析接口
│       ├── ai/chat/route.ts     Mock 真人回复接口
│       └── ai/assist/route.ts   AI 助聊建议接口
│
├── lib/
│   ├── ai/
│   │   ├── index.ts             对外统一接口，按环境变量选 Provider
│   │   ├── types.ts             AIProvider、Message、Schema 类型
│   │   ├── mock.ts              本期实现：脚本/模板
│   │   └── real.ts              预留：日后填 DeepSeek / OpenAI / Anthropic
│   ├── mock-data/
│   │   ├── quiz.ts              8 道测评题 + 选项标签
│   │   ├── profiles.ts          6–8 种性格画像模板
│   │   └── users/
│   │       └── xiaoyu.ts        小雨人设 + 对话剧本 + 触发关键词
│   └── store/
│       ├── user.ts              useUserStore（性格画像）
│       └── chat.ts              useChatStore（聊天历史 + 打字状态）
│
├── components/
│   ├── phone/                   Phone 外壳、StatusBar、AppBody
│   ├── chat/                    MessageBubble、TypingIndicator、InputBar
│   ├── quiz/                    QuizProgress、OptionGroup、ProfilePeek
│   └── common/                  Button、Tag、Avatar、TabBar
│
├── public/
│   ├── manifest.json            PWA 清单
│   ├── icon-192.png             桌面图标
│   └── icon-512.png
│
├── docs/                        本设计文档、未来的计划文档
├── reference/                   原 mockup HTML、立项书
├── .env.local                   AI_PROVIDER=mock
├── package.json
├── tailwind.config.ts
└── next.config.mjs
```

### 3.4 技术栈

| 层 | 选型 | 理由 |
|---|---|---|
| 框架 | **Next.js 15**（App Router） | 一个代码库搞定前后端；SSR/SSG 免费；Claude 生成质量最高 |
| 语言 | **TypeScript** | 提前捕获错误，对 AI 生成代码尤其重要 |
| 样式 | **Tailwind CSS 4** + 原 mockup 的 CSS 变量 | 原 mockup 的视觉系统保留；新组件用 Tailwind 快写 |
| 状态 | **Zustand** + `persist` 中间件 | 极轻、函数式、localStorage 持久化开箱即用 |
| 结构校验 | **Zod** | Mock AI 的 `json()` 返回值用 zod 约束 |
| 图标 | **Lucide React** | 轻量，按需引入 |
| 动画 | **Framer Motion** | 气泡弹入、打字机、进度条动画 |
| 部署 | **Vercel** | 零配置、免费、自动 HTTPS |

**明确不引入**：Redux、LangChain、向量数据库、Auth 库、数据库、测试框架、ESLint/Prettier 以外的 linter。

---

## 4. 屏 1 设计：AI 性格测评

### 4.1 路由

`/onboard`

### 4.2 用户旅程

```
进入 /onboard
  │
  ▼
AI 打招呼："你好呀，我是心遇 AI 😊 接下来通过聊天了解你"
  │
  ▼
AI 出第 1 题（文本 + 4 选项气泡）
  │
  ▼  用户点选项
  │
AI 1) 进度条 +1 / 8
AI 2) 选项对应的 2–3 个性格标签累积进 UserProfile
AI 3) 流式输出一段点评（10–30 字）
AI 4) 显示 "+1 XXX 倾向 · 已识别 N/10 维度" 标签卡
  │
  ▼
AI 出下一题（共 8 题）
  │
  ▼（答完最后一题）
  │
生成性格画像卡（从 6–8 个预设模板中挑最匹配的一张）
  │
  ▼
"进入心遇" 按钮 → 跳转 /chat/xiaoyu
```

### 4.3 题库结构

8 道题，每题 4 选项，每个选项打 2–3 个标签。

```ts
// lib/mock-data/quiz.ts (示意结构)
type QuizOption = { key: 'A'|'B'|'C'|'D'; label: string; tags: string[] }
type QuizQuestion = { id: string; prompt: string; options: QuizOption[] }

// 题目示例：
// "周末朋友临时约你，你已经躺平在家刷剧"
//   A. 立刻爬起来赴约 → [社交驱动, 外向, 即兴]
//   B. 看心情，不熟的算了 → [选择性社交, 理性]
//   C. 婉拒，需要充电时间 → [内向补能, 边界清晰, 独处友好]
//   D. 邀朋友来家一起躺 → [折中, 居家型, 随和]
```

题目主题覆盖：社交模式、情绪调节、冲突应对、亲密距离、生活节奏、兴趣取向、表达风格、压力反应。

### 4.4 性格画像模板

6–8 种，每种对应一组标签集合。示例：

```ts
type Profile = {
  id: string
  displayName: string       // e.g. "月光补能型"
  subtitle: string          // e.g. "安静的温度，慢热但真诚"
  tags: string[]            // 核心标签
  commentary: string        // 200 字左右的 AI 口吻描写
  compatibleTags: string[]  // 与哪些标签契合度高（用于屏 2 契合度计算）
}
```

选择画像的规则：用户累计的标签与每个画像的 `tags` 重合度最高者胜出，打平时按画像定义顺序取首个。

### 4.5 Mock AI 能力调用

屏 1 只用到 `analyzeQuizTurn()`：

```ts
// 输入
{
  questionId: string
  chosenOption: 'A' | 'B' | 'C' | 'D'
  historyTags: string[]
}

// 输出（流式）
{
  newTags: string[]           // 2-3 个新增标签
  commentary: AsyncIterable<string>  // 流式点评文本
  profileHint?: string        // 每 3 题给一次"已识别 N/10 维度 · 倾向 XX"
}
```

### 4.6 产出物

用户走完 8 题后，`useUserStore` 持有：

```ts
UserProfile {
  answers: { questionId, option }[]
  tags: string[]            // 去重后 10+ 个标签
  profileId: string         // 选中的画像 ID
  profileDisplayName: string
  completedAt: timestamp
}
```

写入 `localStorage` 键名 `matchu:user-profile`。

---

## 5. 屏 2 设计：AI 助聊聊天页

### 5.1 路由

`/chat/xiaoyu`（MVP 阶段 `userId` 只有 `xiaoyu` 一种）

### 5.2 用户旅程

```
进入 /chat/xiaoyu
  │
  ▼
顶部显示：小雨头像 + 名字 + "契合度 87%"（基于屏 1 标签算）
  │
  ▼
已有预设开场消息（小雨发给你的 2 条）
  │
  ▼
用户输入消息 → 发送
  │
  ├─ 延迟 300ms → "小雨正在输入…" 指示器出现
  ├─ 再延迟 800–2000ms（随机）→ 小雨流式回一条消息
  │
  ▼
（任何时候）用户点底部 "AI 助聊 ✦" 按钮
  │
  ▼
从底部弹出抽屉，3 条 AI 建议：
  [🫂 关心]  "今天听起来不容易，想吃什么我陪你念叨"
  [✨ 俏皮]  "把累意识传给我，我替你分担三成"
  [🎯 推进]  "讲讲看怎么了，能解决一起想"
  │
  ▼
点任意一条 → 填入输入框 → 用户可编辑 → 发送
```

### 5.3 小雨人设

```
姓名：小雨
年龄：22
身份：刚毕业 / 初入职场的新人
性格：俏皮 + 偶尔 emo
话题偏好：加班吐槽、音乐分享、深夜心情、追剧、小众咖啡
说话风格：省略号多，偶尔英文/emoji，不刻意文艺，偶尔一句戳心
```

### 5.4 对话剧本

**不是脚本播放器，是"基于关键词 + 情绪 + 对话进度"的分支选择器。**

```ts
// lib/mock-data/users/xiaoyu.ts (示意结构)
type ScriptedReply = {
  // 触发条件（任一匹配即可）
  triggers?: {
    keywords?: string[]      // 用户消息含这些词
    emotions?: ('tired'|'happy'|'sad'|'curious')[]  // 简单情绪检测
    turnRange?: [number, number]  // 仅在第 N–M 轮可用
  }
  // 可能的回复（随机挑一条，避免重复）
  replies: string[]
  // 用过就不再用（用于不重复开场白）
  once?: boolean
}
```

开场消息 2 条（写死）：
- "啊 你来啦～"
- "刚下班 打开外卖看了十分钟 还是不知道吃什么 救救"

后续分支覆盖：累/工作、音乐、追剧、问候、沉默、夸赞、疑问、表情包轰炸。

共 15 条剧本回复 + 5 条兜底万能回复（"嗯嗯"、"在的"、"咦你说"、"哈哈哈"、"…那你呢"）。

### 5.5 AI 助聊建议

调用 `assistSuggest()`：

```ts
// 输入
{
  chatHistory: Message[]       // 近 10 条
  userProfile: UserProfile     // 来自屏 1
}

// 输出（非流式，一次返回 3 条）
{
  suggestions: {
    style: 'care' | 'playful' | 'direct'
    text: string
  }[]
}
```

Mock 实现策略：
1. 看聊天最后一条（小雨的消息）里的关键词/情绪
2. 从 `care / playful / direct` 三个模板库中各抽一条
3. 用 `userProfile.tags` 做微调（"内向补能"→ 关心型更克制；"外向热情"→ 俏皮型更跳脱）

每个风格模板库 20–30 条，覆盖常见场景。

### 5.6 契合度算法（MVP 假算法）

```
compatibility(userTags, xiaoyuCompatibleTags)
  = round(60 + 35 * (重合标签数 / xiaoyuCompatibleTags.length))
  → 结果在 60–95 范围
```

小雨的 `compatibleTags` 写死：偏好"俏皮、共情、轻度内向、有话题感、情绪稳定"。

### 5.7 持久化

聊天历史存 `localStorage` 键名 `matchu:chat:xiaoyu`。

---

## 6. Mock AI 接口设计（核心）

### 6.1 设计原则

**Mock 的函数签名、参数、返回值、流式格式必须与真实 LLM SDK 对齐**，未来切换只需修改 `lib/ai/real.ts`，UI 和 API 层零改动。

### 6.2 对外接口

```ts
// lib/ai/types.ts
type Role = 'system' | 'user' | 'assistant'
type Message = { role: Role; content: string }

interface AIProvider {
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
```

### 6.3 三个业务能力封装

```ts
// lib/ai/index.ts
export const ai = {
  analyzeQuizTurn(input): { newTags; commentaryStream; profileHint? }
  xiaoyuReply(input):     AsyncIterable<string>
  assistSuggest(input):   Promise<{ suggestions: Suggestion[] }>
}
```

这三个函数内部用 `AIProvider.stream()` 或 `AIProvider.json()`，视功能而定。

### 6.4 Mock 实现要点

- **流式模拟**：把完整回复切成字符，用 `setTimeout` 每 30–50ms `yield` 一小段
- **首字延迟**：开头先 `await delay(400–700ms)` 再开始推字，模拟真 LLM
- **响应多样性**：同样输入从 3–5 条候选里随机挑，避免"这 AI 只会一句话"
- **上下文敏感**：看最后一条 user message 的关键词 + 简单情绪分（正面 emoji、负面词表）决定分支
- **记忆机制**：Mock 不做向量记忆；用户性格标签和最近 10 条对话已足够驱动 Mock

### 6.5 切换真 LLM 的路径

```bash
# .env.local
AI_PROVIDER=mock      # 当前

# 改为：
AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=sk-xxx
```

`lib/ai/index.ts`：

```ts
const provider: AIProvider =
  process.env.AI_PROVIDER === 'mock'     ? new MockProvider() :
  process.env.AI_PROVIDER === 'deepseek' ? new DeepSeekProvider() :
  process.env.AI_PROVIDER === 'openai'   ? new OpenAIProvider() :
                                           new MockProvider()
```

`lib/ai/real.ts` 预留空壳，包含调用真 LLM 的骨架代码（注释状态），日后取消注释填 API Key 即可。

### 6.6 不做项

- 向量数据库 / RAG
- Agent 框架
- 多模型路由
- Function calling（MVP 的结构化输出用 `json()` + zod 足够）
- 流式 token 用量统计

---

## 7. 状态与持久化

### 7.1 Zustand Stores

```ts
// lib/store/user.ts
interface UserStore {
  profile: UserProfile | null
  answers: QuizAnswer[]
  tags: string[]
  addAnswer(qId, option): void
  completeQuiz(profileId): void
  reset(): void
}

// lib/store/chat.ts
interface ChatStore {
  messages: Record<string, Message[]>  // key = userId (MVP 只有 'xiaoyu')
  isTyping: Record<string, boolean>
  addMessage(userId, msg): void
  setTyping(userId, boolean): void
  reset(userId): void
}
```

两个 store 均接入 `persist` 中间件。

### 7.2 localStorage 键

| 键 | 内容 |
|---|---|
| `matchu:user-profile` | UserProfile |
| `matchu:chat:xiaoyu` | 与小雨的聊天历史 |
| `matchu:version` | 数据结构版本，破坏性升级用 |

### 7.3 升级到云端的路径（不在本期实施）

```
localStorage → Supabase (Postgres + Auth) 或 Neon
     数据形状保持一致，仅替换 store 中的 persist 适配器
```

---

## 8. 部署

### 8.1 本地开发

```bash
npm install
npm run dev
# → http://localhost:3000
```

### 8.2 Vercel 部署

1. 本地项目 push 到 GitHub（空仓库）
2. vercel.com → Import Project → 选择该仓库
3. 首次部署后拿到 `matchu-xxxx.vercel.app`
4. 后续每次 `git push` 自动重新部署
5. 预览部署（PR/分支）自动生成临时 URL

### 8.3 账号与成本

- GitHub：免费个人账号
- Vercel：免费 Hobby 计划（本期流量完全够用）
- 域名：本期使用 `*.vercel.app` 子域名，0 成本

### 8.4 PWA 清单

```json
// public/manifest.json（简要）
{
  "name": "MatchU · 心遇",
  "short_name": "心遇",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0414",
  "theme_color": "#a970ff",
  "icons": [...]
}
```

手机浏览器打开公网 URL → 分享菜单 → "添加到主屏幕"。

---

## 9. 错误处理

### 9.1 场景与兜底

| 场景 | 处理 |
|---|---|
| Mock AI 流式中途异常 | try/catch 降级到固定兜底话："让我想想…（再发一次试试）" |
| `localStorage` 禁用 / 满 | 顶部红条提示"无法保存，刷新会丢数据"，功能不中断（退化为仅内存） |
| 用户直接访问 `/chat/xiaoyu` 未做测评 | 渲染时检查 `UserProfile`，缺失则使用中性默认画像，顶部提示 "未完成测评，建议先去" + 跳过按钮 |
| AI 助聊返回空或格式错 | 降级到 3 条固定兜底建议 |
| Zod 校验失败 | 记 `console.warn`，降级到兜底值，用户不感知 |

### 9.2 不做项

- Sentry / 第三方错误监控
- 用户反馈通道
- 全局错误边界（Next.js 默认即够）

---

## 10. 测试策略

### 10.1 手动测试清单（交付前必过）

- [ ] 首次打开 → 进入测评 → 完成 8 题 → 看到性格画像卡
- [ ] 画像卡 → 点"进入心遇" → 到达聊天页
- [ ] 聊天页右上角契合度数字落在 60–95
- [ ] 用户发消息 → 小雨在 1–3 秒内开始流式回复
- [ ] 点 "AI 助聊 ✦" → 弹出抽屉 → 看到 3 条不同风格的建议
- [ ] 点建议 → 文本进入输入框 → 可编辑 → 可发出
- [ ] 刷新页面 → 性格画像 + 聊天历史保留
- [ ] 清除浏览器数据 → 回到首屏初始态
- [ ] 手机 Chrome / Safari 打开 Vercel URL → 无布局崩坏
- [ ] "添加到主屏幕" → 图标和启动样式正常
- [ ] 跑 8 轮测评，每轮选不同答案，画像结果不应全部一致

### 10.2 为什么不做自动化测试

- Mock 脚本测试 ≈ 抄一遍脚本
- MVP 阶段 UI 频繁变动，测试维护成本高于收益
- 用户不写代码、不跑测试

### 10.3 日后补上的路径（不在本期）

- `lib/ai/mock.ts` 的关键词分支逻辑：Vitest 单元测试
- E2E 关键流程（测评走完 + 聊天发消息）：Playwright
- 接真 LLM 后：LLM 输出的 smoke test（语义合理性人工抽检）

---

## 11. 开发里程碑

### M1 — 项目骨架（≈ 半天）

- `npm create next-app@latest matchu --typescript --tailwind --app` 初始化
- 将原 mockup 的 CSS 变量/渐变/毛玻璃迁移到 `globals.css`
- 建立共用组件 `<Phone>`、`<StatusBar>`、`<AppBody>`、`<TabBar>`
- Zustand 两个 store 架子
- 三条路由空壳：`/`、`/onboard`、`/chat/xiaoyu`
- `lib/ai/types.ts`、`lib/ai/index.ts`、`lib/ai/mock.ts` 骨架

**DONE 定义**：`npm run dev` 能跑，三个 URL 能开，视觉基调和 mockup 一致。

### M2 — 屏 1 AI 性格测评（≈ 1 天）

- `lib/mock-data/quiz.ts`（8 道题）
- `lib/mock-data/profiles.ts`（6–8 种画像模板）
- `lib/ai/mock.ts` 实现 `analyzeQuizTurn()` + 流式打字机
- 测评页完整交互：问题显示、选项点击、进度条、流式点评、标签累积、画像卡生成
- 画像持久化到 `localStorage`

**M1 + M2 共同评审点 → 停下等用户反馈**

### M3 — 屏 2 AI 助聊聊天页（≈ 1 天）

- `lib/mock-data/users/xiaoyu.ts`（人设 + 15 条剧本 + 触发条件）
- `lib/ai/mock.ts` 补 `xiaoyuReply()` 和 `assistSuggest()`
- 聊天页 UI：气泡、输入框、打字指示器、发送按钮
- "AI 助聊 ✦" 按钮 + 底部抽屉 + 3 条建议
- 契合度数字
- 聊天历史持久化

**M3 评审点 → 停下等用户反馈**

### M4 — PWA + 部署 + 手机验证（≈ 半天）

- `manifest.json` + 图标
- 首屏欢迎 + "开始心遇之旅" 按钮
- 错误兜底（localStorage 禁用、Mock AI 失败）
- push 到 GitHub
- 接入 Vercel，获取 `matchu-xxxx.vercel.app`
- 手机访问、"添加到主屏幕" 验证

**M4 评审点 → 项目交付**

---

## 12. 后续阶段（不在本期交付）

```
Phase 2   补齐另外 4 屏：匹配推荐、聊天列表、虚拟视频、我的
Phase 3   接真 LLM（DeepSeek / OpenAI / Anthropic）
Phase 4   接真用户后端：Supabase + 登录注册
Phase 5   备案 + 上架 / 微信小程序版本
```

每个阶段均为独立 spec → plan → 实施循环，不在本文档展开。

---

## 13. 附录

### 13.1 依赖清单

```json
{
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "zustand": "^5",
    "zod": "^3",
    "framer-motion": "^11",
    "lucide-react": "^0.400"
  },
  "devDependencies": {
    "typescript": "^5",
    "tailwindcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19"
  }
}
```

### 13.2 环境变量

```
AI_PROVIDER=mock
# 日后填：
# DEEPSEEK_API_KEY=
# OPENAI_API_KEY=
# ANTHROPIC_API_KEY=
```

### 13.3 关键文件一览（开发完成后）

| 文件 | 作用 |
|---|---|
| `app/onboard/page.tsx` | 屏 1 主组件 |
| `app/chat/[userId]/page.tsx` | 屏 2 主组件 |
| `lib/ai/mock.ts` | 所有 Mock AI 智能的来源 |
| `lib/mock-data/quiz.ts` | 测评题库（改题目改这里） |
| `lib/mock-data/users/xiaoyu.ts` | 小雨人设 + 剧本（改人设改这里） |
| `lib/store/user.ts` | 用户性格画像状态 |
| `lib/store/chat.ts` | 聊天历史状态 |

### 13.4 开发期间用户介入点

| 时机 | 用户要做什么 |
|---|---|
| M1+M2 完成 | 本地运行或看 Claude 提供的预览，反馈测评交互和视觉 |
| M3 完成 | 运行后和小雨完整聊一轮，反馈对话自然度和 AI 助聊建议的质量 |
| M4 完成 | 手机打开 Vercel URL，验证公网可访问、PWA 安装、发给朋友体验 |

开发期间任何时刻用户都可以叫停或改动。
