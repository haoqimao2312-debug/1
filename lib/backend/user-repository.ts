import { deleteById, patchById } from './repository'
import { isSupabaseConfigured, restPath, supabaseFetch } from '@/lib/supabase/rest'
import { fallbackCommunityPosts } from './community-fallback'
import {
  mapCommunityPostRow,
  mapUserProfileRow,
  type AppUserProfile,
  type CommunityPostData,
  type CommunityPostRow,
  type CommunityPostStatus,
  type UserProfileRow,
} from './user-types'
import type { SupabaseAuthUser } from '@/lib/supabase/auth-server'

const USER_SELECT =
  'id,display_name,avatar_url,age,city,profession,mbti,bio,verified,likes_received,matches_count,highest_compatibility,created_at,updated_at'

const POST_SELECT =
  'id,user_id,mood,content,image_urls,likes_count,comments_count,status,created_at,updated_at'

function defaultProfile(user: SupabaseAuthUser): UserProfileRow {
  const prefix = user.email?.split('@')[0] || 'MatchU'
  return {
    id: user.id,
    display_name: prefix,
    avatar_url: null,
    age: null,
    city: '',
    profession: '',
    mbti: '',
    bio: '',
    verified: false,
    likes_received: 0,
    matches_count: 0,
    highest_compatibility: 75,
  }
}

export async function ensureUserProfile(user: SupabaseAuthUser): Promise<AppUserProfile> {
  const existing = await getUserProfileRow(user.id)
  if (existing) return mapUserProfileRow(existing, user.email)

  const rows = await supabaseFetch<UserProfileRow[]>(
    restPath('user_profiles', `on_conflict=id&select=${USER_SELECT}`),
    {
      method: 'POST',
      prefer: 'resolution=ignore-duplicates,return=representation',
      body: JSON.stringify(defaultProfile(user)),
    }
  )

  return mapUserProfileRow(rows[0] ?? defaultProfile(user), user.email)
}

export async function getUserProfileRow(id: string) {
  const query = new URLSearchParams({
    select: USER_SELECT,
    id: `eq.${id}`,
    limit: '1',
  })
  const rows = await supabaseFetch<UserProfileRow[]>(restPath('user_profiles', query.toString()))
  return rows[0] ?? null
}

export async function updateUserProfile(user: SupabaseAuthUser, payload: Record<string, unknown>) {
  const row = normalizeUserProfilePatch(payload)
  const rows = await patchById<UserProfileRow>('user_profiles', user.id, row)
  return mapUserProfileRow(rows[0], user.email)
}

export async function setUserAvatar(user: SupabaseAuthUser, avatarUrl: string) {
  const rows = await patchById<UserProfileRow>('user_profiles', user.id, { avatar_url: avatarUrl })
  return mapUserProfileRow(rows[0], user.email)
}

export async function listPublishedPosts(currentUserId?: string): Promise<{ posts: CommunityPostData[]; source: 'supabase' | 'mock' }> {
  if (!isSupabaseConfigured()) {
    return { posts: fallbackCommunityPosts, source: 'mock' }
  }

  try {
    const query = new URLSearchParams({
      select: POST_SELECT,
      status: 'eq.published',
      order: 'created_at.desc',
      limit: '50',
    })
    const rows = await supabaseFetch<CommunityPostRow[]>(restPath('community_posts', query.toString()))
    const authorMap = await getAuthorMap(rows.map((row) => row.user_id))
    const liked = currentUserId ? await getLikedPostIds(currentUserId, rows.map((row) => row.id)) : new Set<string>()
    return {
      posts: rows.map((row) => mapCommunityPostRow(row, authorMap.get(row.user_id), liked.has(row.id))),
      source: 'supabase',
    }
  } catch (error) {
    console.error('[posts] falling back to mock data', error)
    return { posts: fallbackCommunityPosts, source: 'mock' }
  }
}

export async function createPost(user: SupabaseAuthUser, payload: { mood: string; content: string; imageUrls: string[] }) {
  await ensureUserProfile(user)
  const rows = await supabaseFetch<CommunityPostRow[]>(restPath('community_posts', `select=${POST_SELECT}`), {
    method: 'POST',
    prefer: 'return=representation',
    body: JSON.stringify({
      user_id: user.id,
      mood: payload.mood,
      content: payload.content,
      image_urls: payload.imageUrls,
      status: 'published',
    }),
  })
  const author = await getUserProfileRow(user.id)
  return mapCommunityPostRow(rows[0], author ?? undefined)
}

export async function togglePostLike(user: SupabaseAuthUser, postId: string) {
  const likeQuery = new URLSearchParams({
    select: 'post_id,user_id',
    post_id: `eq.${postId}`,
    user_id: `eq.${user.id}`,
    limit: '1',
  })
  const existing = await supabaseFetch<Array<{ post_id: string; user_id: string }>>(
    restPath('post_likes', likeQuery.toString())
  )

  const post = await getPostRow(postId)
  if (!post || post.status !== 'published') throw new Error('Post not found.')

  if (existing.length > 0) {
    const query = new URLSearchParams({ post_id: `eq.${postId}`, user_id: `eq.${user.id}` })
    await supabaseFetch<void>(restPath('post_likes', query.toString()), { method: 'DELETE' })
    const rows = await patchById<CommunityPostRow>('community_posts', postId, {
      likes_count: Math.max(0, post.likes_count - 1),
    })
    const author = await getUserProfileRow(rows[0].user_id)
    return { post: mapCommunityPostRow(rows[0], author ?? undefined, false), liked: false }
  }

  await supabaseFetch(restPath('post_likes'), {
    method: 'POST',
    body: JSON.stringify({ post_id: postId, user_id: user.id }),
  })
  const rows = await patchById<CommunityPostRow>('community_posts', postId, {
    likes_count: post.likes_count + 1,
  })
  const author = await getUserProfileRow(rows[0].user_id)
  return { post: mapCommunityPostRow(rows[0], author ?? undefined, true), liked: true }
}

export async function adminListUsers() {
  const query = new URLSearchParams({
    select: USER_SELECT,
    order: 'created_at.desc',
    limit: '200',
  })
  return supabaseFetch<UserProfileRow[]>(restPath('user_profiles', query.toString()))
}

export async function adminListPosts() {
  const query = new URLSearchParams({
    select: POST_SELECT,
    order: 'created_at.desc',
    limit: '200',
  })
  const rows = await supabaseFetch<CommunityPostRow[]>(restPath('community_posts', query.toString()))
  const authorMap = await getAuthorMap(rows.map((row) => row.user_id))
  return rows.map((row) => mapCommunityPostRow(row, authorMap.get(row.user_id)))
}

export async function adminUpdatePost(id: string, status: CommunityPostStatus) {
  const rows = await patchById<CommunityPostRow>('community_posts', id, { status })
  const author = await getUserProfileRow(rows[0].user_id)
  return mapCommunityPostRow(rows[0], author ?? undefined)
}

export async function adminDeletePost(id: string) {
  await deleteById('community_posts', id)
}

async function getPostRow(id: string) {
  const query = new URLSearchParams({
    select: POST_SELECT,
    id: `eq.${id}`,
    limit: '1',
  })
  const rows = await supabaseFetch<CommunityPostRow[]>(restPath('community_posts', query.toString()))
  return rows[0] ?? null
}

async function getAuthorMap(userIds: string[]) {
  const unique = Array.from(new Set(userIds)).filter(Boolean)
  if (unique.length === 0) return new Map<string, UserProfileRow>()

  const query = new URLSearchParams({
    select: USER_SELECT,
    id: `in.(${unique.join(',')})`,
  })
  const rows = await supabaseFetch<UserProfileRow[]>(restPath('user_profiles', query.toString()))
  return new Map(rows.map((row) => [row.id, row]))
}

async function getLikedPostIds(userId: string, postIds: string[]) {
  if (postIds.length === 0) return new Set<string>()
  const query = new URLSearchParams({
    select: 'post_id',
    user_id: `eq.${userId}`,
    post_id: `in.(${postIds.join(',')})`,
  })
  const rows = await supabaseFetch<Array<{ post_id: string }>>(restPath('post_likes', query.toString()))
  return new Set(rows.map((row) => row.post_id))
}

function normalizeUserProfilePatch(payload: Record<string, unknown>) {
  return {
    display_name: stringValue(payload.displayName, 'MatchU 用户'),
    age: nullableNumber(payload.age),
    city: stringValue(payload.city),
    profession: stringValue(payload.profession),
    mbti: stringValue(payload.mbti),
    bio: stringValue(payload.bio),
  }
}

function stringValue(value: unknown, fallback = '') {
  return typeof value === 'string' ? value.trim() || fallback : fallback
}

function nullableNumber(value: unknown) {
  if (value === null || value === undefined || value === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}
