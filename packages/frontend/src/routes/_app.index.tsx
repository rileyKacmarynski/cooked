import { Button } from '@/components/ui/button'
import {
  FullPageLoader,
  LoadingIndicator,
} from '@/components/ui/loading-indicator'
import { useQuery, useZero } from '@rocicorp/zero/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/')({
  component: RouteComponent,
  loader({ context }) {},
})

function RouteComponent() {
  const { useZero } = Route.useRouteContext()
  const z = useZero()
  const query = z.query.counters.one()
  const [counter] = useQuery(query)

  if (!counter) {
    return null
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={() =>
          z.mutate.counters.update({
            id: counter.id,
            count: counter.count + 1,
          })
        }
      >
        Increment
      </Button>
      <span>count: {counter?.count}</span>
    </div>
  )
}
