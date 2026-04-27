import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AdminChrome } from '@/components/admin/AdminChrome'
import { SeedButton } from '@/components/admin/SeedButton'
import { adminListPersonas, adminListProfiles, adminListScripts } from '@/lib/backend/repository'
import { adminListPosts, adminListUsers } from '@/lib/backend/user-repository'
import { isSupabaseConfigured } from '@/lib/supabase/rest'
import { isAdminAuthenticated } from '@/lib/admin/session'

export default async function AdminHomePage() {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }

  const configured = isSupabaseConfigured()
  const stats = configured
    ? await Promise.all([adminListProfiles(), adminListPersonas(), adminListScripts(), adminListUsers(), adminListPosts()]).then(
        ([profiles, personas, scripts, users, posts]) => ({
          profiles: profiles.length,
          publishedProfiles: profiles.filter((item) => item.status === 'published').length,
          personas: personas.length,
          publishedPersonas: personas.filter((item) => item.status === 'published').length,
          scripts: scripts.length,
          enabledScripts: scripts.filter((item) => item.enabled).length,
          users: users.length,
          posts: posts.length,
          hiddenPosts: posts.filter((item) => item.status === 'hidden').length,
        })
      )
    : null

  return (
    <AdminChrome>
      <div className="mb-8 flex items-start justify-between gap-6">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-[#a05a68]">Operations</p>
          <h1 className="font-serif text-4xl font-black">运营后台</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6a5058]">
            管理前台匹配卡片、消息列表资料、聊天人设和关键词脚本。用户侧读取已发布内容，草稿只在后台可见。
          </p>
        </div>
        <SeedButton />
      </div>

      {!configured && (
        <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
          Supabase 尚未配置。请设置 SUPABASE_URL、SUPABASE_SERVICE_ROLE_KEY，并执行 supabase/schema.sql。
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="匹配资料" value={stats?.profiles ?? 0} sub={`${stats?.publishedProfiles ?? 0} 已发布`} href="/admin/profiles" />
        <StatCard title="聊天人设" value={stats?.personas ?? 0} sub={`${stats?.publishedPersonas ?? 0} 已发布`} href="/admin/personas" />
        <StatCard title="聊天脚本" value={stats?.scripts ?? 0} sub={`${stats?.enabledScripts ?? 0} 已启用`} href="/admin/scripts" />
        <StatCard title="前台用户" value={stats?.users ?? 0} sub="已注册用户资料" href="/admin/users" />
        <StatCard title="社区帖子" value={stats?.posts ?? 0} sub={`${stats?.hiddenPosts ?? 0} 已下架`} href="/admin/posts" />
      </div>
    </AdminChrome>
  )
}

function StatCard({ title, value, sub, href }: { title: string; value: number; sub: string; href: string }) {
  return (
    <Link href={href} className="rounded-2xl border border-[#dfd1c6] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-5 text-sm font-bold text-[#7c626a]">{title}</div>
      <div className="font-serif text-5xl font-black">{value}</div>
      <div className="mt-2 text-sm font-semibold text-[#a05a68]">{sub}</div>
    </Link>
  )
}
