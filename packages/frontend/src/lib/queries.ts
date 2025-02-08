// TODO: Not sure about this, idea is apiService ultimitely
// comes from the route context, but I don't want to have
// to pass that in for invalidating
import { queryOptions } from '@tanstack/react-query'
import * as apiService from './api-service'

// to supply the service if I'm just invalidating the route...
export function listingsQueryOptions(apiService?: apiService.ApiService) {
  return queryOptions({
    queryKey: ['listings'],
    queryFn() {
      if (!apiService) {
        throw new Error('apiService not passed to listingsQueryOptions')
      }
      return apiService.getListings()
    },
    refetchOnWindowFocus: false,
  })
}
