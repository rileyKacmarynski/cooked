import './main.css'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { Amplify } from 'aws-amplify'
import config from './config'
import { authService } from './lib/aws/cognito-auth-service'
import { QueryClient } from '@tanstack/react-query'
import type { AuthService } from './lib/auth-servce'
import { Hub } from 'aws-amplify/utils'

// Hub.listen('auth', ({ payload, ...rest }) => {
//
//   switch (payload.event) {
//     case 'signedIn':
//       console.log('user have been signedIn successfully.')
//       break
//     case 'signedOut':
//       console.log('user have been signedOut successfully.')
//       break
//     case 'tokenRefresh':
//       console.log('auth tokens have been refreshed.')
//       break
//     case 'tokenRefresh_failure':
//       console.log('failure while refreshing auth tokens.')
//       break
//     case 'signInWithRedirect':
//       console.log('signInWithRedirect API has successfully been resolved.')
//       break
//     case 'signInWithRedirect_failure':
//       console.log('failure while trying to resolve signInWithRedirect API.')
//       break
//     case 'customOAuthState':
//       console.info('custom state returned from CognitoHosted UI')
//       break
//   }
// })

export const queryClient = new QueryClient()

export type RouteContext = {
  authService: AuthService
  queryClient: QueryClient
}

const router = createRouter({
  routeTree,
  context: {
    authService,
    queryClient,
  },
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('app')
if (!rootElement) throw new Error()

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: config.cognito.USER_POOL_ID,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
      userPoolClientId: config.cognito.APP_CLIENT_ID,
      allowGuestAccess: false,
      loginWith: {
        oauth: {
          domain: config.cognito.DOMAIN,
          scopes: [
            'email',
            'openid',
            'profile',
            'phone',
            'aws.cognito.signin.user.admin',
          ],
          redirectSignIn: [config.cognito.REDIRECT_URL],
          redirectSignOut: [config.cognito.REDIRECT_URL],
          responseType: 'code',
          providers: ['Google'],
        },
      },
    },
  },
  API: {
    REST: {
      // api-name: {
      //   endpoint: config.apiGateway.URL,
      //   region: config.apiGateway.REGION,
      // },
    },
  },
})

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<RouterProvider router={router} />)
}
