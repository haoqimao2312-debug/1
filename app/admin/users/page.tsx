import { redirect } from 'next/navigation'
import { AdminChrome } from '@/components/admin/AdminChrome'
import { UserManager } from '@/components/admin/UserManager'
import { isAdminAuthenticated } from '@/lib/admin/session'

export default async function AdminUsersPage() {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }

  return (
    <AdminChrome>
      <UserManager />
    </AdminChrome>
  )
}
