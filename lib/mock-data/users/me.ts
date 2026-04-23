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
  avatarGradientFrom: '#ffd176',
  avatarGradientTo: '#ff8f6b',
  faceTone: '#ffdcc0',
  hairColor: '#3a2030',
}
