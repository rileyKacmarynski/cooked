import { LoginForm } from '@/components/login-form'
import { signInWithRedirect } from '@aws-amplify/auth'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  // redirect to main if already logged in
  beforeLoad: async ({ context }) => {
    const user = await context.authService.getUser()
    if (user) {
      throw redirect({
        to: '/',
      })
    }
  },
})

function RouteComponent() {
  const { authService } = Route.useRouteContext()
  const navigate = Route.useNavigate()

  async function login(email: string, password: string) {
    const result = await authService.login(email, password)
    if (result.error) {
      toast.error('Error signing in.')
    }

    if (result.changePassword) {
      navigate({ to: '/change-password' })

      return
    }

    navigate({ to: '/' })
  }

  return (
    <main className="h-dvh grid place-items-center">
      <LoginForm
        login={login}
        loginWithRedirect={authService.loginWithRedirect}
      />
    </main>
  )
}
