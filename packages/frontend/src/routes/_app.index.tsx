import { ListingsTable } from '@/components/listings-table'
import { listingsQueryOptions } from '@/lib/queries'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { isAfter, subHours } from 'date-fns'

export const Route = createFileRoute('/_app/')({
  component: RouteComponent,
  loader({ context }) {
    return context.queryClient.prefetchQuery(
      listingsQueryOptions(context.apiService),
    )
  },
})

function RouteComponent() {
  const { apiService } = Route.useRouteContext()
  const { data, refetch } = useSuspenseQuery(listingsQueryOptions(apiService))

  // TODO: See if this actually works yo
  useEffect(() => {
    // if something takes longer than an hour to process, just give up
    const stillProcessing = data.some(
      (listing) =>
        listing.status === 'created' &&
        listing.result !== 'error' &&
        !isAfter(listing.createdAt, subHours(new Date(), 1)),
    )

    let timer: Timer | null = null
    if (stillProcessing) {
      timer = setInterval(refetch, 5000)
    }
    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [data, refetch])

  const listingMap = Map.groupBy(data, ({ url }) => url)

  console.log(
    'listings',
    data.map((d) => ({ status: d.status, name: d.name, result: d.result })),
  )

  return <ListingsTable listings={listingMap} />
}
