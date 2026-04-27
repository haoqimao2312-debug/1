export type AppUserProfile = {
  id: string
  email?: string
  displayName: string
  avatarUrl?: string | null
  age?: number | null
  city: string
  profession: string
  mbti: string
  bio: string
  verified: boolean
  stats: {
    likesReceived: number
    matches: number
    highestCompatibility: number
  }
  createdAt?: string
  updatedAt?: string
}

export type CommunityPostStatus = 'published' | 'hidden' | 'deleted'

export type CommunityPostData = {
  id: string
  userId: string
  name: string
  avatar: string
  time: string
  mood: string
  content: string
  images: string[]
  likes: number
  comments: number
  likedByMe?: boolean
  status?: CommunityPostStatus
  createdAt?: string
}

export type PostImageUploadResult = {
  url: string
  relativePath: string
}

export type UserProfileRow = {
  id: string
  display_name: string
  avatar_url: string | null
  age: number | null
  city: string
  profession: string
  mbti: string
  bio: string
  verified: boolean
  likes_received: number
  matches_count: number
  highest_compatibility: number
  created_at?: string
  updated_at?: string
}

export type CommunityPostRow = {
  id: string
  user_id: string
  mood: string
  content: string
  image_urls: string[] | null
  likes_count: number
  comments_count: number
  status: CommunityPostStatus
  created_at?: string
  updated_at?: string
}

export function mapUserProfileRow(row: UserProfileRow, email?: string): AppUserProfile {
  return {
    id: row.id,
    email,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    age: row.age,
    city: row.city,
    profession: row.profession,
    mbti: row.mbti,
    bio: row.bio,
    verified: row.verified,
    stats: {
      likesReceived: row.likes_received,
      matches: row.matches_count,
      highestCompatibility: row.highest_compatibility,
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function mapCommunityPostRow(
  row: CommunityPostRow,
  author?: UserProfileRow,
  likedByMe = false
): CommunityPostData {
  return {
    id: row.id,
    userId: row.user_id,
    name: author?.display_name ?? 'MatchU 用户',
    avatar: author?.avatar_url ?? '/icon-192.png',
    time: formatRelativeTime(row.created_at),
    mood: row.mood,
    content: row.content,
    images: row.image_urls ?? [],
    likes: row.likes_count,
    comments: row.comments_count,
    likedByMe,
    status: row.status,
    createdAt: row.created_at,
  }
}

function formatRelativeTime(value?: string) {
  if (!value) return '刚刚'
  const diff = Date.now() - new Date(value).getTime()
  const minutes = Math.max(0, Math.floor(diff / 60000))
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  return `${days}天前`
}
