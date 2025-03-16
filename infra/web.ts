import {
  userPool,
  userPoolClient,
  identityPool,
  domain as cognitoDomain,
  // jwksUrl,
} from './auth'
import { appUrl, domain } from './domain.ts'
import { viewSyncerEndpoint } from './zero-sync-engine.ts'

const region = aws.getRegionOutput().name

export const frontend = new sst.aws.StaticSite('Frontend', {
  path: 'packages/frontend',
  build: {
    output: 'dist',
    command: 'bun run build',
  },
  domain:
    domain !== null
      ? {
          name: domain,
          redirects: [`www.${domain}`],
          // TODO: Can't get this to work. not worrying about it now
          // dns: sst.vercel.dns({
          //   domain,
          // }),
        }
      : undefined,
  environment: {
    VITE_REGION: region,
    VITE_USER_POOL_ID: userPool.id,
    VITE_IDENTITY_POOL_ID: identityPool.id,
    VITE_USER_POOL_CLIENT_ID: userPoolClient.id,
    VITE_COGNITO_DOMAIN: cognitoDomain,
    // VITE_COGNITO_JWKS_URL: jwksUrl,
    VITE_REDIRECT_URL: appUrl,
    // TODO: need to pass zero stuff here
    VITE_ZERO_SERVER: viewSyncerEndpoint,
  },
})
