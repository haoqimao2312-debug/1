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
  avatarGradientFrom: string
  avatarGradientTo: string
  faceTone: string
  hairColor: string
  photo?: string
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
    photo: '/users/linnian.jpg',
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
    photo: '/users/sara.jpg',
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
    photo: '/users/amy.jpg',
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
    photo: '/users/luna.jpg',
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
    photo: '/users/yinuo.jpg',
    chatPreview: '好呀，什么时候方便？',
    chatTime: '周一',
    online: true,
  },
]

export const matchOrder = [...previewUsers].sort((a, b) => b.compatibility - a.compatibility)

export function getPreviewUser(id: string): PreviewUser | undefined {
  return previewUsers.find((u) => u.id === id)
}
