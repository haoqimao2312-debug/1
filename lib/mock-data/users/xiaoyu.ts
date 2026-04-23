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
