import { redirect } from 'next/navigation'
import { AdminChrome } from '@/components/admin/AdminChrome'
import { PostManager } from '@/components/admin/PostManager'
import { isAdminAuthenticated } from '@/lib/admin/session'

export default async function AdminPostsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }

  return (
    <AdminChrome>
      <PostManager />
    </AdminChrome>
  )
}
