import { createFileRoute } from '@tanstack/react-router'
import { ChangePasswordForm } from '@/components/change-password-form'
import { toast } from 'sonner'

export const Route = createFileRoute('/change-password')({
  component: RouteComponent,
})

function RouteComponent() {
  const { authService } = Route.useRouteContext()
  const navigate = Route.useNavigate()

  async function changePassword(password: string) {
    const result = await authService.changePassword(password)
    if (!result.error) {
      navigate({ to: '/' })

      return
    }

    toast.error('Unable to change password. Try logging in again')
    navigate({ to: '/login' })
  }

  return (
    <main className="h-dvh grid place-items-center">
      <ChangePasswordForm changePassword={changePassword} />
    </main>
  )
}
