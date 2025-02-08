import './main.css'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { Amplify } from 'aws-amplify'
import config from './config'
import { authService } from './lib/aws/cognito-auth-service'
import { apiService } from './lib/aws/listings-api-service'
import { QueryClient } from '@tanstack/react-query'
import type { AuthService } from './lib/auth-servce'
import type { ApiService } from './lib/api-service'

export const queryClient = new QueryClient()

export type RouteContext = {
  authService: AuthService
  apiService: ApiService
  queryClient: QueryClient
}

const router = createRouter({
  routeTree,
  context: {
    authService,
    apiService,
    queryClient,
  },
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')!

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: config.cognito.USER_POOL_ID,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
      userPoolClientId: config.cognito.APP_CLIENT_ID,
      allowGuestAccess: false,
    },
  },
  API: {
    REST: {
      listings: {
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
      },
    },
  },
})

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<RouterProvider router={router} />)
}
