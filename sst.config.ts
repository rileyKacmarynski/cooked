/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'cooked-v1',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
    }
  },
  async run() {
    const vpc = await import('./infra/vpc.ts')
    const storage = await import('./infra/storage.ts')
    const auth = await import('./infra/auth')
    await import('./infra/web')

    return {
      region: aws.getRegionOutput().name,
      vpc: vpc.vpc.urn,
      db: storage.database.host,
      userPool: auth.userPool.id,
      identityPool: auth.identityPool.id,
      userPoolClient: auth.userPoolClient.id,
      cognitoDomain: auth.domain,
    }
  },
})
