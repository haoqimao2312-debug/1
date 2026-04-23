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
