import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/admin/LoginForm'
import { isAdminAuthenticated } from '@/lib/admin/session'

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect('/admin')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#14070d] px-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,143,107,0.25),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(185,95,140,0.22),transparent_35%)]" />
      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  )
}
