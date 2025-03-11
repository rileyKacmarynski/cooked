import { userPool, userPoolClient, identityPool, domain, jwksUrl } from './auth'
import { viewSyncerEndpoint } from './zero-sync-engine.ts'

const region = aws.getRegionOutput().name

export const frontend = new sst.aws.StaticSite('Frontend', {
  path: 'packages/frontend',
  build: {
    output: 'dist',
    command: 'bun run build',
  },
  // TODO: figure out how to set up subdomain of rkac.dev
  // domain:
  //   $app.stage === 'production'
  //     ? {
  //         name: domain.com',
  //         redirects: ['www.domain.com'],
  //       }
  //     : undefined,
  environment: {
    VITE_REGION: region,
    VITE_USER_POOL_ID: userPool.id,
    VITE_IDENTITY_POOL_ID: identityPool.id,
    VITE_USER_POOL_CLIENT_ID: userPoolClient.id,
    VITE_COGNITO_DOMAIN: domain,
    VITE_COGNITO_JWKS_URL: jwksUrl,
    // TODO: need to pass zero stuff here
    VITE_ZERO_SERVER: viewSyncerEndpoint,
  },
})
