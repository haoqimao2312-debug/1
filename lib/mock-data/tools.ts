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
