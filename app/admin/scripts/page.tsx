import { redirect } from 'next/navigation'
import { AdminChrome } from '@/components/admin/AdminChrome'
import { ScriptManager } from '@/components/admin/ScriptManager'
import { isAdminAuthenticated } from '@/lib/admin/session'

export default async function AdminScriptsPage() {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }

  return (
    <AdminChrome>
      <ScriptManager />
    </AdminChrome>
  )
}
