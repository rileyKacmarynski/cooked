import {
  FullPageLoader,
  LoadingIndicator,
} from '@/components/ui/loading-indicator'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/')({
  component: RouteComponent,
  loader({ context }) {},
})

function RouteComponent() {
  return <FullPageLoader />
}
