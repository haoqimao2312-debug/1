import type { CommunityPostData } from './user-types'

export const fallbackCommunityPosts: CommunityPostData[] = [
  {
    id: 'mock-rain',
    userId: 'mock',
    name: '想吃小蛋糕',
    avatar: 'https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?auto=format&fit=crop&w=100&q=80',
    time: '10分钟前',
    mood: '渴望拥抱',
    content: '今天下雨了，没有带伞，被淋成了落汤鸡。好想喝一杯热乎乎的奶茶呀...',
    images: ['https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=300&q=80'],
    likes: 32,
    comments: 5,
  },
  {
    id: 'mock-night',
    userId: 'mock',
    name: '星河漫步',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    time: '23分钟前',
    mood: '深夜emo',
    content: '凌晨三点，又是一个人看星星的夜晚。突然想到很多事，有点想哭。',
    images: [
      'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=300&q=80',
    ],
    likes: 128,
    comments: 24,
  },
  {
    id: 'mock-work',
    userId: 'mock',
    name: '柠檬不加糖',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
    time: '1小时前',
    mood: '想吐槽',
    content: '今天又被老板骂了，明明不是我的错。在线求一个能听我吐槽两小时的朋友。',
    images: [],
    likes: 67,
    comments: 18,
  },
]
