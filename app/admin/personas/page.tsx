import { redirect } from 'next/navigation'
import { AdminChrome } from '@/components/admin/AdminChrome'
import { PersonaManager } from '@/components/admin/PersonaManager'
import { isAdminAuthenticated } from '@/lib/admin/session'

export default async function AdminPersonasPage() {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }

  return (
    <AdminChrome>
      <PersonaManager />
    </AdminChrome>
  )
}
