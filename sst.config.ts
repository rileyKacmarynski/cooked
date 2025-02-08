/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'cooked',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
    }
  },
  async run() {
    const api = await import('./infra/api')
    const auth = await import('./infra/auth')
    await import('./infra/web')

    return {
      region: aws.getRegionOutput().name,
      api: api.api.url,
      userPool: auth.userPool.id,
      identityPool: auth.identityPool.id,
      userPoolClient: auth.userPoolClient.id,
    }
  },
})
