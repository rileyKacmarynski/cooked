/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: 'cooked-v1',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
      providers: {
        command: true,
        '@pulumiverse/vercel': '1.14.3',
      },
    }
  },
  async run() {
    const vpc = await import('./infra/vpc')
    const storage = await import('./infra/storage')
    const auth = await import('./infra/auth')
    await import('./infra/web')
    const zero = await import('./infra/zero-sync-engine')
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
      sync: zero.viewSyncerEndpoint,
      replciation: zero.replicationManagerService.url,
      // ...zero.zeroEnv,
    }
  },
})
