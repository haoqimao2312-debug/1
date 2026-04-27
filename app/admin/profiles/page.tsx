import { redirect } from 'next/navigation'
import { AdminChrome } from '@/components/admin/AdminChrome'
import { ProfileManager } from '@/components/admin/ProfileManager'
import { isAdminAuthenticated } from '@/lib/admin/session'

export default async function AdminProfilesPage() {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }

  return (
    <AdminChrome>
      <ProfileManager />
    </AdminChrome>
  )
}
