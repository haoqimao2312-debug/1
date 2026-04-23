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
