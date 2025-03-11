/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'cooked-v1',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
      providers: {
        command: true,
      },
    }
  },
  async run() {
    const vpc = await import('./infra/vpc.ts')
    const storage = await import('./infra/storage.ts')
    const auth = await import('./infra/auth')
    await import('./infra/web')
    const zero = await import('./infra/zero-sync-engine.ts')

    return {
      region: aws.getRegionOutput().name,
      vpc: vpc.vpc.urn,
      db: storage.database.host,
      connectionString: storage.connectionString,
      userPool: auth.userPool.id,
      identityPool: auth.identityPool.id,
      userPoolClient: auth.userPoolClient.id,
      cognitoDomain: auth.domain,
      jwksUrl: auth.jwksUrl,
      // TODO: This is in an if statement that doesn't run in dev mode
      sync: zero.viewSyncerEndpoint,
      // ...zero.zeroEnv,
    }
  },
})
