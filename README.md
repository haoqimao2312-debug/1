# MatchU · 心遇

🌐 **在线演示**：https://matchu-nine.vercel.app

AI 性格测评驱动的真人交友/匹配产品（MVP 阶段 · Mock AI 版）。

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
- [x] M6 匹配推荐屏（5 Mock 用户 + 滑卡）
- [x] M7 消息列表屏（契合度 hero + 6 条聊天）
- [x] M8 虚拟视频屏（樱花场景 + 花瓣动画）
- [x] M9 我的屏 + SVIP 卡
- [x] M10 AI 工具占位页（12 款）
- [x] 烛光暖调主题 + 质感升级（italic Serif 标题 / 玻璃方块图标 / 分区渐隐线 / 双色图标底）

## 主要路由

**沉浸流**（无 TabBar）
- `/` — 首页（欢迎 + 开始测评 / 已测评→/match）
- `/onboard` — AI 性格测评（8 道题 · 流式点评 · 生成性格画像）
- `/chat/xiaoyu` — 和 Mock 真人"小雨"聊天 + AI 助聊副驾驶

**5-Tab 主流**（底部 TabBar）
- `/match` — 智能匹配推荐（5 个 Mock 假人 · 卡片堆叠 · 拖拽滑卡）
- `/messages` — 契合度 hero 卡 + AI 助聊提示 + 最近聊天列表
- `/tools` — AI 工具占位页（12 款 · Phase 3 开放）
- `/virtual` — 虚拟人物视频（樱花场景 + 动漫少女 + 花瓣飘落）
- `/me` — 我的 + SVIP 卡 + 4 菜单项

## 本地开发

```bash
# 首次克隆后
npm install
cp .env.example .env.local

# 启动开发服务器（http://localhost:3000）
npm run dev

# 生产构建 + 预览
npm run build
npm run start
```

## 技术栈

- **框架**：Next.js 16 (App Router) + React 19 + TypeScript
- **样式**：Tailwind CSS 4 + 自定义 CSS 变量（渐变/玻璃态）
- **状态**：Zustand + `persist` 中间件（localStorage）
- **动画**：Framer Motion
- **图标**：Lucide React
- **部署**：Vercel（免费 Hobby）

## Mock AI → 真 LLM 切换路径

目前所有 AI 能力走 `lib/ai/mock.ts` 的脚本/模板回复。接真 LLM 只需：

1. 在 `.env.local` 修改：
   ```
   AI_PROVIDER=deepseek    # 或 openai / anthropic
   DEEPSEEK_API_KEY=sk-xxx
   ```
2. 实现 `lib/ai/real.ts`（当前为空壳，骨架可参考 `lib/ai/mock.ts`）
3. 在 `lib/ai/index.ts` 的 `selectProvider()` 加一条 switch 分支

UI、API、业务层（`lib/ai/business.ts`）**完全不改**。

## 项目结构

```
app/                    页面路由
├── page.tsx             首页
├── onboard/page.tsx     AI 性格测评
├── chat/[userId]/       AI 助聊聊天
├── layout.tsx           全局布局 + PWA meta
├── error.tsx            全局错误兜底
├── not-found.tsx        404 兜底
└── globals.css          设计 token + 渐变 + 毛玻璃

components/
├── phone/               Phone / StatusBar / AppBody 外壳
├── common/              Button / StorageWarning
├── quiz/                6 个测评专用组件 + ProfileResultCard
└── chat/                5 个聊天专用组件（ChatHeader/MessageBubble/TypingIndicator/InputBar/AssistDrawer）

lib/
├── ai/
│   ├── types.ts         AIProvider 接口 + UserProfile / ChatMessage
│   ├── index.ts         环境变量选 Provider
│   ├── mock.ts          Mock 流式基础
│   ├── business.ts      analyzeQuizTurn / xiaoyuReply / assistSuggest / computeCompatibility
│   ├── emotion.ts       关键词情绪检测
│   └── real.ts          预留（日后接真 LLM）
├── mock-data/
│   ├── quiz.ts          8 道测评题 + 标签
│   ├── profiles.ts      6 种性格画像 + selectProfile()
│   └── users/xiaoyu.ts  小雨人设 + 10 组触发剧本 + 7 兜底
└── store/
    ├── user.ts          Zustand 用户画像（持久化）
    └── chat.ts          Zustand 聊天历史（持久化）

public/
├── icon.svg
├── icon-192.png / icon-512.png / apple-touch-icon.png / favicon-32.png
└── manifest.webmanifest  PWA 清单

docs/superpowers/
├── specs/2026-04-23-matchu-mvp-design.md   产品设计文档
└── plans/2026-04-23-matchu-mvp-plan.md     20 个 task 实施计划
```

## 已交付能力

### 屏 1 · AI 性格测评 (`/onboard`)

- 8 道题，每题 4 选项，每选项携带 2–3 个性格标签
- 答题过程中 AI 流式点评（首字延迟 ~500ms + 每字 ~35ms 打字机效果）
- 进度条实时更新
- 每 3 题出现"已识别 N/10 维度"小卡片
- 答完自动从 6 种画像中挑匹配度最高的一张
- 画像持久化到 localStorage，刷新保留

### 屏 2 · AI 助聊聊天页 (`/chat/xiaoyu`)

- 小雨（22 岁 · 初入职场 · 慢热俏皮）
- 首次进入自动播放 2 条开场白
- 用户发消息 → 打字指示 → 小雨流式回复
- 关键词触发剧本：累/工作/音乐/剧/吃/睡/问候/开心/周末/宠物 共 10 组
- "AI 助聊 ✦" 按钮 → 底部抽屉 → 3 条不同语气建议（🫂 关心 / ✨ 俏皮 / 🎯 推进）
- 建议文案会根据用户性格标签做"短/长句"偏好微调
- 顶部契合度数字（60–95 区间，基于标签重合算出）
- 聊天历史持久化

## 本期明确不做（后续阶段可选）

- 注册/登录/实名认证
- 真实用户数据库（目前只有 1 位 Mock 真人"小雨"）
- 真实 LLM API（目前走 Mock）
- 支付/会员
- 实时语音/视频
- 备案 / 上架 App Store / Google Play
- 自动化测试

## 后续阶段路径

```
Phase 1  ✅  (本期完成)   2 屏 + Mock AI + Vercel 演示
Phase 2  ⭕  (可选)        补齐另外 4 屏（匹配推荐 · 聊天列表 · 虚拟视频 · 我的）
Phase 3  ⭕  (可选)        接真 LLM（改 AI_PROVIDER 即可）
Phase 4  ⭕  (可选)        接真用户后端（Supabase 或 Neon）+ 登录注册
Phase 5  ⭕  (可选)        备案 + 上架 / 微信小程序版
```

## 参考资料

- `reference/matchu_app_original_mockup.html` — 原始 UI 设计稿（6 屏展示版）
- `reference/AI虚拟陪伴社交平台_项目立项书_V2_AI工具箱扩展版.docx` — 远期产品立项书
