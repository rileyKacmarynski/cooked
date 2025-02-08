import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/')({
  component: RouteComponent,
  loader({ context }) {},
})

function RouteComponent() {
  const { apiService } = Route.useRouteContext()

  return <h1>Hello world</h1>
}
